import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PaymentService, generatePaymentReference, calculateCommission } from '@/lib/payment'

export async function POST(request: NextRequest) {
  try {
    const { amount, provider = 'paystack' } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    // Get user from session
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Generate payment reference
    const reference = generatePaymentReference()
    const commission = calculateCommission(amount)
    const totalAmount = amount + commission

    // Initialize payment
    const paymentService = new PaymentService()
    const result = await paymentService.initializePayment(provider, {
      amount: totalAmount,
      email: user.email!,
      reference,
      metadata: {
        user_id: user.id,
        tax_amount: amount,
        commission,
        provider
      }
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.message || 'Payment initialization failed' },
        { status: 400 }
      )
    }

    // Save payment record to database
    const { error: dbError } = await supabase
      .from('payments')
      .insert({
        user_id: user.id,
        amount: totalAmount,
        commission,
        payment_reference: reference,
        status: 'pending'
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Failed to save payment record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reference: result.reference,
      authorization_url: result.authorization_url,
      amount: totalAmount,
      commission
    })

  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
