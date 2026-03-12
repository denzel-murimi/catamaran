'use client'

import { useState, useEffect } from 'react'
import { DayPicker, DateRange } from 'react-day-picker'
import { differenceInDays } from 'date-fns'
import 'react-day-picker/dist/style.css'
import { createBooking } from '@/app/actions/book-trip'
import { clsx } from 'clsx'
import { Users } from 'lucide-react'
import TermsModal from '@/components/terms-modal'
import { useLang } from '@/components/lang-context'

export default function BookingForm() {
  const { t } = useLang()
  const [range, setRange] = useState<DateRange | undefined>()
  
  // Fred's Rule: Minimum 5 people. Max 10.
  const [guests, setGuests] = useState(5) 
  const [showTerms, setShowTerms] = useState(false) 
  const [agreed, setAgreed] = useState(false)
  
  // The only two options left: Bareboat (true) or All-Inclusive (false)
  const [isExperiencedCaptain, setIsExperiencedCaptain] = useState(false) 
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [priceDisplay, setPriceDisplay] = useState('')

  useEffect(() => {
    if (range?.from && range?.to) {
      const days = Math.max(1, differenceInDays(range.to, range.from))
      
      if (isExperiencedCaptain) {
        // BAREBOAT LOGIC: Weekly Seasonal Pricing
        const weeks = Math.max(1, Math.round(days / 7))
        const startMonth = range.from.getMonth() + 1; // 0-indexed
        
        let weeklyRate = 4000; // Default / May
        if (startMonth === 5) {
          weeklyRate = 4000; // May
        } else if (startMonth === 6) {
          weeklyRate = 5000; // June
        } else if (startMonth === 7) {
          weeklyRate = 6000; // July
        }

        setPriceDisplay(`$${(weeklyRate * weeks).toLocaleString()}`)
        
      } else {
        // ALL-INCLUSIVE LOGIC: $400 per person, per day (Min 5 people enforced by slider)
        setPriceDisplay(`$${(days * guests * 400).toLocaleString()}`) 
      }
    } else {
      setPriceDisplay('')
    }
  }, [range, guests, isExperiencedCaptain])

  // Calendar Lock: Prevent winter bareboat bookings
  // Universally block the harsh winter months for ALL bookings
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    if (date < today) return true; // Always block the past

    const month = date.getMonth();
    // JavaScript months are 0-indexed (0=Jan, 1=Feb, 2=Mar ... 9=Oct, 10=Nov, 11=Dec)
    // We block anything before April (index 3) and anything after September (index 8)
    if (month < 3 || month > 8) {
      return true; 
    }
    
    return false;
  };

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)
    
    if (!range?.from || !range?.to) {
        alert("Please select your travel dates first")
        setIsSubmitting(false)
        return
    }

    formData.append('guestCount', guests.toString())
    formData.append('isExperiencedCaptain', isExperiencedCaptain.toString()) 

    // We hardcode 'expedition' since it's the only mode we offer now!
    const result = await createBooking(formData, range.from, range.to, 'expedition')
    
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
      
      <div className="mb-6 space-y-6">
        {/* 1. CAPTAIN EXPERIENCE TOGGLE (Moved to top as the primary choice) */}
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

        {/* 2. GUEST SLIDER (Locked to minimum 5) */}
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
      </div>

      {/* 3. Calendar Logic (Range Only) */}
      <div className="flex justify-center mb-6 bg-white/5 rounded-xl p-2 sm:p-4 w-full max-w-full [&_.rdp]:w-full [&_.rdp-months]:w-full [&_.rdp-month]:w-full [&_.rdp-table]:w-full [&_.rdp-head_cell]:w-auto [&_.rdp-cell]:w-auto sm:[&_.rdp-day]:w-8 sm:[&_.rdp-day]:h-8 sm:[&_.rdp-day]:text-sm [&_.rdp-day]:text-xs">
          <DayPicker
            mode="range" selected={range} onSelect={setRange} min={1}
            disabled={isDateDisabled}
            modifiersClassNames={{ selected: 'bg-white text-black rounded-full font-bold', range_middle: 'bg-white/20 !rounded-none', today: 'text-amber-400' }}
            className="text-white"
          />
      </div>

      {/* 4. Price Preview */}
      {priceDisplay && (
        <div className="mb-6 p-4 bg-emerald-900/20 border border-emerald-500/30 rounded-lg flex justify-between items-center">
          <span className="text-emerald-400 text-sm font-medium">{t.booking.estimatedTotal}</span>
          <div className="text-right">
            <span className="text-white font-bold text-lg block">{priceDisplay}</span>
            {!isExperiencedCaptain && <span className="text-[10px] text-gray-400 block mt-1">{t.booking.fullBoard} {guests} {t.booking.guests}</span>}
            {isExperiencedCaptain && <span className="text-[10px] text-gray-400 block mt-1">{t.booking.bareboatRate}</span>}
          </div>
        </div>
      )}

      {/* 5. Inputs */}
      <form action={handleSubmit} className="space-y-4">
        <input name="name" type="text" placeholder={t.booking.placeholders.name}  required className={inputClasses} />
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
          disabled={!agreed || isSubmitting || !range?.from || !range?.to}
          className="w-full bg-white text-black font-bold py-4 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Processing...' : 'Request Adventure'}
        </button>
      </form>
      
      {/* MOUNT THE MODAL */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      </div>
  )
}