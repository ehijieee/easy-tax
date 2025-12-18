'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  FileText, 
  Plus, 
  Edit, 
  Trash2,
  BarChart3,
  DollarSign,
  UserCheck,
  Volume2,
  VolumeX
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface DashboardStats {
  totalUsers: number
  totalTransactions: number
  totalRevenue: number
  activeSubscriptions: number
}

interface EducationalContent {
  id: string
  title: string
  language: string
  content_type: string
  content_url: string
  created_at: string
}

export default function AdminPage() {
  const [language, setLanguage] = useState<'english' | 'pidgin'>('english')
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalTransactions: 0,
    totalRevenue: 0,
    activeSubscriptions: 0
  })
  const [content, setContent] = useState<EducationalContent[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'analytics'>('overview')
  const router = useRouter()
  const supabase = createClient()

  const contentData = {
    english: {
      title: 'Admin Dashboard',
      subtitle: 'Manage EasyTax platform content and analytics',
      overview: 'Overview',
      content: 'Content Management',
      analytics: 'Analytics',
      totalUsers: 'Total Users',
      totalTransactions: 'Total Transactions',
      totalRevenue: 'Total Revenue',
      activeSubscriptions: 'Active Subscriptions',
      recentContent: 'Recent Content',
      addContent: 'Add Content',
      edit: 'Edit',
      delete: 'Delete',
      titleLabel: 'Title',
      languageLabel: 'Language',
      typeLabel: 'Content Type',
      urlLabel: 'Content URL',
      save: 'Save',
      cancel: 'Cancel'
    },
    pidgin: {
      title: 'Admin Dashboard',
      subtitle: 'Manage EasyTax platform content and analytics',
      overview: 'Overview',
      content: 'Content Management',
      analytics: 'Analytics',
      totalUsers: 'Total Users',
      totalTransactions: 'Total Transactions',
      totalRevenue: 'Total Revenue',
      activeSubscriptions: 'Active Subscriptions',
      recentContent: 'Recent Content',
      addContent: 'Add Content',
      edit: 'Edit',
      delete: 'Delete',
      titleLabel: 'Title',
      languageLabel: 'Language',
      typeLabel: 'Content Type',
      urlLabel: 'Content URL',
      save: 'Save',
      cancel: 'Cancel'
    }
  }

  const currentContent = contentData[language]

  useEffect(() => {
    checkAuth()
    fetchData()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth/login')
      return
    }

    // Check if user is admin (simplified check)
    const { data: adminData } = await supabase
      .from('admin')
      .select('*')
      .eq('email', user.email)
      .single()

    if (!adminData) {
      router.push('/dashboard')
      return
    }
  }

  const fetchData = async () => {
    try {
      // Fetch stats
      const [usersResult, paymentsResult, subscriptionsResult] = await Promise.all([
        supabase.from('users').select('id', { count: 'exact' }),
        supabase.from('payments').select('amount, status', { count: 'exact' }),
        supabase.from('users').select('subscription_status', { count: 'exact' }).eq('subscription_status', true)
      ])

      const totalUsers = usersResult.count || 0
      const totalTransactions = paymentsResult.count || 0
      const totalRevenue = paymentsResult.data?.reduce((sum, payment) => 
        payment.status === 'completed' ? sum + payment.amount : sum, 0) || 0
      const activeSubscriptions = subscriptionsResult.count || 0

      setStats({
        totalUsers,
        totalTransactions,
        totalRevenue,
        activeSubscriptions
      })

      // Fetch content
      const { data: contentData } = await supabase
        .from('educational_content')
        .select('*')
        .order('created_at', { ascending: false })

      setContent(contentData || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const { error } = await supabase
        .from('educational_content')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting content:', error)
      } else {
        setContent(prev => prev.filter(item => item.id !== id))
      }
    } catch (error) {
      console.error('Error deleting content:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
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
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              {audioEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>
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

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: currentContent.overview, icon: BarChart3 },
                { id: 'content', label: currentContent.content, icon: FileText },
                { id: 'analytics', label: currentContent.analytics, icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{currentContent.totalUsers}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{currentContent.totalTransactions}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <DollarSign className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{currentContent.totalRevenue}</p>
                      <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <UserCheck className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{currentContent.activeSubscriptions}</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Content */}
            <Card>
              <CardHeader>
                <CardTitle>{currentContent.recentContent}</CardTitle>
                <CardDescription>Latest educational content added to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {content.slice(0, 5).map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">
                          {item.language} • {item.content_type} • {formatDate(item.created_at)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={() => handleDeleteContent(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Content Management Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">{currentContent.content}</h2>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {currentContent.addContent}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>
                      {item.language} • {item.content_type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      Added: {formatDate(item.created_at)}
                    </p>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        {currentContent.edit}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteContent(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - User growth over time
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Revenue trends
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
