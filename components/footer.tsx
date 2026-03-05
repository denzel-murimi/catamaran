'use client'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useLang } from './lang-context'

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-slate-950 border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        
        {/* Left: Brand Identity */}
        <div className="text-center md:text-left space-y-4">
          <h3 className="font-serif text-3xl text-white font-bold tracking-tight">
            Valhalla Voyage
          </h3>
          <p className="text-gray-400 text-sm max-w-xs mx-auto md:mx-0 leading-relaxed">
            {t.footer.tagline}
          </p>
        </div>

        {/* Right: Contact Information (The New Data) */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          
          <div className="text-center md:text-right">
            <p className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-1">
              {t.footer.manager}
            </p>
            <p className="text-white text-lg font-serif">Fred Olav Bore</p>
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <a 
              href="tel:+4797536122" 
              className="flex items-center gap-3 hover:text-white transition group justify-center md:justify-end"
            >
              <span className="group-hover:translate-x-1 transition">+47 975 36 122</span>
              <Phone className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </a>
            
            <a 
              href="mailto:fobore65@gmail.com" 
              className="flex items-center gap-3 hover:text-white transition group justify-center md:justify-end"
            >
              <span className="group-hover:translate-x-1 transition">fobore65@gmail.com</span>
              <Mail className="w-4 h-4 text-gray-500 group-hover:text-white" />
            </a>

            <div className="flex items-center gap-3 justify-center md:justify-end text-gray-500">
              <span>Aker Brygge, Oslo</span>
              <MapPin className="w-4 h-4" />
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar */}
      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/5 text-center text-xs text-gray-600">
        © {new Date().getFullYear()} Valhalla Voyage. {t.footer.rights}
      </div>
    </footer>
  )
}