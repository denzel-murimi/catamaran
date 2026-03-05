import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // 1. Google Fonts optimization
import './globals.css'
import Footer from '@/components/footer'
import { LangProvider } from '@/components/lang-context'
// 'subsets' reduces file size by only loading Latin characters
const inter = Inter({ subsets: ['latin'] })
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  ? process.env.NEXT_PUBLIC_BASE_URL 
  : 'http://localhost:3000'
// 3. SEO Metadata (Crucial for "Catamaran Oslo" search ranking)
export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'The Valhalla Voyage | Exclusive Catamaran Charter ',
  description: 'Luxury catamaran charters and overnight stays in the heart of Oslofjord. Experience the Nordic silence.',
  openGraph: {
    title: 'Valhalla Voyage | The Fjord is Your Lounge',
    description: 'Rent your own private floating luxury apartment. Day charters, overnight stays, and expeditions available now.',
    url: baseUrl,
    siteName: 'Valhalla Voyage',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/assets/ext-profile.jpg', // We use the specific file you renamed
        width: 1200,
        height: 630,
        alt: 'Lagoon 400 S2 Catamaran in Oslofjord',
      },
    ],
  },

  // 4. TWITTER CARD (Large Image)
  twitter: {
    card: 'summary_large_image',
    title: 'Valhalla Voyage',
    description: 'Silent luxury cruising in Oslo. Book your private charter today.',
    images: ['/assets/ext-profile.jpg'], 
  },
  
  // 5. ICONS (Favicon)
  icons: {
    icon: '/icons8-favicon-32.png', // Ensure you have a favicon in /public
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      {/* 4. Body Classes:
        - inter.className: Applies the font globally
        - antialiased: Makes the font look sharper (crucial for dark mode)
        - bg-slate-950: A deep, rich dark blue/black background
        - text-white: Default text color
      */}
      <body className={`${inter.className} antialiased bg-slate-950 text-white`}>
        {/* Navigation Bar will go here later */}
        <LangProvider>
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          
          {/* Footer will go here later */}
          <Footer />
        </LangProvider>
      </body>
    </html>
  )
}