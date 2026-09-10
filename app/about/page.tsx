import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import {
  Award, Users, Target, Shield, CheckCircle2, TrendingUp,
  Briefcase, Heart, Cpu, Landmark, GraduationCap,
  BookOpen, BadgeCheck, Gem, Lightbulb, Building2, Globe, HeartHandshake
} from 'lucide-react'
import { CtaSection } from '@/components/home/cta-section'
import { AnimatedCard } from '@/components/ui/animated-card'

const TEAM_SECTIONS = [
  {
    department: "Direcção Geral",
    gridClass: "grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center justify-center",
    members: [
      { name: "Valéria Serra", role: "Directora Administrativa", department: "Direcção Administrativa", img: "/images/Equipe/dg3.jpeg" },
      { name: "Júlia Indira Simões", role: "Diretora Geral", department: "Direcção Geral", img: "/images/Equipe/dg1.jpeg" },
      { name: "Santos Egas Moniz", role: "Director Pedagógico", department: "Direcção Pedagógica", img: "/images/trainers/SantosEgasMoniz.png" }
    ]
  }
];

export const metadata: Metadata = {
  title: 'Sobre Nós - Prime Academy',
  description: 'Saiba mais sobre a Prime Academy. Novas Tecnologias de Gestão e Secretariado Executivo de alto nível em Angola.',
}

