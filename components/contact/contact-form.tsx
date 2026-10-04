'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const courses = [
    "Gestão Administrativa",
    "Liderança & Redacção Oficial",
    "Secretariado Estratégico",
    "Tecnologia & IA Aplicada",
    "Outros"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...formData }),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        throw new Error(result?.error || 'Não foi possível enviar a mensagem')
      }

      setIsSuccess(true)
      setFormData({ name: '', email: '', phone: '', course: '', message: '' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="bg-emerald-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold text-[#312455] mb-3">Mensagem enviada!</h3>
        <p className="text-slate-500 mb-6 text-sm">
          Obrigado pelo contacto. A nossa equipa responderá o mais breve possível.
        </p>
        <Button
          onClick={() => setIsSuccess(false)}
          className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-xl text-xs font-bold uppercase tracking-wider px-6 py-2.5"
        >
          Enviar outra mensagem
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 flex flex-col flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="contact-name" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Nome Completo *
          </Label>
            <Input
              id="contact-name"
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Insira o seu nome"
              className="w-full h-14 sm:h-16 rounded-xl border-slate-200 focus-visible:ring-[#8a66a8] text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Endereço de E-mail *
            </Label>
            <Input
              id="contact-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="exemplo@email.com"
              className="w-full h-14 sm:h-16 rounded-xl border-slate-200 focus-visible:ring-[#8a66a8] text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="contact-phone" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              WhatsApp / Telefone
            </Label>
            <Input
              id="contact-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+244 9XX XXX XXX"
              className="w-full h-14 sm:h-16 rounded-xl border-slate-200 focus-visible:ring-[#8a66a8] text-base"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact-course" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Assunto / Curso de Interesse *
            </Label>
            <Select onValueChange={(value) => setFormData({ ...formData, course: value })} value={formData.course} required>
              <SelectTrigger id="contact-course" className="w-full h-14 sm:h-16 rounded-xl border-slate-200 focus:ring-[#8a66a8] focus-visible:ring-[#8a66a8] text-base bg-white px-3 py-2">
                <SelectValue placeholder="Seleccione um curso" />
              </SelectTrigger>
              <SelectContent className="rounded-xl bg-white">
                {courses.map((course) => (
                  <SelectItem key={course} value={course} className="text-base">
                    {course}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Mensagem *
          </Label>
          <Textarea
            id="contact-message"
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="Escreva a sua mensagem aqui..."
            rows={5}
            className="w-full rounded-xl resize-none border-slate-200 focus-visible:ring-[#8a66a8]"
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
          className="w-full h-14 sm:h-16 bg-[#312455] hover:bg-[#8a66a8] text-white rounded-xl text-base font-bold uppercase tracking-widest px-6 py-4 mt-auto shadow-md transition-all duration-300"
        >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            A enviar...
          </>
        ) : (
          <>
            <span>Enviar pedido</span>
            <span className="ml-1.5">&gt;</span>
          </>
        )}
      </Button>
    </form>
  )
}
