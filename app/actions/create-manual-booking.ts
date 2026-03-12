'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createManualBooking(formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string // Now perfectly accepts 'maintenance', 'bareboat', or 'all-inclusive'
  const guestCount = Number(formData.get('guestCount') || 0) // NEW: Catches the guests from the admin panel
  const start = formData.get('start') as string
  const end = formData.get('end') as string
  const price = formData.get('price') as string
  
  // Format the Postgres Range: [start, end)
  // We assume the admin enters ISO strings or simpler date inputs
  const startTime = new Date(start)
  const endTime = new Date(end)
  
  // DB Insert
  const { error } = await supabase
    .from('bookings')
    .insert({
      customer_name: name,
      customer_email: 'admin@internal', // Placeholder for manual blocks
      booking_type: type, // We pass the exact type directly since we removed the old database constraints
      guest_count: guestCount, // NEW: Saves the guest count to your new Supabase column
      duration: `[${startTime.toISOString()}, ${endTime.toISOString()})`,
      total_price: Number(price) * 100, // Convert to minor units
      status: 'confirmed' // Skip pending, go straight to confirmed so it locks the public calendar
    })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/admin')
  return { success: true }
}