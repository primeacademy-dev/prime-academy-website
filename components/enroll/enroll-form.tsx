'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Loader2, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Course } from '@/lib/hygraph'
import { createInscricao } from '@/lib/enrollments-service'
import { useAuth } from '@/contexts/auth-context'

interface EnrollFormProps {
  courses: Course[]
}

export function EnrollForm({ courses }: EnrollFormProps) {
  const searchParams = useSearchParams()
  const preselectedCourse = searchParams.get('course')

  // Find corresponding course name if ID or name was passed
  const getInitialCourseValue = () => {
    if (!preselectedCourse) return ''
    const match = courses.find(
      (c) => c.id === preselectedCourse || c.name === preselectedCourse
    )
    return match ? match.name : preselectedCourse
  }

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: getInitialCourseValue(),
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      const redirectPath = `/enroll${preselectedCourse ? `?course=${encodeURIComponent(preselectedCourse)}` : ''}`
      router.replace(`/login?redirect=${encodeURIComponent(redirectPath)}`)
    }
  }, [isLoading, user, preselectedCourse, router])

  useEffect(() => {
    if (preselectedCourse) {
      const match = courses.find(
        (c) => c.id === preselectedCourse || c.name === preselectedCourse
      )
      setFormData((prev) => ({ ...prev, course: match ? match.name : preselectedCourse }))
    }
  }, [preselectedCourse, courses])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'enrollment',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          course: formData.course,
          message: formData.message,
        }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || 'Não foi possível enviar a inscrição')
      }

      const matchedCourse = courses.find((c) => c.name === formData.course)
      await createInscricao({
        nome: formData.name,
        email: formData.email,
        telefone: formData.phone,
        curso_id: matchedCourse?.id ?? formData.course,
        curso_nome: formData.course,
        mensagem: formData.message || undefined,
        modalidade: matchedCourse?.online ? 'online' : 'presencial',
      })

      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', course: '', message: '' })
    } catch (err) {

      setError(err instanceof Error ? err.message : 'Erro ao enviar inscrição')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="min-h-[360px] flex items-center justify-center">
        <span className="text-sm text-slate-500">A validar sessão e redirecionar para login...</span>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-3">Inscrição recebida!</h2>
        <p className="text-muted-foreground mb-6">
          O pedido foi registado e aguarda aprovação. Receberá uma notificação no painel quando for
          analisado.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          variant="outline"
          className="rounded-xl"
        >
          Fazer nova inscrição
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Nome completo *</Label>
        <Input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Insira o seu nome completo"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          placeholder="exemplo@email.com"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone *</Label>
        <Input
          id="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+244 9XX XXX XXX"
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="course">Curso pretendido *</Label>
        <Select
          value={formData.course}
          onValueChange={(value) => setFormData({ ...formData, course: value })}
          required
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Selecione um curso" />
          </SelectTrigger>
          <SelectContent>
            {courses.map((course) => (
              <SelectItem key={course.id} value={course.name}>
                {course.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Mensagem (opcional)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Alguma pergunta ou informação adicional?"
          rows={4}
          className="rounded-xl resize-none"
        />
      </div>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-destructive/10 text-destructive p-4 rounded-xl text-sm"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl text-base py-6"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            A enviar...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Submeter inscrição
          </>
        )}
      </Button>
    </form>
  )
}
