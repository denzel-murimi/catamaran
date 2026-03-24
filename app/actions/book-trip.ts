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
  mode: string // We keep this parameter so we don't break the frontend, but we ignore it!
) {
  console.log("Received Booking Request:")
  if (!startDate || !endDate) return { success: false, error: "No valid date range selected" }

  const email = formData.get('email') as string
  const name = formData.get('name') as string
  const resend = new Resend(process.env.RESEND_API_KEY);
  
  // Catch the Captain toggle from the frontend
  const isExperiencedCaptain = formData.get('isExperiencedCaptain') === 'true';

  // Default to 5 guests based on Fred's rules
  const rawGuests = formData.get('guestCount')
  const guestCount = rawGuests ? Number(rawGuests) : 5

  let startTimestamp = new Date(startDate)
  let endTimestamp = new Date(endDate)
  
  // Expeditions standardize to a noon check-in/check-out
  startTimestamp.setHours(12, 0, 0)
  endTimestamp.setHours(12, 0, 0)

  let calculatedPrice = 0
  let description = ""

  const days = Math.max(1, differenceInDays(endTimestamp, startTimestamp))
  
  // --- 2. USD PRICE CALCULATION LOGIC ---
  if (isExperiencedCaptain) {
    // --- HELGELAND COAST SEASONAL BAREBOAT PRICING ---
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
    // --- FULL BOARD LOGIC: $400 per person per day ---
    calculatedPrice = days * guestCount * 400
    description = `Helgeland Coast Expedition: ${days} Days for ${guestCount} Guests (Includes Captain)`
  }

  console.log("Calculated Price (USD):", calculatedPrice)

  // --- 3. THE SAFETY NET ---
  if (calculatedPrice <= 0) {
    return { success: false, error: "Price calculation failed ($0). Please check dates." }
  }

  // --- 4. DATABASE INSERT ---
  // We dynamically set the booking type so Fred knows exactly what they bought
  const finalBookingType = isExperiencedCaptain ? 'bareboat' : 'all-inclusive';

 const { data: booking, error } = await supabase
    .from('bookings')
    .insert({
      customer_name: name,
      customer_email: email,
      booking_type: finalBookingType, // Now clearly states 'bareboat' or 'all-inclusive'
      guest_count: guestCount,        // NEW: Saves the exact number of guests to Supabase
      duration: `[${startTimestamp.toISOString()}, ${endTimestamp.toISOString()})`,
      total_price: calculatedPrice * 100, // Store in US Cents
      status: 'pending'
    })
    .select()
    .single()

  // --- THE NEW ERROR INTERCEPTOR ---
  if (error) {
    // Keep the raw error in your server logs for debugging
    console.error("Supabase Error:", error)
    
    // Check if it's the specific double-booking constraint
    if (error.message.includes('no_double_bookings')) {
      return { 
        success: false, 
        error: "Oops! Those dates are already booked. Please select a different available date range." 
      }
    }

    // Generic fallback for any other unexpected database issues
    return { 
      success: false, 
      error: "Something went wrong processing your request. Please try again or contact us." 
    }
  }

  if (booking) {
    // --- 5. SEND RESEND EMAIL ---
    await resend.emails.send({
      from: 'Valhalla Voyage <bookings@sailinghelgeland.com>', // Change when you verify a domain
      to: email, 
      subject: 'Your Helgeland Coast Reservation',
      react: BookingReceipt({
        customerName: name,
        bookingType: finalBookingType,
        dateRange: `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`,
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
              // Branded Product Names based on their exact choice
              name: isExperiencedCaptain ? "Valhalla Bareboat Charter" : "Valhalla All-Inclusive Expedition",
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
      // Pass this clean data over to Stripe so it shows up on Fred's financial receipts
      metadata: { 
        booking_id: booking.id,
        customer_name: name,
        booking_type: finalBookingType,
        guest_count: guestCount.toString(),
        start_date: startDate.toISOString(), 
        end_date: endDate.toISOString()
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