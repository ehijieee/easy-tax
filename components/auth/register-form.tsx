'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface RegisterFormProps {
  language: 'english' | 'pidgin'
}

export function RegisterForm({ language }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bvn: '',
    cacNumber: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const content = {
    english: {
      title: 'Create Your EasyTax Account',
      description: 'Join thousands of Nigerians simplifying their tax compliance',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      bvn: 'BVN (Optional)',
      cacNumber: 'CAC Number (Optional)',
      createAccount: 'Create Account',
      haveAccount: 'Already have an account?',
      signIn: 'Sign in here',
      passwordMismatch: 'Passwords do not match'
    },
    pidgin: {
      title: 'Create Your EasyTax Account',
      description: 'Join thousands of Nigerians wey dey make their tax easy',
      fullName: 'Full Name',
      email: 'Email Address',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      bvn: 'BVN (Optional)',
      cacNumber: 'CAC Number (Optional)',
      createAccount: 'Create Account',
      haveAccount: 'Already get account?',
      signIn: 'Sign in here',
      passwordMismatch: 'Password no match'
    }
  }

  const currentContent = content[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError(currentContent.passwordMismatch)
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/login` : undefined,
          data: {
            full_name: formData.fullName,
            bvn: formData.bvn,
            cac_number: formData.cacNumber
          }
        }
      })

      if (error) {
        setError(error.message)
      } else if (data.session) {
        router.push('/dashboard')
      } else {
        router.push('/auth/login?checkEmail=1')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-xl border-0 bg-white/95 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
        <CardTitle className="text-xl font-bold text-gray-900">{currentContent.title}</CardTitle>
        <CardDescription className="text-gray-600 font-medium">{currentContent.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-800 mb-2">
              {currentContent.fullName}
            </label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              required
              className="w-full h-12 text-lg font-semibold text-gray-900 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200 placeholder:text-gray-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-2">
              {currentContent.email}
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
              className="w-full h-12 text-lg font-semibold text-gray-900 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200 placeholder:text-gray-500"
              placeholder="Enter your email address"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-2">
              {currentContent.password}
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
                className="w-full h-12 text-lg font-semibold text-gray-900 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200 pr-12 placeholder:text-gray-500"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-800 mb-2">
              {currentContent.confirmPassword}
            </label>
            <Input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              required
              className="w-full h-12 text-lg font-semibold text-gray-900 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200 placeholder:text-gray-500"
              placeholder="Confirm your password"
            />
          </div>

          <div>
            <label htmlFor="bvn" className="block text-sm font-semibold text-gray-800 mb-2">
              {currentContent.bvn}
            </label>
            <Input
              id="bvn"
              type="text"
              value={formData.bvn}
              onChange={(e) => handleChange('bvn', e.target.value)}
              className="w-full h-12 text-lg font-semibold text-gray-900 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200 placeholder:text-gray-500"
              placeholder="Enter your BVN (optional)"
            />
          </div>

          <div>
            <label htmlFor="cacNumber" className="block text-sm font-semibold text-gray-800 mb-2">
              {currentContent.cacNumber}
            </label>
            <Input
              id="cacNumber"
              type="text"
              value={formData.cacNumber}
              onChange={(e) => handleChange('cacNumber', e.target.value)}
              className="w-full h-12 text-lg font-semibold text-gray-900 border-2 border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-lg transition-all duration-200 placeholder:text-gray-500"
              placeholder="Enter your CAC number (optional)"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none" 
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                Creating account...
              </>
            ) : (
              currentContent.createAccount
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <p className="text-gray-600">
            {currentContent.haveAccount}{' '}
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-md border border-gray-300 px-2 py-1 text-sm font-semibold text-blue-700 bg-white hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              {currentContent.signIn}
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
