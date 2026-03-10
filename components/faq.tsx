'use client'

import { useLang } from '@/components/lang-context'

export default function FAQ() {
  const { t } = useLang(); 

  // Safely fallback to an empty array to prevent crashes if the dictionary is missing
  const questions = t.faq?.questions || [];

  return (
    <div className="max-w-2xl mx-auto py-20 px-6" id="faq">
      <h2 className="font-serif text-3xl text-center text-white mb-12">
        {t.faq?.title || "Common Inquiries"}
      </h2>
      
      <div className="space-y-4">
        {questions.map((item: { q: string, a: string }, index: number) => (
          <details key={index} className="group bg-slate-900/50 border border-white/10 rounded-lg open:bg-slate-900 transition">
            <summary className="flex justify-between items-center cursor-pointer p-6 list-none text-gray-200 font-medium group-hover:text-white">
              <span>{item.q}</span>
              <span className="transition group-open:rotate-180">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </span>
            </summary>
            
            <div className="px-6 pb-6 text-gray-400 leading-relaxed animate-in fade-in slide-in-from-top-2">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </div>
  )
}