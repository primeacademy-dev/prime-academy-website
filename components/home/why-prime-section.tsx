'use client'

import { motion } from 'framer-motion'
import { Award, ShieldCheck, Target, Zap } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const differentials = [
  {
    icon: Award,
    title: "Excelência Formativa",
    description: "Padrões elevados de ensino desenhados para elevar o potencial de executivos e profissionais."
  },
  {
    icon: ShieldCheck,
    title: "Credibilidade e Prestígio",
    description: "Parcerias estratégicas e certificações valorizadas que garantem autoridade no mercado."
  },
  {
    icon: Zap,
    title: "Inovação Aplicada",
    description: "Conteúdos modernos, alinhados com as exigências da transformação digital e gestão inteligente."
  },
  {
    icon: Target,
    title: "Orientação para Resultados",
    description: "Metodologia prática e focada no desenvolvimento de competências críticas para a performance corporativa."
  }
]

export function WhyPrimeSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-primary uppercase tracking-tight mb-4">
            Porquê Escolher a Prime
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubra os pilares que nos posicionam como o seu parceiro de eleição em formação profissional de alto nível.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {differentials.map((diff, index) => (
            <motion.div
              key={diff.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="h-full"
            >
              <Card className="h-full hover:shadow-xl transition-all border-slate-100 hover:border-secondary/20">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary mb-2">
                    <diff.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-lg text-primary tracking-tight">{diff.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{diff.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
