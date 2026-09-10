'use client'

import { ScrollReveal } from '@/components/ui/scroll-reveal'

const partners = [
  { name: 'Governo de Angola', logo: '/images/logos/logo1.png' },
  { name: 'Polícia Nacional', logo: '/images/logos/logo10.png' },
  { name: 'CISP', logo: '/images/logos/logo9.png' },
  { name: 'ENDE', logo: '/images/logos/logo6.png' },
  { name: 'ENBI', logo: '/images/logos/logo8.png' },
  { name: 'Porto de Luanda', logo: '/images/logos/logo7.png' },
  { name: 'ZAP', logo: '/images/logos/logo5.png' },
  { name: 'PRODEL', logo: '/images/logos/logo2.png' },
  { name: 'ARSEG', logo: '/images/logos/logo3.png' },
  { name: 'RECREDIT', logo: '/images/logos/logo4.png' },
  { name: 'Expo Secretary', logo: '/images/logos/logo11.png' },
  { name: 'Serra Treinamentos', logo: '/images/logos/logo12.png' },
]

export function PartnersSection() {
  // Repeat the list to ensure a completely seamless scroll loop
  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners]

  return (
    <section className="py-12 md:py-16 bg-muted/20 dark:bg-card/20 border-y border-border/40 relative overflow-hidden">
      {/* Subtle light background reflection */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
        {/* Title block with scroll reveals */}
        <div className="text-center mb-10 space-y-2">
          <ScrollReveal delay={0.05} direction="up" distance={15}>
            <h2 className="text-xl md:text-2xl font-extrabold text-primary tracking-wider">
              Clientes e Parceiros
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15} direction="up" distance={15}>
            <p className="text-muted-foreground text-xs font-light">
              Empresas públicas e privadas, organismos do Estado e instituições internacionais com equipas formadas pela Prime Academy.
            </p>
          </ScrollReveal>
        </div >
      </div >

      {/* Endless Auto-scrolling Cards Marquee - OUTSIDE CONTAINER FOR 100% FULL-WIDTH horizontal bleed */}
      <ScrollReveal delay={0.35} direction="up" distance={20} className="w-full relative z-10">
        <div className="relative w-full overflow-hidden whitespace-nowrap py-2">
          <div className="inline-flex animate-partners-marquee gap-5 items-center px-4">
            {duplicatedPartners.map((partner, idx) => (
              <div
                key={`${partner.name}-${idx}`}
                className="w-36 sm:w-40 h-24 sm:h-28 bg-white dark:bg-card border border-border/60 rounded-xl flex flex-col items-center justify-center p-4 shadow-[0_4px_20px_rgb(0,0,0,0.01)] dark:shadow-none hover:shadow-[0_12px_24px_rgba(138,102,168,0.04)] hover:border-accent/30 transition-all duration-500 group shrink-0 select-none cursor-pointer"
              >
                <div className="h-8 sm:h-9 w-full flex items-center justify-center relative overflow-hidden mb-2">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-full w-auto max-w-[85%] object-contain opacity-100 transition-all duration-500 scale-100 group-hover:scale-105 ease-out"
                  />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground/75 group-hover:text-primary transition-colors text-center truncate w-full">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>

      {/* CSS Keyframes for smooth infinite scroll */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes partnersMarquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partners-marquee {
          animation: partnersMarquee 50s linear infinite;
        }
        .animate-partners-marquee:hover {
          animation-play-state: paused;
        }
      `}} />
    </section>
  )
}
