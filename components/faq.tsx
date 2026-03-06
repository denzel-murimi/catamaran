'use client'

import { useLang } from '@/components/lang-context'

export default function FAQ() {
  const { t } = useLang(); // Correctly destructuring 't'

  return (
    
      <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 sm:py-20">
        <h2 className="font-serif text-2xl sm:text-3xl text-center text-white mb-8 sm:mb-12">
          Common Inquiries
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-slate-900/50 border border-white/10 rounded-lg open:bg-slate-900 transition"
            >
              <summary className="flex justify-between items-center cursor-pointer p-4 sm:p-6 list-none text-gray-200 font-medium group-hover:text-white gap-4 min-h-[56px]">
                <span className="text-sm sm:text-base leading-snug">{faq.question}</span>
                <span className="transition-transform group-open:rotate-180 shrink-0">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <div className="px-4 pb-4 sm:px-6 sm:pb-6 text-gray-400 text-sm sm:text-base leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    
  )
}