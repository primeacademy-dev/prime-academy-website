'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Users, Award, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const workshops = [
  {
    id: 'w1',
    title: 'Gestão e Organização de Eventos Corporativos',
    edition: '1ª Edição',
    date: '15 de Maio a 20 de Julho de 2026',
    icon: Users,
    tag: 'Corporativo'
  },
  {
    id: 'w2',
    title: 'Planeamento e Gestão de Viagens Corporativas',
    edition: '2ª Edição',
    date: '10 de Junho a 15 de Julho de 2026',
    icon: Award,
    tag: 'Estratégia'
  },
  {
    id: 'w3',
    title: 'Ferramentas de IA para Administração Moderna',
    edition: '1ª Edição',
    date: '20 de Agosto a 30 de Setembro de 2026',
    icon: Calendar,
    tag: 'Tecnologia'
  },
  {
    id: 'w4',
    title: 'Masterclasse sobre Gestão de Gabinetes de Altos Gestores',
    edition: '1ª Edição',
    date: '10 de Setembro a 05 de Outubro de 2026',
    icon: Award,
    tag: 'Alta Direcção'
  }
]

export function WorkshopsSection() {
  return (
    <section className="py-20 md:py-28 bg-background relative overflow-hidden">
      {/* Visual accents */}
      <div className="absolute top-0 right-1/3 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <Badge className="bg-primary text-white border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
            CALENDÁRIO EXECUTIVO 2026
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary max-w-3xl mx-auto leading-tight">
            Workshops e Seminários Executivos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Programas intensivos de actualização profissional com formadores especialistas de renome nacional e internacional.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workshops.map((w, index) => {
            const IconComponent = w.icon
            return (
              <motion.div
                key={w.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group h-full"
              >
                <Card className="h-full flex flex-col justify-between border border-border/80 hover:border-accent/40 hover:shadow-xl transition-all duration-300 bg-card rounded-xl overflow-hidden">
                  <CardHeader className="pb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-primary/5 text-primary text-[10px] uppercase font-bold py-0.5 px-2">
                        {w.edition}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] font-medium border-border">
                        {w.tag}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-extrabold text-foreground leading-snug group-hover:text-accent transition-colors pt-2">
                      {w.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-4 space-y-4">
                    <div className="flex items-start gap-2.5 text-xs text-muted-foreground bg-muted/40 p-3.5 rounded-xl border border-border/50">
                      <Calendar className="h-4.5 w-4.5 text-accent flex-shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="block font-bold text-foreground text-[10px] uppercase tracking-wider">Período Previsto</span>
                        <span>{w.date}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="pt-2 pb-6 px-6">
                    <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90 rounded-xl font-semibold shadow-md group-hover:shadow-lg transition-all">
                      <Link href={`/enroll?workshop=${encodeURIComponent(w.title)}`}>
                        Inscrever-me
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
