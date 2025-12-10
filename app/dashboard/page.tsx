'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  CreditCard, 
  Calculator, 
  FileText, 
  Bell, 
  Download, 
  Volume2, 
  VolumeX,
  TrendingUp,
  Calendar,
  Shield,
  User
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface User {
  id: string
  email: string
  full_name: string
  subscription_status: boolean
  subscription_expiry: string
}

interface Payment {
  id: string
  amount: number
  commission: number
  status: string
  created_at: string
  payment_reference: string
}

interface TaxCalculation {
  id: string
  income: number
  federal_tax: number
  state_tax: number
  created_at: string
}

export default function DashboardPage() {
  const [language, setLanguage] = useState<'english' | 'pidgin'>('english')
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [payments, setPayments] = useState<Payment[]>([])
  const [calculations, setCalculations] = useState<TaxCalculation[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const content = {
    english: {
      title: 'Your Tax Dashboard',
      subtitle: 'Manage your tax calculations, payments, and compliance',
      welcome: 'Welcome back',
      subscription: 'Subscription Status',
      active: 'Active',
      expired: 'Expired',
      renew: 'Renew Subscription',
      recentPayments: 'Recent Payments',
      taxCalculations: 'Tax Calculations',
      upcomingDeadlines: 'Upcoming Deadlines',
      reminders: 'Tax Reminders',
      downloadReport: 'Download Report',
      calculateTax: 'Calculate Tax',
      makePayment: 'Make Payment',
      viewAll: 'View All',
      noPayments: 'No payments yet',
      noCalculations: 'No calculations yet',
      totalPaid: 'Total Paid',
      totalCalculated: 'Total Calculated',
      nextDeadline: 'Next Deadline',
      daysRemaining: 'days remaining'
    },
    pidgin: {
      title: 'Your Tax Dashboard',
      subtitle: 'Manage your tax calculations, payments, and compliance',
      welcome: 'Welcome back',
      subscription: 'Subscription Status',
      active: 'Active',
      expired: 'Expired',
      renew: 'Renew Subscription',
      recentPayments: 'Recent Payments',
      taxCalculations: 'Tax Calculations',
      upcomingDeadlines: 'Upcoming Deadlines',
      reminders: 'Tax Reminders',
      downloadReport: 'Download Report',
      calculateTax: 'Calculate Tax',
      makePayment: 'Make Payment',
      viewAll: 'View All',
      noPayments: 'No payments yet',
      noCalculations: 'No calculations yet',
      totalPaid: 'Total Paid',
      totalCalculated: 'Total Calculated',
      nextDeadline: 'Next Deadline',
      daysRemaining: 'days remaining'
    }
  }

  const currentContent = content[language]

  useEffect(() => {
    checkAuth()
    fetchUserData()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
    }
  }

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch user profile
      const { data: userData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (userData) {
        setUser(userData)
      }

      // Fetch payments
      const { data: paymentsData } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (paymentsData) {
        setPayments(paymentsData)
      }

      // Fetch tax calculations
      const { data: calculationsData } = await supabase
        .from('tax_calculations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (calculationsData) {
        setCalculations(calculationsData)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalCalculated = calculations.reduce((sum, calc) => sum + (calc.federal_tax + calc.state_tax), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Language Toggle */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                onClick={() => setLanguage('english')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  language === 'english' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('pidgin')}
                className={`px-3 py-1 rounded text-sm font-medium ${
                  language === 'pidgin' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Pidgin
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </button>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {currentContent.title}
          </h1>
          <p className="text-gray-600">
            {currentContent.subtitle}
          </p>
        </div>

        {/* Welcome Section */}
        <div className="mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {currentContent.welcome}, {user?.full_name || user?.email}!
                  </h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Shield className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">
                        {currentContent.subscription}: 
                        <span className={`ml-1 font-medium ${
                          user?.subscription_status ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {user?.subscription_status ? currentContent.active : currentContent.expired}
                        </span>
                      </span>
                    </div>
                    {!user?.subscription_status && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        {currentContent.renew}
                      </Button>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={() => router.push('/calculator')} variant="outline">
                    <Calculator className="w-4 h-4 mr-2" />
                    {currentContent.calculateTax}
                  </Button>
                  <Button onClick={() => router.push('/education')} variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Learn
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentContent.totalPaid}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalPaid)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentContent.totalCalculated}</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalCalculated)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{currentContent.nextDeadline}</p>
                  <p className="text-2xl font-bold text-gray-900">45 {currentContent.daysRemaining}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Payments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentContent.recentPayments}</CardTitle>
                  <CardDescription>Your latest tax payments</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  {currentContent.viewAll}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {payments.length > 0 ? (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <CreditCard className="w-5 h-5 text-green-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                          <p className="text-sm text-gray-500">{formatDate(payment.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          payment.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">{payment.payment_reference}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{currentContent.noPayments}</p>
                  <Button className="mt-4" onClick={() => router.push('/calculator')}>
                    {currentContent.makePayment}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tax Calculations */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentContent.taxCalculations}</CardTitle>
                  <CardDescription>Your recent tax calculations</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  {currentContent.viewAll}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {calculations.length > 0 ? (
                <div className="space-y-4">
                  {calculations.map((calc) => (
                    <div key={calc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <Calculator className="w-5 h-5 text-blue-600 mr-3" />
                        <div>
                          <p className="font-medium text-gray-900">{formatCurrency(calc.federal_tax + calc.state_tax)}</p>
                          <p className="text-sm text-gray-500">{formatDate(calc.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Income: {formatCurrency(calc.income)}</p>
                        <Button size="sm" variant="outline">
                          <Download className="w-3 h-3 mr-1" />
                          {currentContent.downloadReport}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calculator className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">{currentContent.noCalculations}</p>
                  <Button className="mt-4" onClick={() => router.push('/calculator')}>
                    {currentContent.calculateTax}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Reminders Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="w-5 h-5 mr-2" />
              {currentContent.reminders}
            </CardTitle>
            <CardDescription>Important tax deadlines and reminders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Calendar className="w-5 h-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-yellow-800">Personal Income Tax Deadline</p>
                  <p className="text-sm text-yellow-600">March 31, 2024 - 45 days remaining</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium text-blue-800">Company Tax Filing</p>
                  <p className="text-sm text-blue-600">June 30, 2024 - 135 days remaining</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
