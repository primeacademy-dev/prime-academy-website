'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, CheckCircle } from 'lucide-react'
import type { Course } from '@/lib/hygraph'

interface PreEnrollmentModalProps {
  course: Course | null
  isOpen: boolean
  onClose: () => void
}

export function PreEnrollmentModal({ course, isOpen, onClose }: PreEnrollmentModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    empresa: '',
    modalidade: 'online',
    notas: '',
  })

  if (!course) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enrollment',
          name: formData.nome,
          email: formData.email,
          phone: formData.telefone,
          course: course.name,
          message: `Modalidade: ${formData.modalidade}${formData.empresa ? `\nEmpresa: ${formData.empresa}` : ''}${formData.notas ? `\n\nNotas:\n${formData.notas}` : ''}`,
        }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || 'Não foi possível enviar a pré-inscrição')
      }

      toast.success('Pré-inscrição enviada!', {
        description: `Entraremos em contacto brevemente sobre a modalidade ${formData.modalidade}.`
      })
      onClose()
      setFormData({ nome: '', email: '', telefone: '', empresa: '', modalidade: 'online', notas: '' })
    } catch (err) {
      toast.error('Erro ao enviar', {
        description: 'Ocorreu um erro ao enviar a sua pré-inscrição. Tente novamente mais tarde.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden rounded-3xl gap-0 border-none shadow-2xl [&>button]:hidden">
        {/* Usando a classe sr-only do Tailwind para acessibilidade sem dependências extras */}
        <div className="sr-only">
          <DialogTitle>Pré-inscrição em {course.name}</DialogTitle>
          <DialogDescription>Formulário de pré-inscrição para o curso {course.name}.</DialogDescription>
        </div>

        {/* Header da Modal com gradiente sutil */}
        <div className="bg-gradient-to-br from-[#312455] to-[#4a3b75] p-8 text-white relative">
          <p className="text-[10px] font-bold tracking-widest uppercase opacity-75 mb-2">
            Pré-inscrição de Formação
          </p>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight">
            {course.name}
          </h2>
          <div className="flex items-center gap-4 mt-4 text-xs opacity-90 font-medium">
            <span>{course.duration}</span>
            <span className="w-1 h-1 rounded-full bg-white/50" />
            <span>Nível: {course.level}</span>
          </div>
        </div>

        {/* Formulário com espaçamento profissional */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6 bg-white">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="nome" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Nome do Formando *</Label>
              <Input 
                id="nome" 
                required 
                placeholder="Introduza o seu nome completo"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                className="bg-slate-50 border-slate-200 rounded-xl h-11 focus:ring-2 focus:ring-[#312455]/20 focus:border-[#312455]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email *</Label>
                <Input 
                  id="email" 
                  type="email" 
                  required
                  placeholder="exemplo@email.ao"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="bg-slate-50 border-slate-200 rounded-xl h-11 focus:ring-2 focus:ring-[#312455]/20 focus:border-[#312455]"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="telefone" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Telemóvel *</Label>
                <Input 
                  id="telefone" 
                  type="tel" 
                  required
                  placeholder="923 000 000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className="bg-slate-50 border-slate-200 rounded-xl h-11 focus:ring-2 focus:ring-[#312455]/20 focus:border-[#312455]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modalidade *</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, modalidade: 'online'})}
                  className={`h-11 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.modalidade === 'online' 
                      ? 'border-[#312455] bg-[#312455]/5 text-[#312455]' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  Online
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({...formData, modalidade: 'presencial'})}
                  className={`h-11 rounded-xl border-2 font-bold text-sm transition-all ${
                    formData.modalidade === 'presencial' 
                      ? 'border-[#312455] bg-[#312455]/5 text-[#312455]' 
                      : 'border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  Presencial
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="empresa" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Empresa ou Instituição (Opcional)</Label>
              <Input 
                id="empresa" 
                placeholder="Ex: Ministério das Finanças / Particular"
                value={formData.empresa}
                onChange={(e) => setFormData({...formData, empresa: e.target.value})}
                className="bg-slate-50 border-slate-200 rounded-xl h-11 focus:ring-2 focus:ring-[#312455]/20 focus:border-[#312455]"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="notas" className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Notas ou Observações (Opcional)</Label>
              <Textarea
                id="notas"
                placeholder="Ex: Prefiro turma da manhã, formação in company, etc."
                value={formData.notas}
                onChange={(e) => setFormData({...formData, notas: e.target.value})}
                className="bg-slate-50 border-slate-200 rounded-xl min-h-[80px] focus:ring-2 focus:ring-[#312455]/20 focus:border-[#312455] resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={onClose}
              className="w-1/3 rounded-xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 h-12"
            >
              VOLTAR
            </Button>
            <Button 
              type="submit" 
              className="w-2/3 bg-[#312455] hover:bg-[#251b42] text-white rounded-xl font-bold h-12 shadow-lg hover:shadow-xl transition-all flex gap-2" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle className="h-4 w-4" />
              )}
              GARANTIR VAGA
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
