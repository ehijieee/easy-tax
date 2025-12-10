export interface User {
  id: string
  email: string
  full_name?: string
  bvn?: string
  cac_number?: string
  subscription_status: boolean
  subscription_expiry?: string
  created_at: string
}

export interface TaxCalculation {
  id: string
  user_id?: string
  income: number
  business_type?: string
  occupation?: string
  federal_tax: number
  state_tax: number
  created_at: string
}

export interface Payment {
  id: string
  user_id?: string
  amount: number
  commission: number
  government_account?: string
  payment_reference?: string
  receipt_url?: string
  status: 'pending' | 'completed' | 'failed'
  created_at: string
}

export interface EducationalContent {
  id: string
  title: string
  language: 'english' | 'pidgin'
  content_type: 'article' | 'video' | 'audio' | 'infographic'
  content_url?: string
  created_at: string
}

export type Language = 'english' | 'pidgin'

export interface DashboardStats {
  totalUsers: number
  totalTransactions: number
  totalRevenue: number
  activeSubscriptions: number
}
