'use client'

import HeroSection from '@/components/hero-section'
import BookingForm from '@/components/booking-form'
import Gallery from '@/components/gallery'
import FAQ from '@/components/faq'
import { ModeProvider } from '@/components/mode-context'
import { LangProvider, useLang } from '@/components/lang-context'

export default function Home() {
  return (
    
      <ModeProvider>
        <HomeContent />
      </ModeProvider>
    
  )
}

function HomeContent() {
  const { t } = useLang()

  return (
    <main className="relative min-h-screen">
      

      {/* 1. FIXED VIDEO BACKGROUND (Locked in place) */}
      <div className="fixed inset-0 -z-20">
        <HeroSection />
      </div>

      {/* 2. SUBTLE OVERLAY (Makes text readable without blocking video) */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

      {/* 3. SCROLLABLE CONTENT */}
      <div className="relative z-10">
        
        {/* SECTION A: THE HERO (Full Screen height) */}
        {/* Everything here floats over the video */}
        <div className="min-h-screen flex flex-col justify-center px-6 py-20">
          <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            
            {/* Left Column: Text & Stats */}
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="space-y-6">
                <h1 className="font-serif text-5xl md:text-7xl font-bold leading-tight text-white drop-shadow-2xl">
                  {t.hero.title}
                </h1>
                <p className="font-sans text-xl md:text-2xl text-gray-100 max-w-lg leading-relaxed font-light drop-shadow-lg">
                  {t.hero.subtitle}
                </p>
              </div>

              {/* Stats Block */}
              <div className="flex gap-10 border-l-2 border-amber-500/80 pl-6 pt-2 backdrop-blur-sm">
                <div>
                  <span className="block text-4xl font-serif font-bold text-white drop-shadow-md">{t.hero.stats.length}</span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-[0.2em]">{t.hero.stats.type}</span>
                </div>
                <div>
                  <span className="block text-4xl font-serif font-bold text-white drop-shadow-md">{t.hero.stats.capacityNum}</span>
                  <span className="text-[10px] text-amber-200 uppercase tracking-[0.2em]">{t.hero.stats.capacityText}</span>
                </div>
              </div>

              {/* Gallery Trigger */}
              <Gallery />
            </div>

            {/* Right Column: The Booking Engine */}
            <div id="book" className="flex justify-center lg:justify-end">
              <BookingForm />
            </div>
          </div>
        </div>

        {/* SECTION B: THE SOLID CONTENT (FAQ & Details) */}
        {/* This fades in as you scroll down */}
        <div className="relative bg-slate-950 pt-20 pb-32">
            
            {/* The Gradient Bridge: Smooths the transition from Video to Black */}
            <div className="absolute -top-32 left-0 w-full h-32 bg-gradient-to-b from-transparent to-slate-950" />

            <div className="max-w-4xl mx-auto px-6 space-y-16">
                
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-serif text-white">{t.experience.title}</h2>
                  <p className="text-gray-400 max-w-xl mx-auto">
                    {t.experience.desc}
                  </p>
                </div>

                {/* FAQ Section */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <FAQ />
                </div>
            </div>
        </div>

      </div>
    </main>
  )
}