import type { Metadata } from 'next'
import { getContactInfo } from '@/lib/hygraph'
import { ContactForm } from '@/components/contact/contact-form'
import { HowToReachUs } from '@/components/contact/how-to-reach-us'
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto - Prime Academy',
  description: 'Entre em contacto com a Prime Academy. Estamos disponíveis para esclarecer todas as suas dúvidas sobre os nossos cursos e serviços.',
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="relative pt-48 pb-16 lg:pt-48 lg:pb-28 overflow-hidden bg-[#312455]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-primary/90 via-primary/85 to-[#1d1533]/95" />
        {/* Decorative Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent" />
        {/* Floating Elements */}
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-accent rounded-full animate-pulse" />
        <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-accent/50 rounded-full animate-pulse delay-300" />
        <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-white/30 rounded-full animate-pulse delay-500" />

        <div className="container mx-auto px-6 text-center relative z-10">
          <span className="text-white/60 font-bold text-xs uppercase tracking-widest block mb-3">
            Fale Connosco
          </span>
          <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold tracking-tight text-primary-foreground leading-tight mb-3 max-w-3xl mx-auto">
            A Nossa Equipa À Sua Disposição
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base mt-3 text-pretty">
            Seja para formação individual, programas corporativos sob medida ou parcerias institucionais, estamos prontos para ajudar a alcançar os seus objectivos.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-8 md:py-12 bg-white">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

            {/* LEFT COLUMN: CONTACT DETAILS */}
            <div className="h-full flex flex-col justify-center space-y-3">
              <div className="text-left">
                <h2 className="text-[#312455] font-black text-2xl sm:text-3xl mb-1">Contactos</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
                  Contacte-nos pelo seu canal de preferência: Formulário, WhatsApp Ou Email.
                </p>
              </div>
              {/* Grid of 4 Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3 pt-0">
                {/* 1. Location */}
                <div className="flex gap-3 items-center bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-0\">
                  <div className="bg-[#312455]/5 text-[#312455] p-2.5 rounded-xl h-fit">
                    <MapPin className="h-5 w-5 text-[#312455]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#312455] text-sm sm:text-base">Localização</h4>
                    <p className="text-slate-500 text-xs font-light leading-relaxed">{contactInfo.address}</p>
                  </div>
                </div>

                {/* 2. Phone */}
                <div className="flex gap-3 items-center bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-0">
                  <div className="bg-[#312455]/5 text-[#312455] p-2.5 rounded-xl h-fit">
                    <Phone className="h-5 w-5 text-[#312455]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#312455] text-sm sm:text-base">Telefone</h4>
                    <a href={`tel:${contactInfo.phone}`} className="block text-slate-500 text-xs hover:text-[#8a66a8] transition-colors">{contactInfo.phone}</a>
                  </div>
                </div>

                {/* 3. Email */}
                <div className="flex gap-3 items-start bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-0">
                  <div className="bg-[#312455]/5 text-[#312455] p-2.5 rounded-xl h-fit mt-1">
                    <Mail className="h-5 w-5 text-[#312455]" />
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-[#312455] text-sm sm:text-base">Email</h4>
                    <a href="mailto:geral@primeacademy.ao" className="block text-slate-500 text-xs hover:text-[#8a66a8] transition-colors break-all">geral@primeacademy.ao</a>
                  </div>
                </div>

                {/* 4. Social networks */}
                <div className="flex gap-3 items-center bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-slate-100 sm:border-0">
                  <div className="bg-[#312455]/5 text-[#312455] p-2.5 rounded-xl h-fit">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                      <path d="M12.04 2.5A9.53 9.53 0 0 0 2.5 12.04c0 1.67.44 3.3 1.28 4.73L2.5 21.5l4.82-1.26A9.53 9.53 0 1 0 12.04 2.5Zm0 17.3a7.78 7.78 0 0 1-3.95-1.09l-.28-.17-2.86.75.77-2.79-.18-.29a7.78 7.78 0 1 1 6.5 3.59Zm4.39-5.83c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.13 3.55.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-[#312455] text-sm sm:text-base">Redes Sociais</h4>
                    <div className="flex gap-2">
                      {contactInfo.socialLinks.facebook && (
                        <a
                          href={contactInfo.socialLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white sm:bg-slate-50 hover:bg-[#312455] text-slate-700 hover:text-white p-2 rounded-xl transition-all duration-300 border border-slate-100 shadow-sm"
                          aria-label="Facebook"
                        >
                          <Facebook className="h-4 w-4" />
                        </a>
                      )}
                      <a
                        href="https://www.instagram.com/prime_academy_26?utm_source=qr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white sm:bg-slate-50 hover:bg-[#E4405F] text-slate-700 hover:text-white p-2 rounded-xl transition-all duration-300 border border-slate-100 shadow-sm"
                        aria-label="Instagram"
                      >
                        <Instagram className="h-4 w-4" />
                      </a>
                      <a
                        href={`https://wa.me/${contactInfo.whatsappNumber.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white sm:bg-slate-50 hover:bg-[#25D366] text-slate-700 hover:text-white p-2 rounded-xl transition-all duration-300 border border-slate-100 shadow-sm"
                        aria-label="WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                          <path d="M12.04 2.5A9.53 9.53 0 0 0 2.5 12.04c0 1.67.44 3.3 1.28 4.73L2.5 21.5l4.82-1.26A9.53 9.53 0 1 0 12.04 2.5Zm0 17.3a7.78 7.78 0 0 1-3.95-1.09l-.28-.17-2.86.75.77-2.79-.18-.29a7.78 7.78 0 1 1 6.5 3.59Zm4.39-5.83c-.24-.12-1.42-.7-1.64-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.2-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.01-.37.1-.48.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.19-.47-.39-.4-.54-.4h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.7 2.6 4.13 3.55.58.24 1.03.38 1.38.49.58.18 1.11.16 1.53.1.47-.07 1.42-.58 1.62-1.14.2-.56.2-1.04.14-1.14-.06-.1-.22-.16-.46-.28Z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CARD & FORM */}
            <div className="h-full">
              <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-7 shadow-lg h-full flex flex-col">
                <h3 className="text-xl font-bold text-[#312455] mb-4 sm:mb-6">
                  Envie-nos o seu Pedido
                </h3>
                <div className="flex-1">
                  <ContactForm />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW TO REACH US — Route Planner + Satellite Map */}
      <HowToReachUs />
    </div>
  )
}
