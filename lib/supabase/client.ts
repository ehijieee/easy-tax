import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string
          full_name: string | null
          bvn: string | null
          cac_number: string | null
          subscription_status: boolean
          subscription_expiry: string | null
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash: string
          full_name?: string | null
          bvn?: string | null
          cac_number?: string | null
          subscription_status?: boolean
          subscription_expiry?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string
          full_name?: string | null
          bvn?: string | null
          cac_number?: string | null
          subscription_status?: boolean
          subscription_expiry?: string | null
          created_at?: string
        }
      }
      tax_calculations: {
        Row: {
          id: string
          user_id: string | null
          income: number | null
          business_type: string | null
          occupation: string | null
          federal_tax: number | null
          state_tax: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          income?: number | null
          business_type?: string | null
          occupation?: string | null
          federal_tax?: number | null
          state_tax?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          income?: number | null
          business_type?: string | null
          occupation?: string | null
          federal_tax?: number | null
          state_tax?: number | null
          created_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string | null
          amount: number
          commission: number
          government_account: string | null
          payment_reference: string | null
          receipt_url: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          amount: number
          commission?: number
          government_account?: string | null
          payment_reference?: string | null
          receipt_url?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          amount?: number
          commission?: number
          government_account?: string | null
          payment_reference?: string | null
          receipt_url?: string | null
          status?: string
          created_at?: string
        }
      }
      educational_content: {
        Row: {
          id: string
          title: string | null
          language: string | null
          content_type: string | null
          content_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title?: string | null
          language?: string | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string | null
          language?: string | null
          content_type?: string | null
          content_url?: string | null
          created_at?: string
        }
      }
    }
  }
}
