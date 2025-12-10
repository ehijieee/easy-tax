import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { PaymentService } from '@/lib/payment'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get('reference') || searchParams.get('tx_ref')
    const provider = searchParams.get('provider') || 'paystack'

    if (!reference) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error&message=No reference provided`)
    }

    // Verify payment
    const paymentService = new PaymentService()
    const result = await paymentService.verifyPayment(provider as 'paystack' | 'flutterwave', reference)

    const supabase = await createClient()

    if (result.success) {
      // Update payment status in database
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: 'completed',
          receipt_url: `${process.env.NEXT_PUBLIC_BASE_URL}/receipts/${reference}`
        })
        .eq('payment_reference', reference)

      if (updateError) {
        console.error('Database update error:', updateError)
      }

      // Send confirmation email (implement email service)
      // await sendPaymentConfirmationEmail(user.email, paymentData)

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success&reference=${reference}`)
    } else {
      // Update payment status to failed
      await supabase
        .from('payments')
        .update({ status: 'failed' })
        .eq('payment_reference', reference)

      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error&message=${encodeURIComponent(result.message || 'Payment failed')}`)
    }

  } catch (error) {
    console.error('Payment callback error:', error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=error&message=Internal server error`)
  }
}
