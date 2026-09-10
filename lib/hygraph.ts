export interface Course {
  id: string
  name: string
  description: string
  category: string
  duration: string
  price: string
  image: string
  rating: number
  level: string
  online: boolean
  /** HTML gerado pelo Hygraph Rich Text (campo syllabus ou programaDoCurso) */
  syllabus?: string
  highlights?: string[]
}

export interface FeaturedBoard {
  id: string
  title: string
  duration: string
  level: string
  regime: string
  vagasLimitadas: boolean
}

export interface GalleryImage {
  id: string
  title: string
  categoria: string
  destaque: boolean
  imageUrl: string
  createdAt: string
}

export interface Testimonial {
  id: string
  name: string
  text: string
  avatarUrl: string | null
}

export interface ContactInfo {
  phone: string
  whatsappNumber: string
  email: string
  address: string
  socialLinks: {
    facebook?: string
    instagram?: string
  }
}

// Environment variables configuration
const endpoint = process.env.NEXT_PUBLIC_HYGRAPH_ENDPOINT
const token = process.env.HYGRAPH_API_TOKEN || process.env.HYGRAPH_PROD_AUTH_TOKEN

/**
 * Generic fetcher for Hygraph GraphQL API with caching and error handling
 * 
 * NOTA DE CACHE COM WEBHOOKS:
 * - Quando webhooks do Hygraph estão configurados → Deploy Hooks da Vercel
 * - A Vercel reconstrói o projeto automaticamente quando conteúdo é publicado
 * - Por isso, o tempo de revalidação pode ser AUMENTADO para melhor performance
 * - O webhook força o rebuild, não o cache time
 */
async function hygraphFetch<T>(query: string, variables?: Record<string, any>): Promise<T | null> {
  if (!endpoint) {
    return null
  }
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'gcms-stage': 'PUBLISHED', // ✅ Apenas conteúdo publicado em produção
  }
  if (token) {
    const formattedToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    headers['Authorization'] = formattedToken
  }



  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
    cache: 'no-store'
  })

  if (!response.ok) {
    const errorText = await response.text()

    throw new Error(`Hygraph API returned status ${response.status}: ${errorText}`)
  }

  const json = await response.json()

  if (json.errors) {
    if (json.data) {

    } else {
      throw new Error(`Hygraph GraphQL errors: ${JSON.stringify(json.errors)}`)
    }
  }

  return json.data
}

/**
 * Helper mapper to convert Hygraph Course schema to frontend Course interface
 */
function mapCourse(c: any): Course {
  const rawCategory = c.categoria ?? c.category ?? ''
  const category = rawCategory.toString().trim().toUpperCase() || 'GERAL'

  return {
    id: c.id,
    name: c.name,
    description: c.description || '',
    category,
    duration: c.duration || '',
    price: c.price || 'Sob consulta',
    image: c.image?.url || '/placeholder.jpg',
    rating: 4.8,
    level: c.level || 'Todos',
    online: false,
    syllabus: c.syllabus?.html || '',
    highlights: Array.isArray(c.highlights) ? c.highlights : []
  }
}

/**
 * Helper mapper to convert Hygraph Gallery Image schema to frontend GalleryImage interface
 */
function mapGalleryImage(item: any): GalleryImage {
  return {
    id: item.id,
    title: item.caption || item.title || '',
    categoria: item.category || item.categoria || 'Geral',
    destaque: Boolean(item.destaque),
    imageUrl: item.imageUrl?.url || (item.imageUrl?.handle && `https://media.graphassets.com/${item.imageUrl.handle}`) || '/placeholder.jpg',
    createdAt: item.createdAt || ''
  }
}

const contactInfoData: ContactInfo = {
  phone: '(+244) 921 394 946',
  whatsappNumber: '+244921394946',
  email: 'geral@primeacademy.ao',
  address: 'Rua 28 de Maio, Edifício 30, 6º Andar Lado Esquerdo, Maianga, Luanda, Angola',
  socialLinks: {
    facebook: 'https://facebook.com/primeacademy',
    instagram: 'https://instagram.com/primeacademy'
  }
}

const GET_CURSOS = `
  query GetCursos {
    cursos(first: 100) {
      id
      name
      description
      duration
      price
      level
      highlights
      categoria
      syllabus { html }
      image { url }
    }
  }
`

const GET_QUADRO_EM_DESTAQUE = `
  query GetQuadroEmDestaque {
    quadroEmDestaques {
      id
      nomeDoCurso
      duracao
      nivelDoCurso
      modalidadeDeAulas
      vagasLimitadas
    }
  }
`

const GET_COURSE_BY_SLUG = `
  query GetCourseById($id: ID!) {
    curso(where: { id: $id }) {
      id
      name
      description
      duration
      price
      level
      highlights
      categoria
      syllabus { html }
      image { url }
    }
  }
`

function mapFeaturedBoard(item: any): FeaturedBoard {
  return {
    id: item.id,
    title: item.nomeDoCurso || '',
    duration: item.duracao || '',
    level: item.nivelDoCurso || '',
    regime: item.modalidadeDeAulas || '',
    vagasLimitadas: Boolean(item.vagasLimitadas),
  }
}

export async function getCourses(): Promise<Course[]> {
  if (!endpoint) return []
  try {
    const data = await hygraphFetch<{ cursos: any[] }>(GET_CURSOS)
    return data?.cursos?.map(mapCourse) ?? []
  } catch (error) {

    return []
  }
}

export async function getQuadroEmDestaque(): Promise<FeaturedBoard[]> {
  if (!endpoint) return []
  try {
    const data = await hygraphFetch<{ quadroEmDestaques: any[] }>(GET_QUADRO_EM_DESTAQUE)
    return data?.quadroEmDestaques?.map(mapFeaturedBoard) ?? []
  } catch (error) {
    return []
  }
}

export async function getCourseBySlug(id: string): Promise<Course | null> {
  if (!endpoint) return null
  try {
    const data = await hygraphFetch<{ curso: any }>(GET_COURSE_BY_SLUG, { id })
    return data?.curso ? mapCourse(data.curso) : null
  } catch (error) {

    return null
  }
}

const GET_GALLERY_IMAGES = `
  query GetGalleryImages {
    galleryImages(first: 100) {
      id
      imageUrl { url handle }
      caption
      category
      destaque
      createdAt
    }
  }
`

function sortByDestaque(images: GalleryImage[]): GalleryImage[] {
  return [...images].sort((a, b) => {
    if (a.destaque && !b.destaque) return -1
    if (!a.destaque && b.destaque) return 1
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
    return dateB - dateA
  })
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (!endpoint) return []
  try {
    const data = await hygraphFetch<{ galleryImages: any[] }>(GET_GALLERY_IMAGES)
    return data?.galleryImages?.length ? sortByDestaque(data.galleryImages.map(mapGalleryImage)) : []
  } catch (error) {

    return []
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  return []
}

export async function getContactInfo(): Promise<ContactInfo> {
  return contactInfoData
}
