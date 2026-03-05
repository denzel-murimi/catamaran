'use client'

import { useMode } from '@/components/mode-context'
import { clsx } from 'clsx'
import { useLang } from '@/components/lang-context'
export default function HeroSection() {
  const { mode } = useMode()
  const { t } = useLang()

  // CONFIGURATION: Set your video/image sources here
  // If you don't have videos yet, you can use the images you uploaded.
  const backgrounds = {
    charter: {
      type: 'video', // Change to 'video' when you have a file
      src: '/assets/Catamaran_Sunset_Sail_Video.webm', // The Sailing Shot
      srcMp4: '/assets/Catamaran_Sunset_Sail_Video.mp4', // The Sailing Shot in MP4
      alt: 'Sailing the Fjord'
    },
    hotel: {
      type: 'video', 
      src: '/assets/AuroraVid.mp4', // The Cozy Interior Shot
      srcMp4: '/assets/AuroraVid.mp4', // The Cozy Interior Shot in MP4
      alt: 'Aurora Sailing'
    },
    expedition: {
      type: 'video',
      src: '/assets/CataSailing.webm', // The Adventure/Nature Shot
      srcMp4: '/assets/CataSailing.mp4', // The Adventure/Nature Shot in MP4
      alt: 'Fishing Expedition'
    }
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950">
      
      {/* We render ALL 3 backgrounds but only show the active one. 
          This ensures smooth cross-fading (no black flashes). */}
      
      {Object.entries(backgrounds).map(([key, bg]) => (
        <div
          key={key}
          className={clsx(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            mode === key ? "opacity-100 z-10" : "opacity-0 z-0"
          )}
        >
          <div className="absolute inset-0 bg-black/40 z-10" /> {/* Dark Overlay */}
          
          {bg.type === 'video' ? (
            <video
              autoPlay 
              loop 
              muted 
              playsInline
              className="object-cover w-full h-full scale-105"
            >
              <source src={bg.src} type="video/webm" />
              <source src={bg.srcMp4} type="video/mp4" />
            </video>
          ) : (
            <img
              src={bg.src}
              alt={bg.alt}
              className="object-top w-full h-full scale-105 animate-slow-pan" 
            />
          )}
        </div>
      ))}

      

    </div>
  )
}