'use server'

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { differenceInDays } from 'date-fns'
import { Resend } from 'resend';
import BookingReceipt from '@/components/emails/booking-receipt';

// Ensure your environment variables are set!
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-01-28.clover', 
})

export async function createBooking(
  formData: FormData, 
  startDate: Date | undefined, 
  endDate: Date | undefined, 
  mode: 'charter' | 'hotel' | 'expedition'
) {
  console.log("Received Booking Request:")
  if (!startDate) return { success: false, error: "No start date selected" }

  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const timeSlot = formData.get('timeSlot') as string
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Catch the Captain toggle from the frontend
  const isExperiencedCaptain = formData.get('isExperiencedCaptain') === 'true';

  // Default to 5 guests for expedition based on the rules
  const rawGuests = formData.get('guestCount')
  const guestCount = rawGuests ? Number(rawGuests) : (mode === 'expedition' ? 5 : 1)

  let startTimestamp = new Date(startDate)
  let endTimestamp = (mode !== 'charter' && endDate) ? new Date(endDate) : new Date(startDate)

  let calculatedPrice = 0
  let description = ""

  // --- 2. USD PRICE CALCULATION LOGIC ---
  if (mode === 'charter') {
    const [hours] = timeSlot ? timeSlot.split(':').map(Number) : [9]
    startTimestamp.setHours(hours, 0, 0)
    endTimestamp.setHours(hours + 4, 0, 0)
    
    calculatedPrice = 4000 // $4,000 USD Fixed Day Rate
    description = `Helgeland Coast Charter: ${startDate.toDateString()} @ ${timeSlot}`

  } else if (mode === 'hotel') {
    startTimestamp.setHours(15, 0, 0)
    endTimestamp.setHours(15, 0, 0)
    
    const nights = differenceInDays(endTimestamp, startTimestamp)
    if (nights < 1) return { success: false, error: "Stay must be at least 1 night" }

    calculatedPrice = nights * 600 // $600 USD per night
    description = `Catamaran Stay: ${nights} Nights`

  } else if (mode === 'expedition') {
    startTimestamp.setHours(12, 0, 0)
    endTimestamp.setHours(12, 0, 0)
    
    const days = Math.max(1, differenceInDays(endTimestamp, startTimestamp))
    
    if (isExperiencedCaptain) {
      // --- NEW: HELGELAND COAST SEASONAL BAREBOAT PRICING ---
      const bookingMonth = startTimestamp.getMonth() + 1; // getMonth is 0-indexed
      let weeklyRate = 4000; // Default fallback

      if (bookingMonth === 5) {
        weeklyRate = 4000; // May
      } else if (bookingMonth === 6) {
        weeklyRate = 5000; // June
      } else if (bookingMonth === 7) {
        weeklyRate = 6000; // July
      }

      const weeks = Math.max(1, Math.round(days / 7))
      calculatedPrice = weeks * weeklyRate 
      
      // Update description to show the month so the customer understands the tier
      const monthName = startTimestamp.toLocaleString('en-US', { month: 'long' });
      description = `Helgeland Coast Bareboat: ${weeks} Weeks in ${monthName}`
      
    } else {
      // FULL BOARD LOGIC: $400 per person per day
      calculatedPrice = days * guestCount * 400
      description = `Helgeland Coast Expedition: ${days} Days for ${guestCount} Guests (Includes Captain)`
    }
  }

  console.log("Calculated Price (USD):", calculatedPrice)

  // --- 3. THE SAFETY NET ---
  if (calculatedPrice <= 0) {
    return { success: false, error: "Price calculation failed ($0). Please check dates." }
  }

  // --- 4. DATABASE INSERT ---
  const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: name,
      customer_email: email,
      booking_type: mode,
      duration: `[${startTimestamp.toISOString()}, ${endTimestamp.toISOString()})`,
      total_price: calculatedPrice * 100, // Store in US Cents
      status: 'pending'
    })
    .select()
    .single()

  if (error) {
    console.error("Supabase Error:", error)
    return { success: false, error: error.message }
  }

  if (booking) {
    // --- 5. SEND RESEND EMAIL ---
    await resend.emails.send({
      from: 'Valhalla Voyage <onboarding@resend.dev>', // Change when you verify a domain
      to: email, 
      subject: 'Your Helgeland Coast Reservation',
      react: BookingReceipt({
        customerName: name,
        bookingType: mode,
        dateRange: `${startDate?.toLocaleDateString()} - ${endDate?.toLocaleDateString()}`,
        totalPrice: `$${calculatedPrice.toLocaleString()} USD`,
        bookingId: booking.id,
        guestCount: guestCount,                   
        isExperiencedCaptain: isExperiencedCaptain
      }),
    });
  }

  // --- 6. STRIPE CHECKOUT ---
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              // Branded Product Names
              name: mode === 'expedition' ? "Helgeland Coast Expedition" : (mode === 'charter' ? "Helgeland Charter" : "Valhalla Suite"),
              description: description,
            },
            unit_amount: calculatedPrice * 100, // Amount in US cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?booking_id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      customer_email: email,
      metadata: { 
        booking_id: booking.id,
        customer_name: name,
        booking_type: mode,
        is_experienced_captain: isExperiencedCaptain.toString(),
        start_date: startDate.toISOString(), 
        end_date: endDate?.toISOString() || startDate.toISOString()
      },
    })

    if (session.url) {
      return { success: true, redirectUrl: session.url }
    }
  } catch (e: any) {
    console.error("Stripe Error:", e)
    return { success: false, error: e.message }
  }

  return { success: false, error: "Unknown error occurred" }
}