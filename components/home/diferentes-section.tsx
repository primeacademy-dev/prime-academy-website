import Link from 'next/link'
import { BookOpen, Award, TrendingUp, Shield } from 'lucide-react'

const DIFERENCIAIS = [
  {
    icon: BookOpen,
    titulo: 'Formação Contextualizada com Metodologia Prática',
    descricao: 'Cada programa é desenvolvido a partir da realidade das organizações angolanas. Os conteúdos, os casos de estudo e os exercícios são retirados de situações reais, para que o que se aprende na formação seja aplicado no dia de trabalho seguinte.',
  },
  {
    icon: Award,
    titulo: 'Formadores com Excelência Comprovada',
    descricao: 'Os formadores da Prime Academy têm um percurso profissional comprovado nas áreas que ensinam. São profissionais que exerceram funções de secretariado, gestão e liderança em contextos exigentes, dentro e fora de Angola.',
  },
  {
    icon: TrendingUp,
    titulo: 'Impacto Organizacional e de Carreira',
    descricao: 'Quem passa pela Prime regressa ao trabalho diferente. Mais organizado, mais confiante, mais capaz. E as organizações que formam as suas equipas connosco notam a diferença, na comunicação, nos processos e nos resultados.',
  },
  {
    icon: Shield,
    titulo: 'Certificação Reconhecida',
    descricao: 'Todos os programas da Prime Academy incluem certificado de conclusão, reconhecido por empresas e instituições públicas em Angola e além fronteiras.',
  },
]

export function DiferentesSection() {
  return (
    <section className="relative pt-6 pb-8 md:pt-10 md:pb-12 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center space-y-4 mb-10 md:mb-14">
          <span className="text-[11px] sm:text-xs font-bold text-[#8a66a8] uppercase tracking-[0.2em]">
            O QUE NOS DIFERENCIA
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#312455] leading-tight">
            Razões Fundamentais para Escolher a Prime Academy
          </h2>
          <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
            Não somos mais um centro de formação. Somos a academia angolana especializada em Novas Tecnologias de Gestão Secretarial, com historial e metodologia orientada, para o sector público e privado.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFERENCIAIS.map((item, idx) => {
            const Icon = item.icon
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 text-center border border-gray-100 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(49,36,85,0.18)]"
              >
                <div className="w-12 h-12 rounded-xl bg-[#f5f0fa] flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-[#8a66a8]" />
                </div>
                <h3 className="text-sm font-bold text-[#312455] mb-2 leading-snug">
                  {item.titulo}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.descricao}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-10 md:mt-14">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-[#8a66a8] hover:bg-[#735191] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            Falar com a nossa Equipa
          </Link>
        </div>
      </div>
    </section>
  )
}
