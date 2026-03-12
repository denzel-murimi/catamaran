'use client'

import { createManualBooking } from '@/app/actions/create-manual-booking'
import { useState } from 'react'

export default function AdminBookingForm() {
  const [isOpen, setIsOpen] = useState(false)

  async function handleSubmit(formData: FormData) {
    const res = await createManualBooking(formData)
    if (res.success) {
      setIsOpen(false)
      alert('Block created successfully')
    } else {
      alert('Error: ' + res.error)
    }
  }

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="mb-8 bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
      >
        <span className="text-xl">+</span> New Manual Booking / Block Date
      </button>
    )
  }

  return (
    <div className="mb-8 bg-slate-900 border border-white/10 p-6 rounded-xl animate-in fade-in slide-in-from-top-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-white">Manual Override</h3>
        <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">✕</button>
      </div>

      {/* Expanded grid to 6 columns to fit the new Guests field perfectly */}
      <form action={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        
        {/* 1. Name */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Guest / Reason</label>
          <input name="name" type="text" placeholder="e.g. Engine Service" required 
            className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white text-sm focus:ring-1 focus:ring-amber-500 outline-none" />
        </div>

        {/* 2. Type */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Type</label>
          <select name="type" className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white text-sm focus:ring-1 focus:ring-amber-500 outline-none">
            <option value="maintenance">Maintenance (Block)</option>
            <option value="bareboat">Bareboat Charter</option>
            <option value="all-inclusive">All-Inclusive Expedition</option>
          </select>
        </div>

        {/* NEW: 3. Guests */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Guests</label>
          <input name="guestCount" type="number" min="0" max="10" defaultValue="0" required 
            className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white text-sm focus:ring-1 focus:ring-amber-500 outline-none" />
        </div>

        {/* 4. Dates */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Start (ISO)</label>
          <input name="start" type="datetime-local" required 
            className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white text-sm focus:ring-1 focus:ring-amber-500 outline-none" />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">End (ISO)</label>
          <input name="end" type="datetime-local" required 
            className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white text-sm focus:ring-1 focus:ring-amber-500 outline-none" />
        </div>

        {/* 5. Price & Submit */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Price (USD)</label>
          <div className="flex gap-2">
            <input name="price" type="number" defaultValue="0" 
              className="w-full bg-slate-800 border border-white/10 rounded p-2 text-white text-sm focus:ring-1 focus:ring-amber-500 outline-none" />
            <button className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 rounded transition">
              Add
            </button>
          </div>
        </div>

      </form>
    </div>
  )
}