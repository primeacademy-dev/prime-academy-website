'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, MessageCircle, Phone, Mail, MapPin, ChevronUp } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Footer() {
  const pathname = usePathname()

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
    return null
  }

  const navLinksCol1 = [
    { href: '/', label: 'Início' },
    { href: '/courses', label: 'Cursos' },
    { href: '/enroll', label: 'Inscrição' },
  ]
  
  const navLinksCol2 = [
    { href: '/about', label: 'Sobre Nós' },
    { href: '/gallery', label: 'Galeria' },
    { href: '/contact', label: 'Contacto' },
  ]
  
  const contactDetails = [
    { icon: Phone, text: '(+244) 921 394 946', href: 'tel:+244921394946' },
    { icon: Mail, text: 'geral@primeacademy.ao', href: 'mailto:geral@primeacademy.ao' },
  ]

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <footer className="relative bg-primary text-primary-foreground border-t border-primary-foreground/10 py-8 md:py-12 overflow-hidden">
      {/* Background Image Layer - Preserves the royal purple brand color while introducing a stunning abstract tech texture */}
      <div 
        className="absolute inset-0 z-0 opacity-10 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Decorative Glow Effects inspired by the reference footer's bokeh and dark ambient lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Pinkish/Purple glow on the bottom-left corner to recreate the bokeh circles */}
        <div className="absolute -left-20 bottom-0 w-[450px] h-[450px] bg-[#8a66a8]/25 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Unified Grid: Logo + Desc | Menu | Contacts | Socials */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 items-start mb-8">
          
          {/* Column 1: Logo and Brand Description */}
          <div className="relative h-28 md:h-0">
            <Link href="/" className="inline-block group absolute top-0 left-0">
              <Image 
                src="/logo.svg" 
                alt="Prime Academy Logo" 
                width={200} 
                height={54} 
                className="h-55 md:h-55 w-auto -translate-y-20 invert brightness-0" 
              />
            </Link>
          </div>

          {/* Column 2: Navigation - Split into 2 visual columns */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Navegação Rápida
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <ul className="space-y-2 text-xs text-primary-foreground/80">
                {navLinksCol1.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors duration-200 font-light flex items-center gap-1 group">
                      <span className="w-1 h-1 rounded-full bg-[#8a66a8]/40 group-hover:bg-white transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="space-y-2 text-xs text-primary-foreground/80">
                {navLinksCol2.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-white transition-colors duration-200 font-light flex items-center gap-1 group">
                      <span className="w-1 h-1 rounded-full bg-[#8a66a8]/40 group-hover:bg-white transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Column 3: Contacts */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Contactos
            </h3>
            <ul className="space-y-2 text-xs text-primary-foreground/80 font-light">
              {contactDetails.map((item, idx) => {
                const Icon = item.icon
                return (
                  <li key={idx} className="flex items-start gap-2">
                    <Icon className="h-4 w-4 text-[#8a66a8] mt-0.5 flex-shrink-0" />
                    <a href={item.href} className="hover:text-white transition-colors">{item.text}</a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Column 4: Socials */}
          <div className="space-y-2">
            <h3 className="font-bold text-xs tracking-widest text-white uppercase border-l-2 border-[#8a66a8] pl-2.5">
              Redes Sociais
            </h3>
            <div className="flex gap-3">
              <a 
                href="https://www.facebook.com/profile.php?id=61590607380114" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#8a66a8] text-white p-2 rounded-lg transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a 
                href="https://www.instagram.com/prime_academy_26?utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#E4405F] text-white p-2 rounded-lg transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://wa.me/244921394946" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-[#25D366] text-white p-2 rounded-lg transition-all duration-300"
                aria-label="WhatsApp"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M12.04 2.5A9.53 9.53 0 0 0 2.5 12.04c0 1.67.44 3.3 1.28 4.73L2.5 21.5l4.82-1.26A9.53 9.53 0 1 0 12.04 2.5Zm0 17.3a7.78 7.78 0 0 1-3.95-1.09l-.28-.17-2.86.75.77-2.79-.18-.29a7.78 7.78 0 1 1 6.5 3.59Zm4.39-5.83c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.13 3.55.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-primary-foreground/10 flex flex-col items-center gap-4 text-xs text-primary-foreground/60">
          <p>© {new Date().getFullYear()} Prime Academy. Todos os direitos reservados. By RC MEDIA</p>
          
          {/* Scroll to Top Arrow Button */}
          <button 
            onClick={scrollToTop}
            className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-primary-foreground/65 hover:text-white hover:border-white/40 bg-transparent transition-all duration-300"
            aria-label="Voltar ao Topo"
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>

      </div>
    </footer>
  )
}
