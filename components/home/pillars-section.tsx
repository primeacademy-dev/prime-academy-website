'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Building, BookOpen, Briefcase, Cpu, ArrowRight, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const pillars = [
  {
    id: 0,
    icon: Building,
    title: "Gestão Administrativa",
    subtitle: "Sistemas Digitais e Produtividade",
    description: "Otimize processos, organize fluxos de trabalho e implemente ferramentas digitais para uma gestão administrativa de alta performance.",
    competencies: [
      "Organização de Fluxos de Trabalho",
      "Ferramentas de Gestão Digital",
      "Produtividade e Gestão de Tempo",
      "Processos Administrativos Eficientes"
    ]
  },
  {
    id: 1,
    icon: BookOpen,
    title: "Liderança & Redacção Oficial",
    subtitle: "Comunicação e Procedimentos Estatais",
    description: "Desenvolva capacidades de liderança e domine a redacção oficial, essencial para a comunicação institucional de alto nível.",
    competencies: [
      "Técnicas de Redacção Oficial",
      "Comunicação Institucional",
      "Liderança de Equipas",
      "Protocolo e Procedimentos Estatais"
    ]
  },
  {
    id: 2,
    icon: Briefcase,
    title: "Secretariado Estratégico",
    subtitle: "Assessoria de Altos Gestores",
    description: "Capacite-se para ser o braço direito da gestão, com competências avançadas em assessoria e suporte à decisão.",
    competencies: [
      "Assessoria de Alta Direcção",
      "Gestão de Agenda Executiva",
      "Protocolo Executivo",
      "Suporte à Decisão"
    ]
  },
  {
    id: 3,
    icon: Cpu,
    title: "Tecnologia & IA Aplicada",
    subtitle: "Inovação Prática e Automação",
    description: "Posicione a sua equipa um passo à frente com integrações modernas e ferramentas de automatização inteligentes.",
    competencies: [
      "Utilização Ética e Produtiva de GPTs e CoPilot",
      "Cibersegurança e Proteção de Dados para Assistentes",
      "Automação no Processamento de Faturas e Relatórios",
      "Sistemas de Apoio à Decisão e Monitorização"
    ]
  }
]

export function PillarsSection() {
  const [activePillar, setActivePillar] = useState(3) // Default to Technology & IA

  return (
    <section className="py-16 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10 max-w-7xl">
        
        <div className="text-center mb-16 space-y-4">
          <h3 className="text-secondary font-bold tracking-widest text-sm uppercase">Excelência em Formação Executiva</h3>
          <h2 className="text-3xl md:text-5xl font-extrabold text-primary">Os 4 Pilares da Nossa Formação</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Combinamos a nossa metodologia de elite com quatro pilares estratégicos para garantir resultados práticos e alinhados com o futuro corporativo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left: List of Pillars */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xs text-muted-foreground uppercase tracking-widest font-bold">Seleccione uma área de impacto</span>
            {pillars.map((pillar) => (
              <button
                key={pillar.id}
                onClick={() => setActivePillar(pillar.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center justify-between group ${activePillar === pillar.id 
                  ? 'bg-primary text-white shadow-lg' 
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-100'}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${activePillar === pillar.id ? 'bg-white/10' : 'bg-secondary/10'}`}>
                    <pillar.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold">{pillar.title}</h4>
                    <p className={`text-xs ${activePillar === pillar.id ? 'text-white/80' : 'text-muted-foreground'}`}>{pillar.subtitle}</p>
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${activePillar === pillar.id ? 'text-white' : 'text-slate-400'}`} />
              </button>
            ))}
            <p className="text-xs text-slate-500 pt-4 px-2">Cursos customizáveis para o plano da sua empresa.</p>
          </div>

          {/* Right: Details Card */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePillar}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white border border-slate-100 rounded-xl p-8 shadow-sm space-y-6"
              >
                <div className="flex justify-between items-start">
                   <Badge className="bg-secondary/10 text-secondary border-none">Foco: Futuro Exponencial</Badge>
                   <span className="text-xs text-muted-foreground">2.200+ Especialistas</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold text-primary">{pillars[activePillar].title}</h3>
                  <p className="text-muted-foreground">{pillars[activePillar].description}</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Competências de sucesso abordadas:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {pillars[activePillar].competencies.map((comp, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <Check className="w-4 h-4 text-emerald-500" />
                        {comp}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                   <p className="text-xs text-muted-foreground text-center md:text-left">Todos os módulos contam com material de apoio completo em formato PDF e avaliação prática continuada.</p>
                   <Link href="/courses" className="bg-primary text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors whitespace-nowrap">
                     Ver Horários E Preços <ArrowRight className="w-4 h-4" />
                   </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
