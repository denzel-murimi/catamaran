import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // 1. Google Fonts optimization
import './globals.css'
import Footer from '@/components/footer'
import { LangProvider } from '@/components/lang-context'
import Navbar from '@/components/navbar'
// 'subsets' reduces file size by only loading Latin characters
const inter = Inter({ subsets: ['latin'] })
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  ? process.env.NEXT_PUBLIC_BASE_URL 
  : 'http://localhost:3000'
// 3. SEO Metadata (Crucial for "Catamaran Oslo" search ranking)


export const metadata: Metadata = {
  title: 'Valhalla Voyage | Catamaran Charter on the Helgeland Coast',
  description: 'Experience sailing a catamaran under the midnight sun. Book a private whale safari, world-class fishing, and unforgettable adventures on the Helgeland Coast.',
  keywords: [
    'Helgeland Coast', 
    'sailing a catamaran', 
    'midnight sun', 
    'whale safari', 
    'fishing Norway',
    'boat rental Helgeland', 
    'bareboat charter Norway'
  ],
  openGraph: {
    title: 'Valhalla Voyage | Helgeland Coast Catamaran Charter',
    description: 'Experience sailing a catamaran under the midnight sun. Book a private whale safari, world-class fishing, and unforgettable adventures on the Helgeland Coast.',
    url: 'https://valhallavoyage.com', // Update this if your live domain is different!
    siteName: 'Valhalla Voyage',
    images: [
      {
        // We will need to make sure you have an image at this path in your public folder!
        url: 'https://valhallavoyage.com/ext-profile.jpg', 
        width: 1200,
        height: 630,
        alt: 'Valhalla Voyage Catamaran sailing the Helgeland Coast',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Valhalla Voyage | Helgeland Coast Catamaran',
    description: 'Experience sailing a catamaran under the midnight sun on the Helgeland Coast.',
    images: ['https://valhallavoyage.com/ext-profile.jpg'], 
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
        {/* Navigation Bar */}
        
        <LangProvider>
          <Navbar />
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