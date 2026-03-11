'use client'

import { useState } from 'react'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { Camera } from 'lucide-react'
import { useLang } from './lang-context'

// THE REAL ASSETS
type CustomSlide = {
  src: string
  title: string
  description: string
}

const slides: CustomSlide[] = [
  { 
    src: "/assets/ext-stern.jpg", 
    title: "The Aft Deck Lounge",
    description: "Alfresco dining with panoramic views of the Oslofjord."
  },
  { 
    src: "/assets/int-salon.jpg", 
    title: "Panoramic Salon",
    description: "360-degree views in a climate-controlled lounge."
  },
  { 
    src: "/assets/int-galley.jpg", 
    title: "Full Galley",
    description: "Equipped for gourmet catering or private chef service."
  },
  { 
    src: "/assets/cabin-master.jpg", 
    title: "Private Stateroom",
    description: "Queen-sized comfort with en-suite bathroom."
  },
  { 
    src: "/assets/outside.jpg", 
    title: "Outdoor Deck",
    description: "Spacious area for sunbathing and socializing."
  },
  { 
    src: "/assets/roof-view.jpg", 
    title: "Roof View",
    description: "Panoramic views from the top deck."
  },
  { 
    src: "/assets/ext-profile.jpg", 
    title: "Lagoon 400 S2",
    description: "Stable, spacious, and silent under sail."
  },
  { 
    src: "/assets/northern-lights.jpg", 
    title: "Northern Lights",
    description: "Experience the magical Aurora Borealis from the deck."
  },
  { 
    src: "/assets/layout.jpg", 
    title: "Vessel Layout",
    description: "4 Double Cabins, 2 Bathrooms - Privacy for all guests."
  },
  {
    src: "/assets/whale.jpg",
    title: "Whale Safari",
    description: "Get up close with majestic whales in their natural habitat."
  },
  {
    src: "/assets/fishing.jpg",
    title: "World-Class Fishing",
    description: "Fish the rich waters of the Helgeland Coast."
  },
  {
    src: "/assets/bow.jpg",
    title: "Sailing the Helgeland Coast",
    description: "Navigate the stunning fjords and islands of Norway."
  },
  {
    src: "/assets/coast.jpg",
    title: "The Helgeland Coast",
    description: "Explore the rugged beauty of Norway's Helgeland coast."
  }
]

export default function Gallery() {
  const [open, setOpen] = useState(false)
  const { t } = useLang()

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="group flex items-center gap-3 text-white/80 hover:text-white transition mt-6"
      >
        <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition">
            <Camera className="w-4 h-4" />
        </div>
        <span className="text-sm font-medium tracking-widest uppercase border-b border-transparent group-hover:border-white transition pb-0.5">
            {t.hero.galleryBtn || "View Catamaran"} ({slides.length} {t.hero.photos || "Photos"})
        </span>
      </button>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        styles={{ container: { backgroundColor: "rgba(15, 23, 42, 0.98)" } }}
        render={{
            slide: ({ slide }) => {
                const customSlide = slide as CustomSlide
                return (
                  <div className="relative flex flex-col items-center justify-center h-full">
                      <img 
                        src={customSlide.src} 
                        alt={customSlide.title} 
                        className="max-h-[70vh] w-auto rounded-lg shadow-2xl mb-4" 
                      />
                      <div className="text-center">
                        <p className="text-white font-serif text-2xl italic mb-2">{customSlide.title}</p>
                        <p className="text-gray-400 text-sm max-w-md mx-auto">{customSlide.description}</p>
                      </div>
                  </div>
                )
            }
        }}
      />
    </>
  )
}