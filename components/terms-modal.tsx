'use client'

import { X, ShieldAlert, Anchor, CloudRain } from 'lucide-react'
import { useLang } from '@/components/lang-context'

export default function TermsModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const { t } = useLang();

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. Backdrop (Click to close) */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* 2. The Legal Scroll */}
      <div className="relative bg-slate-900 border border-white/10 w-full max-w-2xl max-h-[80vh] rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/10 bg-slate-950/50 rounded-t-2xl">
          <h3 className="text-xl font-serif text-white font-bold flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-500" />
            {t.termsModal.title}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-8 text-gray-300 text-sm leading-relaxed">
          
          {/* Section 1: Cancellation */}
          <section>
            <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2">
              1. {t.termsModal.cancel.title}
            </h4>
            <ul className="list-disc pl-5 space-y-1 marker:text-amber-500">
              <li>{t.termsModal.cancel.b1}</li>
              <li>{t.termsModal.cancel.b2}</li>
              <li>{t.termsModal.cancel.b3}</li>
            </ul>
          </section>

          {/* Section 2: Weather */}
          <section>
            <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-blue-400" />
              2. {t.termsModal.weather.title}
            </h4>
            <p>
              {t.termsModal.weather.desc}
            </p>
          </section>

          {/* Section 3: Conduct */}
          <section>
            <h4 className="text-white font-bold text-base mb-2 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-emerald-400" />
              3. {t.termsModal.safety.title}
            </h4>
            <ul className="list-disc pl-5 space-y-1 marker:text-emerald-500">
              <li><strong>{t.termsModal.safety.conductTitle}</strong> {t.termsModal.safety.conductDesc}</li>
              <li><strong>{t.termsModal.safety.damagesTitle}</strong> {t.termsModal.safety.damagesDesc}</li>
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/10 bg-slate-950/50 rounded-b-2xl flex justify-end">
          <button 
            onClick={onClose}
            className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            {t.termsModal.understand}
          </button>
        </div>

      </div>
    </div>
  )
}