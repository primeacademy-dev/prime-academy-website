'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  CheckCircle,
  Loader2,
  Upload,
  Copy,
  Check,
  HelpCircle,
  ArrowRight,
  BookOpen,
  DollarSign,
  Banknote,
  ChevronRight,
  ChevronLeft,
  X,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Course } from '@/lib/hygraph'
import { getCoursePriceDisplay } from '@/lib/format-price'
import { createInscricao } from '@/lib/enrollments-service'
import { useAuth } from '@/contexts/auth-context'
import { useToast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { createNotificationViaApi } from '@/lib/admin-api'

interface EnrollmentCheckoutFormProps {
  courses: Course[]
  whatsappNumber?: string
}

interface BankInfo {
  banco: string
  conta: string
  iban: string
  titular: string
}

interface UserProfile {
  nome: string
  email: string
}

export function EnrollmentCheckoutForm({
  courses,
  whatsappNumber = '+244921394946',
}: EnrollmentCheckoutFormProps) {
  const searchParams = useSearchParams()
  const preselectedCourse = searchParams.get('course')
  const router = useRouter()

  const [formData, setFormData] = useState({
    course: '',
    modalidade: 'online' as 'online' | 'presencial',
    comprovativo: null as File | null,
    mensagem: '',
  })

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userAuthId, setUserAuthId] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadFileName, setUploadFileName] = useState<string | null>(null)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const { user, isLoading } = useAuth()
  const { toast } = useToast()

  const bankInfo: BankInfo = {
    banco: 'BAI - Banco Angolano de Investimentos',
    conta: '1436.2851.1016.0',
    iban: 'AO06.0040.0000.1436.2851.1016.0',
    titular: 'Prime Academy Formação Técnica Serv LDA',
  }

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectPath = `/enroll${preselectedCourse ? `?course=${encodeURIComponent(preselectedCourse)}` : ''}`
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [isLoading, user, preselectedCourse, router])

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser()
        if (authData?.user?.id) {
          setUserAuthId(authData.user.id)
          const { data, error } = await supabase
            .from('perfis')
            .select('nome, email')
            .eq('id', authData.user.id)
            .single()

          if (data && !error) {
            setUserProfile(data)
          }
        }
      } catch (err) {

      }
    }

    if (user) {
      fetchUserProfile()
    }
  }, [user])

  useEffect(() => {
    if (preselectedCourse) {
      const match = courses.find(
        (c) => c.id === preselectedCourse || c.name === preselectedCourse
      )
      setFormData((prev) => ({
        ...prev,
        course: match ? match.id : preselectedCourse,
      }))
    }
  }, [preselectedCourse, courses])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFileName(file.name)
      setFormData((prev) => ({ ...prev, comprovativo: file }))
    }
  }

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const buildWhatsAppMessage = (
    courseName: string,
    email: string,
    nome: string,
    modalidade: 'online' | 'presencial',
    mensagem?: string
  ): string => {
    const modalidadeLabel = modalidade === 'presencial' ? 'Presencial' : 'Online'
    let msg =
      `Olá, Prime Academy! 👋\n\n` +
      `O meu nome é *${nome}* e acabei de realizar a minha inscrição no curso:\n` +
      `📚 *${courseName}* — Modalidade: *${modalidadeLabel}*\n\n` +
      `O meu e-mail de registo é: *${email}*\n\n`

    if (mensagem && mensagem.trim()) {
      msg += `📝 *Nota/Observação:* ${mensagem.trim()}\n\n`
    }

    msg += `Envio em anexo o comprovativo de pagamento para validação. Fico a aguardar a confirmação. Obrigado! 🙏`
    return encodeURIComponent(msg)
  }

  const buildWhatsAppUrl = (): string => {
    const phone = whatsappNumber.replace(/[^0-9]/g, '')
    const courseMatch = courses.find((c) => c.id === formData.course)
    const courseName = courseMatch?.name ?? 'um curso da Prime Academy'
    const nome = userProfile?.nome ?? 'Candidato'
    const email = userProfile?.email ?? ''
    const modalidade = formData.modalidade
    return `https://api.whatsapp.com/send?phone=${phone}&text=${buildWhatsAppMessage(courseName, email, nome, modalidade, formData.mensagem)}`
  }

  const uploadComprovatvoToStorage = async (file: File, inscricaoId: string): Promise<string> => {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
      const filePath = `comprovativos/${fileName}`

      const { data, error } = await supabase.storage
        .from('inscricoes')
        .upload(filePath, file, {
          contentType: file.type,
          upsert: true,
        })

      if (error) {
        throw new Error(`Erro ao fazer upload: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('inscricoes')
        .getPublicUrl(filePath)

      return publicUrlData.publicUrl
    } catch (err) {

      throw err
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      if (!formData.course) {
        throw new Error('Por favor, selecione um curso')
      }

      if (!formData.comprovativo) {
        toast({
          title: 'Atenção',
          description: 'Por favor, faça o upload do seu comprovativo bancário para concluir a inscrição.',
          variant: 'destructive',
        })
        setIsSubmitting(false)
        return
      }

      if (!userProfile) {
        throw new Error('Perfil do utilizador não encontrado')
      }

      const matchedCourse = courses.find((c) => c.id === formData.course)
      if (!matchedCourse) {
        throw new Error('Curso não encontrado')
      }

      // 1. Salvar inscrição imediatamente (sem esperar pelo upload do ficheiro)
      const inscricaoResult = await createInscricao({
        nome: userProfile.nome,
        email: userProfile.email,
        curso_id: formData.course,
        curso_nome: matchedCourse.name,
        modalidade: formData.modalidade,
        comprovativo_url: null,
        mensagem: formData.mensagem.trim() || undefined,
      })

      if (!inscricaoResult.ok) {
        throw new Error(inscricaoResult.error || 'Erro ao criar inscrição')
      }

      const inscricaoId = inscricaoResult.inscricao?.id

      // 2. Upload do comprovativo + patch da inscrição em segundo plano
      const fileToUpload = formData.comprovativo
      if (fileToUpload && inscricaoId) {
        ;(async () => {
          try {
            const fileExt = fileToUpload.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`
            const filePath = `comprovativos/${fileName}`
            const { error: uploadError } = await supabase.storage
              .from('inscricoes')
              .upload(filePath, fileToUpload, { contentType: fileToUpload.type, upsert: true })
            if (!uploadError) {
              const { data: urlData } = supabase.storage.from('inscricoes').getPublicUrl(filePath)
              await supabase.from('inscricoes').update({ comprovativo_url: urlData.publicUrl }).eq('id', inscricaoId)
            }
          } catch (_) {}
        })()
      }

      // 3. Notificações em segundo plano
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enrollment',
          name: userProfile.nome,
          email: userProfile.email,
          phone: 'N/A',
          course: matchedCourse.name,
          message: `Modalidade: ${formData.modalidade === 'presencial' ? 'Presencial' : 'Online'}. Comprovativo será enviado via WhatsApp.`,
        }),
      }).catch(() => {})

      Promise.resolve(
        supabase.from('perfis').select('id').eq('cargo', 'admin').then(({ data: admins }) => {
          if (admins && admins.length > 0) {
            admins.forEach((admin: { id: string }) => {
              createNotificationViaApi({
                perfilId: admin.id,
                tipo: 'nova_inscricao',
                titulo: 'Nova Inscrição Recebida',
                descricao: `${userProfile.nome} inscreveu-se no curso "${matchedCourse.name}".`,
                metadata: { aluno_nome: userProfile.nome, aluno_email: userProfile.email, curso_nome: matchedCourse.name, curso_id: formData.course, modalidade: formData.modalidade, inscricao_id: inscricaoId },
              })
            })
          }
        })
      ).catch(() => {})

      if (userAuthId) {
        createNotificationViaApi({
          perfilId: userAuthId,
          tipo: 'inscricao_em_analise',
          titulo: 'Inscrição Enviada',
          descricao: `A sua inscrição no curso "${matchedCourse.name}" foi recebida e está a ser analisada.`,
          metadata: { curso_nome: matchedCourse.name, curso_id: formData.course, inscricao_id: inscricaoId },
        }).catch(() => {})
      }

      setIsSuccess(true)
      const whatsappUrl = buildWhatsAppUrl()

      toast({
        title: '✓ Inscrição enviada com sucesso!',
        description: 'A abrir o WhatsApp...',
      })

      // Redirecionamento instantâneo para o WhatsApp
      window.location.href = whatsappUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar inscrição')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    const whatsappUrl = buildWhatsAppUrl()
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-card border border-border rounded-2xl p-6 sm:p-8 text-center shadow-xl space-y-4"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle className="h-8 w-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-foreground">Inscrição Enviada com Sucesso!</h2>
            <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
              Os seus dados e comprovativo foram registados no sistema. A redirecionar para o WhatsApp para falar com a nossa equipa…
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <span>Enviar Mensagem no WhatsApp</span>
              <ArrowRight className="h-4 w-4" />
            </a>

            <Button
              variant="outline"
              className="w-full rounded-xl text-xs"
              onClick={() => router.push('/dashboard')}
            >
              Ir para o Meu Painel
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isLoading || !user || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
          <span className="text-sm text-muted-foreground">Carregando dados...</span>
        </div>
      </div>
    )
  }

  const selectedCourse = courses.find((c) => c.id === formData.course)

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* Header Fixed com Breadcrumbs */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-2 md:px-8 md:py-3">
        <div className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors flex-shrink-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <Link
            href={selectedCourse ? `/courses/${selectedCourse.id}` : '/dashboard?tab=explore'}
            className="text-slate-600 hover:text-[#312455] transition-colors font-semibold whitespace-nowrap"
          >
            Voltar ao Curso
          </Link>
          <span className="text-slate-300 hidden sm:inline">/</span>
          <span className="text-slate-500 truncate">
            {selectedCourse ? selectedCourse.name : 'Inscrição'}
          </span>
        </div>
      </header>

      {/* Main Grid com Altura Calculada para Desktop sem Scroll */}
      <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 pt-[56px] md:pt-[60px] lg:h-[calc(100vh-60px)] lg:max-h-[calc(100vh-60px)] lg:overflow-hidden bg-background">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-first flex flex-col justify-center p-4 md:p-6 lg:px-8 lg:py-4 bg-background border-b lg:border-b-0 lg:border-r border-border relative overflow-hidden lg:h-full"
      >
        <div className="absolute -right-32 -top-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-48 h-48 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 my-auto w-full max-w-xl mx-auto">
          {/* Cabeçalho Centralizado Compacto */}
          <div className="mb-2 lg:mb-3 text-center flex flex-col items-center">
            <div className="inline-flex items-center justify-center px-2.5 py-0.5 mb-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md">
              <span className="text-[10px] font-semibold text-primary uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-primary" />
                Dados de Pagamento Seguros
              </span>
            </div>
            <h2 className="text-lg lg:text-xl font-extrabold text-foreground mb-0.5 tracking-tight">
              Pagamento por Transferência
            </h2>
            <p className="text-muted-foreground text-[11px] max-w-sm mx-auto">
              Efetue o pagamento utilizando os dados bancários oficiais da Prime Academy
            </p>
          </div>

          <div className="space-y-2.5 lg:space-y-3">
            {/* VALOR DO INVESTIMENTO CENTRALIZADO */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-2 lg:p-2.5 bg-muted/40 border border-border rounded-xl text-center"
            >
              <p className="text-[9px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">
                Valor do Investimento
              </p>
              {selectedCourse ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg lg:text-xl font-black text-primary tracking-tight">
                    {getCoursePriceDisplay(selectedCourse.id, selectedCourse.price)}
                  </span>
                </div>
              ) : (
                <p className="text-muted-foreground text-[11px] italic">Selecione um curso para ver o valor</p>
              )}
            </motion.div>

            {/* DADOS BANCÁRIOS CENTRALIZADOS E ELEGANTES NA IDENTIDADE DA PRIME */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 lg:p-5 bg-gradient-to-br from-[#312455] via-[#2a1e4a] to-[#1c1435] text-white rounded-2xl space-y-3 shadow-xl relative overflow-hidden text-center border border-white/10"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              {/* Ícone e Título Centralizado */}
              <div className="flex flex-col items-center border-b border-white/15 pb-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shadow-sm mb-1.5">
                  <Building2 className="h-4.5 w-4.5 text-white" />
                </div>
                <h3 className="text-white font-bold text-sm lg:text-base">Dados Bancários Prime</h3>
                <span className="mt-1 text-[9px] font-semibold text-white/90 bg-white/15 px-2.5 py-0.5 rounded-full border border-white/25">
                  Conta Oficial
                </span>
              </div>

              {/* BANCO */}
              <div className="space-y-0.5">
                <p className="text-[9px] uppercase tracking-widest text-white/60 font-medium">Banco</p>
                <p className="text-xs lg:text-sm font-bold text-white">
                  {bankInfo.banco}
                </p>
              </div>

              {/* IBAN DESTAQUE CENTRALIZADO */}
              <div className="bg-black/25 backdrop-blur-md p-2.5 rounded-xl border border-white/15 shadow-inner hover:border-white/30 transition-all text-center space-y-1.5">
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-[9px] uppercase tracking-wider text-white/80 font-bold">IBAN</p>
                  {copiedField === 'iban' && (
                    <span className="text-[9px] text-emerald-400 font-bold animate-pulse">Copiado!</span>
                  )}
                </div>
                <p className="text-xs md:text-sm font-mono font-black text-white tracking-wider break-all select-all">
                  {bankInfo.iban}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => handleCopyToClipboard(bankInfo.iban, 'iban')}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1 rounded-lg bg-white text-[#312455] hover:bg-white/90 text-[10px] font-bold transition-all active:scale-95 shadow-md"
                  >
                    <AnimatePresence mode="wait">
                      {copiedField === 'iban' ? (
                        <motion.div
                          key="check"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-1 text-emerald-700 font-bold"
                        >
                          <Check className="h-3 w-3" />
                          <span>IBAN Copiado!</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copiar IBAN</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* NUMERO DE CONTA CENTRALIZADO */}
              <div className="bg-white/5 p-2 rounded-xl border border-white/10 text-center space-y-0.5">
                <div className="flex items-center justify-center gap-1.5">
                  <p className="text-[9px] uppercase tracking-wider text-white/70 font-semibold">Número de Conta</p>
                  {copiedField === 'conta' && (
                    <span className="text-[9px] text-emerald-400 font-bold animate-pulse">Copiado!</span>
                  )}
                </div>
                <p className="text-xs font-mono font-bold text-white tracking-wider select-all">
                  {bankInfo.conta}
                </p>
                <div>
                  <button
                    type="button"
                    onClick={() => handleCopyToClipboard(bankInfo.conta, 'conta')}
                    className="inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 border border-white/15 text-[9px] font-medium text-white transition-all active:scale-95"
                  >
                    <AnimatePresence mode="wait">
                      {copiedField === 'conta' ? (
                        <motion.div
                          key="check-conta"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-1 text-emerald-400"
                        >
                          <Check className="h-3 w-3" />
                          <span>Copiado</span>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="copy-conta"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex items-center gap-1"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copiar Conta</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* TITULAR */}
              <div className="pt-1.5 border-t border-white/15 space-y-0.5">
                <p className="text-[9px] uppercase tracking-widest text-white/60 font-semibold">Titular da Conta</p>
                <p className="text-xs font-bold text-white">{bankInfo.titular}</p>
              </div>

              {/* NOTA E INSTRUÇÕES */}
              <div className="mt-1.5 p-2 bg-white/10 border border-white/15 rounded-xl text-center flex flex-col items-center gap-0.5">
                <ShieldCheck className="h-3.5 w-3.5 text-white/90" />
                <p className="text-[10px] text-white/90 leading-tight max-w-sm">
                  <strong>Instruções:</strong> Realize a transferência e anexe o comprovativo no formulário ao lado.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="order-last flex flex-col justify-center p-4 md:p-6 lg:px-8 lg:py-4 bg-background lg:h-full lg:overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="my-auto max-w-xl mx-auto w-full"
        >
          <form onSubmit={handleSubmit} className="w-full space-y-3">
          {error && (
            <Alert variant="destructive" className="rounded-xl border-red-200 py-2">
              <AlertDescription className="text-xs">{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              Informações Pessoais
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label htmlFor="name" className="text-foreground font-medium text-xs">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={userProfile.nome}
                  disabled
                  readOnly
                  className="rounded-xl bg-muted/50 cursor-not-allowed border border-border h-8 text-xs"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="email" className="text-foreground font-medium text-xs">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={userProfile.email}
                  disabled
                  readOnly
                  className="rounded-xl bg-muted/50 cursor-not-allowed border border-border h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              Curso Pretendido
            </h3>

            <div className="space-y-0.5">
              {selectedCourse ? (
                <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                  <div className="p-1.5 bg-primary/20 rounded-lg">
                    <BookOpen className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-xs text-foreground">{selectedCourse.name}</p>
                    <p className="text-[10px] text-muted-foreground">Curso confirmado para inscrição</p>
                  </div>
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-muted/50 border border-border flex items-center gap-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Carregando curso...</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              Formato de Aprendizagem
            </h3>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, modalidade: 'online' }))}
                className={`relative p-2 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 group ${
                  formData.modalidade === 'online'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <div className="relative w-4 h-4 rounded-full border-2 border-border group-hover:border-primary/50 transition-colors">
                  {formData.modalidade === 'online' && (
                    <div className="absolute inset-0.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${
                  formData.modalidade === 'online' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Online
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, modalidade: 'presencial' }))}
                className={`relative p-2 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 group ${
                  formData.modalidade === 'presencial'
                    ? 'border-primary bg-primary/10'
                    : 'border-border bg-muted/30 hover:border-primary/50'
                }`}
              >
                <div className="relative w-4 h-4 rounded-full border-2 border-border group-hover:border-primary/50 transition-colors">
                  {formData.modalidade === 'presencial' && (
                    <div className="absolute inset-0.5 rounded-full bg-primary animate-pulse" />
                  )}
                </div>
                <span className={`text-xs font-semibold transition-colors ${
                  formData.modalidade === 'presencial' ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  Presencial
                </span>
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <div className="w-1 h-5 bg-primary rounded-full" />
              Comprovativo de Pagamento
            </h3>

            <div className="space-y-0.5">
              <Label htmlFor="file" className="text-foreground font-medium text-xs">
                Upload do comprovativo bancário (obrigatório)
              </Label>
              <div className="relative border-2 border-dashed border-border rounded-xl p-3 hover:border-primary/50 transition-colors cursor-pointer overflow-hidden bg-muted/20">
                <input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  required
                />
                <div className="flex flex-col items-center justify-center text-center">
                  <Upload className="h-5 w-5 text-muted-foreground mb-0.5" />
                  <p className="text-xs font-medium text-foreground">
                    {uploadFileName || 'Clique para fazer upload do comprovativo'}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    PDF, JPG ou PNG (máx. 5MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Campo de Notas / Observações */}
          <div className="space-y-1">
            <Label htmlFor="mensagem" className="text-foreground font-medium text-xs flex items-center justify-between">
              <span>Notas / Observações <span className="text-muted-foreground font-normal text-[11px]">(Opcional)</span></span>
            </Label>
            <textarea
              id="mensagem"
              rows={2}
              placeholder="Ex: O pagamento foi efetuado por outra pessoa em meu nome..."
              value={formData.mensagem}
              onChange={(e) => setFormData((prev) => ({ ...prev, mensagem: e.target.value }))}
              className="w-full rounded-xl border border-border bg-muted/20 px-3 py-2 text-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-primary resize-none transition-all"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || !formData.course}
            className="w-full h-9 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-xs flex items-center justify-center gap-2 mt-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Processando...
              </>
            ) : (
              <>
                Confirmar Inscrição
                <ArrowRight className="h-3.5 w-3.5" />
              </>
            )}
          </Button>

          <p className="text-center text-[10px] text-muted-foreground">
            Após confirmar, será redirecionado para o WhatsApp para falar com a nossa equipa.
          </p>
        </form>
        </motion.div>
      </motion.div>
      </div>
    </div>
  )
}
