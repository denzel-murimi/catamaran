import { createClient } from '@supabase/supabase-js'
import HomeClient from '@/components/home-client'

export const dynamic = 'force-dynamic' // Forces Vercel to always fetch fresh dates

// Initialize Supabase with the public ANON key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default async function Home() {
  // 1. Fetch the blocked dates securely on the server
  const { data: bookedDates } = await supabase
    .from('bookings')
    .select('duration')
    .in('status', ['confirmed', 'paid']) // Only block dates that are actually finalized!

  // 2. Render the client layout and hand it the dates
  return <HomeClient bookedDates={bookedDates || []} />
}