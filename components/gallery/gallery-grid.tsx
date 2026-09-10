'use client'

import { useState } from 'react'
import { SafeImage } from '@/components/ui/safe-image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { X, Eye, Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GalleryImage } from '@/lib/hygraph'

interface GalleryGridProps {
  images: GalleryImage[]
  categories: string[]
}

export function GalleryGrid({ images, categories }: GalleryGridProps) {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10 // Shows 10 compact items at a time to ensure symmetry with grid-cols-5

  // ── Ordenação robusta no cliente: destaque:true sempre no índice 0 ──────────
  // Garante posicionamento correto independentemente da ordem retornada pela API.
  const sortedImages = [...images].sort((a, b) => {
    if (a.destaque && !b.destaque) return -1
    if (!a.destaque && b.destaque) return 1
    
    // Critério de desempate: mais recente primeiro (createdAt decrescente)
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })

  // Filtered images for the catalog section (opera sobre o array já ordenado)
  const filteredImages = activeCategory === 'Todos'
    ? sortedImages
    : sortedImages.filter((img) => img.categoria === activeCategory)

  // Calculate paginated subset
  const totalPages = Math.ceil(filteredImages.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedImages = filteredImages.slice(startIndex, startIndex + itemsPerPage)

  // Generate pages range with ellipses for large page counts
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const range = 1 // numbers around currentPage

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - range && i <= currentPage + range)
      ) {
        pages.push(i)
      } else if (
        i === 2 && currentPage - range > 2
      ) {
        pages.push('ellipsis-start')
      } else if (
        i === totalPages - 1 && currentPage + range < totalPages - 1
      ) {
        pages.push('ellipsis-end')
      }
    }
    return pages.filter((value, index, self) => self.indexOf(value) === index)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const element = document.getElementById('galeria-coleccao')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    setCurrentPage(1)
  }

  // Para a secção de destaques — usa o array ordenado:
  // Card principal (1.º após ordenação = sempre o item com destaque:true)
  const mainHighlight = sortedImages[0]
  // Cards secundários (2.º ao 4.º)
  const secondaryHighlights = sortedImages.slice(1, 4)

  return (
    <div className="space-y-12 md:space-y-16">
      {/* ── SECTION 1: LATEST STORIES / DESTAQUES RECENTES ── */}
      {images.length > 0 && (
        <section className="space-y-6">
          <div>
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">Registos recentes</span>
            <h2 className="text-xl md:text-2xl font-black text-[#312455] mt-2 leading-tight">
              Últimos destaques da Prime Academy
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-lg">
              Explore os momentos marcantes que moldam o nosso ecossistema, formações intensivas, workshops práticos e celebrações de excelência profissional.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left side: Main Highlight (Large Card) */}
            {mainHighlight && (
              <div 
                className="lg:col-span-7 group relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(mainHighlight)}
              >
                <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-t-[2rem]">
                  <SafeImage
                    src={mainHighlight.imageUrl}
                    alt={mainHighlight.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 60vw"
                  />
                  <div className="absolute top-4 left-4 bg-[#8a66a8] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full shadow-md">
                    {mainHighlight.categoria}
                  </div>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />
                </div>

                <div className="p-5 sm:p-6 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-[#8a66a8]" />
                    <span>Destaque Principal</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-[#312455] leading-tight group-hover:text-[#8a66a8] transition-colors duration-300">
                    {mainHighlight.title}
                  </h3>
                  <p className="text-slate-500 text-sm font-light leading-relaxed">
                    Registo dos momentos marcantes, workshops, celebrações e eventos de excelência que traduzem a evolução prática e a trajectória de sucesso no nosso ecossistema.
                  </p>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#8a66a8] pt-2">
                    <span>Ver em tamanho cheio</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            )}

            {/* Right side: Secondary highlights stacked vertically */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-4">
              {secondaryHighlights.map((img) => (
                <div 
                  key={img.id}
                  className="group relative flex flex-col sm:flex-row items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedImage(img)}
                >
                  <div className="relative w-full sm:w-40 aspect-video sm:aspect-square overflow-hidden rounded-xl shrink-0">
                    <SafeImage
                      src={img.imageUrl}
                      alt={img.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 160px"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors duration-300" />
                  </div>

                  <div className="flex-1 space-y-2 py-1">
                    <div className="inline-block bg-[#312455]/5 text-[#312455] text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {img.categoria}
                    </div>
                    <h4 className="font-bold text-slate-800 text-sm leading-snug group-hover:text-[#8a66a8] transition-colors duration-300 line-clamp-2">
                      {img.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#8a66a8] font-semibold">
                      <span>Visualizar registo</span>
                      <Eye className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── SECTION 2: TOP DESTINATIONS / EXPLORAR COLECÇÃO COMPLETA ── */}
      <section id="galeria-coleccao" className="space-y-6 border-t border-slate-100 pt-8 md:pt-10 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[#8a66a8] font-bold text-xs uppercase tracking-widest">Coleção completa</span>
            <h2 className="text-xl md:text-2xl font-black text-[#312455] mt-2 leading-tight">
              Galeria geral de Momentos
            </h2>
          </div>

          {/* Filter Pills slider/container */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(category)}
                className={`rounded-xl px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-[#312455] text-white hover:bg-[#8a66a8]'
                    : 'border-slate-200 text-slate-600 hover:border-[#8a66a8] hover:text-[#312455] hover:bg-[#f5f0fa]'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Dynamic Compact Grelha: Smaller Cards to prevent long scrolling */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
          <AnimatePresence mode="popLayout">
            {paginatedImages.map((image) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                {/* Shorter landscape image frame */}
                <div className="relative aspect-[4/3] w-full overflow-hidden">
                  <SafeImage
                    src={image.imageUrl || '/placeholder.jpg'}
                    alt={image.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  />
                  {/* Category overlay */}
                  <div className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-sm text-[#312455] text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm z-10">
                    {image.categoria}
                  </div>
                  {/* Hover icon and dark overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#312455]/85 via-[#312455]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="bg-white text-[#312455] p-2 rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-all duration-300">
                      <Eye className="w-4 h-4 text-[#312455]" />
                    </div>
                  </div>
                </div>

                {/* Footer with metadata */}
                <div className="p-2.5 space-y-0.5 bg-white">
                  <h4 className="font-bold text-slate-800 text-xs leading-snug group-hover:text-[#8a66a8] transition-colors duration-200 line-clamp-1">
                    {image.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium">Prime Academy Angola</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredImages.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 bg-slate-50 rounded-[2rem]"
          >
            <p className="text-slate-400 font-light text-sm">
              Nenhum acontecimento registado nesta categoria de momento.
            </p>
          </motion.div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="rounded-xl border-slate-200 text-slate-600 hover:border-[#8a66a8] hover:text-[#8a66a8] disabled:opacity-40 disabled:hover:text-slate-600 disabled:hover:border-slate-200"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {getPageNumbers().map((page, index) => {
              if (typeof page === 'string') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="w-9 h-9 flex items-center justify-center text-slate-400 text-xs font-bold"
                  >
                    ...
                  </span>
                )
              }

              return (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  variant={currentPage === page ? 'default' : 'outline'}
                  className={`w-9 h-9 rounded-xl font-bold text-xs ${
                    currentPage === page
                      ? 'bg-[#312455] text-white hover:bg-[#8a66a8]'
                      : 'border-slate-200 text-slate-600 hover:border-[#8a66a8] hover:text-[#8a66a8]'
                  }`}
                >
                  {page}
                </Button>
              )
            })}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="rounded-xl border-slate-200 text-slate-600 hover:border-[#8a66a8] hover:text-[#8a66a8] disabled:opacity-40 disabled:hover:text-slate-600 disabled:hover:border-slate-200"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </section>

      {/* Lightbox Dialog (Keep zoom function working perfectly) */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-transparent border-none shadow-2xl">
          <DialogTitle className="sr-only">
            {selectedImage?.title || 'Imagem da galeria'}
          </DialogTitle>
          {selectedImage && (
            <div className="relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-full transition-colors"
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
              <div className="relative aspect-[4/3] md:aspect-[16/10]">
                <SafeImage
                  src={selectedImage.imageUrl}
                  alt={selectedImage.title}
                  fill
                  unoptimized
                  className="object-contain bg-black"
                  sizes="(max-width: 1024px) 100vw, 80vw"
                  priority
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                <div className="inline-block bg-[#8a66a8] text-white text-xs font-semibold px-2.5 py-1 rounded-md mb-2">
                  {selectedImage.categoria}
                </div>
                <p className="text-white font-bold text-lg sm:text-xl">{selectedImage.title}</p>
                <p className="text-white/60 text-xs mt-1">Registo Oficial - Prime Academy</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
