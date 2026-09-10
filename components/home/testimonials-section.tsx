import { getTestimonials } from '@/lib/hygraph'
import { Badge } from '@/components/ui/badge'
import { TestimonialsCarousel } from './testimonials-carousel'

const mockTestimonials = [
  {
    id: 't1',
    name: 'Maria Silva',
    text: 'A formação superou as minhas expectativas. Ferramentas práticas e imediatas.',
    avatarUrl: null
  },
  {
    id: 't2',
    name: 'João Pedro',
    text: 'Excelente abordagem metodológica. Sinto-me muito mais preparado para os desafios da minha liderança.',
    avatarUrl: null
  },
  {
    id: 't3',
    name: 'Ana Costa',
    text: 'Formadores de alto nível e conteúdos extremamente pertinentes para a nossa realidade.',
    avatarUrl: null
  },
  {
    id: 't4',
    name: 'Sofia Bento',
    text: 'A metodologia é fantástica. Aprendi técnicas que aplicarei no meu dia-a-dia profissional.',
    avatarUrl: null
  },
  {
    id: 't5',
    name: 'Ricardo Silva',
    text: 'Uma experiência enriquecedora que transformou a minha forma de gerir processos.',
    avatarUrl: null
  }
]

export async function TestimonialsSection() {
  const testimonialsFromHygraph = await getTestimonials()
  const testimonials = testimonialsFromHygraph.length > 0 ? testimonialsFromHygraph : mockTestimonials

  return (
    <section className="pt-8 pb-8 md:pt-12 md:pb-12 bg-secondary/10 relative overflow-hidden border-t border-border">
      <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <Badge className="bg-accent text-accent-foreground border-none px-4 py-1 uppercase tracking-widest text-[10px] font-bold">
              TESTEMUNHOS COMPROVADOS
            </Badge>
            <h3 className="text-2xl md:text-3xl font-extrabold text-primary">
              Os nossos Formandos Recomendam
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl mx-auto">
              Porque o investimento tem impacto real nas suas organizações e carreiras.
            </p>
          </div>

          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  )
}
