'use client'

import { useState, useEffect } from 'react'
import { SafeImage } from '@/components/ui/safe-image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { OfertaFormativaTabs } from '@/components/home/oferta-formativa-tabs'
import { BookOpen, Clock, Play, Search, BadgeCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Course } from '@/lib/hygraph'
import { getTrainerForCourse } from '@/lib/course-trainers'
import { getCoursePriceDisplay } from '@/lib/format-price'
import { PreEnrollmentModal } from './pre-enrollment-modal'
import { CtaSection } from '@/components/home/cta-section'

interface CoursesGridProps {
  courses: Course[]
  categories: string[]
}

/**
 * Normaliza uma string para comparação robusta:
 * remove acentos (NFD), colapsa espaços e converte para minúsculas.
 * Garante que "GESTÃO ADMINISTRATIVA DIGITAL" == "gestao administrativa digital"
 * mesmo que o CMS grave sem acento ou com espaços extra.
 */
const normalizeStr = (str: string): string =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove marcas diacríticas (acentos)
    .trim()
    .replace(/\s+/g, '')             // Colapsa todos os espaços em branco

export function CoursesGrid({ courses, categories }: CoursesGridProps) {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const whatsappUrl = `https://api.whatsapp.com/send?phone=244921394946&text=${encodeURIComponent('Olá, Prime Academy! 👋 Quero fazer parte da próxima turma e gostaria de saber mais sobre as próximas inscrições.')}`
  
  // activeFilter default 'GESTÃO ADMINISTRATIVA DIGITAL' — first category in OFFICIAL_CATEGORIES
  const [activeFilter, setActiveFilter] = useState(categoryParam || 'GESTÃO ADMINISTRATIVA DIGITAL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('Todos')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCourseForModal, setSelectedCourseForModal] = useState<Course | null>(null)

  useEffect(() => {
    if (categoryParam) {
      setActiveFilter(categoryParam)
    }
  }, [categoryParam])

  const openPreEnrollment = (course: Course) => {
    setSelectedCourseForModal(course)
    setIsModalOpen(true)
  }

  const getTrainerInfo = (courseId: string, coursePrice: string) => {
    const trainer = getTrainerForCourse(courseId)
    return {
      name: trainer.name,
      avatar: trainer.avatar,
      price: getCoursePriceDisplay(courseId, coursePrice),
    }
  }

  const filteredCourses = courses.filter((course) => {
    // Normalização avançada: ignora acentos, espaços e capitalização em ambos os lados
    const matchesCategory =
      activeFilter === 'TODOS' ||
      normalizeStr(course.category) === normalizeStr(activeFilter)
    const matchesType =
      selectedType === 'Todos' ||
      (selectedType === 'online' && course.online) ||
      (selectedType === 'presencial' && !course.online)
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesType && matchesSearch
  })

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ── HERO (Restaurado para cor original, com barra de pesquisa glassmorphic integrada) ── */}
      <section className="relative pt-48 pb-16 lg:pt-48 lg:pb-28 overflow-hidden bg-[#312455]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#312455]/95 via-[#312455]/90 to-[#312455]/80" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8a66a8]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10 max-w-5xl">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-white/60 font-bold text-xs uppercase tracking-widest block mb-3"
          >
            FORMAÇÃO, PROGRAMAS, CONSULTORIA & EVENTOS
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 max-w-3xl mx-auto"
          >
            Um Mar de Oportunidades à Sua Espera
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed mt-4 mb-8 text-pretty"
          >
            Uma Academia. Soluções à medida. Um único padrão de Excelência.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex justify-center"
          >
            <Button
              asChild
              size="lg"
              className="bg-white hover:bg-neutral-100 text-[#312455] rounded-xl px-7 py-5 text-xs md:text-base font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-lg border-0"
            >
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                Fazer Parte da Próxima Turma
              </a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── CONTEÚDO PRINCIPAL ── */}
      <div className="container mx-auto px-4 max-w-screen-xl pb-20">

        {/* Bloco de ofertas formativas */}
        <div className="mb-10">
          <OfertaFormativaTabs />
        </div>

        {/* Título da secção */}
        <div className="text-center pt-2 mb-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#312455] tracking-wider">
            Os nossos Cursos
          </h2>
        </div>

        {/* Traço roxo mantido na sua posição visual original */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-1 bg-[#8a66a8] rounded-full" />
        </div>

        {/* Filtros por categoria (tabs responsivas) */}
        <div className="flex overflow-x-auto pb-4 -mb-4 scrollbar-hide md:flex-wrap items-center justify-start md:justify-center gap-2 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-sm whitespace-nowrap ${
                activeFilter.trim().toUpperCase() === category.trim().toUpperCase()
                  ? 'bg-[#8a66a8] text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-100 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Grid – 1 col mobile / 2 md / 3 lg / 4 xl — preenche todo o espaço horizontal */}
        <div id="nossos-cursos" className="scroll-mt-32">
          <AnimatePresence mode="popLayout">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course, index) => {
              const trainer = getTrainerInfo(course.id, course.price)
              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  className="flex"
                >
                  <div className="bg-white rounded-xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_40px_rgba(138,102,168,0.12)] transition-all duration-500 flex flex-col group w-full">

                    {/* Imagem de capa */}
                    <div className="relative h-44 overflow-hidden bg-slate-200">
                      <SafeImage
                        src={course.image}
                        alt={course.name}
                        fill
                        unoptimized
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      {/* Badge Certificação Flutuante */}
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-md text-[10px] shadow-lg">
                        <BadgeCheck className="w-3 h-3" />
                        Certificação
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-4 flex-1 flex flex-col gap-3">
                      <div>
                        <h3 className="text-sm font-black text-[#312455] leading-snug mb-1.5 group-hover:text-[#8a66a8] transition-colors duration-200 line-clamp-2">
                          {course.name}
                        </h3>
                        <p className="text-slate-500 text-xs font-light leading-relaxed line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Metadados */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium mt-auto">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-[#8a66a8]" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-[#312455]" />
                          12 Aulas
                        </span>
                        <span className="bg-[#8a66a8]/8 text-[#8a66a8] font-bold px-2 py-0.5 rounded-md text-[10px]">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="px-4 pb-4 flex gap-2">
                      <Button asChild variant="outline" className="w-1/2 rounded-xl h-10 text-xs font-bold border-slate-200 text-slate-600 hover:border-[#8a66a8] hover:text-[#8a66a8] hover:bg-transparent cursor-pointer transition-colors duration-300">
                        <Link href={`/courses/${course.id}`}>
                          Saber mais
                        </Link>
                      </Button>
                      <Button 
                        onClick={() => openPreEnrollment(course)}
                        className="w-1/2 bg-[#8a66a8] hover:bg-[#735191] text-white rounded-xl h-10 text-xs font-bold shadow-md cursor-pointer transition-all duration-300"
                      >
                        Pré-inscrição
                      </Button>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </div>
        </AnimatePresence>

        {/* Estado vazio */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-white border border-slate-100 rounded-xl shadow-sm max-w-lg mx-auto"
          >
            <BookOpen className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-1">Nenhum curso encontrado</h3>
            <p className="text-sm text-slate-500 max-w-xs mx-auto font-light leading-relaxed">
              Não encontrámos nenhum curso correspondente aos seus filtros. Tente novamente com termos mais genéricos.
            </p>
          </motion.div>
        )}
        </div>

      </div>

      <CtaSection
        title="Pronto Para Atualizar Os Seus Conhecimentos?"
        subtitle="A sua jornada começa hoje. Inscreva-se numa das nossas turmas ou fale connosco para encontrar o programa ideal, individual ou à medida da sua equipa."
        cta1Label="Pedir Proposta"
        cta1Href="/contact"
        cta2Label="Falar Com A Nossa Equipa"
        cta2Href="/contact"
      />

      <PreEnrollmentModal 
        course={selectedCourseForModal} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  )
}
