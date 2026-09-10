'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, User, BookOpen, Trophy } from 'lucide-react'

const steps = [
  {
    icon: User,
    title: '1. Inscrição',
    desc: 'Escolha o seu programa e faça a inscrição online de forma rápida e segura.'
  },
  {
    icon: BookOpen,
    title: '2. Aprendizagem',
    desc: 'Aceda a materiais de excelência e videoaulas desenvolvidas por especialistas.'
  },
  {
    icon: CheckCircle2,
    title: '3. Aplicação Prática',
    desc: 'Implemente metodologias inovadoras nos desafios reais da sua organização.'
  },
  {
    icon: Trophy,
    title: '4. Certificação',
    desc: 'Receba o seu certificado reconhecido e potencie a sua carreira profissional.'
  }
]

export function HowItWorksSection() {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">A SUA JORNADA</span>
          <h2 className="text-3xl md:text-4xl font-black text-[#312455] mt-3 leading-tight">
            Como Funciona a sua Jornada
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-slate-50 p-8 rounded-xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 text-center flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                  <Icon className="h-8 w-8 text-[#8a66a8]" />
                </div>
                <h3 className="text-lg font-black text-[#312455]">{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
