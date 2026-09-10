'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'

export function TrainersSection() {
  const trainers = [
    {
      name: "Lourença Ricardo",
      role: "Protocolo & Secretariado de Direcção",
      image: "/images/trainers/LourençaRicardo.jpeg"
    },
    {
      name: "Hosana Inglês",
      role: "Gestão de Processos & Inovação",
      image: "/images/trainers/HossanaInglês.png"
    },
    {
      name: "Cláudia Chaffer",
      role: "Liderança & Desenvolvimento Executivo",
      image: "/images/trainers/CláudiaChaffer.png"
    },
    {
      name: "Isabel Gaspar",
      role: "Sistemas & Tecnologias de Gestão",
      image: "/images/trainers/IsabelGaspar.jpeg"
    },
    {
      name: "Valéria Serra",
      role: "Gestão de Pessoas & Cultura Organizacional",
      image: "/images/trainers/ValériaSerra.png"
    },
    {
      name: "Santos Egas Moniz",
      role: "Liderança & Gestão de Recursos Humanos",
      image: "/images/trainers/SantosEgasMoniz.png"
    },
    {
      name: "Eduardo Chiloya",
      role: "Tecnologias Inovadoras & IA",
      image: "/images/trainers/EduardoChiloya.jpeg"
    },
    {
      name: "Regina Mestre",
      role: "Secretariado Executivo & Gestão",
      image: "/images/trainers/Regina Mestre.jpeg"
    },
    {
      name: "Silvestre Jorge Pascoal",
      role: "Tecnologias Inovadoras & IA",
      image: "/images/trainers/Silvestre Jorge Pascoal.jpeg"
    },
    {
      name: "Fábio Sebastião",
      role: "Comunicação & Análise Financeira",
      image: "/images/trainers/Fábio Sebastião.jpeg"
    }
  ]

  // Duplicate the list for an infinite seamless marquee effect
  const duplicateTrainers = [...trainers, ...trainers]

  return (
    <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-white relative overflow-hidden">
      {/* Decorative Brand Gradient Orbs in the background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-[400px] h-[400px] bg-[#8a66a8]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-20 w-[400px] h-[400px] bg-[#312455]/5 rounded-full blur-[100px]" />
      </div>

      {/* Title Section - Wraps in container to align perfectly with content grid */}
      <div className="container mx-auto px-4 max-w-7xl relative z-10 mb-12 md:mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="block text-xs md:text-sm font-bold tracking-widest text-[#8a66a8] uppercase mb-3">
            Núcleo de Especialistas
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#312455] tracking-tight leading-tight max-w-3xl mx-auto">
            Formadores de Excelência <span className="text-[#8a66a8]">Nacionais e Internacionais</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Todos os nossos formadores têm um percurso profissional comprovado nas áreas que ministram. Na Prime Academy, experiência real é requisito, não excepção.
          </p>
          <Link
            href="/about#formadores"
            className="inline-flex items-center gap-2 bg-[#8a66a8] hover:bg-[#735191] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl mt-6"
          >
            Ver todos os Formadores
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Infinite Carousel (Marquee scrolling Right-to-Left) - Outside container for full bleed edge-to-edge layout */}
      <div className="relative w-full overflow-hidden py-4 z-10">
        <div className="inline-flex gap-6 animate-trainersMarquee hover:[animation-play-state:paused]">
          
          {duplicateTrainers.map((trainer, idx) => (
            <div 
              key={`trainer-card-${idx}`}
              className="group relative flex-shrink-0 w-[240px] h-[340px] md:w-[280px] md:h-[390px] rounded-xl overflow-hidden bg-slate-200 border border-slate-200/60 shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all duration-500 hover:shadow-[0_20px_40px_rgba(138,102,168,0.15)] hover:scale-[1.02] cursor-pointer"
            >
              {/* Trainer Image */}
              <Image
                src={trainer.image}
                alt={trainer.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-w-720px) 240px, 280px"
              />

              {/* Elegant Dark Vignette Overlay for Text Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent opacity-85 group-hover:opacity-95 transition-opacity duration-300 z-10" />

              {/* Trainer Bio details */}
              <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-20 flex flex-col justify-end">
                <span className="inline-block w-8 h-1 bg-[#8a66a8] rounded-full mb-3 transform origin-left group-hover:w-12 transition-all duration-300" />
                <h3 className="text-base md:text-lg font-black text-white leading-tight group-hover:text-[#8a66a8] transition-colors duration-200 uppercase tracking-wide">
                  {trainer.name}
                </h3>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* Dynamic Keyframes to run the smooth Right-to-Left infinite animation loop */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes trainersMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-trainersMarquee {
          animation: trainersMarquee 58s linear infinite;
        }
      `}} />
    </section>
  )
}
