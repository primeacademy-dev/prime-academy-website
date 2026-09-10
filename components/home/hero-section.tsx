'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Course } from '@/lib/hygraph'
import { FeaturedCard } from './featured-card'

const slides = [
  { image: "/images/hero/hero1.jpeg" },
  { image: "/images/hero/hero5 (1).jpeg" },
  { image: "/images/hero/hero3.jpeg" },
]

interface FeaturedBoard {
  id: string
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas: boolean
}

// Fallback used only when Hygraph returns no courses
const FALLBACK_COURSES: FeaturedBoard[] = [
  {
    id: 'f1',
    title: "Secretariado Executivo Digital e Novas Tecnologias",
    duration: "2 Dias / 16 Horas",
    level: "Avançado",
    regime: "Híbrido",
    vagasLimitadas: true,
  },
  {
    id: 'f2',
    title: "Gestão de Documentos e Arquivos Electrónicos",
    duration: "2 Dias / 14 Horas",
    level: "Intermédio",
    regime: "Híbrido",
    vagasLimitadas: true,
  },
  {
    id: 'f3',
    title: "Oratória, Persuasão e Comunicação de Impacto",
    duration: "1 Dia / 8 Horas",
    level: "Executivo",
    regime: "Híbrido",
    vagasLimitadas: true,
  },
]


interface FeaturedBoard {
  id: string
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas: boolean
}

interface HeroSectionProps {
  featuredCourses?: Course[]
  featuredBoards?: FeaturedBoard[]
}

export function HeroSection({ featuredCourses = [], featuredBoards = [] }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [contentToggle, setContentToggle] = useState(true)

  // Derive the featured item from Hygraph featured board, real courses, or fallback
  const coursePool: FeaturedBoard[] = featuredBoards.length > 0
    ? featuredBoards
    : featuredCourses.length > 0
      ? featuredCourses.map(c => ({
          id: c.id,
          title: c.name,
          duration: c.duration || '-',
          level: c.level || '-',
          regime: c.online ? 'Online' : 'Híbrido',
          vagasLimitadas: true,
        }))
      : FALLBACK_COURSES

  const activeCourse = coursePool[currentSlide % coursePool.length]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
      setContentToggle((prev) => !prev)
    }, 6000)
    return () => clearInterval(timer)
  }, [])


  const imageObjectPosition = 'object-cover object-top'

  return (
    <section className="relative pt-20 md:pt-24 pb-8 lg:pt-0 lg:pb-0 mt-[82px] md:mt-[112px] h-auto min-h-[480px] md:h-[calc(100vh-170px)] md:min-h-[520px] w-full flex items-stretch overflow-hidden">
      {/* Background Images Slideshow */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-primary">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={slides[currentSlide].image}
              alt="Prime Academy Background"
              fill
              className={imageObjectPosition}
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#312455]/90 via-[#312455]/60 to-transparent" />
      </div>

      {/* Grid Layout */}
      <div className="relative z-20 w-full h-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 px-6 sm:px-12 lg:px-16 items-center">

        {/* Left Column - Text Content */}
        <div className="lg:col-span-7 flex flex-col justify-center items-start text-left h-full pt-16 lg:pt-8 lg:justify-center lg:pl-8 space-y-4 md:space-y-6">

          {/* DESKTOP CONTENT (Always visible on desktop, hidden on mobile) */}
          <div className="hidden lg:flex lg:flex-col lg:items-start lg:space-y-6 w-full">
            {/* Badge */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] tracking-wider border border-white/10 uppercase">
                <Star className="h-3 w-3 text-secondary fill-secondary" />
                <span className="font-semibold">Formação Executiva em Angola</span>
              </div>
            </div>

            <div className="max-w-xl text-left flex flex-col items-start justify-start">
              <div className="overflow-hidden">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight">
                  Da Competência à Excelência
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-lg font-light leading-relaxed text-pretty mt-3 lg:mt-4">
                  Formação corporativa especializada em Novas Tecnologias de Gestão Secretarial, focada no desenvolvimento de profissionais de alta performance para o alcance dos objectivos organizacionais.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-row items-center justify-start gap-3 lg:gap-4 mt-4 md:mt-6 w-full relative z-10">
                <Button
                  asChild
                  size="lg"
                  className="bg-white hover:bg-neutral-100 text-[#312455] rounded-xl px-7 py-5 text-xs md:text-base font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-lg border-0 w-fit"
                >
                  <Link href="/courses">Explorar Soluções</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* MOBILE CONTENT (Alternates on mobile, hidden on desktop) */}
          <div className="lg:hidden w-full">
            <AnimatePresence mode="wait">
              {contentToggle ? (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="flex flex-col items-start w-full space-y-4"
                >
                  {/* Badge */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full text-white text-[10px] tracking-wider border border-white/10 uppercase">
                      <Star className="h-3 w-3 text-secondary fill-secondary" />
                      <span className="font-semibold">Formação Executiva em Angola</span>
                    </div>
                  </div>

                  <div className="max-w-[90%] md:max-w-[540px] text-left flex flex-col items-start justify-start">
                    <div className="overflow-hidden">
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight">
                        Da Competência à Excelência
                      </h1>
                      <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-lg font-light leading-relaxed text-pretty mt-3">
                        Oferecemos formação corporativa especializada em secretariado executivo, gestão administrativa e tecnologias digitais em Angola. Programas práticos, formadores com experiência real, para profissionais ativos no alcance dos objectivos organizacionais.
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-row flex-wrap items-center justify-start gap-2 mt-3 w-full relative z-10">
                      <Button
                        asChild
                        size="sm"
                        className="bg-white hover:bg-neutral-100 text-[#312455] rounded-xl px-7 py-5 text-[10px] md:text-sm font-bold tracking-wide transition-all duration-300 hover:scale-[1.03] shadow-md hover:shadow-lg border-0 w-fit"
                      >
                        <Link href="/courses">Explorar Soluções</Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.2, ease: "easeInOut" }}
                  className="w-full flex flex-col items-start"
                >
                  {/* Mobile Featured Card */}
                  <div className="w-full max-w-[310px] mb-4 bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
                    <FeaturedCard
                      title={activeCourse.title}
                      duration={activeCourse.duration}
                      level={activeCourse.level}
                      regime={activeCourse.regime}
                      vagasLimitadas={activeCourse.vagasLimitadas}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>

        {/* Right Column - Featured Card */}
        <div className="hidden lg:flex lg:col-span-5 lg:items-center lg:justify-start h-full lg:pt-8">
          <div className="w-full max-w-[310px] bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <FeaturedCard
              title={activeCourse.title}
              duration={activeCourse.duration}
              level={activeCourse.level}
              regime={activeCourse.regime}
              vagasLimitadas={activeCourse.vagasLimitadas}
            />
          </div>
        </div>
      </div>

      {/* Slide Pagination Dots */}
      <div className="hidden sm:flex absolute bottom-5 right-12 md:right-24 z-20 gap-2.5 items-center bg-black/35 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10 shadow-xl">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-500 ease-out ${index === currentSlide
              ? "w-7 bg-secondary shadow-[0_0_8px_rgba(138,102,168,0.7)]"
              : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  )
}
