'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const categories = [
  {
    title: 'GESTÃO ADMINISTRATIVA DIGITAL',
    image: '/images/courses/gestao.jpeg',
    items: ['Ferramentas de Produtividade Avançada (Office 365/Google Workspace)', 'Gestão de Documentos e Arquivos Electrónicos', 'Gestão do Tempo, Processos e Produtividade']
  },
  {
    title: 'LIDERANÇA E COMUNICAÇÃO',
    image: '/images/courses/lideranca.jpeg',
    items: ['Comunicação Institucional', 'Redacção Oficial', 'Procedimentos Administrativos', 'Liderança e Gestão de RH', 'Oratória e Persuasão']
  },
  {
    title: 'SECRETARIADO ESTRATÉGICO',
    image: '/images/courses/secretariado.jpeg',
    items: ['Secretariado para Alta Direcção', 'Gestão de Gabinete de Altos Gestores', 'Protocolo e Etiqueta Empresarial', 'Práticas de Secretariado Executivo']
  },
  {
    title: 'TECNOLOGIAS INOVADORAS',
    image: '/images/courses/tecnologia.jpeg',
    items: ['Inteligência Artificial para automação de tarefas administrativas', 'Tecnologias de Comunicação e Gestão de Informação', 'Cibersegurança para gestores']
  }
]

export function CoursesSection() {
  return (
    <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-[#f8f7fb] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1600px]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-5">
          <div className="space-y-2">
            <span className="text-[11px] sm:text-xs font-bold text-[#8a66a8] uppercase tracking-[0.2em]">
              FORMAÇÃO EXECUTIVA ESPECIALIZADA
            </span>
            <h2 className="text-2xl md:text-4xl font-extrabold text-[#312455] tracking-tight">
              Os Cursos que Mais Transformam o Setor em Angola
            </h2>
            <p className="text-slate-500 text-sm">
              Inscreva-se num dos cursos com maior impacto no mercado, da produtividade digital ao secretariado de alta direcção
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-xl font-bold px-6 text-[#312455] hover:bg-[#312455] hover:text-white transition-all h-10 shadow-md hover:shadow-xl">
            <Link href="/courses#nossos-cursos" className="flex items-center gap-2">
              Ver Todos Os Cursos
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* 4 Course Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((cat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Link href={`/courses?category=${encodeURIComponent(cat.title)}#nossos-cursos`} className="block h-full">
                <div className="h-full flex flex-col border border-slate-100 shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden bg-white">
                  
                  <div className="h-44 overflow-hidden">
                    <img src={cat.image} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  
                  <div className="p-3 pb-2">
                    <h3 className="text-base font-bold text-[#312455] leading-snug">{cat.title}</h3>
                  </div>
                  
                  <div className="flex-1 p-3 pt-0">
                    <ul className="space-y-1.5">
                      {cat.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs leading-snug text-slate-600">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#8a66a8] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-3 px-3 pb-3">
                    <Button asChild className="w-fit justify-center bg-[#8a66a8] hover:bg-[#312455] text-white rounded-xl font-bold h-9 px-4 shadow-md hover:shadow-xl transition-all">
                      <span>Saber Mais</span>
                    </Button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
