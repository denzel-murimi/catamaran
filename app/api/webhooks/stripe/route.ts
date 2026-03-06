import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'
import BookingReceipt from '@/components/emails/booking-receipt'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover',
})
const resend = new Resend(process.env.RESEND_API_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// You will get this secret in the next step
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const incomingHeaders = await headers();
  const signature = incomingHeaders.get('stripe-signature') as string;

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
  }

  // EVENT: PAYMENT RECEIVED
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const meta = session.metadata

    if (meta?.booking_id) {
      // 1. Mark Database as CONFIRMED (Paid)
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'confirmed' })
        .eq('id', meta.booking_id)

      if (error) console.error('Supabase update failed:', error)

      // 2. Send the "Golden Ticket" Email
      // We use the data we packed into the metadata
      await resend.emails.send({
        from: 'Valhalla Voyage <onboarding@resend.dev>', // Update to your real domain later
        to: session.customer_details?.email || '',
        subject: 'Booking Confirmed - Valhalla Voyage',
        react: BookingReceipt({
            customerName: meta.customer_name,
            bookingType: meta.booking_type,
            dateRange: `${new Date(meta.start_date).toLocaleDateString()} - ${new Date(meta.end_date).toLocaleDateString()}`,
            totalPrice: `${(session.amount_total! / 100).toLocaleString()} NOK`,
            bookingId: meta.booking_id,
            guestCount: Number(meta.guest_count), 
            isExperiencedCaptain: meta.is_experienced_captain === 'true',
        }),
      })
    }
  }

  return new NextResponse('ok', { status: 200 })
}