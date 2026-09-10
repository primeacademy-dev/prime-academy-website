import Link from 'next/link'
import { AlertTriangle, TrendingDown, HelpCircle } from 'lucide-react'

const DESAFIOS = [
  {
    icon: AlertTriangle,
    title: 'Desequilíbrio de Competências',
    description: 'Necessidade crítica de conciliar habilidades técnicas (hard skills) com as habilidades humanas (soft skills).',
  },
  {
    icon: TrendingDown,
    title: 'Desvalorização Administrativa',
    description: 'As áreas administrativas e os sectores de apoio sofrem de uma desvalorização e banalização generalizada no mercado.',
  },
  {
    icon: HelpCircle,
    title: 'Falta de Clareza Organizacional',
    description: 'Os gestores e as instituições demonstram dificuldade em distinguir claramente o papel do secretariado face a outros sectores de apoio.',
  },
]

export function ChallengesSection() {
  return (
    <section className="relative pt-4 pb-6 md:pt-8 md:pb-10 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 md:mb-14">
          <span className="text-[11px] sm:text-xs font-bold text-[#8a66a8] uppercase tracking-[0.2em]">
            DESAFIOS DO MERCADO
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#312455] leading-tight">
            Identificámos os Desafios. Construímos as Soluções.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Angola tem profissionais com potencial. A Prime Academy existe para ajudar organizações e pessoas a transformar esse potencial em resultados reais.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {DESAFIOS.map((desafio, idx) => {
            const Icon = desafio.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#f5f0fa] flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-[#8a66a8]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#312455] mb-2 leading-snug">
                  {desafio.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {desafio.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-[#8a66a8] hover:bg-[#735191] text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            Descubra os nossos Programas
          </Link>
        </div>
      </div>
    </section>
  )
}
