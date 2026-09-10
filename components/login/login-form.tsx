'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/auth-context'
import { useEffect } from 'react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.push(redirect)
    }
  }, [user, router, searchParams])

  if (user) {
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    const result = await login(email, password)
    
    if (result.success) {
      const redirect = searchParams.get('redirect') || '/dashboard'
      router.push(redirect)
    } else {
      let friendlyError = result.error || 'Erro ao fazer login. Verifique as suas credenciais.'
      if (friendlyError.toLowerCase().includes('invalid login credentials')) {
        friendlyError = 'E-mail ou senha incorrectos. Por favor, verifique as suas credenciais e tente novamente.'
      } else if (friendlyError.toLowerCase().includes('email not confirmed')) {
        friendlyError = 'O seu e-mail ainda não foi confirmado. Verifique a sua caixa de entrada e clique no link de confirmação para activar a sua conta.'
      }
      setError(friendlyError)
    }
    
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-10 shadow-xl"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-tr from-[#312455] to-[#8a66a8] rounded-xl mb-4 shadow-md shadow-purple-950/20">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.753 2 16.5S6.5 26.747 12 26.747s10-4.5 10-10.247S17.5 6.253 12 6.253z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#312455] mb-2 tracking-tight">Bem-Vindo</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
          >
            {error}
          </motion.div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Email
          </Label>
          <div className="relative mt-1">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-12 h-12 rounded-xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Senha
            </Label>
            <Link href="#" className="text-xs font-semibold text-[#8a66a8] hover:text-[#735191] transition-colors hover:underline">
              Esqueceu a senha?
            </Link>
          </div>
          <div className="relative mt-1">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 pr-12 h-12 rounded-xl border-slate-200 focus:border-[#8a66a8] focus:ring-[#8a66a8] transition-all bg-slate-50/50 focus:bg-white text-slate-800"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-12 bg-[#8a66a8] hover:bg-[#735191] text-white rounded-xl text-base font-semibold shadow-lg shadow-purple-950/15 hover:shadow-xl transition-all duration-300"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Autenticando...
            </>
          ) : (
            'Entrar na Conta'
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 bg-white text-slate-500">Inscreva-se nos nossos programas</span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full h-12 border-2 border-slate-200 hover:border-slate-300 text-[#312455] rounded-xl text-base font-semibold transition-all duration-300"
          onClick={() => router.push('/signup')}
        >
          Criar Conta
        </Button>
      </form>
    </motion.div>
  )
}
