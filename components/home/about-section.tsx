import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export function AboutSection() {
  return (
    <section className="relative py-12 md:py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left - Text */}
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[11px] sm:text-xs font-bold text-[#8a66a8] uppercase tracking-[0.2em]">
              QUEM SOMOS
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#312455] leading-tight">
              Liderança, Inovação e Impacto no Desenvolvimento Corporativo
            </h2>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              Transformamos organizações e carreiras desenvolvendo programas individuais ou para equipas de qualquer dimensão, com diagnóstico de necessidades, formação in-company e relatório de impacto incluídos.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 bg-[#8a66a8] hover:bg-[#735191] text-white font-bold text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-xl group"
            >
              Conheça a nossa História
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Right - Team Images */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl overflow-hidden aspect-[3/4] shadow-lg shadow-[#8a66a8]/10">
                <Image
                  src="/images/7.jpeg"
                  alt="Prime Academy"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden aspect-[3/4] mt-6 shadow-lg shadow-[#8a66a8]/10">
                <Image
                  src="/images/5.jpeg"
                  alt="Prime Academy"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
