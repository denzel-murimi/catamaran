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
  
  // NEW RULES: Default 5, Max 10.
  const [guests, setGuests] = useState(5) 
  const [showTerms, setShowTerms] = useState(false) 
  const [agreed, setAgreed] = useState(false)
  
  // NEW STATE: Captain Experience Toggle
  const [isExperiencedCaptain, setIsExperiencedCaptain] = useState(false) 
  
  const { mode, setMode } = useMode()
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Changed from numbers to a string so we can display ranges like "$4,000 - $6,000"
  const [priceDisplay, setPriceDisplay] = useState('')

  useEffect(() => {
    if (mode === 'charter') {
      setPriceDisplay('$4,000') // Update this fixed rate to whatever USD value the owner wants
    } 
    else if (mode === 'hotel' && range?.from && range?.to) {
      const nights = Math.max(1, differenceInDays(range.to, range.from))
      setPriceDisplay(`$${nights * 600}`) // Update this fixed rate to whatever USD value the owner wants
    } 
    else if (mode === 'expedition' && range?.from && range?.to) {
      const days = Math.max(1, differenceInDays(range.to, range.from))
      const weeks = Math.max(1, Math.round(days / 7))
      
      // NEW PRICING LOGIC
      if (isExperiencedCaptain) {
        // Bareboat Weekly Rate
        setPriceDisplay(`$${4000 * weeks} - $${6000 * weeks}`)
      } else {
        // Full Board + Captain (Assuming $400 is per person, per day. If it's a flat $400 total per day, remove "* guests")
        setPriceDisplay(`$${days * guests * 400}`) 
      }
    } 
    else {
      setPriceDisplay('')
    }
  }, [mode, range, date, guests, isExperiencedCaptain])

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    const isRangeMode = mode === 'hotel' || mode === 'expedition'
    const startDate = isRangeMode ? range?.from : date
    const endDate = isRangeMode ? range?.to : date

    if (!startDate) {
        alert("Please select dates first")
        setIsSubmitting(false)
        return
    }

    formData.append('guestCount', guests.toString())
    // Send the captain choice to the server so you know what they booked
    formData.append('isExperiencedCaptain', isExperiencedCaptain.toString()) 

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
    
      <div className="bg-slate-900/80 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-2xl max-w-md w-full shadow-2xl animate-in fade-in slide-in-from-right-8">
      
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

      {/* 2. Expedition Specific UI (Slider & Captain Toggle) */}
      {mode === 'expedition' && (
        <div className="mb-6 space-y-4">
          
          {/* GUEST SLIDER */}
          <div className="bg-slate-900/50 border border-white/10 p-4 rounded-xl">
            <div className="flex justify-between text-sm mb-4">
              <span className="text-gray-300 flex items-center gap-2"><Users className="w-4 h-4"/> Guest Count</span>
              <span className="font-bold text-white">{guests} {t.booking.guests}</span>
            </div>
            
            <input 
              type="range" min="5" max="10" step="1" 
              value={guests} onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
               <span>{t.booking.min}: 5</span>
               <span>{t.booking.max}: 10</span>
            </div>
          </div>

          {/* CAPTAIN EXPERIENCE TOGGLE */}
          <div 
            className={clsx(
              "p-4 border rounded-xl flex items-start gap-3 cursor-pointer transition-all",
              isExperiencedCaptain ? "border-amber-500/50 bg-amber-500/10" : "border-white/10 bg-slate-800/50"
            )}
            onClick={() => setIsExperiencedCaptain(!isExperiencedCaptain)}
          >
             <input 
                type="checkbox" 
                checked={isExperiencedCaptain}
                onChange={(e) => setIsExperiencedCaptain(e.target.checked)}
                className="mt-1 accent-amber-500 w-4 h-4 cursor-pointer"
                onClick={(e) => e.stopPropagation()} 
             />
             <div>
                <label className="text-sm font-bold text-white cursor-pointer">{t.booking.captainTitle}</label>
                <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">
                  {t.booking.captainDesc}
                </p>
             </div>
          </div>

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
      {priceDisplay && (
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg flex justify-between items-center">
          <span className="text-emerald-400 text-sm font-medium">{t.booking.estimatedTotal}</span>
          <div className="text-right">
            <span className="text-white font-bold text-lg block">{priceDisplay}</span>
            {mode === 'expedition' && !isExperiencedCaptain && <span className="text-[10px] text-gray-400 block mt-1">{t.booking.fullBoard} {guests} {t.booking.guests}</span>}
            {mode === 'expedition' && isExperiencedCaptain && <span className="text-[10px] text-gray-400 block mt-1">{t.booking.bareboatRate}</span>}
          </div>
        </div>
      )}

      {/* 5. Inputs */}
      <form action={handleSubmit} className="space-y-4">
        {mode === 'charter' && (
          <select name="timeSlot" className={inputClasses}>
            <option value="09:00">{t.booking.timeSlots.morning}</option>
            <option value="14:00">{t.booking.timeSlots.afternoon}</option>
            <option value="19:00">{t.booking.timeSlots.evening}</option>
          </select>
        )}
        
        <input name="name" type="text" placeholder={t.booking.placeholders.name}   required className={inputClasses} />
        <input name="email" type="email" placeholder={t.booking.placeholders.email} required className={inputClasses} />
        
        {/* THE LEGAL CHECKBOX */}
        <div className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg border border-white/5">
          <input 
            type="checkbox" 
            id="terms"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-600 bg-slate-700 accent-amber-500 cursor-pointer"
          />
          <label htmlFor="terms" className="text-xs text-gray-300 leading-snug select-none cursor-pointer">
            {t.booking.terms.agree}{' '}
            <button 
              type="button" 
              onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
              className="text-white underline hover:text-amber-400 font-bold transition"
            >
              {t.booking.terms.link}
            </button>
            {t.booking.terms.safety}
          </label>
        </div>

        <button 
          disabled={!agreed || isSubmitting || (mode !== 'charter' && (!range?.from || !range?.to)) || (mode === 'charter' && !date)}
          className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : `Request ${mode === 'expedition' ? 'Adventure' : 'Booking'}`}
        </button>
      </form>
      
      {/* MOUNT THE MODAL */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
    
  )
}