'use client'

import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { useLang } from '@/components/lang-context'
import { usePathname } from 'next/navigation' // <-- 1. Import the hook

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname() // <-- 2. Get the current route

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // <-- 3. THE FIX: Hide navbar completely on the admin panel
  // (Note: If your admin folder is named something else like '/dashboard', change the string below!)
  if (pathname?.startsWith('/admin')) {
    return null
  }

  const navLinks = [
    { name: t.nav.contact, href: '#contact' },
    { name: t.nav.book, href: '#book' },
  ]

  return (
    <nav 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled ? 'bg-slate-950/90 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <a href="#" className="text-white font-serif text-2xl font-bold tracking-widest hover:text-amber-400 transition">
          VALHALLA
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-300 hover:text-white transition"
            >
              {link.name}
            </a>
          ))}
          
          {/* The Safe Language Toggle */}
          <button 
            onClick={() => setLang(lang === 'en' ? 'no' : 'en')}
            className="flex items-center justify-center bg-slate-800 border border-white/20 px-4 py-2 rounded-full text-xs font-bold text-white hover:bg-slate-700 transition"
          >
            {lang === 'en' ? 'NO 🇳🇴' : 'EN 🇬🇧'}
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden text-white p-2"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-slate-900 border-b border-white/10 shadow-2xl animate-in slide-in-from-top-2">
          <div className="flex flex-col px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={link.href} 
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-gray-300 hover:text-white transition"
              >
                {link.name}
              </a>
            ))}
            <div className="pt-4 border-t border-white/10">
              <button 
                onClick={() => {
                  setLang(lang === 'en' ? 'no' : 'en');
                  setIsOpen(false);
                }}
                className="flex items-center gap-2 border border-white/20 px-4 py-2 rounded-full text-sm font-bold text-white hover:bg-white hover:text-black transition"
              >
                {lang === 'en' ? 'Switch to Norwegian 🇳🇴' : 'Bytt til Engelsk 🇬🇧'}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}