'use client'

import HeroSection from '@/components/hero-section'
import BookingForm from '@/components/booking-form'
import Gallery from '@/components/gallery'
import FAQ from '@/components/faq'
import { ModeProvider } from '@/components/mode-context'
import { LangProvider, useLang } from '@/components/lang-context'

// 1. Accept the dates from the server
export default function HomeClient({ bookedDates }: { bookedDates: any[] }) {
  return (
      <ModeProvider>
        <HomeContent bookedDates={bookedDates} />
      </ModeProvider>
  )
}

function HomeContent({ bookedDates }: { bookedDates: any[] }) {
  const { t } = useLang()

  return (
    <main className="relative min-h-screen">
      
      {/* 1. FIXED VIDEO BACKGROUND */}
      <div className="fixed inset-0 -z-20">
        <HeroSection />
      </div>

      {/* 2. SUBTLE OVERLAY */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-slate-950/40 to-slate-950/10" />

      {/* 3. SCROLLABLE CONTENT */}
      <div className="relative z-10">
        
        {/* SECTION A: THE HERO */}
        <div className="min-h-screen flex flex-col justify-center px-6 py-32">
          <div className="w-full max-w-5xl mx-auto flex flex-col items-center gap-16">
            
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 text-center w-full">
              
              <div className="space-y-6">
                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
                  {t.hero.title}
                </h1>
                <h2 className="font-sans text-lg md:text-2xl text-gray-100 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-lg">
                  {t.hero.subtitle}
                </h2>
              </div>

              <div className="flex justify-center items-center gap-12 pt-4">
                <div className="text-center">
                  <span className="block text-4xl font-serif font-bold text-white drop-shadow-md">{t.hero.stats.length}</span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-[0.2em]">{t.hero.stats.type}</span>
                </div>
                
                <div className="w-px h-12 bg-amber-500/50"></div>
                
                <div className="text-center">
                  <span className="block text-4xl font-serif font-bold text-white drop-shadow-md">{t.hero.stats.capacityNum}</span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-[0.2em]">{t.hero.stats.capacityText}</span>
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Gallery />
              </div>
            </div>

            {/* Bottom: The Booking Engine */}
            <div id="book" className="w-full max-w-md animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
              {/* 2. Pass the dates directly into the form! */}
              <BookingForm existingBookings={bookedDates} />
            </div>
            
          </div>
        </div>

        {/* SECTION B: THE SOLID CONTENT (FAQ & Details) */}
        <div className="relative bg-slate-950 pt-20 pb-32">
            
            <div className="absolute -top-32 left-0 w-full h-32 bg-gradient-to-b from-transparent to-slate-950" />

            <div className="max-w-4xl mx-auto px-6 space-y-16">
                
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-serif text-white">{t.experience.title}</h2>
                  <p className="text-gray-400 max-w-xl mx-auto">
                    {t.experience.desc}
                  </p>
                </div>

                <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
                    <FAQ />
                </div>
            </div>
        </div>

      </div>
    </main>
  )
}