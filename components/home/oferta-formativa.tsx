'use client'

import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  Users,
  Briefcase,
  ArrowRight,
} from 'lucide-react'

// ─── Cards de Soluções (Substitui as tabs) ────────────────────────────────────

const SOLUCOES_CARDS = [
  {
    id: 'formacao',
    icon: BookOpen,
    title: 'Formação Especializada',
    description: 'Programas completos em Gestão Documental, Liderança e Comunicação, Tecnologias Inovadoras e Secretariado Estratégico.',
    cta: 'Ver Cursos',
    ctaHref: '/courses',
  },
  {
    id: 'programas',
    icon: Users,
    title: 'Programas Especiais',
    description: 'Agenciamento de formadores, actualização de altos gestores e briefings sobre ética e deontologia profissional.',
    cta: 'Conhecer os Programas',
    ctaHref: '/courses?tab=programas',
  },
  {
    id: 'eventos',
    icon: Calendar,
    title: 'Eventos Corporativos',
    description: 'Seminários, workshops e master classes de alto impacto para equipas e organizações exigentes.',
    cta: 'Explorar Eventos',
    ctaHref: '/gallery',
  },
  {
    id: 'servicos',
    icon: Briefcase,
    title: 'Serviços Personalizados',
    description: 'Formação à medida da sua organização, diagnóstico de necessidades e programas in-company para equipas de qualquer dimensão.',
    cta: 'Solicitar Consultoria',
    ctaHref: '/contact',
  },
]

/** Card individual de solução */
function SolucaoCard({
  icon: Icon,
  title,
  description,
  cta,
  ctaHref,
}: {
  icon: typeof BookOpen
  title: string
  description: string
  cta: string
  ctaHref: string
}) {
  return (
    <div className="flex flex-col h-full p-6 rounded-xl bg-white border border-slate-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(49,36,85,0.18)]">
      {/* Ícone */}
      <div className="w-12 h-12 rounded-xl bg-[#f5f0fa] flex items-center justify-center mb-4 shrink-0">
        <Icon className="h-6 w-6 text-[#8a66a8]" />
      </div>

      {/* Título */}
      <h3 className="text-lg font-bold text-[#312455] mb-3 leading-snug">
        {title}
      </h3>

      {/* Descrição */}
      <p className="text-sm text-slate-600 mb-6 flex-grow leading-relaxed">
        {description}
      </p>

      {/* CTA */}
      <Link
        href={ctaHref}
        className="inline-flex items-center gap-2 text-[#8a66a8] hover:text-[#735191] font-bold text-sm transition-colors group"
      >
        {cta}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function OfertaFormativa() {
  return (
    <section className="relative pt-6 pb-8 md:pt-10 md:pb-12 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-12 md:mb-16">
          <span className="text-[11px] sm:text-xs font-bold text-[#8a66a8] uppercase tracking-[0.2em]">
            SOLUÇÕES PRIME
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#312455] leading-tight">
            Quatro formas de transformar a sua Organização
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Soluções especializadas, programas à medida e eventos de alto nível, escolha o formato que melhor serve o seu objectivo profissional.
          </p>
        </div>

        {/* Grid de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SOLUCOES_CARDS.map((solucao) => (
            <SolucaoCard
              key={solucao.id}
              icon={solucao.icon}
              title={solucao.title}
              description={solucao.description}
              cta={solucao.cta}
              ctaHref={solucao.ctaHref}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
