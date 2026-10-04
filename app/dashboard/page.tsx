'use client'

import { useEffect, useState, Fragment, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { SafeImage } from '@/components/ui/safe-image'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { 
  BookOpen, Clock, Award, ArrowRight, Play, User, LogOut, 
  Download, Upload, Plus, CheckCircle2, Globe, Users, FileText, 
  ChevronRight, ShieldCheck, Menu, X, Bell, Calendar, Search, 
  BookOpenCheck, LayoutDashboard, Settings, Compass, Eye, EyeOff,
  Lock, UserCircle, Mail, Tag, Star, Loader2, Video, Trash2, CheckCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/contexts/auth-context'
import { useNotifications } from '@/contexts/notifications-context'
import { useScrollDirection } from '@/hooks/use-scroll-direction'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import type { Course } from '@/lib/hygraph'
import { supabase } from '@/lib/supabase'
import { VirtualRoomsTab } from '@/components/dashboard/virtual-rooms-tab'
import { useCourses } from '@/hooks/use-courses'
import { useActivePrograms } from '@/hooks/use-active-programs'
import { useStudents } from '@/hooks/use-students'
import { usePdfMaterials } from '@/hooks/use-pdf-materials'
import { useQueryClient } from '@tanstack/react-query'



function isAttendingCatalogCourse(
  course: Course,
  activePrograms: ActiveProgram[],
  enrolledIds: string[]
): { attending: boolean; label: 'A Frequentar' | 'Em Formação' } {
  const activeMatch = activePrograms.find(
    p => p.catalogId === course.id || p.name === course.name
  )
  if (activeMatch) {
    return {
      attending: true,
      label: activeMatch.progress > 0 ? 'Em Formação' : 'A Frequentar',
    }
  }
  if (enrolledIds.includes(course.id)) {
    return { attending: true, label: 'A Frequentar' }
  }
  return { attending: false, label: 'A Frequentar' }
}

function getCategoryLabel(category: string): string {
  switch (category) {
    case 'GESTAOADMINISTRATIVADIGITAL':
      return 'Gestão Administrativa Digital'
    case 'LIDERANCAECOMUNICACAO':
      return 'Liderança e Comunicação'
    case 'SECRETARIADOESTRATEGICO':
      return 'Secretariado Estratégico'
    case 'TECNOLOGIASINOVADORAS':
      return 'Tecnologias Inovadoras'
    default:
      return category
  }
}



interface PDFMaterial {
  id: string
  title: string
  courseId: string
  courseName: string
  description: string
  fileName: string
  uploadedAt: string
  fileUrl?: string
}

interface ActiveProgram {
  id: string
  name: string
  description: string
  image: string
  progress: number
  totalLessons: number
  completedLessons: number
  category: string
  online: boolean
  /** Hygraph catalog id when this program exists in the public course list */
  catalogId?: string
}

function CourseSkeleton() {
  return (
    <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-white flex flex-col">
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <div
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
          style={{ animation: 'shimmer 1.5s infinite' }}
        />
      </div>
      <div className="p-5 space-y-3">
        <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite' }}
          />
        </div>
        <div className="relative h-3 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite 0.15s' }}
          />
        </div>
        <div className="relative h-3 w-5/6 rounded-full bg-slate-100 overflow-hidden">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite 0.3s' }}
          />
        </div>
        <div className="flex gap-3 pt-1">
          <div className="relative h-3 w-14 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
              style={{ animation: 'shimmer 1.5s infinite' }}
            />
          </div>
          <div className="relative h-3 w-10 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
              style={{ animation: 'shimmer 1.5s infinite 0.1s' }}
            />
          </div>
        </div>
        <div className="relative h-10 rounded-2xl bg-slate-100 overflow-hidden mt-2">
          <div
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent"
            style={{ animation: 'shimmer 1.5s infinite 0.2s' }}
          />
        </div>
      </div>
    </div>
  )
}

const DASHBOARD_TABS = ['courses', 'online-classes', 'pdfs', 'students', 'explore', 'settings'] as const
type DashboardTab = (typeof DASHBOARD_TABS)[number]

function isDashboardTab(value: string | null): value is DashboardTab {
  return value !== null && (DASHBOARD_TABS as readonly string[]).includes(value)
}

function DashboardPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isLoading, logout } = useAuth()
  const isInstructor = user?.role === 'admin'
  
  const [activeTab, setActiveTab] = useState<DashboardTab>('courses')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [currentDate, setCurrentDate] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [markingId, setMarkingId] = useState<string | null>(null)
  const [markingAll, setMarkingAll] = useState(false)
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications()
  
  // User profile extensions state
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')

  // Online Classes state
  const [onlineClassesActiveTab, setOnlineClassesActiveTab] = useState<'live' | 'presencial'>('live')
  const [showScheduleForm, setShowScheduleForm] = useState(false)

  // Student visual hidden PDFs
  const [hiddenPdfIds, setHiddenPdfIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('prime_academy_hidden_pdfs')
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  // PDF confirm modal state
  const [pdfConfirmModal, setPdfConfirmModal] = useState<{
    open: boolean
    action: 'delete' | 'hide'
    pdfId: string
    pdfTitle: string
    fileUrl?: string
  }>({ open: false, action: 'hide', pdfId: '', pdfTitle: '' })
  const [isPdfActionLoading, setIsPdfActionLoading] = useState(false)

  const handleHidePdf = (id: string, title: string) => {
    setPdfConfirmModal({ open: true, action: 'hide', pdfId: id, pdfTitle: title })
  }

  const handleNotificationClick = async (notif: any) => {
    if (markingId || markingAll) return
    setMarkingId(notif.id)
    await markRead(notif.id)
    setMarkingId(null)
    setShowNotifications(false)

    // Smart routing based on notification type
    const tipo = notif.tipo as string
    if (tipo === 'material') {
      handleTabChange('pdfs')
    } else if (tipo === 'aula' || tipo === 'transmissao') {
      handleTabChange('online-classes')
    } else if (tipo === 'nova_inscricao' || tipo === 'promovido_admin') {
      // Admin notifications → painel admin
      router.push('/admin')
    } else if (
      tipo === 'inscricao_aceite' ||
      tipo === 'inscricao_recebida' ||
      tipo === 'inscricao_em_analise' ||
      tipo === 'inscricao_processada' ||
      tipo === 'inscricao_pendente_pagamento'
    ) {
      // Enrollment status notifications → Meus Cursos
      handleTabChange('courses')
    } else if (tipo === 'inscricao_rejeitada') {
      // Rejected → suggest exploring other courses
      handleTabChange('explore')
    } else if (tipo === 'cargo_revogado') {
      // Role revoked → dashboard principal
      handleTabChange('courses')
    }
  }

  const handleMarkAllRead = async () => {
    if (markingAll || markingId !== null) return
    setMarkingAll(true)
    await markAllRead()
    toast.success('Todas as notificações foram marcadas como lidas!')
    setMarkingAll(false)
  }

  // Loading states
  const [isTabChanging, setIsTabChanging] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false)

  // Load avatar and overridden display name on user load
  useEffect(() => {
    if (user) {
      const savedAvatar = localStorage.getItem(`prime_academy_avatar_${user.email}`)
      if (savedAvatar) {
        setAvatarUrl(savedAvatar)
      }
      const savedName = localStorage.getItem(`prime_academy_username_${user.email}`)
      setDisplayName(savedName || user.name)
      setSettingsName(savedName || user.name) // Initialize settingsName in form
    }
  }, [user])

  const handleTabChange = (tabId: DashboardTab) => {
    if (tabId === activeTab) return
    setIsTabChanging(true)
    const href = tabId === 'courses' ? '/dashboard' : `/dashboard?tab=${tabId}`
    router.replace(href, { scroll: false })
    setTimeout(() => {
      setActiveTab(tabId)
      setShowExploreHeader(true)
      setIsTabChanging(false)
    }, 450)
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 2MB.')
        return
      }
      setIsUploadingAvatar(true)
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setTimeout(() => {
          setAvatarUrl(base64)
          if (user?.email) {
            localStorage.setItem(`prime_academy_avatar_${user.email}`, base64)
            toast.success('Foto de perfil atualizada!')
          }
          setIsUploadingAvatar(false)
        }, 900)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setIsRemovingAvatar(true)
    setTimeout(() => {
      setAvatarUrl(null)
      if (user?.email) {
        localStorage.removeItem(`prime_academy_avatar_${user.email}`)
        toast.success('Foto de perfil removida.')
      }
      setIsRemovingAvatar(false)
    }, 700)
  }
  
  // React Query: cursos do catálogo (shared cache entre explore, active programs e PDFs)
  const { data: exploreCourses = [] } = useCourses()

  // React Query: programas ativos do utilizador
  const { data: activeCourses = [] } = useActivePrograms(user?.id, user?.role)

  // React Query: lista de formandos (apenas admin)
  const { data: students = [], isLoading: isLoadingStudents } = useStudents(isInstructor)

  // React Query: materiais PDF
  const { data: pdfMaterials = [] } = usePdfMaterials()
  const queryClient = useQueryClient()
  const setPdfMaterials = (updater: typeof pdfMaterials | ((previous: typeof pdfMaterials) => typeof pdfMaterials)) => {
    queryClient.setQueryData<typeof pdfMaterials>(['pdf-materials'], (previous = []) =>
      typeof updater === 'function' ? updater(previous) : updater
    )
  }

  // Form state for PDF upload
  const [newPdfTitle, setNewPdfTitle] = useState('')
  const [newPdfDesc, setNewPdfDesc] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('1')
  const [newPdfFileName, setNewPdfFileName] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploadingPdf, setIsUploadingPdf] = useState(false)

  // Explore tab state
  const [isSearching, setIsSearching] = useState(false)
  const [isFiltering, setIsFiltering] = useState(false)
  const [loadingCategory, setLoadingCategory] = useState<string | null>(null)
  const [searchTimer, setSearchTimer] = useState<NodeJS.Timeout | null>(null)
  const [exploreSearch, setExploreSearch] = useState('')
  const [exploreCategory, setExploreCategory] = useState('Todos')
  const [showExploreHeader, setShowExploreHeader] = useState(true)
  const [isHeaderUserClosed, setIsHeaderUserClosed] = useState(false)
  const isHeaderVisible = useScrollDirection()

  useEffect(() => {
    setIsHeaderUserClosed(false)
  }, [activeTab])

  useEffect(() => {
    if (isHeaderVisible) {
      if (!isHeaderUserClosed) {
        setShowExploreHeader(true)
      }
    } else {
      setShowExploreHeader(false)
      setIsHeaderUserClosed(false)
    }
  }, [isHeaderVisible, isHeaderUserClosed])

  // Inicializar selectedCourseId com o primeiro curso disponível
  useEffect(() => {
    if (exploreCourses && exploreCourses.length > 0) {
      setSelectedCourseId(exploreCourses[0].id)
    }
  }, [exploreCourses])

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])

  // Load enrolled courses from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('prime_academy_enrolled_courses')
    if (saved) {
      try {
        setEnrolledCourses(JSON.parse(saved))
      } catch (err) {
        // Error loading enrolled courses
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      if (searchTimer) clearTimeout(searchTimer)
    }
  }, [searchTimer])

  // Settings tab state
  const [settingsName, setSettingsName] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrentPw, setShowCurrentPw] = useState(false)
  const [showNewPw, setShowNewPw] = useState(false)

  // Prefill settings name from user
  useEffect(() => {
    if (displayName) setSettingsName(displayName)
    else if (user?.name) setSettingsName(user.name)
  }, [user, displayName])

  // Sync active tab from URL searchParams
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (isDashboardTab(tab)) {
      setActiveTab(tab)
    } else if (!isInstructor && user && !searchParams.has('tab')) {
      setActiveTab('explore')
    }
  }, [searchParams, user, isInstructor])

  // Load date in Portuguese
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
    const today = new Date().toLocaleDateString('pt-AO', options)
    setCurrentDate(today.charAt(0).toUpperCase() + today.slice(1))
  }, [])

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312455]"></div>
          <p className="text-sm font-semibold text-slate-500 animate-pulse">A carregar o seu painel...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = () => {
    setIsLoggingOut(true)
    setTimeout(() => {
      logout()
      router.push('/')
    }, 900)
  }

  // Handle PDF file upload with real Supabase Storage & Database integration
  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPdfTitle || !newPdfDesc || !newPdfFileName) {
      toast.error('Preencha todos os campos do material!')
      return
    }

    setIsUploadingPdf(true)
    const targetCourseObj = exploreCourses.find(c => c.id === selectedCourseId)
    const targetCourseName = targetCourseObj?.name || 'Curso Geral'

    const localId = crypto.randomUUID()
    const fileNameSafe = newPdfFileName.endsWith('.pdf') ? newPdfFileName : `${newPdfFileName}.pdf`
    
    // Default file url if storage fails
    let publicUrl = ''

    // 1. Upload to Supabase Storage if file is selected
    if (selectedFile) {
      try {
        const fileExt = selectedFile.name.split('.').pop()
        const storageFileName = `${crypto.randomUUID()}.${fileExt}`

        const { data: storageData, error: uploadError } = await supabase.storage
          .from('materiais')
          .upload(storageFileName, selectedFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          // Storage upload failed, fallback to local URL
        } else if (storageData) {
          const { data: urlData } = supabase.storage
            .from('materiais')
            .getPublicUrl(storageFileName)
          
          if (urlData) {
            publicUrl = urlData.publicUrl
          }
        }
      } catch (uploadException) {
        // Exception during file upload
      }
    }

    // 2. Insert into Supabase table public.materiais_pdf
    try {
      const { data: insertedData, error: insertError } = await supabase
        .from('materiais_pdf')
        .insert([{
          titulo: newPdfTitle,
          descricao: newPdfDesc,
          nome_arquivo: fileNameSafe,
          url_arquivo: publicUrl,
          curso_id: selectedCourseId
        }])
        .select()

      if (insertError) {
        // Table public.materiais_pdf INSERT failed, using local storage fallback
      } else if (insertedData && insertedData.length > 0) {
        // successfully saved to database
        const row = insertedData[0]
        const newMaterial: PDFMaterial = {
          id: row.id,
          title: row.titulo,
          courseId: row.curso_id,
          courseName: targetCourseName,
          description: row.descricao,
          fileName: row.nome_arquivo,
          uploadedAt: row.created_at ? new Date(row.created_at).toLocaleDateString('pt-AO') : new Date().toLocaleDateString('pt-AO'),
          fileUrl: row.url_arquivo
        }

        const updatedList = [newMaterial, ...pdfMaterials]
        setPdfMaterials(updatedList)
        localStorage.setItem('prime_academy_pdfs', JSON.stringify(updatedList))
        toast.success('Material PDF publicado e guardado na base de dados!')

        // Trigger notification broadcast for all active students enrolled in this course (KISS & tolerant)
        try {
          const { data: enrolledStudents, error: enrollError } = await supabase
            .from('matriculas')
            .select('perfil_id')
            .eq('curso_id_catalogo', selectedCourseId)

          if (!enrollError && enrolledStudents && enrolledStudents.length > 0) {
            const notifs = enrolledStudents.map(student => ({
              perfil_id: student.perfil_id,
              tipo: 'material',
              titulo: 'Novo Material Disponível',
              descricao: `O material "${newPdfTitle}" está disponível para download na sua Biblioteca PDF.`,
              lida: false
            }))

            await supabase
              .from('notificacoes')
              .insert(notifs)
          }
        } catch (notifErr) {
          // Notification broadcast failed
        }
        
        // Reset states
        setNewPdfTitle('')
        setNewPdfDesc('')
        setNewPdfFileName('')
        setSelectedFile(null)
        setIsUploadingPdf(false)
        return
      }
    } catch (insertException) {
      // Exception during INSERT, keeping local fallback
    }

    // Fallback block if table INSERT was not completed
    const newMaterial: PDFMaterial = {
      id: localId,
      title: newPdfTitle,
      courseId: selectedCourseId,
      courseName: targetCourseName,
      description: newPdfDesc,
      fileName: fileNameSafe,
      uploadedAt: new Date().toLocaleDateString('pt-AO'),
      fileUrl: publicUrl || undefined
    }

    const updatedList = [newMaterial, ...pdfMaterials]
    setPdfMaterials(updatedList)
    localStorage.setItem('prime_academy_pdfs', JSON.stringify(updatedList))
    toast.success('Material PDF publicado com sucesso (salvo localmente)!')
    
    // Reset states
    setNewPdfTitle('')
    setNewPdfDesc('')
    setNewPdfFileName('')
    setSelectedFile(null)
    setIsUploadingPdf(false)
  }

  // Handle PDF deletion from storage and database
  const handleDeletePdf = async (id: string, fileUrl?: string, title?: string) => {
    setPdfConfirmModal({ open: true, action: 'delete', pdfId: id, pdfTitle: title || 'este PDF', fileUrl })
  }

  const executePdfAction = async () => {
    const { action, pdfId, pdfTitle, fileUrl } = pdfConfirmModal
    setIsPdfActionLoading(true)

    if (action === 'hide') {
      const updated = [...hiddenPdfIds, pdfId]
      setHiddenPdfIds(updated)
      localStorage.setItem('prime_academy_hidden_pdfs', JSON.stringify(updated))
      toast.success('Material pedagógico removido da sua vista.')
    } else {
      // delete action
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pdfId)

      if (isUUID) {
        if (fileUrl) {
          try {
            const urlParts = fileUrl.split('/')
            const storageFileName = urlParts[urlParts.length - 1]
            const { error: storageError } = await supabase.storage
              .from('materiais')
              .remove([storageFileName])
            if (storageError) {

            }
          } catch (storageException) {

          }
        }
        try {
          const { error: dbError } = await supabase
            .from('materiais_pdf')
            .delete()
            .eq('id', pdfId)
          if (dbError) {

          }
        } catch (dbException) {

        }
      }

      setPdfMaterials(prev => prev.filter(pdf => pdf.id !== pdfId))
      try {
        const saved = localStorage.getItem('prime_academy_pdfs')
        if (saved) {
          localStorage.setItem(
            'prime_academy_pdfs',
            JSON.stringify(JSON.parse(saved).filter((pdf: { id: string }) => pdf.id !== pdfId))
          )
        }
      } catch (e) {

      }
      toast.success(`"${pdfTitle}" eliminado com sucesso!`)
    }

    setIsPdfActionLoading(false)
    setPdfConfirmModal({ open: false, action: 'hide', pdfId: '', pdfTitle: '' })
  }

  // Handle save settings — always works (localStorage-first), Supabase in background
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('As senhas não coincidem. Verifique e tente novamente.')
      return
    }
    if (newPassword && newPassword.length < 6) {
      toast.error('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }

    setIsSavingSettings(true)

    setTimeout(() => {
      // 1. Save to localStorage
      if (settingsName && settingsName.trim()) {
        localStorage.setItem(`prime_academy_username_${user.email}`, settingsName.trim())
        setDisplayName(settingsName.trim())
      }
      if (newPassword) {
        localStorage.setItem(`prime_academy_password_${user.email}`, newPassword)
      }

      // 2. Show success toast and reset form
      toast.success('Definições guardadas com sucesso!')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setIsSavingSettings(false)
      
      // 3. Sync to Supabase in background
      const syncToSupabase = async () => {
        try {
          const { supabase } = await import('@/lib/supabase')
          const { data: sessionData } = await supabase.auth.getSession()
          const session = sessionData?.session
          if (!session) return

          if (settingsName && settingsName.trim() && settingsName.trim() !== user.name) {
            await supabase.from('perfis').update({ nome: settingsName.trim() }).eq('id', session.user.id)
            await supabase.auth.updateUser({ data: { name: settingsName.trim() } })
          }

          if (newPassword) {
            await supabase.auth.updateUser({ password: newPassword })
          }
        } catch {
          // Silent background sync failure
        }
      }
      syncToSupabase()
    }, 850)
  }

  // Dynamic categories from loaded courses
  const exploreCategories = ['Todos', ...Array.from(new Set(exploreCourses.map(c => c.category)))]

  // Handle search — spinner nos resultados (debounce 400ms)
  const handleExploreSearchChange = (value: string) => {
    setExploreSearch(value)
    if (searchTimer) clearTimeout(searchTimer)
    if (!value.trim()) {
      setIsSearching(false)
      return
    }
    setIsSearching(true)
    const timer = setTimeout(() => setIsSearching(false), 400)
    setSearchTimer(timer)
  }

  // Handle category filter with brief loading shimmer
  const handleExploreCategoryChange = (cat: string) => {
    if (cat === exploreCategory) return
    setLoadingCategory(cat)
    setIsFiltering(true)
    setTimeout(() => {
      setExploreCategory(cat)
      setIsFiltering(false)
      setLoadingCategory(null)
    }, 500)
  }

  // Filtered explore courses
  const filteredExploreCourses = exploreCourses.filter(c => {
    const matchesCategory = exploreCategory === 'Todos' || c.category === exploreCategory
    const matchesSearch = c.name.toLowerCase().includes(exploreSearch.toLowerCase()) ||
                          c.description.toLowerCase().includes(exploreSearch.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const sidebarLinks = isInstructor
    ? [
        {
          id: 'courses' as const,
          label: 'Minhas Turmas',
          icon: BookOpen,
        },
        {
          id: 'online-classes' as const,
          label: 'Aulas',
          icon: Video,
        },
        {
          id: 'pdfs' as const,
          label: 'Gerir PDFs',
          icon: FileText,
        },
        {
          id: 'students' as const,
          label: 'Lista de Formandos',
          icon: Users,
        },
        {
          id: 'explore' as const,
          label: 'Explorar Cursos',
          icon: Compass,
        },
        {
          id: 'settings' as const,
          label: 'Definições',
          icon: Settings,
        },
      ]
    : [
        {
          id: 'explore' as const,
          label: 'Explorar Cursos',
          icon: Compass,
        },
        {
          id: 'courses' as const,
          label: 'Meus Cursos',
          icon: BookOpen,
        },
        {
          id: 'online-classes' as const,
          label: 'Aulas',
          icon: Video,
        },
        {
          id: 'pdfs' as const,
          label: 'Biblioteca PDF',
          icon: FileText,
        },
        {
          id: 'settings' as const,
          label: 'Definições',
          icon: Settings,
        },
      ]

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800">
      
      {/* Hidden file input for avatar uploading */}
      <input 
        type="file" 
        id="sidebar-avatar-upload" 
        accept="image/*" 
        className="hidden" 
        onChange={handleAvatarChange} 
      />

      {/* PDF Confirm Modal (delete / hide) */}
      <AnimatePresence>
        {pdfConfirmModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-7 max-w-sm w-full shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${pdfConfirmModal.action === 'delete' ? 'bg-red-50' : 'bg-amber-50'}`}>
                  <Trash2 className={`w-5 h-5 ${pdfConfirmModal.action === 'delete' ? 'text-red-500' : 'text-amber-500'}`} />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#312455]">
                    {pdfConfirmModal.action === 'delete' ? 'Eliminar material' : 'Remover da vista'}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">Esta ação será aplicada imediatamente.</p>
                </div>
              </div>

              {/* Body */}
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {pdfConfirmModal.action === 'delete' ? (
                  <>
                    Tem a certeza que deseja <strong className="text-red-600">eliminar permanentemente</strong> o material{' '}
                    <strong className="text-[#312455]">"{pdfConfirmModal.pdfTitle}"</strong>?
                    O ficheiro será removido do servidor e não poderá ser recuperado.
                  </>
                ) : (
                  <>
                    Deseja ocultar{' '}
                    <strong className="text-[#312455]">"{pdfConfirmModal.pdfTitle}"</strong>{' '}
                    da sua biblioteca? Pode contactar o administrador para o restaurar.
                  </>
                )}
              </p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setPdfConfirmModal({ open: false, action: 'hide', pdfId: '', pdfTitle: '' })}
                  disabled={isPdfActionLoading}
                  className="flex-1 h-10 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={executePdfAction}
                  disabled={isPdfActionLoading}
                  className={`flex-1 h-10 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors cursor-pointer ${
                    pdfConfirmModal.action === 'delete'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-[#312455] hover:bg-[#3d2d6b]'
                  }`}
                >
                  {isPdfActionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      A processar...
                    </>
                  ) : pdfConfirmModal.action === 'delete' ? (
                    'Eliminar'
                  ) : (
                    'Ocultar'
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#312455] text-white fixed h-screen z-30 shadow-none border-none rounded-r-[2.5rem]">
        {/* Profile/Avatar Premium Header */}
        <div className="pt-8 pb-6 px-6 border-b border-white/10 flex flex-col items-center text-center">
          {/* Avatar Ring with subtle glow */}
          <div 
            onClick={() => document.getElementById('sidebar-avatar-upload')?.click()}
            className="relative mb-3 group cursor-pointer"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8a66a8] to-white/40 blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative w-20 h-20 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] transition-transform duration-300 group-hover:scale-105 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} className="w-full h-full rounded-full object-cover shadow-inner" alt="Avatar" />
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-xl font-black text-white shadow-inner">
                  {(displayName || user.name).split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
              )}
              {/* Premium Upload Overlay */}
              <div className="absolute inset-1 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-[9px] font-extrabold gap-0.5">
                <Upload className="h-3.5 w-3.5" />
                <span>Alterar</span>
              </div>
            </div>
          </div>
          {/* Name & Email */}
          <h2 className="font-extrabold text-sm tracking-tight text-white line-clamp-1">{displayName || user.name}</h2>
          <p className="text-[10px] text-white/50 font-semibold truncate max-w-full mt-0.5">{user.email}</p>
          <Badge className="mt-2 bg-[#8a66a8]/20 hover:bg-[#8a66a8]/35 text-[#c1a7d6] border border-[#8a66a8]/30 uppercase text-[8px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
            {isInstructor ? 'Administrador' : 'Formando'}
          </Badge>
        </div>

        <nav className="flex-1 pl-4 pr-0 py-6 space-y-1 lg:overflow-visible overflow-y-auto">
          {isInstructor && (
            <div className="pb-4 pr-4">
              <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
                Administração
              </div>
              <Link
                href="/admin"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                <ShieldCheck className="h-4.5 w-4.5 text-white/60" />
                Painel Geral Admin
              </Link>
            </div>
          )}

          <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
            Área de Formação
          </div>
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = activeTab === link.id
            const isSettings = link.id === 'settings'
            return (
              <Fragment key={link.id}>
                {isSettings && <div className="h-px bg-white/10 my-3 mr-4 ml-3" />}
                <button
                  onClick={() => handleTabChange(link.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 w-full ${
                    isActive 
                      ? 'bg-white/15 text-white shadow-sm' 
                      : 'text-white/70 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-white' : 'text-white/60'}`} />
                  <span>{link.label}</span>
                </button>
              </Fragment>
            )
          })}
        </nav>

        {/* Logout Section at bottom */}
        <div className="p-4 border-t border-white/10 bg-black/10 mt-auto rounded-br-[2.5rem]">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-red-300 transition-all duration-300 cursor-pointer"
          >
            <LogOut className="h-4.5 w-4.5 text-white/60" />
            Terminar Sessão
          </button>
        </div>
      </aside>

      {/* 2. SIDEBAR MOBILE DRAWER */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-64 bg-[#312455] text-white z-50 flex flex-col lg:hidden shadow-2xl rounded-r-[2.5rem]"
            >
              {/* Mobile Profile/Avatar Premium Header */}
              <div className="pt-8 pb-6 px-6 border-b border-white/10 flex flex-col items-center text-center relative">
                {/* Close Button absolute inside header */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setSidebarOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:bg-white/5 hover:text-white rounded-lg"
                >
                  <X className="h-5 w-5" />
                </Button>

                {/* Avatar Ring */}
                <div 
                  onClick={() => {
                    document.getElementById('sidebar-avatar-upload')?.click()
                  }}
                  className="relative mb-3 group cursor-pointer"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#8a66a8] to-white/40 blur-sm opacity-70" />
                  <div className="relative w-20 h-20 rounded-full p-1 bg-white/10 ring-2 ring-white/20 ring-offset-2 ring-offset-[#312455] flex items-center justify-center overflow-hidden">
                    {avatarUrl ? (
                      <img src={avatarUrl} className="w-full h-full rounded-full object-cover shadow-inner" alt="Avatar" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-[#8a66a8] to-[#4a347c] flex items-center justify-center text-xl font-black text-white shadow-inner">
                        {(displayName || user.name).split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    {/* Premium Upload Overlay */}
                    <div className="absolute inset-1 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white text-[9px] font-extrabold gap-0.5">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Alterar</span>
                    </div>
                  </div>
                </div>
                {/* Name & Email */}
                <h2 className="font-extrabold text-sm tracking-tight text-white line-clamp-1">{displayName || user.name}</h2>
                <p className="text-[10px] text-white/50 font-semibold truncate max-w-full mt-0.5">{user.email}</p>
                <Badge className="mt-2 bg-[#8a66a8]/20 text-[#c1a7d6] border border-[#8a66a8]/30 uppercase text-[8px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-full">
                  {isInstructor ? 'Administrador' : 'Formando'}
                </Badge>
              </div>

              <nav className="flex-1 pl-4 pr-0 py-6 space-y-1 overflow-y-auto">
                {isInstructor && (
                  <div className="pb-4 pr-4">
                    <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
                      Administração
                    </div>
                    <Link
                      href="/admin"
                      onClick={() => setSidebarOpen(false)}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-white transition-all duration-300"
                    >
                      <ShieldCheck className="h-4.5 w-4.5 text-white/60" />
                      Painel Geral Admin
                    </Link>
                  </div>
                )}

                <div className="text-[10px] font-bold tracking-wider text-white/40 uppercase px-3 mb-2">
                  Área de Formação
                </div>
                {sidebarLinks.map((link) => {
                  const Icon = link.icon
                  const isActive = activeTab === link.id
                  const isSettings = link.id === 'settings'
                  return (
                    <Fragment key={link.id}>
                      {isSettings && <div className="h-px bg-white/10 my-3 mr-4 ml-3" />}
                      <button
                        onClick={() => {
                          handleTabChange(link.id)
                          setSidebarOpen(false)
                        }}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 w-full ${
                          isActive 
                            ? 'bg-white/15 text-white shadow-sm' 
                            : 'text-white/70 hover:bg-white/8 hover:text-white'
                        }`}
                      >
                        <Icon className={`h-4.5 w-4.5 transition-colors ${isActive ? 'text-white' : 'text-white/60'}`} />
                        <span>{link.label}</span>
                      </button>
                    </Fragment>
                  )
                })}
              </nav>

              {/* Mobile Logout Section at bottom */}
              <div className="p-4 border-t border-white/10 bg-black/10 mt-auto rounded-br-[2.5rem]">
                <button 
                  onClick={() => {
                    setSidebarOpen(false)
                    handleLogout()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/70 hover:bg-white/5 hover:text-red-300 transition-all duration-300 cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5 text-white/60" />
                  Terminar Sessão
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col lg:pl-64 min-h-screen min-w-0 overflow-x-hidden">
        
        {/* Workspace Fixed Mobile Header + Metrics */}
        <div className="fixed top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 p-4 md:relative md:top-auto md:left-auto md:w-auto md:z-0 md:bg-transparent md:backdrop-blur-none md:border-b-0 md:p-6 flex flex-col gap-4">
          
          <header className="flex items-center justify-between z-20">
            {/* Left side: hamburger + date */}
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-slate-700 hover:bg-slate-100/50 rounded-lg"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Date display — left side */}
              <div className="flex items-center gap-2 text-slate-500 text-xs font-medium bg-slate-100/80 px-3.5 py-1.5 rounded-full border border-slate-200/50 shadow-sm">
                <Calendar className="h-3.5 w-3.5 text-[#8a66a8]" />
                <span className="text-[#312455] font-semibold">{currentDate}</span>
              </div>
            </div>

            {/* Right: Notification Bell + Avatar */}
            <div className="flex items-center gap-4 relative">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className={`relative text-slate-500 hover:text-[#312455] hover:bg-slate-100 rounded-full transition-all ${
                    showNotifications ? 'bg-slate-100 text-[#312455]' : ''
                  }`}
                  title="Notificações"
                >
                  <Bell className="h-5 w-5" />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span 
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center px-1.5 ring-2 ring-white leading-none shadow-sm shadow-red-950/20"
                      >
                        {unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>

                {/* Elegant Notifications Popup (portalized) */}
                {typeof window !== 'undefined' &&
                  createPortal(
                    <AnimatePresence>
                      {showNotifications && (
                        <>
                          {/* Backdrop overlay for closing */}
                          <div
                            className="fixed inset-0 z-[9998] cursor-default"
                            onClick={() => setShowNotifications(false)}
                          />

                          {/* Popup Container */}
                          <motion.div
                            initial={{ opacity: 0, y: 12, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 12, scale: 0.96 }}
                            transition={{ duration: 0.18, ease: 'easeOut' }}
                            className="
                              fixed z-[9999] overflow-hidden
                              bg-white border border-slate-100 shadow-2xl
                              rounded-[2rem]
                              top-[4.5rem] right-4 left-4
                              sm:left-auto sm:w-[360px]
                            "
                          >
                        {/* Cabeçalho */}
                        <div className="flex items-center justify-between px-5 py-4 bg-[#312455]">
                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-white/70" />
                            <span className="text-white text-sm font-extrabold tracking-tight">Notificações</span>
                            {unreadCount > 0 && (
                              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {unreadCount} nova{unreadCount !== 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowNotifications(false)}
                            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition-colors cursor-pointer"
                            aria-label="Fechar notificações"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        
                        {/* Lista de notificações */}
                        <div className="divide-y divide-slate-100 max-h-[55vh] sm:max-h-72 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="py-10 text-center">
                              <Bell className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                              <p className="text-xs text-slate-400 font-bold">Sem notificações de momento.</p>
                            </div>
                          ) : (
                            notifications.map((notif) => {
                              const isMarking = markingId === notif.id
                              const isDisabled = markingId !== null || markingAll
                              return (
                                <button
                                  key={notif.id}
                                  type="button"
                                  onClick={() => handleNotificationClick(notif)}
                                  disabled={isDisabled}
                                  className={`w-full px-5 py-4 text-left transition-colors flex items-start gap-3 group
                                    ${!notif.lida ? 'bg-[#312455]/[0.03]' : 'bg-white'}
                                    ${isDisabled ? 'cursor-not-allowed opacity-60' : 'hover:bg-slate-50 cursor-pointer'}
                                  `}
                                >
                                  {/* Indicador não lido */}
                                  <span
                                    className={`mt-1.5 w-2 h-2 rounded-full shrink-0 transition-all ${
                                      !notif.lida ? 'bg-[#8a66a8]' : 'bg-transparent'
                                    }`}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-bold leading-snug ${
                                      !notif.lida ? 'text-[#312455]' : 'text-slate-600'
                                    }`}>
                                      {notif.titulo}
                                    </p>
                                    <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2 font-medium">
                                      {notif.descricao}
                                    </p>
                                    {notif.time && (
                                      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{notif.time}</p>
                                    )}
                                  </div>
                                  {/* Spinner de loading */}
                                  {isMarking && (
                                    <Loader2 className="w-3.5 h-3.5 text-[#8a66a8] animate-spin shrink-0 mt-0.5" />
                                  )}
                                </button>
                              )
                            })
                          )}
                        </div>

                        {/* Rodapé */}
                        {notifications.some((n) => !n.lida) && (
                          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/60">
                            <button
                              type="button"
                              onClick={handleMarkAllRead}
                              disabled={markingAll || markingId !== null}
                              className="w-full flex items-center justify-center gap-1.5 text-[11px] font-bold text-[#8a66a8] hover:text-[#312455] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer py-1 transition-colors"
                            >
                              {markingAll ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCheck className="w-3 h-3" />
                              )}
                              {markingAll ? 'A marcar...' : 'Marcar todas como lidas'}
                            </button>
                          </div>
                        )}
                      </motion.div>
                      </>
                    )}
                  </AnimatePresence>,
                  document.body
                )}
              </div>

              <div 
                onClick={() => handleTabChange('settings')}
                className="h-9 w-9 rounded-full bg-[#312455] text-white flex items-center justify-center text-xs font-bold border border-slate-200 shadow-sm cursor-pointer hover:ring-2 hover:ring-[#8a66a8] transition-all overflow-hidden"
                title="Ir para Definições"
              >
                {avatarUrl ? (
                  <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                ) : (
                  (displayName || user.name).charAt(0).toUpperCase()
                )}
              </div>
            </div>
          </header>
          
          {/* C. Interactive Statistics Row */}
          {activeTab === 'courses' && (
            <div className="grid grid-cols-3 gap-2 md:gap-6">
              {isInstructor ? (
                <>
                  <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center text-center gap-0.5 py-2.5 px-2 md:p-6">
                      <div className="text-xl font-bold text-slate-900 leading-none">{exploreCourses.length}</div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                        <BookOpen className="w-3 h-3 hidden sm:block" />
                        <span className="hidden sm:inline">Cursos</span>
                        <span className="sm:hidden">Cursos</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center text-center gap-0.5 py-2.5 px-2 md:p-6">
                      <div className="text-xl font-bold text-slate-900 leading-none">{students.length}</div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                        <Users className="w-3 h-3 hidden sm:block" />
                        <span className="hidden sm:inline">Alunos</span>
                        <span className="sm:hidden">Alunos</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center text-center gap-0.5 py-2.5 px-2 md:p-6">
                      <div className="text-xl font-bold text-slate-900 leading-none">{pdfMaterials.length}</div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                        <FileText className="w-3 h-3 hidden sm:block" />
                        <span className="hidden sm:inline">Arquivos</span>
                        <span className="sm:hidden">Arquivos</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center text-center gap-0.5 py-2.5 px-2 md:p-6">
                      <div className="text-xl font-bold text-slate-900 leading-none">{activeCourses.length}</div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                        <BookOpen className="w-3 h-3 hidden sm:block" />
                        <span className="hidden sm:inline">Cursos</span>
                        <span className="sm:hidden">Cursos</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center text-center gap-0.5 py-2.5 px-2 md:p-6">
                      <div className="text-xl font-bold text-slate-900 leading-none">
                        {activeCourses.reduce((acc, c) => acc + c.completedLessons, 0)}
                      </div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                        <Clock className="w-3 h-3 hidden sm:block" />
                        <span className="hidden sm:inline">Aulas</span>
                        <span className="sm:hidden">Aulas</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white/70 backdrop-blur-sm overflow-hidden group">
                    <CardContent className="flex flex-col items-center justify-center text-center gap-0.5 py-2.5 px-2 md:p-6">
                      <div className="text-xl font-bold text-slate-900 leading-none">{pdfMaterials.length}</div>
                      <div className="flex items-center gap-1 text-[9px] font-semibold tracking-wider text-slate-400 uppercase">
                        <FileText className="w-3 h-3 hidden sm:block" />
                        <span className="hidden sm:inline">PDFs</span>
                        <span className="sm:hidden">PDFs</span>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          )}

          {/* D. Online Classes Header Section - Fixed on mobile */}
          {activeTab === 'online-classes' && (
            <div className="md:hidden flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-6">
                <div className="flex gap-4 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setOnlineClassesActiveTab('live')
                      setShowScheduleForm(false)
                    }}
                    className={`relative py-1.5 transition-colors cursor-pointer ${
                      onlineClassesActiveTab === 'live' ? 'text-[#312455] font-black' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Online
                    {onlineClassesActiveTab === 'live' && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#312455]"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setOnlineClassesActiveTab('presencial')
                      setShowScheduleForm(false)
                    }}
                    className={`relative py-1.5 transition-colors cursor-pointer ${
                      onlineClassesActiveTab === 'presencial' ? 'text-[#312455] font-black' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    Presencial
                    {onlineClassesActiveTab === 'presencial' && (
                      <motion.div
                        layoutId="tab-underline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#312455]"
                      />
                    )}
                  </button>
                </div>
              </div>

              {isInstructor && (
                <Button
                  onClick={() => setShowScheduleForm(!showScheduleForm)}
                  variant="ghost"
                  className="text-xs font-bold text-slate-500 hover:text-[#312455] flex items-center gap-1 cursor-pointer h-8 px-2.5 rounded-lg border border-slate-200/50 hover:bg-slate-50 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {showScheduleForm ? 'Cancelar' : 'Agendar Aula'}
                </Button>
              )}
            </div>
          )}

          {/* E. Explore Courses Header Section - Fixed on mobile */}
          {activeTab === 'explore' && showExploreHeader && (
            <div className={`md:hidden flex flex-col gap-2 border-b border-slate-100 pb-2 fixed top-0 left-0 right-0 z-40 bg-[#f8fafc]/95 backdrop-blur-sm px-4 pt-3 transition-transform duration-300 ease-in-out ${
              isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
            }`}>
              <button
                onClick={() => {
                  setShowExploreHeader(false)
                  setIsHeaderUserClosed(true)
                }}
                className="absolute top-1 right-2 p-1 text-slate-400 hover:text-[#312455] rounded-full transition-colors"
                aria-label="Fechar cabeçalho"
              >
                <X className="h-4 w-4" />
              </button>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pr-6">
                <div>
                  <h2 className="text-sm font-black text-[#312455]">Catálogo</h2>
                  <p className="text-[9px] text-slate-500">Explorar formações.</p>
                </div>
                <Badge className="bg-[#8a66a8]/10 text-[#8a66a8] border-none font-bold text-[9px] py-0.5 px-2 rounded-full whitespace-nowrap flex-shrink-0">
                  {exploreCourses.length}
                </Badge>
              </div>

              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                <Input
                  placeholder="Pesquisar..."
                  value={exploreSearch}
                  onChange={(e) => handleExploreSearchChange(e.target.value)}
                  className="pl-8 rounded-xl h-8 text-[11px] border-slate-200 bg-white shadow-sm focus-visible:ring-[#8a66a8] transition-all duration-200"
                />
              </div>

              {/* Category Filter Buttons */}
              <div className="flex gap-1.5 flex-wrap pb-1">
                {exploreCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleExploreCategoryChange(cat)}
                    disabled={isFiltering}
                    className={`relative px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all duration-200 border flex items-center gap-1 whitespace-nowrap leading-tight ${(
                      exploreCategory === cat || loadingCategory === cat
                        ? 'bg-[#312455] text-white border-[#312455] shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-[#8a66a8] hover:text-[#8a66a8]'
                    )} disabled:opacity-80 disabled:cursor-default`}
                  >
                    {loadingCategory === cat ? (
                      <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                    ) : null}
                    <span>{getCategoryLabel(cat)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <main className={`flex-1 flex flex-col justify-start gap-6 p-6 overflow-y-auto transition-all duration-300 ${activeTab === 'explore' && showExploreHeader ? 'pt-[140px]' : 'pt-6'} md:pt-6`}>

          {/* A. Dynamic Banner (Only Desktop) */}
          {activeTab === 'courses' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="hidden md:flex relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#312455] via-[#4a347c] to-[#312455] p-8 text-white shadow-lg"
            >
              {/* Visual background lights */}
              <div className="absolute right-0 top-0 w-80 h-80 bg-[#8a66a8]/25 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
              <div className="absolute left-0 bottom-0 w-60 h-60 bg-white/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-white/10 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full border border-white/10">
                      Prime Academy Angola
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white leading-tight">
                    {isInstructor ? `Olá, Admin ${(displayName || user.name).split(' ')[0]}!` : `Olá, Aluno ${(displayName || user.name).split(' ')[0]}!`}
                  </h1>
                  <p className="text-white/70 text-sm max-w-xl">
                    {isInstructor 
                      ? 'Bem-vindo ao seu painel de administração. Aqui pode gerir os seus materiais de apoio e acompanhar o progresso pedagógico de cada aluno.'
                      : 'Pronto para expandir o seu conhecimento hoje? Continue o seu percurso de aprendizagem de onde parou.'}
                  </p>
                </div>
              </div>
            </motion.div>
          )}


          {/* D. Tab Content Panel */}
          <AnimatePresence mode="wait">
            {isTabChanging && (
              <motion.div
                key="tab-loader"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-white/60 backdrop-blur-md border border-slate-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center min-h-[400px] text-center shadow-lg shadow-purple-950/5"
              >
                <div className="relative mb-6">
                  {/* Outer glowing pulsing orb */}
                  <div className="absolute inset-0 rounded-full bg-[#8a66a8]/20 blur-md animate-pulse" />
                  {/* Premium Spinner */}
                  <div className="relative w-14 h-14 rounded-full border-[3px] border-slate-100 border-t-[#8a66a8] border-r-[#312455] animate-spin" />
                </div>
                <h3 className="text-base font-extrabold text-[#312455] tracking-tight">A carregar conteúdo...</h3>
                <p className="text-xs text-slate-400 mt-1 font-semibold leading-relaxed">
                  A preparar a sua área de aprendizagem personalizada
                </p>
              </motion.div>
            )}
            
            {/* D1. COURSES TAB */}
            {!isTabChanging && activeTab === 'courses' && (
              <motion.div
                key="courses-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-[#312455]">
                    {isInstructor ? 'Formações em Docência' : 'Os Meus Programas Activos'}
                  </h2>
                  <p className="text-xs text-slate-500">Acompanhamento e evolução do seu desenvolvimento.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {activeCourses.length === 0 ? (
                    <div className="col-span-full flex flex-col md:flex-row items-start gap-6 py-8 bg-white border border-slate-100 rounded-2xl shadow-sm p-6">
                      <div className="flex-1">
                        <h3 className="text-lg font-extrabold text-[#312455] mb-2">Nenhuma formação encontrada</h3>
                        <p className="text-sm text-slate-500 mb-3">
                          {isInstructor
                            ? 'Ainda não existem formações registadas. Pode criar conteúdos formativos a partir do painel de administração.'
                            : 'Ainda não tem formações activas. Consulte o catálogo público para descobrir formações e inscreva-se nas que lhe interessam.'}
                        </p>
                        <p className="text-xs text-slate-400">Se for administrador, utilize a área de gestão para adicionar formações; se for formando, explore o catálogo para se inscrever.</p>
                      </div>
                      <div className="flex-shrink-0 flex items-center">
                        {isInstructor ? (
                          <Link href="/admin" className="bg-gradient-to-r from-[#312455] to-[#8a66a8] text-white font-bold px-4 py-2 rounded-xl shadow-md">Ir para Admin</Link>
                        ) : (
                          <Link href="/enroll" className="bg-white border border-slate-200 text-[#312455] font-bold px-4 py-2 rounded-xl">Inscrever-me</Link>
                        )}
                      </div>
                    </div>
                  ) : (
                    activeCourses.map((course) => (
                      <Card key={course.id} className="overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl bg-white flex flex-col group py-0 pt-0 gap-0">
                      <div className="relative h-48 w-full overflow-hidden">
                        {course.image ? (
                          <SafeImage
                            src={course.image}
                            alt={course.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#312455] via-[#8a66a8] to-[#c084fc]" />
                        )}
                        {/* Overlay gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                        
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge className="bg-[#8a66a8] text-white border-none text-[9px] font-bold px-3 py-1 rounded-full">
                            {getCategoryLabel(course.category)}
                          </Badge>
                        </div>
                      </div>

                      <CardContent className="flex flex-col flex-1 p-6 space-y-4">
                        <div>
                          <h3 className="font-black text-[#312455] text-base leading-snug">{course.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{course.description}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-slate-500">Progresso</span>
                            <span className="font-black text-[#312455]">{course.progress}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#312455] to-[#8a66a8] rounded-full transition-all duration-700"
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[10px] text-slate-400">
                            <span>{course.completedLessons} de {course.totalLessons} aulas</span>
                            <span>{course.totalLessons - course.completedLessons} restantes</span>
                          </div>
                        </div>

                        <Button
                          asChild
                          className="w-full bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-11 font-bold text-xs shadow-sm cursor-pointer transition-all duration-300 mt-auto"
                        >
                          <Link href="/dashboard?tab=online-classes">
                            <Play className="mr-2 h-4 w-4" />
                            {course.progress > 0 ? 'Continuar Curso' : 'Iniciar Curso'}
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))) }
                </div>
              </motion.div>
            )}

            {/* D1.2 ONLINE CLASSES TAB */}
            {!isTabChanging && activeTab === 'online-classes' && (
              <motion.div
                key="online-classes-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <VirtualRoomsTab
                  isInstructor={isInstructor}
                  availableCourses={activeCourses.map(c => ({
                    id: c.id,
                    name: c.name,
                    online: c.online
                  }))}
                  activeTab={onlineClassesActiveTab}
                  setActiveTab={setOnlineClassesActiveTab}
                  showScheduleForm={showScheduleForm}
                  setShowScheduleForm={setShowScheduleForm}
                />
              </motion.div>
            )}

            {/* D2. PDFs TAB */}
            {!isTabChanging && activeTab === 'pdfs' && (
              <motion.div
                key="pdfs-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#312455]">
                      {isInstructor ? 'Gestão de Materiais PDF' : 'Biblioteca de Materiais'}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {isInstructor ? 'Publique e gira os materiais de apoio para os seus alunos.' : 'Aceda e faça download dos seus materiais de estudo.'}
                    </p>
                  </div>
                  <Badge className="bg-[#312455]/10 text-[#312455] border-none font-bold text-xs py-1 px-3.5 rounded-full">
                    {(isInstructor 
                      ? pdfMaterials 
                      : pdfMaterials.filter(pdf => !hiddenPdfIds.includes(pdf.id) && activeCourses.some(ac => ac.catalogId === pdf.courseId || ac.id === pdf.courseId))
                    ).length} Ficheiros
                  </Badge>
                </div>

                {/* Instructor Upload Form - Moved to top */}
                {isInstructor && (
                  <Card className="border border-[#8a66a8]/20 shadow-sm rounded-2xl bg-gradient-to-br from-white to-[#8a66a8]/5 overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#8a66a8]/10 flex items-center justify-center">
                          <Upload className="h-4.5 w-4.5 text-[#8a66a8]" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-black text-[#312455]">Publicar Novo Material</CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Adicione materiais de estudo para os seus alunos</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePdfUpload} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <Label htmlFor="pdfTitle" className="text-xs font-bold text-slate-600">Título do Material</Label>
                            <Input
                              id="pdfTitle"
                              placeholder="Ex: Manual de Boas Práticas PMBOK"
                              value={newPdfTitle}
                              onChange={(e) => setNewPdfTitle(e.target.value)}
                              className="rounded-xl h-10 text-xs text-[#312455] border-slate-200"
                              required
                            />
                          </div>
                          <div className="space-y-1.5">
                            <Label htmlFor="pdfCourse" className="text-xs font-bold text-slate-600">Curso Associado</Label>
                            <select
                              id="pdfCourse"
                              value={selectedCourseId}
                              onChange={(e) => setSelectedCourseId(e.target.value)}
                              className="w-full h-10 rounded-xl border border-slate-200 bg-white text-xs text-[#312455] px-3 focus:outline-none focus:ring-2 focus:ring-[#8a66a8] transition-all"
                            >
                              {exploreCourses.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="pdfDesc" className="text-xs font-bold text-slate-600">Descrição do Conteúdo</Label>
                          <textarea
                            id="pdfDesc"
                            placeholder="Descreva resumidamente o que o estudante aprenderá neste manual..."
                            className="w-full p-3 rounded-xl border border-slate-200 bg-white text-xs h-20 focus:outline-none focus:ring-2 focus:ring-[#8a66a8] resize-none transition-all"
                            value={newPdfDesc}
                            onChange={(e) => setNewPdfDesc(e.target.value)}
                            required
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label htmlFor="pdfFile" className="text-xs font-bold text-slate-600">Arquivo PDF *</Label>
                          <Input
                            id="pdfFile"
                            type="file"
                            accept=".pdf"
                            onChange={(e) => {
                              const file = e.target.files?.[0] || null
                              setSelectedFile(file)
                              if (file) {
                                setNewPdfFileName(file.name)
                              }
                            }}
                            className="rounded-xl h-10 text-xs text-[#312455] border-slate-200 cursor-pointer pt-2 bg-white"
                            required
                          />
                        </div>

                        <Button type="submit" disabled={isUploadingPdf} className="w-full bg-[#8a66a8] text-white hover:bg-[#312455] rounded-2xl h-11 text-xs font-bold shadow-md mt-4 cursor-pointer transition-transform duration-300 hover:scale-101">
                          {isUploadingPdf ? (
                            <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                          ) : (
                            <Plus className="mr-1.5 h-4 w-4" />
                          )}
                          {isUploadingPdf ? 'A publicar...' : 'Publicar PDF'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 gap-4">
                  {(isInstructor 
                    ? pdfMaterials 
                    : pdfMaterials.filter(pdf => !hiddenPdfIds.includes(pdf.id) && activeCourses.some(ac => ac.catalogId === pdf.courseId || ac.id === pdf.courseId))
                  ).length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-xs font-semibold text-slate-400 tracking-wide animate-pulse">
                        Nenhum material PDF disponível de momento.
                      </p>
                    </div>
                  ) : (
                    (isInstructor 
                      ? pdfMaterials 
                      : pdfMaterials.filter(pdf => !hiddenPdfIds.includes(pdf.id) && activeCourses.some(ac => ac.catalogId === pdf.courseId || ac.id === pdf.courseId))
                    ).map((pdf) => (
                      <Card key={pdf.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white overflow-hidden group">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex items-start gap-3 sm:gap-4">
                            {/* Ícone */}
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-100 transition-colors duration-300">
                              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
                            </div>

                            {/* Conteúdo principal */}
                            <div className="flex-1 min-w-0">
                              {/* Título */}
                              <h3 className="font-black text-[#312455] text-sm leading-snug break-words">{pdf.title}</h3>
                              {/* Badge do curso — sempre abaixo do título */}
                              <Badge className="mt-1 bg-[#8a66a8]/10 text-[#8a66a8] border-none text-[9px] font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full whitespace-normal leading-tight inline-flex">
                                {pdf.courseName}
                              </Badge>
                              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">{pdf.description}</p>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2.5">
                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-slate-400" />
                                  {pdf.uploadedAt}
                                </span>
                                <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px] sm:max-w-[200px]">{pdf.fileName}</span>
                              </div>
                            </div>

                            {/* Acções */}
                            <div className="flex flex-col sm:flex-row items-center gap-1 flex-shrink-0 self-start">
                              <Button 
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 text-[#8a66a8] hover:bg-[#8a66a8]/10 rounded-xl transition-all"
                                asChild={!!pdf.fileUrl}
                                onClick={() => {
                                  if (!pdf.fileUrl) {
                                    toast.success(`A iniciar download de "${pdf.fileName}"...`)
                                  }
                                }}
                              >
                                {pdf.fileUrl ? (
                                  <a href={pdf.fileUrl} target="_blank" rel="noopener noreferrer" download={pdf.fileName}>
                                    <Download className="h-4 w-4" />
                                  </a>
                                ) : (
                                  <Download className="h-4 w-4" />
                                )}
                              </Button>

                              {isInstructor ? (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                                  onClick={() => handleDeletePdf(pdf.id, pdf.fileUrl, pdf.title)}
                                  title="Eliminar Material"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-slate-300 hover:text-[#8a66a8] hover:bg-[#8a66a8]/10 rounded-xl transition-all cursor-pointer"
                                  onClick={() => handleHidePdf(pdf.id, pdf.title)}
                                  title="Remover da Vista"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </motion.div>
            )}

            {/* D3. STUDENTS TABLE TAB */}
            {!isTabChanging && isInstructor && activeTab === 'students' && (
              <motion.div
                key="students-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-black text-[#312455]">Estudantes sob Minha Tutoria</h2>
                    <p className="text-xs text-slate-500">Gestão de desempenho e progresso dos estudantes ativos.</p>
                  </div>
                  <Badge className="bg-[#312455]/10 text-[#312455] border-none font-bold text-xs py-1 px-3.5 rounded-full">
                    {students.length} Alunos Inscritos
                  </Badge>
                </div>

                {/* Visualização em Lista para Mobile */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {students.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 text-sm">
                      Sem alunos vinculados de momento.
                    </div>
                  ) : (
                    students.map((student) => (
                      <Card key={student.id} className="p-5 border border-slate-100 shadow-sm rounded-2xl bg-white space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#8a66a8]/10 text-[#8a66a8] font-bold flex items-center justify-center text-xs shadow-sm">
                            {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-extrabold text-slate-800 text-sm truncate">{student.name}</p>
                            <p className="text-xs text-slate-400 font-semibold truncate mt-0.5">{student.email}</p>
                          </div>
                          <span className={`text-[9px] font-bold uppercase tracking-wider py-1 px-2.5 rounded-full border shrink-0 ${
                            student.status === 'Concluído'
                              ? 'bg-green-50 text-green-600 border-green-500/20'
                              : 'bg-amber-50 text-amber-600 border-amber-500/20'
                          }`}>
                            {student.status}
                          </span>
                        </div>
                        
                        <div className="flex flex-col gap-2 pt-3 border-t border-slate-50">
                          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500">
                            <span>Curso Vinculado</span>
                            <span className="font-bold text-[#312455]">{student.progress}%</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className="bg-[#312455]/5 text-[#312455] border-none text-[9px] font-extrabold tracking-wide uppercase px-2.5 py-1 rounded-md w-fit max-w-full whitespace-normal break-words text-left justify-start">
                              {student.course}
                            </Badge>
                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#312455] to-[#8a66a8] rounded-full"
                                style={{ width: `${student.progress}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>

                {/* Visualização em Tabela para Desktop */}
                <Card className="hidden md:block border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 uppercase tracking-wider text-[10px] font-bold">
                          <th className="p-4 font-bold text-[#312455]">Nome Completo</th>
                          <th className="p-4 font-bold text-[#312455]">E-mail</th>
                          <th className="p-4 font-bold text-[#312455]">Curso Vinculado</th>
                          <th className="p-4 font-bold text-[#312455] text-center">Progresso Geral</th>
                          <th className="p-4 font-bold text-[#312455]">Estado</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 font-medium text-slate-600">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#8a66a8]/10 text-[#8a66a8] font-bold flex items-center justify-center text-[10px] shadow-sm">
                                {student.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                              </div>
                              <span className="font-extrabold text-slate-800 text-sm">{student.name}</span>
                            </td>
                            <td className="p-4 text-slate-400 font-semibold">{student.email}</td>
                            <td className="p-4">
                              <Badge className="bg-[#312455]/5 text-[#312455] border-none text-[9px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded-full">
                                {student.course}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center justify-center gap-3 max-w-[130px] mx-auto">
                                <span className="font-bold text-[#312455] w-8 text-right">{student.progress}%</span>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full bg-gradient-to-r from-[#312455] to-[#8a66a8] rounded-full"
                                    style={{ width: `${student.progress}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`text-[9px] font-bold uppercase tracking-wider py-1 px-3 rounded-full border ${
                                student.status === 'Concluído'
                                  ? 'bg-green-50 text-green-600 border-green-500/20'
                                  : 'bg-amber-50 text-amber-600 border-amber-500/20'
                              }`}>
                                {student.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </motion.div>
            )}

            {/* D4. EXPLORE COURSES TAB */}
            {!isTabChanging && activeTab === 'explore' && (
              <motion.div
                key="explore-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 pt-4 md:pt-0"
              >
                {/* Header — Desktop only */}
                <div className="hidden md:flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-[#312455]">Catálogo de Formações</h2>
                    <p className="text-xs text-slate-500">Descubra novos programas e expanda as suas competências profissionais.</p>
                  </div>
                  <Badge className="bg-[#8a66a8]/10 text-[#8a66a8] border-none font-bold text-xs py-1.5 px-4 rounded-full self-start md:self-auto">
                    {exploreCourses.length} Formações Disponíveis
                  </Badge>
                </div>

                {/* Search + Filters — Desktop only */}
                <div className="hidden md:flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      placeholder="Pesquisar formações..."
                      value={exploreSearch}
                      onChange={(e) => handleExploreSearchChange(e.target.value)}
                      className="pl-10 rounded-2xl h-11 text-sm border-slate-200 bg-white shadow-sm focus-visible:ring-[#8a66a8] transition-all duration-200"
                    />
                  </div>
                  {/* Category filter buttons */}
                  <div className="flex gap-2 flex-wrap">
                    {exploreCategories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleExploreCategoryChange(cat)}
                        disabled={isFiltering}
                        className={`relative px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 border flex items-center gap-1.5 max-w-[120px] sm:max-w-none text-center sm:text-left whitespace-normal justify-center sm:justify-start leading-tight ${
                          (exploreCategory === cat || loadingCategory === cat)
                            ? 'bg-[#312455] text-white border-[#312455] shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-[#8a66a8] hover:text-[#8a66a8]'
                        } disabled:opacity-80 disabled:cursor-default`}
                      >
                        {loadingCategory === cat ? (
                          <Loader2 className="h-3 w-3 animate-spin flex-shrink-0" />
                        ) : null}
                        <span>{getCategoryLabel(cat)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Resultados — spinner na pesquisa, skeletons no filtro */}
                {isSearching ? (
                  <motion.div
                    key="search-loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col items-center justify-center py-24 min-h-[360px] rounded-[2.5rem] bg-white/60 border border-slate-100 shadow-sm"
                  >
                    <div className="relative mb-5">
                      <div className="absolute inset-0 rounded-full bg-[#8a66a8]/20 blur-md animate-pulse" />
                      <Loader2 className="relative h-12 w-12 text-[#8a66a8] animate-spin" />
                    </div>
                    <p className="text-sm font-extrabold text-[#312455] tracking-tight">A pesquisar formações...</p>
                    <p className="text-xs text-slate-400 mt-1 font-semibold">A filtrar o catálogo com o seu termo</p>
                  </motion.div>
                ) : isFiltering ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CourseSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredExploreCourses.length === 0 && exploreCourses.length === 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <CourseSkeleton key={i} />
                    ))}
                  </div>
                ) : filteredExploreCourses.length === 0 ? (
                  <div className="text-center py-16">
                    <Compass className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold text-sm">Nenhuma formação encontrada</p>
                    <p className="text-slate-400 text-xs mt-1">Tente outro termo de pesquisa ou categoria</p>
                  </div>
                ) : (
                  <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    <AnimatePresence mode="popLayout">
                    {filteredExploreCourses.map((course) => {
                      const { attending: isAttending, label: attendanceLabel } =
                        isAttendingCatalogCourse(course, activeCourses, enrolledCourses)
                      return (
                        <motion.div
                          key={course.id}
                          layout
                          initial={{ opacity: 0, scale: 0.97 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.25 }}
                        >
                          <Card className="overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 rounded-3xl bg-white flex flex-col group h-full py-0 pt-0 gap-0">
                            <div className="relative h-40 w-full overflow-hidden">
                              <SafeImage
                                src={course.image}
                                alt={course.name}
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                                <Badge className="bg-[#8a66a8] text-white border-none text-[9px] font-bold px-2.5 py-0.5 rounded-full">
                                  {getCategoryLabel(course.category)}
                                </Badge>
                                <Badge className="bg-emerald-500/90 text-white border-none uppercase text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                                  Presencial / Online
                                </Badge>
                              </div>
                              {/* "A Frequentar" ribbon for active courses */}
                              {isAttending && (
                                <div className="absolute top-3 right-3">
                                  <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                                    <CheckCircle2 className="h-2.5 w-2.5" />
                                    {attendanceLabel}
                                  </span>
                                </div>
                              )}
                            </div>
                            <CardContent className="flex flex-col flex-1 p-5 space-y-3">
                              <div>
                                <h3 className="font-black text-[#312455] text-sm leading-snug">{course.name}</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed line-clamp-2">{course.description}</p>
                              </div>
                              <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />{course.duration}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-amber-400 fill-amber-400" />{course.rating.toFixed(1)}
                                </span>
                              </div>
                              {isAttending ? (
                                <div className="w-full rounded-2xl h-10 font-black text-xs mt-auto flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  {attendanceLabel}
                                </div>
                              ) : (
                                <Button
                                  asChild
                                  className="w-full rounded-2xl h-10 font-bold text-xs mt-auto bg-[#312455] hover:bg-[#8a66a8] text-white shadow-sm transition-all duration-300 cursor-pointer"
                                >
                                  <Link href={`/dashboard/courses/${course.id}`}>
                                    <Play className="mr-1.5 h-3.5 w-3.5 fill-white" />
                                    Saber Mais
                                  </Link>
                                </Button>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      )
                    })}
                    </AnimatePresence>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* D5. SETTINGS TAB */}
            {!isTabChanging && activeTab === 'settings' && (
              <motion.div
                key="settings-tab"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 max-w-2xl"
              >
                <div>
                  <h2 className="text-xl font-black text-[#312455]">Definições da Conta</h2>
                  <p className="text-xs text-slate-500">Gerencie as suas informações pessoais e segurança da conta.</p>
                </div>

                <form onSubmit={handleSaveSettings} className="space-y-6">
                  {/* Profile Section */}
                  <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#312455]/5 flex items-center justify-center">
                          <UserCircle className="h-5 w-5 text-[#312455]" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-black text-[#312455]">Informações do Perfil</CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Atualize os seus dados pessoais</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      {/* Avatar premium interactive preview */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50/80 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[#312455] to-[#8a66a8] flex items-center justify-center text-white text-xl font-black shadow-md overflow-hidden border-2 border-white ring-4 ring-[#312455]/5">
                            {avatarUrl ? (
                              <img src={avatarUrl} className="w-full h-full object-cover" alt="Avatar" />
                            ) : (
                              (settingsName || user.name).charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-[#312455]">{settingsName || user.name}</p>
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                              {isInstructor ? 'Administrador' : 'Estudante / Formando'} · Prime Academy
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            onClick={() => document.getElementById('sidebar-avatar-upload')?.click()}
                            className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-xl h-9 px-4 text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                            disabled={isUploadingAvatar || isRemovingAvatar}
                          >
                            {isUploadingAvatar ? (
                              <>
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                A carregar...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-1.5 h-3.5 w-3.5" />
                                Carregar Foto
                              </>
                            )}
                          </Button>
                          {avatarUrl && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={handleRemoveAvatar}
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-xl h-9 px-4 text-xs font-bold transition-colors cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                              disabled={isUploadingAvatar || isRemovingAvatar}
                            >
                              {isRemovingAvatar ? (
                                <>
                                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin text-red-500" />
                                  A remover...
                                </>
                              ) : (
                                'Remover'
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-[#8a66a8]" />Nome Completo
                          </Label>
                          <Input
                            value={settingsName}
                            onChange={(e) => setSettingsName(e.target.value)}
                            placeholder="O seu nome completo"
                            className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8]"
                            disabled={isSavingSettings}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-[#8a66a8]" />Endereço de E-mail
                          </Label>
                          <Input
                            value={user.email || ''}
                            disabled
                            className="rounded-xl h-10 text-sm border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Tag className="h-3.5 w-3.5 text-[#8a66a8]" />Tipo de Conta
                          </Label>
                          <Input
                            value={isInstructor ? 'Administrador' : 'Estudante / Formando'}
                            disabled
                            className="rounded-xl h-10 text-sm border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-[#8a66a8]" />Idioma
                          </Label>
                          <select
                            className="w-full h-10 rounded-xl border border-slate-200 bg-white text-sm text-[#312455] px-3 focus:outline-none focus:ring-2 focus:ring-[#8a66a8] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            defaultValue="pt-AO"
                            disabled={isSavingSettings}
                          >
                            <option value="pt-AO">Português (Angola)</option>
                            <option value="pt-PT">Português (Portugal)</option>
                          </select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Security Section */}
                  <Card className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                    <CardHeader className="pb-4 border-b border-slate-50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#8a66a8]/5 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-[#8a66a8]" />
                        </div>
                        <div>
                          <CardTitle className="text-sm font-black text-[#312455]">Segurança da Conta</CardTitle>
                          <CardDescription className="text-[10px] text-slate-400">Altere a sua senha de acesso</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      <div className="space-y-1.5">
                        <Label className="text-xs font-bold text-slate-600">Senha Atual</Label>
                        <div className="relative">
                          <Input
                            type={showCurrentPw ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="••••••••"
                            className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8] pr-10"
                            disabled={isSavingSettings}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPw(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#8a66a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isSavingSettings}
                          >
                            {showCurrentPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Nova Senha</Label>
                          <div className="relative">
                            <Input
                              type={showNewPw ? 'text' : 'password'}
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="Mínimo 6 caracteres"
                              className="rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8] pr-10"
                              disabled={isSavingSettings}
                            />
                            <button
                              type="button"
                              onClick={() => setShowNewPw(v => !v)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#8a66a8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={isSavingSettings}
                            >
                              {showNewPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold text-slate-600">Confirmar Nova Senha</Label>
                          <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Repita a nova senha"
                            className={`rounded-xl h-10 text-sm border-slate-200 focus-visible:ring-[#8a66a8] ${
                              confirmPassword && confirmPassword !== newPassword ? 'border-red-300 focus-visible:ring-red-400' : ''
                            }`}
                            disabled={isSavingSettings}
                          />
                          {confirmPassword && confirmPassword !== newPassword && (
                            <p className="text-[10px] text-red-500 font-semibold">As senhas não coincidem</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Save Button */}
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={isSavingSettings}
                      onClick={() => {
                        setSettingsName(user.name)
                        setCurrentPassword('')
                        setNewPassword('')
                        setConfirmPassword('')
                      }}
                      className="rounded-2xl h-11 px-6 text-sm font-bold text-slate-500 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSavingSettings}
                      className="bg-[#312455] hover:bg-[#8a66a8] text-white rounded-2xl h-11 px-8 text-sm font-bold shadow-md cursor-pointer transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isSavingSettings ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          A guardar...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Guardar Alterações
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

          </AnimatePresence>

        </main>
      </div>
      
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#312455]" />
        </div>
      }
    >
      <DashboardPageContent />
    </Suspense>
  )
}
