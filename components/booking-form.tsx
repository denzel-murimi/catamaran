'use client'

import { useState, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { differenceInDays } from 'date-fns'
import 'react-day-picker/dist/style.css'
import { createBooking } from '@/app/actions/book-trip'
import { clsx } from 'clsx'
import { Users } from 'lucide-react'
import { useMode } from '@/components/mode-context'
import TermsModal from '@/components/terms-modal'
import { LangProvider } from './lang-context'
import { useLang } from '@/components/lang-context'
export default function BookingForm() {
  const { t, lang } = useLang()
  const [range, setRange] = useState<DateRange | undefined>()
  const [date, setDate] = useState<Date | undefined>()
  const [guests, setGuests] = useState(4) // Default to min required for Expedition
  const [showTerms, setShowTerms] = useState(false) // <--- 2. NEW STATE
  const [agreed, setAgreed] = useState(false)
  
  // Modes: 'charter' (Hourly), 'hotel' (Nightly Room), 'expedition' (Per Person All-Inclusive)
  const { mode, setMode } = useMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if (mode === 'charter') {
      setTotalPrice(40000) // Fixed boat rate
    } 
    else if (mode === 'hotel' && range?.from && range?.to) {
      const nights = differenceInDays(range.to, range.from)
      setTotalPrice(nights * 6000) // Fixed room rate
    } 
    else if (mode === 'expedition' && range?.from && range?.to) {
      const nights = differenceInDays(range.to, range.from)
      // 4,500 NOK per person per day
      setTotalPrice(nights * guests * 4500) 
    } 
    else {
      setTotalPrice(0)
    }
  }, [mode, range, date, guests])

 async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    // 1. DEFINE WHAT MODES USE A CALENDAR RANGE
    // Previously, you only checked for 'hotel'. Now we add 'expedition'.
    const isRangeMode = mode === 'hotel' || mode === 'expedition' // <--- FIX HERE
    
    // 2. SELECT THE CORRECT DATES BASED ON THAT MODE
    // If it's a range mode, grab the range. Otherwise, grab the single date.
    const startDate = isRangeMode ? range?.from : date
    const endDate = isRangeMode ? range?.to : date

    // 3. DEBUGGING (Optional: You can remove this after testing)
    console.log("Submitting Mode:", mode)
    console.log("Start:", startDate)
    console.log("End:", endDate)

    if (!startDate) {
        alert("Please select dates first")
        setIsSubmitting(false)
        return
    }

    // 4. APPEND GUEST COUNT
    formData.append('guestCount', guests.toString())

    // 5. SEND TO SERVER
    const result = await createBooking(formData, startDate, endDate, mode)
    
    if (result.success && result.redirectUrl) {
      window.location.href = result.redirectUrl
    } else {
      alert("Error: " + result.error)
      setIsSubmitting(false)
    }
  }

  const inputClasses = "w-full bg-slate-800/50 backdrop-blur-sm border border-white/10 text-white rounded-lg p-3 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"

  return (
    <LangProvider>
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 md:p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-right-8">
      
      {/* 1. Three-Way Toggle Switch */}
      <div className="grid grid-cols-2 sm:flex bg-slate-800/50 p-1 rounded-xl mb-6 overflow-hidden gap-1">
        {['charter', 'hotel', 'expedition'].map((m, i) => (
            <button
              key={m}
              onClick={() => { setMode(m as any); setRange(undefined); setDate(undefined); }}
              className={clsx(
                "sm:flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-lg",
                i === 2 && "col-span-2 sm:col-span-1",
                mode === m ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white border border-white/10"
              )}
            >
              {m === 'charter' ? t.booking.tabs.day : 
              m === 'hotel' ? t.booking.tabs.stay : 
              t.booking.tabs.adv}
            </button>
        ))}
      </div>

      {/* 2. Guest Slider (Only for Expedition) */}
      {mode === 'expedition' && (
        <div className="mb-6 bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-blue-200 flex items-center gap-2"><Users className="w-4 h-4"/> Guest Count</span>
            <span className="font-bold text-white">{guests} {t.booking.guests}</span>
          </div>
          <input 
            type="range" min="4" max="12" step="1" 
            value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}
            className="w-full accent-blue-400 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-[10px] text-blue-300/70 mt-2 text-center">
            *Includes Captain, Sea Fishing & Full Board (4 Meals/Day)
          </p>
        </div>
      )}

      {/* 3. Calendar Logic */}
      <div className="flex justify-center mb-6 bg-white/5 rounded-xl p-2 sm:p-4 w-full max-w-full [&_.rdp]:w-full [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-head_cell]:w-auto [&_.rdp-cell]:w-auto sm:[&_.rdp-day]:w-8 sm:[&_.rdp-day]:h-8 sm:[&_.rdp-day]:text-sm [&_.rdp-day]:text-xs">
          
        {mode === 'charter' ? (
          <DayPicker
            mode="single" selected={date} onSelect={setDate}
            disabled={{ before: new Date() }}
            modifiersClassNames={{ selected: 'bg-white text-black rounded-full font-bold', today: 'text-amber-400' }}
            className="text-white"
          />
        ) : (
          <DayPicker
            mode="range" selected={range} onSelect={setRange} min={1}
            disabled={{ before: new Date() }}
            modifiersClassNames={{ selected: 'bg-white text-black rounded-full font-bold', range_middle: 'bg-white/20 !rounded-none', today: 'text-amber-400' }}
            className="text-white"
          />
        )}
      </div>

      {/* 4. Price Preview */}
      {totalPrice > 0 && (
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg flex justify-between items-center">
          <span className="text-emerald-400 text-sm font-medium">Estimated Total</span>
          <div className="text-right">
            <span className="text-white font-bold text-lg block">{totalPrice.toLocaleString()} NOK</span>
            {mode === 'expedition' && <span className="text-[10px] text-gray-400 block">All-inclusive for {guests} guests</span>}
          </div>
        </div>
      )}

      {/* 5. Inputs */}
      <form action={handleSubmit} className="space-y-4">
        {mode === 'charter' && (
          <select name="timeSlot" className={inputClasses}>
            <option value="09:00">Morning Cruise (09:00 - 13:00)</option>
            <option value="14:00">Afternoon Cruise (14:00 - 18:00)</option>
            <option value="19:00">Evening Champagne (19:00 - 23:00)</option>
          </select>
        )}
        
        <input name="name" type="text" placeholder="Full Name" required className={inputClasses} />
        <input name="email" type="email" placeholder="Corporate Email" required className={inputClasses} />
        {/* 3. THE LEGAL CHECKBOX (Insert this right before the Button) */}
        <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/5">
          <input 
            type="checkbox" 
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-600 bg-slate-700 text-blue-500 focus:ring-offset-slate-900"
          />
          <label htmlFor="terms" className="text-xs text-gray-300 leading-snug select-none">
            I agree to the{' '}
            <button 
              type="button" 
              onClick={() => setShowTerms(true)}
              className="text-white underline hover:text-blue-400 font-bold transition"
            >
              Cancellation Policy & Terms
            </button>
            . I understand that the Captain has final authority on safety.
          </label>
        </div>

        
        <button 
          // 4. DISABLE BUTTON IF NOT AGREED
          disabled={!agreed || isSubmitting || (mode !== 'charter' && (!range?.from || !range?.to)) || (mode === 'charter' && !date)}
          className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : `Request ${mode === 'expedition' ? 'Adventure' : 'Booking'}`}
        </button>
      </form>
     {/* 5. MOUNT THE MODAL */}
        <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    </LangProvider>
  )
}