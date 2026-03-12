import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { updateBookingStatus } from '../../app/actions/manage-booking'
import AdminBookingForm from '@/components/admin-booking-form'
import AdminCalendar from '@/components/admin-calendar'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } } // No user session needed for admin view
)

export const dynamic = 'force-dynamic' // Ensure this page never caches

export default async function AdminDashboard() {
  // 1. Fetch All Bookings
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })

  if (!bookings) return <div className="p-10 text-white">No data found.</div>

  // 2. Calculate Metrics (The "Business" Logic)
  const totalRevenue = bookings
    .filter(b => b.status === 'confirmed' || b.status === 'paid') // Adjust based on your status
    .reduce((sum, b) => sum + (b.total_price / 100), 0) // Convert øre to NOK
  
  const pendingCount = bookings.filter(b => b.status === 'pending').length

 
  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif font-bold">Command Center</h1>
        <div className="text-sm text-gray-400">Yield Report: 2026</div>
      </div>

      {/* NEW: Manual Booking Form */}
      <div className="max-w-6xl mx-auto mb-8">
         <AdminBookingForm />
      </div>

      {/* NEW: THE VISUAL CORTEX (CALENDAR) */}
      <div className="max-w-6xl mx-auto mb-12">
        {/* We pass the same bookings data we fetched for the table */}
        <AdminCalendar bookings={bookings} />
      </div>

      {/* KPI Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-slate-900 border border-white/10 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Total Revenue</h3>
          <p className="text-4xl font-bold text-emerald-400">{totalRevenue.toLocaleString()} USD</p>
        </div>
        
        <div className="bg-slate-900 border border-white/10 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Pending Requests</h3>
          <p className="text-4xl font-bold text-amber-400">{pendingCount}</p>
        </div>

        <div className="bg-slate-900 border border-white/10 p-6 rounded-xl">
          <h3 className="text-gray-400 text-sm uppercase tracking-widest mb-2">Total Bookings</h3>
          <p className="text-4xl font-bold text-white">{bookings.length}</p>
        </div>
      </div>

      {/* The Manifest (Table) */}
      <div className="max-w-6xl mx-auto bg-slate-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          
          {/* 1. TABLE HEAD - Defines the columns clearly */}
          <thead>
            <tr className="bg-slate-950 border-b border-white/10 text-xs uppercase text-gray-400 tracking-wider">
              <th className="p-5 font-medium">Guest Details</th>
              <th className="p-5 font-medium">Type</th>
              <th className="p-5 font-medium">Dates</th>
              <th className="p-5 font-medium">Status</th>
              <th className="p-5 font-medium text-right">Revenue</th>
              <th className="p-5 font-medium text-right">Controls</th>
            </tr>
          </thead>

          {/* 2. TABLE BODY - The Data Loop */}
          <tbody className="divide-y divide-white/5">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-white/5 transition group">
                
                {/* Column 1: Guest */}
                <td className="p-5">
                  <div className="font-bold text-white">
                    {booking.customer_name || 'Anonymous'}
                  </div>
                  <div className="text-xs text-gray-500 font-mono mt-1">
                    {booking.customer_email}
                  </div>
                </td>

                {/* Column 2: Type */}
                <td className="p-5">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    booking.booking_type === 'charter' 
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                      : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                  }`}>
                    {booking.booking_type === 'charter' ? 'Day Charter' : 'Overnight'}
                  </span>
                </td>

                {/* Column 3: Dates */}
                <td className="p-5 text-sm text-gray-300">
                  {/* Clean up the Postgres timestamp format */}
                  {booking.duration 
                    ? new Date(booking.duration.split(',')[0].replace('[', '').replace('"', '')).toLocaleDateString()
                    : 'N/A'
                  }
                </td>

                {/* Column 4: Status */}
                <td className="p-5">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase px-2.5 py-1 rounded-full border ${
                    booking.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                    booking.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                    'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>
                    {/* Status Dot */}
                    <span className={`w-1.5 h-1.5 rounded-full ${
                       booking.status === 'confirmed' ? 'bg-emerald-400' : 
                       booking.status === 'cancelled' ? 'bg-red-400' :
                       'bg-amber-400'
                    }`}></span>
                    {booking.status}
                  </span>
                </td>

                {/* Column 5: Revenue */}
                <td className="p-5 text-right font-mono text-gray-300">
                  {(booking.total_price / 100).toLocaleString()} NOK
                </td>

                {/* Column 6: Actions (Buttons) */}
                <td className="p-5 text-right">
                  <div className="flex justify-end gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                    
                    {/* Confirm Button */}
                    <form action={updateBookingStatus}>
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input type="hidden" name="action" value="confirm" />
                      <button className="p-2 hover:bg-emerald-500/20 text-emerald-500 rounded-lg transition" title="Confirm Booking">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </button>
                    </form>

                    {/* Cancel Button */}
                    <form action={updateBookingStatus}>
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input type="hidden" name="action" value="cancel" />
                      <button className="p-2 hover:bg-red-500/20 text-red-500 rounded-lg transition" title="Cancel Booking">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </form>

                  </div>
                </td>
              </tr>
            ))}
            
            {/* Empty State Helper */}
            {bookings.length === 0 && (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-500">
                  No bookings found yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  )
}