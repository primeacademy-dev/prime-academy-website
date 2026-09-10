'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  BookOpen,
  Calendar,
  Users,
  Briefcase,
  ArrowRight,
  FolderOpen,
  Mic2,
  Cpu,
  Award,
  RefreshCw,
  ShieldCheck,
  PresentationIcon,
  Wrench,
  Network,
  GraduationCap,
  FileSearch,
  BarChart2,
  ClipboardList,
} from 'lucide-react'

// ─── Data ────────────────────────────────────────────────────────────────────

const OFERTA_FORMATIVA = [
  {
    id: 'formacao',
    icon: BookOpen,
    title: 'Formação Especializada',
    subtitle: 'Programas completos para Desenvolver competências críticas',
    cta: 'Ver cursos',
    ctaHref: '/courses',
    areas: [
      {
        titulo: 'Gestão Administrativa Digital',
        descricao: 'Sistemas, Processos e Normas de gestão da informação e arquivo nas organizações modernas.',
        areaIcon: FolderOpen,
        cursos: [
          'Gestão de Documentos e Arquivos Electrónicos',
          'Gestão Estratégica de Recursos Humanos',
          'Gestão e Redacção de Documentos Oficiais e Pareceres Técnicos',
        ],
      },
      {
        titulo: 'Liderança e Comunicação',
        descricao: 'Comunicação Institucional, Protocolo, Redacção Executiva e Relações Interpessoais de Alto Nível.',
        areaIcon: Mic2,
        cursos: [
          'Comunicação Institucional e Corporativa',
          'Redacção Profissional e Escrita Executiva',
          'Protocolo, Cerimonial e Imagem Institucional',
          'Oratória, Persuasão e Comunicação de Impacto',
        ],
      },
      {
        titulo: 'Tecnologias Inovadoras',
        descricao: 'IA, Ferramentas Digitais avançadas e Cibersegurança para o profissional administrativo moderno.',
        areaIcon: Cpu,
        cursos: [
          'AI para Automação e Tarefas Administrativas',
          'Ferramentas de Produtividade (Office 365/Google)',
          'Cibersegurança e Proteção de Dados',
          'Gestão de Tempo, Processos e Produtividade',
        ],
      },
      {
        titulo: 'Secretariado Estratégico',
        descricao: 'Competências de Assessoria, Protocolo Executivo e Gestão de Gabinetes de Alta Direcção.',
        areaIcon: Award,
        cursos: [
          'Secretariado para Alta Direcção',
          'Gestão de Gabinetes de Altos Gestores',
          'Práticas de Secretariado Executivo',
          'Relações Públicas',
        ],
      },
    ],
  },
  {
    id: 'programas',
    icon: Users,
    title: 'Programas Especiais',
    subtitle: 'Programas de curta duração focados em resultados rápidos',
    cta: 'Saber mais',
    ctaHref: '/courses',
    areas: [
      {
        titulo: 'Agenciamento',
        descricao: 'Gestão de Projetos e parcerias estratégicas para Profissionais de Alta Performance.',
        areaIcon: ClipboardList,
        cursos: [
          'Agenciamento de Formadores e Gestão de Formação Estratégica',
        ],
      },
      {
        titulo: 'Atualização',
        descricao: 'Formação Contínua e atualização profissional para acompanhar as exigências do mercado.',
        areaIcon: RefreshCw,
        cursos: [
          'Atualização de habilidades de Altos Gestores',
        ],
      },
      {
        titulo: 'Ética',
        descricao: 'Princípios de Ética Profissional e Governança Corporativa aplicados ao contexto organizacional.',
        areaIcon: ShieldCheck,
        cursos: [
          'Briefing sobre Ética e Deontologia Profissional',
        ],
      },
    ],
  },
  {
    id: 'eventos',
    icon: Calendar,
    title: 'Eventos Corporativos',
    subtitle: 'Seminários, Workshops e Masterclasses de Alto Nível',
    cta: 'Explorar eventos',
    ctaHref: '/gallery',
    areas: [
      {
        titulo: 'Seminários',
        descricao: 'Sessões aprofundadas sobre gestão e organização de eventos corporativos de excelência.',
        areaIcon: PresentationIcon,
        cursos: [
          'Seminários sobre Gestão e Organização de Eventos Corporativos',
        ],
      },
      {
        titulo: 'Workshops',
        descricao: 'Formação prática em planeamento de viagens e ferramentas de IA para a administração moderna.',
        areaIcon: Wrench,
        cursos: [
          'Workshop - Planeamento e Gestão de Viagens Corporativas',
          'Workshop - Ferramentas de IA para Administração Moderna',
        ],
      },
      {
        titulo: 'Masterclasses',
        descricao: 'Aprendizagem de elite com especialistas sobre a Gestão de Gabinetes de Altos Gestores.',
        areaIcon: GraduationCap,
        cursos: [
          'Masterclass sobre Gestão de Gabinetes de Altos Gestores',
        ],
      },
      {
        titulo: 'Networking',
        descricao: 'Eventos de Networking exclusivos para profissionais de alto nível e tomadores de decisão.',
        areaIcon: Network,
        cursos: [
          'Networking de Alto Nível',
        ],
      },
    ],
  },

  {
    id: 'servicos',
    icon: Briefcase,
    title: 'Serviços Personalizados',
    subtitle: 'Consultorias e Formação sob medida para a sua Organização',
    cta: 'Solicitar consultoria',
    ctaHref: '/contact',
    areas: [
      {
        titulo: 'Consultoria',
        descricao: 'Apoio especializado na Organização de Gabinetes, Comunicação Institucional e Assessoria de Imprensa.',
        areaIcon: BarChart2,
        cursos: [
          'Consultoria em Gestão e Organização de Gabinetes de Altos Gestores',
          'Consultoria em Comunicação Institucional e Assessoria de Imprensa',
        ],
      },
      {
        titulo: 'Formação Sob Medida',
        descricao: 'Programas formativos desenhados especificamente para as necessidades da sua Organização.',
        areaIcon: FileSearch,
        cursos: [
          'Construção de Formação sob medida para as necessidades da sua Organização',
        ],
      },
    ],
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Linha clicável individual de cada curso dentro de um card de área */
function CursoRow({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-100 text-left text-xs md:text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors group"
    >
      <span>{label}</span>
      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#8a66a8] transition-colors shrink-0 ml-2" />
    </Link>
  )
}

/** Card vertical de uma área (ex: Gestão Administrativa Digital) */
function AreaCard({
  area,
  ctaHref,
}: {
  area: (typeof OFERTA_FORMATIVA)[0]['areas'][0]
  ctaHref: string
}) {
  const AreaIcon = area.areaIcon

  return (
    <div className="flex flex-col justify-between h-full p-6 rounded-xl bg-white border border-slate-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(49,36,85,0.18)]">
      {/* ── Topo: Cabeçalho ── */}
      <div>
        {/* Linha do título com ícone */}
        <div className="flex items-center gap-3 mb-3">
          <span className="p-2 rounded-lg bg-purple-50 text-purple-600 shrink-0">
            <AreaIcon className="h-4 w-4" />
          </span>
          <h4 className="text-sm font-semibold text-[#312455] text-left leading-snug">
            {area.titulo}
          </h4>
        </div>

        {/* Descrição curta */}
        <p className="mb-6 text-left text-slate-500 text-xs md:text-sm leading-relaxed">
          {area.descricao}
        </p>

        {/* ── Meio: Lista de sub-itens ── */}
        <div className="flex flex-col gap-2 mb-6">
          {area.cursos.map((curso, i) => (
            <CursoRow key={i} href={ctaHref} label={curso} />
          ))}
        </div>
      </div>

    </div>
  )
}

// ─── Main Component (apenas as abas, sem header) ─────────────────────────────

export function OfertaFormativaTabs() {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  
  // Encontra o índice da aba baseado no ID do search param
  const defaultTabIndex = tabParam 
    ? OFERTA_FORMATIVA.findIndex(cat => cat.id === tabParam)
    : 0
  
  const [activeTab, setActiveTab] = useState(defaultTabIndex >= 0 ? defaultTabIndex : 0)
  const activeCategory = OFERTA_FORMATIVA[activeTab]
  
  useEffect(() => {
    if (tabParam && defaultTabIndex >= 0) {
      setActiveTab(defaultTabIndex)
    }
  }, [tabParam, defaultTabIndex])

  return (
    <div className="w-full pt-6 md:pt-8">
      {/* Tabs Navigation */}
      <div className="flex overflow-x-auto whitespace-nowrap gap-2 md:justify-center border-b border-gray-200 pb-4 mb-10 md:mb-14 scrollbar-hide">
        {OFERTA_FORMATIVA.map((cat, idx) => {
          const Icon = cat.icon
          return (
            <button
              key={cat.id}
              onClick={() => setActiveTab(idx)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all border-b-2 rounded-xl shadow-[0_4px_12px_rgba(49,36,85,0.16)] ${
                activeTab === idx
                  ? 'border-[#8a66a8] text-[#8a66a8]'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {cat.title}
            </button>
          )
        })}
      </div>

      {/* Active Category Content */}
      <div className="space-y-8">
        <p className="text-center text-gray-500 max-w-xl mx-auto">
          {activeCategory.subtitle}
        </p>

        {/* Sub-grid de cards de área */}
        <div
          className={`grid gap-6 ${
            activeCategory.id === 'formacao'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {activeCategory.areas.map((area, idx) => (
            <AreaCard
              key={idx}
              area={area}
              ctaHref={activeCategory.ctaHref}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