export default function AboutPage() {

  const differentials = [
    { icon: Award, title: 'Certificações Reconhecidas', desc: 'Diplomas e certificados com validade nacional e reconhecimento institucional.' },
    { icon: Heart, title: 'Conteúdos Para Problemas Reais', desc: 'Programas desenvolvidos com base em desafios organizacionais concretos.' },
    { icon: Cpu, title: 'Metodologia Prática', desc: '80% de prática aplicada e 20% de teoria relevante.' },
    { icon: Users, title: 'Formadores De Excelência', desc: 'Especialistas nacionais e internacionais de experiência comprovada.' },
    { icon: TrendingUp, title: 'Impacto Organizacional', desc: 'Medimos o sucesso pela transformação real nas organizações.' },
    { icon: Target, title: 'Formação Sob Medida', desc: 'Programas In Company adaptados à realidade da sua instituição.' },
  ]

  const trainers = [
    { name: 'Cláudia Chaffer', role: 'Secretariado e Eventos', bio: 'Especialista em Novas Tecnologias de Secretariado e Organização de Eventos Corporativos', avatar: '/images/trainers/CláudiaChaffer.png' },
    { name: 'Lourença Ricardo', role: 'Gestão e Administração', bio: 'Especialista em Gestão e Administração Pública', avatar: '/images/trainers/LourençaRicardo.jpeg' },
    { name: 'Isabel Gaspar', role: 'Jurista e Compliance', bio: 'Jurista (Advogada), Especialista em Compliance', avatar: '/images/trainers/IsabelGaspar.jpeg' },
    { name: 'Francisco Domingos', role: 'Comunicação', bio: 'Especialista em Técnicas de Expressão Oral e Escrita em Língua Portuguesa', avatar: '/images/trainers/FranciscoDomingos.jpeg' },
    { name: 'Hossana Inglês', role: 'Comunicação', bio: 'Especialista em Comunicação e Persuasão', avatar: '/images/trainers/HossanaInglês.png' },
    { name: 'Santos Egas Moniz', role: 'Gestão e Inovação', bio: 'Especialista em Gestão Empreendedorismo e Inovação, Comunicação Institucional.', avatar: '/images/trainers/SantosEgasMoniz.png' },
    { name: 'Valéria Serra', role: 'Secretariado', bio: 'Especialista em Secretariado para Alta Gestão', avatar: '/images/trainers/ValériaSerra.png' },
    { name: 'Eduardo Chiloya', role: 'Recursos Humanos', bio: 'Especialista em Gestão Estratégica de Recursos Humanos.', avatar: '/images/trainers/EduardoChiloya.jpeg' },
    { name: 'Jacira Pimental', role: 'Gestão de Projetos', bio: 'Especialista em Gestão de Projectos de Desenvolvimento Institucional.', avatar: '/images/trainers/JaciraPimental.jpeg' },
    { name: 'Regina Mestre', role: 'Jurista e Advogada', bio: 'Especialista nas Áreas Jurídicas e de Gestão.', avatar: '/images/trainers/Regina Mestre2.jpeg' },
    { name: 'Silvestre Jorge Pascoal', role: 'Tecnologias Inovadoras e IA', bio: 'Especialista em Transformação Digital, Automação de Processos com Inteligência Artificial e Infraestrutura de TI.', avatar: '/images/trainers/Silvestre Jorge Pascoal.jpeg' },
    { name: 'Fábio Sebastião', role: 'Comunicação e Análise Financeira', bio: 'Especialista em Estruturação de Apresentações Estratégicas, Comunicação de Alto Impacto e Análise Financeira.', avatar: '/images/trainers/Fábio Sebastião.jpeg' },
  ]

  const targetAudience = [
    'Gestores administrativos',
    'Secretários executivos e assessores de direcção',
    'Chefias intermédias',
    'Directores de Gabinetes e Departamentos',
    'Técnicos superiores da Administração Pública',
    'Quadros estratégicos de empresas públicas e privadas',
  ]

  const segments = [
    'Instituições públicas e governamentais',
    'Empresas privadas nacionais e multinacionais',
    'Bancos e seguradoras',
    'Universidades e centros de investigação',
    'ONGs e organismos internacionais',
  ]

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HERO BANNER (Top) ── */}
      <section className="relative pt-48 pb-16 lg:pt-48 lg:pb-28 overflow-hidden bg-[#312455]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80)' }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#312455]/95 via-[#312455]/85 to-[#312455]/75 lg:bg-gradient-to-r lg:from-[#312455]/95 lg:via-[#312455]/90 lg:to-[#312455]/80" />
        {/* Decorative blur elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#8a66a8]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-[#8a66a8]/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

        <div className="container mx-auto px-6 relative z-10 text-center">
          <span className="text-white/60 font-bold text-xs uppercase tracking-widest block mb-3">
            O SEU PARCEIRO ESTRATÉGICO
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight mb-4 max-w-3xl mx-auto">
            Conheça o Ecossistema Prime
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed mt-4 text-pretty">
            Desde 2018 a impulsionar o desenvolvimento e a melhoria contínua das habilidades técnicas e humanas em gestão secretarial, com soluções personalizadas em todo território nacional.
          </p>
        </div>
      </section>


      {/* ══════════════════════════════════════════════
          SECÇÃO — Linha do Tempo
      ══════════════════════════════════════════════ */}
      <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-slate-50 overflow-hidden">
        <div className="container mx-auto px-4 max-w-6xl">

          <div className="relative pb-4 md:pb-6">
            {/* Desktop: SVG straight timeline with connectors */}
            <div className="hidden md:block relative" style={{ height: '240px' }}>
              <svg 
                className="absolute inset-0 w-full h-full" 
                viewBox="0 0 1000 240" 
                preserveAspectRatio="none" 
                aria-hidden
                style={{ overflow: 'visible' }}
              >
                <defs>
                  <linearGradient id="timelineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#8a66a8" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#735191" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                
                {/* Main horizontal line at Y=35 */}
                <line x1="0" y1="35" x2="1000" y2="35" stroke="#8a66a8" strokeWidth="6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                
                {/* Connectors starting exactly from main line (Y=35) down to card top (Y=85) */}
                <line x1="60" y1="35" x2="60" y2="85" stroke="#8a66a8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" vectorEffect="non-scaling-stroke" />
                <line x1="340" y1="35" x2="340" y2="85" stroke="#8a66a8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" vectorEffect="non-scaling-stroke" />
                <line x1="630" y1="35" x2="630" y2="85" stroke="#8a66a8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" vectorEffect="non-scaling-stroke" />
                <line x1="900" y1="35" x2="900" y2="85" stroke="#8a66a8" strokeWidth="2.5" strokeLinecap="round" opacity="0.6" vectorEffect="non-scaling-stroke" />
              </svg>

              {/* Markers placed exactly centered on the horizontal line (top: 11px + half height 24px = 35px) */}
              {[
                { left: '6%', year: 'Ponto de partida', title: 'Identificação da Oportunidade', desc: 'Ausência de formação especializada em gestão secretarial' },
                { left: '34%', year: '2018', title: 'Início do Projecto', desc: 'Fundação com apoio da Universidade Agostinho Neto em Luanda' },
                { left: '63%', year: 'Marco de impacto', title: '+10.353 Profissionais Capacitados', desc: 'Estado, Forças Armadas, Governos e Ensino Superior' },
                { left: '90%', year: '2026', title: 'Lançamento do Manual', desc: 'Contextualização e publicação do Manual' },
              ].map((m, i) => (
                <div 
                  key={i} 
                  className="absolute flex flex-col items-center z-20" 
                  style={{ left: m.left, top: '11px', transform: 'translate(-50%, 0)' }}
                >
                  {/* Purple dot marker centered on main line */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg ring-4 ring-[#8a66a8]/15 border-2 border-[#8a66a8] z-20">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#8a66a8] shadow-xs" />
                  </div>

                  {/* Card positioned right where connector line ends (Y=85) */}
                  <div className="w-[220px] text-center" style={{ marginTop: '26px' }}>
                    <AnimatedCard delay={i * 0.11}>
                      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-md hover:-translate-y-1 transition-transform duration-350 hover-float">
                        <span className="text-[#8a66a8] font-extrabold text-sm">{m.year}</span>
                        <h3 className="text-sm font-bold text-[#312455] mt-1">{m.title}</h3>
                        <p className="text-xs text-slate-500 mt-2">{m.desc}</p>
                      </div>
                    </AnimatedCard>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile: vertical timeline fallback */}
            <div className="md:hidden relative px-4">
              <div className="absolute left-7 top-6 bottom-6 w-0.5 bg-[#8a66a8]/30" />
              <div className="space-y-6">
                {[
                  { year: 'Ponto de partida', title: 'Identificação da Oportunidade', desc: 'Ausência de formação especializada em gestão secretarial' },
                  { year: '2018', title: 'Início do Projecto', desc: 'Fundação com apoio da Universidade Agostinho Neto em Luanda' },
                  { year: 'Marco de impacto', title: '+10.353 Profissionais Capacitados', desc: 'Estado, Forças Armadas, Governos e Ensino Superior' },
                  { year: '2026', title: 'Actualização de Profissionais & Lançamento do Manual', desc: 'Contextualização e publicação do Manual' },
                ].map((marco, i) => (
                  <div key={i} className="relative animate-fade-up" style={{ animationDelay: `${i * 90}ms` }}>
                    <div className="absolute left-[21px] top-4 w-3.5 h-3.5 rounded-full bg-[#8a66a8] border-2 border-white shadow-md z-20" />
                    <div className="pl-12">
                      <AnimatedCard delay={i * 0.09}>
                        <div className="bg-[#fff] rounded-xl p-3.5 border border-slate-100 shadow-sm hover:-translate-y-1 transition-transform duration-350 hover-float">
                          <span className="text-[#8a66a8] font-bold text-sm">{marco.year}</span>
                          <h3 className="text-sm font-bold text-[#312455] mt-1">{marco.title}</h3>
                          <p className="text-xs text-slate-500 mt-1">{marco.desc}</p>
                        </div>
                      </AnimatedCard>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-3 relative z-30">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center bg-[#8a66a8] hover:bg-[#735191] text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              Ir para Galeria
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECÇÃO 1 — Colagem de fotos + Apresentação (Fundo Branco, conforme referência) ── */}
      <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* LEFT — Photo Collage (exactly like reference) */}
            <div className="relative h-[420px] md:h-[500px] hidden md:block">
              {/* Main large photo */}
              <div className="absolute top-0 left-0 w-[58%] h-[70%] rounded-xl overflow-hidden shadow-2xl">
                <img src="/images/4.jpeg" alt="Equipa Prime Academy" className="w-full h-full object-cover" />
              </div>
              {/* Top-right photo */}
              <div className="absolute top-0 right-0 w-[38%] h-[45%] rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <img src="/images/5.jpeg" alt="Profissionais Prime Academy" className="w-full h-full object-cover" />
              </div>
              {/* Bottom-right photo */}
              <div className="absolute bottom-0 right-0 w-[55%] h-[50%] rounded-xl overflow-hidden shadow-xl border-4 border-white">
                <img src="/images/6.jpeg" alt="Sala de formação executiva" className="w-full h-full object-cover" />
              </div>
              {/* Floating experience badges (year + professionals) */}
              <div className="absolute bottom-6 left-4 flex items-center gap-3 z-20">
                <div className="bg-[#8a66a8] text-white px-6 py-3.5 rounded-xl shadow-2xl text-center min-w-[120px] border border-white/20">
                  <p className="text-3xl font-black text-white leading-none">2018</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white/90">Início do Projecto</p>
                </div>
                <div className="bg-[#8a66a8] text-white px-6 py-3.5 rounded-xl shadow-2xl text-center min-w-[160px] border border-white/20">
                  <p className="text-3xl font-black text-white leading-none">+10.353</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider mt-1 text-white/90">Profissionais Capacitados</p>
                </div>
              </div>
              {/* Decorative dashed circle */}
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full border-2 border-dashed border-[#8a66a8]/25 z-0" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#8a66a8] rounded-full opacity-50 z-10" />
            </div>

            {/* RIGHT — Text + feature list + CTA */}
            <div className="space-y-6">
              <div>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#312455] mt-3 leading-tight">
                  A nossa História
                </h2>
              </div>

              <p className="text-slate-500 text-sm leading-relaxed">
                Somos a Prime Academy, um centro de formação corporativa avançado, resultado de um projecto iniciado em 2018, que já capacitou mais de <strong className="text-[#312455] font-black">10.353 profissionais</strong>, de norte a sul de Angola.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Atuamos no desenvolvimento de competências estratégicas, técnicas e tecnológicas, apoiando organizações e líderes na modernização dos seus modelos de gestão e na adaptação às exigências da era digital.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Trabalhamos com profissionais que lideram, decidem e influenciam, contribuindo para a construção de organizações mais eficientes, competitivas e sustentáveis.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Em 2026 lançamos o <strong className="text-[#312455] font-black">Manual de Gestão e Redacção de Documentos Oficiais e Pareceres Técnicos</strong> para complementar esta jornada e contribuir na uniformização da apresentação das correspondências oficiais das instituições públicas e privadas de Angola.
              </p>
              <p className="text-slate-500 text-sm leading-relaxed">
                Muito mais está por vir.
              </p>

              {/* Feature checkpoints */}
              <div className="grid grid-cols-2 gap-4 py-2">
                {[
                  { color: 'bg-rose-500', label: 'Formadores' },
                  { color: 'bg-[#8a66a8]', label: 'A formação online e presencial' },
                  { color: 'bg-amber-500', label: 'Acesso Vitalício' },
                  { color: 'bg-teal-500', label: 'Resultados Reais' },
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full ${feat.color} flex items-center justify-center shrink-0`}>
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{feat.label}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/gallery"
                  className="inline-flex items-center justify-center bg-[#8a66a8] hover:bg-[#735191] text-white font-bold text-sm px-8 py-3.5 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  Conheça o nosso Trabalho
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO 5 — A Nossa Identidade (Missão & Visão + Público)
      ══════════════════════════════════════════════ */}
      <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-black text-[#312455]">A Nossa Identidade</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm flex flex-col gap-5">
              <div className="w-14 h-14 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                <Target className="h-7 w-7 text-[#8a66a8]" />
              </div>
              <h3 className="text-xl font-black text-[#312455]">A Nossa Missão</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Capacitar profissionais para liderar, decidir e transformar organizações, por meio da aplicação de tecnologias, metodologias inovadoras e boas práticas internacionais, promovendo resultados sustentáveis e excelência organizacional.
              </p>
            </div>

            <div className="bg-[#312455] rounded-xl p-8 flex flex-col gap-5">
              <div className="w-14 h-14 rounded-xl bg-white/15 flex items-center justify-center">
                <Shield className="h-7 w-7 text-[#c4a9e0]" />
              </div>
              <h3 className="text-xl font-black text-white">A Nossa Visão</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Ser uma academia de referência nacional e regional na formação de quadros estratégicos em gestão administrativa moderna e secretariado executivo de alto nível, reconhecida pela excelência, inovação e impacto no desenvolvimento organizacional.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-slate-100 shadow-sm flex flex-col gap-5">
              <div className="w-14 h-14 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                <Gem className="h-7 w-7 text-[#8a66a8]" />
              </div>
              <h3 className="text-xl font-black text-[#312455]">Os Nossos Valores</h3>
              <ul className="space-y-2">
                {['Excelência', 'Rigor', 'Especialidade', 'Cooperação', 'Inovação'].map((valor) => (
                  <li key={valor} className="flex items-center gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#8a66a8] shrink-0" />
                    <span className="text-sm font-semibold text-slate-700">{valor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO PÚBLICO-ALVO
      ══════════════════════════════════════════════ */}
      <section className="pt-6 pb-8 md:pt-10 md:pb-12 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10 text-center">
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">O NOSSO PÚBLICO</span>
            <h2 className="text-3xl md:text-4xl font-black text-[#312455]">Para Quem Criamos Valor</h2>
            <p className="text-slate-500 text-sm leading-relaxed mt-4 max-w-2xl mx-auto">
              Da Administração Pública às maiores empresas privadas de Angola, a Prime Academy forma profissionais e equipas em todos os sectores onde a gestão secretarial e administrativa faz a diferença.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white border border-slate-100 rounded-xl p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-[#8a66a8]" />
                </div>
                <h3 className="text-xl font-black text-[#312455]">Perfil Dos Profissionais</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {targetAudience.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#8a66a8] mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-slate-100 rounded-xl p-8 space-y-5 shadow-sm">
                <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                  <Landmark className="h-5 w-5 text-[#8a66a8]" />
                </div>
                <h3 className="text-xl font-black text-[#312455]">Organizações E Sectores</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {segments.map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-[#8a66a8] mt-0.5 shrink-0" />
                    <span className="text-sm text-slate-600 font-medium leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      

      

      {/* ══════════════════════════════════════════════
          SECÇÃO — A Excelência Que Não Se Negocia + Equipa Interna
      ══════════════════════════════════════════════ */}
      <section className="pt-6 pb-6 md:pt-10 md:pb-10 bg-slate-50 border-t border-slate-100">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center space-y-4 mb-8 md:mb-10">
            <div>
              <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">A EXCELÊNCIA QUE NÃO SE NEGOCEIA</span>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-[#312455] mt-3 leading-tight">
                As Pessoas por detrás da Prime
              </h2>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed max-w-2xl mx-auto">
              A qualidade de uma academia mede-se pelo talento que a compõe. Contamos com profissionais de referência, desde a equipa interna aos formadores. Porque dirigimos o que conhecemos e conhecemos o que ensinamos.
            </p>
          </div>

          {/* Equipa Interna */}
          <div className="space-y-6 md:space-y-8">
            <div className="text-center mb-4 md:mb-6">
              <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">Equipa interna</span>
            
            </div>
            {TEAM_SECTIONS.map((section, idx) => (
              <div key={idx} className="w-full">
                <h3 className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest text-center mb-4">{section.department}</h3>
                <div className={section.gridClass}>
                  {section.members.map((member, mIdx) => {
                    const isFeatured = mIdx === 1

                    return (
                      <div
                        key={mIdx}
                        className={`group flex flex-col items-center w-full max-w-[260px] mx-auto bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 ${isFeatured ? 'border-purple-200/80 shadow-md md:-translate-y-8 md:scale-105 z-10 max-w-[270px]' : ''}`}
                      >
                        <div className="w-full aspect-[3/4] rounded-xl overflow-hidden bg-slate-50 relative mb-4 border border-slate-100 group-hover:border-[#8a66a8] transition-all duration-300">
                          <img
                            src={member.img}
                            alt={member.name || 'Membro da Equipa'}
                            className="object-cover object-center w-full h-full group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                          />
                        </div>
                        {member.name && (
                          <div className="text-center w-full">
                            <p className="font-bold text-slate-800 text-base md:text-lg leading-tight">{member.name}</p>
                            <p className="text-xs font-bold text-[#8a66a8] tracking-wider uppercase mt-1">
                              {member.department || section.department}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}

          </div>

          <div className="max-w-3xl mx-auto text-center text-slate-700 mt-8">
            <p className="text-sm leading-relaxed">
              A Prime Academy existe porque acreditamos que o capital humano administrativo é mais do que operacional, é estratégico.
              São estes profissionais que gerem a informação, coordenam os processos e suportam a liderança. As organizações mais competitivas investem exactamente neste recurso.
              A nossa missão é desenvolver esses profissionais e entregar às organizações equipas mais capazes, com formação especializada, contextualizada e de alto impacto.
              É este o nosso compromisso. Deixamos os números falarem por si.
            </p>
            <p className="mt-4 font-bold">- A Direcção da Prime Academy</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO 4 — Equipa e Formadores
      ══════════════════════════════════════════════ */}
      <section id="formadores" className="pt-6 pb-4 md:pt-10 md:pb-8 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-14">
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">Os Formadores</span>
          </div>

          {/* Corpo Docente */}
          <div>
            {/* Row 1: 4 trainers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">
              {trainers.slice(0, 4).map((trainer, i) => (
                <div key={i} className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-100 group-hover:border-[#8a66a8] transition-all duration-300 shadow-sm">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#312455] leading-tight">{trainer.name}</p>
                    <p className="text-xs text-[#8a66a8] font-bold mt-1 uppercase tracking-wider">{trainer.role}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{trainer.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 2: 4 trainers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-10">
              {trainers.slice(4, 8).map((trainer, i) => (
                <div key={i} className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-100 group-hover:border-[#8a66a8] transition-all duration-300 shadow-sm">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#312455] leading-tight">{trainer.name}</p>
                    <p className="text-xs text-[#8a66a8] font-bold mt-1 uppercase tracking-wider">{trainer.role}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{trainer.bio}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Row 3: remaining trainers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              {trainers.slice(8).map((trainer, i) => (
                <div key={i} className="group bg-white rounded-xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center gap-4">
                  <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-100 group-hover:border-[#8a66a8] transition-all duration-300 shadow-sm">
                    <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div>
                    <p className="font-black text-lg text-[#312455] leading-tight">{trainer.name}</p>
                    <p className="text-xs text-[#8a66a8] font-bold mt-1 uppercase tracking-wider">{trainer.role}</p>
                    <p className="text-xs text-slate-500 mt-3 leading-relaxed">{trainer.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO — Faixa Métrica de Impacto (Estilo Clean & Moderno)
      ══════════════════════════════════════════════ */}
      <section className="bg-gradient-to-b from-slate-50/60 via-white to-slate-50/60 py-6 md:py-8 border-y border-slate-100/80 relative overflow-hidden">
        {/* Glow de fundo subtil */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-64 h-64 bg-purple-100/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-64 h-64 bg-slate-100/40 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/70 shadow-[0_4px_25px_-4px_rgba(49,36,85,0.04)] p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-100 gap-y-6 md:gap-y-0">
              {[
                { icon: BookOpen, label: 'Formação Contextualizada', sub: 'Com metodologia prática' },
                { icon: Users, label: 'Formadores', sub: 'Com experiência comprovada' },
                { icon: TrendingUp, label: 'Impacto Organizacional', sub: 'E de carreira' },
                { icon: Target, label: 'Formação Sob Medida', sub: 'Para indivíduos ou equipas' },
                { icon: BadgeCheck, label: 'Certificação Reconhecida', sub: 'Validade nacional' },
              ].map((feat, i) => {
                const Icon = feat.icon
                return (
                  <div 
                    key={i} 
                    className="group flex flex-col items-center text-center px-3 pt-4 pb-2 md:py-2 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f8f3fe] via-[#f3e9fd] to-[#ede0fb] border border-[#e4d3f8] flex items-center justify-center mb-3.5 shadow-xs group-hover:shadow-md group-hover:shadow-purple-500/10 group-hover:border-[#cbb0f3] transition-all duration-300 group-hover:-translate-y-1">
                      <Icon className="w-6 h-6 text-[#6b46c1] group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <div>
                      <p className="font-bold text-[#2a1d4a] group-hover:text-[#6b46c1] text-sm leading-snug tracking-tight transition-colors duration-200">{feat.label}</p>
                      <p className="text-slate-500 text-xs mt-1 leading-relaxed max-w-[190px] mx-auto font-normal">{feat.sub}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECÇÃO — Organizações que Confiam
      ══════════════════════════════════════════════ */}
      

      {/* ── CTA FINAL ── */}
      <CtaSection
        eyebrow="ENCONTROU O PARCEIRO CERTO"
        title="Já Escolheu o Programa Ideal?"
        subtitle="Explore o nosso catálogo ou fale connosco, temos o programa certo para si ou para a sua equipa."
        cta1Label="Ver Todas As Soluções"
        cta1Href="/courses"
        cta2Label="Falar com a Prime"
        cta2Href="/contact"
      />
    </div>
  )
}
