import { LangProvider } from "./lang-context"

const faqs = [
  {
    question: "What happens if it rains?",
    answer: "The Valhalla Voyage is designed for all seasons. We have a heated, glass-enclosed salon with panoramic views, so you can enjoy the fjord in complete comfort while the storm rages outside. It's actually quite cozy."
  },
  {
    question: "Can we bring our own alcohol?",
    answer: "Yes. We operate on a 'Bring Your Own' basis for alcohol. We provide crystal glassware, ice, and coolers. We can also arrange catering partners to deliver food prior to your arrival."
  },
  {
    question: "Is the boat moving or stationary?",
    answer: "For 'Day Charters', we cruise the inner Oslofjord. For 'Overnight Stays', the boat remains docked at our private pier in Aker Brygge, giving you a floating luxury apartment in the city center."
  },
  {
    question: "Are children allowed?",
    answer: "Absolutely. We have life vests for all ages."
  }
]

export default function FAQ() {
  return (
    <LangProvider>
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
    </LangProvider>
  )
}