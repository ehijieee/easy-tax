// Payment integration utilities for Paystack and Flutterwave

export interface PaymentData {
  amount: number
  email: string
  reference: string
  metadata?: Record<string, any>
}

export interface PaymentResult {
  success: boolean
  reference?: string
  message?: string
  authorization_url?: string
}

// Paystack integration
export class PaystackPayment {
  private secretKey: string
  private publicKey: string

  constructor() {
    this.secretKey = process.env.PAYSTACK_SECRET_KEY || ''
    this.publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''
  }

  async initializePayment(data: PaymentData): Promise<PaymentResult> {
    try {
      const response = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: data.amount * 100, // Convert to kobo
          email: data.email,
          reference: data.reference,
          metadata: data.metadata,
          callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
        }),
      })

      const result = await response.json()

      if (result.status) {
        return {
          success: true,
          reference: result.data.reference,
          authorization_url: result.data.authorization_url,
        }
      } else {
        return {
          success: false,
          message: result.message || 'Payment initialization failed',
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
      }
    }
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
        },
      })

      const result = await response.json()

      if (result.status && result.data.status === 'success') {
        return {
          success: true,
          reference: result.data.reference,
        }
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
      }
    }
  }
}

// Flutterwave integration
export class FlutterwavePayment {
  private secretKey: string
  private publicKey: string

  constructor() {
    this.secretKey = process.env.FLUTTERWAVE_SECRET_KEY || ''
    this.publicKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || ''
  }

  async initializePayment(data: PaymentData): Promise<PaymentResult> {
    try {
      const response = await fetch('https://api.flutterwave.com/v3/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx_ref: data.reference,
          amount: data.amount,
          currency: 'NGN',
          redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
          customer: {
            email: data.email,
          },
          meta: data.metadata,
        }),
      })

      const result = await response.json()

      if (result.status === 'success') {
        return {
          success: true,
          reference: result.data.tx_ref,
          authorization_url: result.data.link,
        }
      } else {
        return {
          success: false,
          message: result.message || 'Payment initialization failed',
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
      }
    }
  }

  async verifyPayment(reference: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`https://api.flutterwave.com/v3/transactions/${reference}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.secretKey}`,
        },
      })

      const result = await response.json()

      if (result.status === 'success' && result.data.status === 'successful') {
        return {
          success: true,
          reference: result.data.tx_ref,
        }
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
        }
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error occurred',
      }
    }
  }
}

// Payment service factory
export class PaymentService {
  private paystack: PaystackPayment
  private flutterwave: FlutterwavePayment

  constructor() {
    this.paystack = new PaystackPayment()
    this.flutterwave = new FlutterwavePayment()
  }

  async initializePayment(
    provider: 'paystack' | 'flutterwave',
    data: PaymentData
  ): Promise<PaymentResult> {
    if (provider === 'paystack') {
      return this.paystack.initializePayment(data)
    } else {
      return this.flutterwave.initializePayment(data)
    }
  }

  async verifyPayment(
    provider: 'paystack' | 'flutterwave',
    reference: string
  ): Promise<PaymentResult> {
    if (provider === 'paystack') {
      return this.paystack.verifyPayment(reference)
    } else {
      return this.flutterwave.verifyPayment(reference)
    }
  }
}

// Utility functions
export function generatePaymentReference(): string {
  return `EASYTAX_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function calculateCommission(amount: number): number {
  return 600 // Fixed ₦600 commission as per PRD
}

export function calculateTotalAmount(taxAmount: number): number {
  return taxAmount + calculateCommission(taxAmount)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}
