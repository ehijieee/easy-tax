'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CreditCard, Loader2, Shield, AlertCircle } from 'lucide-react'
import { formatCurrency, calculateCommission } from '@/lib/payment'

interface PaymentFormProps {
  taxAmount: number
  language: 'english' | 'pidgin'
}

export function PaymentForm({ taxAmount, language }: PaymentFormProps) {
  const [provider, setProvider] = useState<'paystack' | 'flutterwave'>('paystack')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const commission = calculateCommission(taxAmount)
  const totalAmount = taxAmount + commission

  const content = {
    english: {
      title: 'Complete Your Tax Payment',
      description: 'Pay securely to official government accounts',
      taxAmount: 'Tax Amount',
      commission: 'Service Fee',
      total: 'Total Amount',
      provider: 'Payment Provider',
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      payNow: 'Pay Now',
      processing: 'Processing payment...',
      secure: 'Your payment is secured with SSL encryption',
      error: 'Payment failed. Please try again.'
    },
    pidgin: {
      title: 'Complete Your Tax Payment',
      description: 'Pay secure to government accounts',
      taxAmount: 'Tax Amount',
      commission: 'Service Fee',
      total: 'Total Amount',
      provider: 'Payment Provider',
      paystack: 'Paystack',
      flutterwave: 'Flutterwave',
      payNow: 'Pay Now',
      processing: 'Processing payment...',
      secure: 'Your payment dey secured with SSL encryption',
      error: 'Payment fail. Try again.'
    }
  }

  const currentContent = content[language]

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/login')
        return
      }

      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: taxAmount,
          provider
        })
      })

      const result = await response.json()

      if (result.success && result.authorization_url) {
        // Redirect to payment gateway
        window.location.href = result.authorization_url
      } else {
        setError(result.error || currentContent.error)
      }
    } catch (error) {
      setError(currentContent.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          {currentContent.title}
        </CardTitle>
        <CardDescription>{currentContent.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">{currentContent.taxAmount}</span>
            <span className="font-medium">{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{currentContent.commission}</span>
            <span className="font-medium">{formatCurrency(commission)}</span>
          </div>
          <div className="border-t pt-3">
            <div className="flex justify-between text-lg font-bold">
              <span>{currentContent.total}</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Payment Provider Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {currentContent.provider}
          </label>
          <Select value={provider} onValueChange={(value: 'paystack' | 'flutterwave') => setProvider(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paystack">{currentContent.paystack}</SelectItem>
              <SelectItem value="flutterwave">{currentContent.flutterwave}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Security Notice */}
        <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
          <Shield className="w-5 h-5 text-green-600 mr-2" />
          <span className="text-sm text-green-800">{currentContent.secure}</span>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm text-red-800">{error}</span>
          </div>
        )}

        {/* Payment Button */}
        <Button 
          onClick={handlePayment} 
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {currentContent.processing}
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              {currentContent.payNow}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
