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
  : 'https://www.sailinghelgeland.com'
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
    url: 'https://www.sailinghelgeland.com', // Update this if your live domain is different!
    siteName: 'Valhalla Voyage',
    images: [
      {
        // We will need to make sure you have an image at this path in your public folder!
        url: 'https://www.sailinghelgeland.com/ext-profile.jpg', 
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
    images: ['https://www.sailinghelgeland.com/ext-profile.jpg'], 
  },
}
// This creates the structured data Google uses to rank local businesses
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["TravelAgency", "LocalBusiness"],
  "name": "Valhalla Voyage",
  "description": "Premium catamaran rental and bareboat charters on the Helgeland Coast. Experience the midnight sun, whale safaris, and world-class fishing in Norway.",
  "url": "https://www.sailinghelgeland.com",
  "image": "https://www.sailinghelgeland.com/ext-profile.jpg",
  "telephone": "+47 975 36 122", 
  "priceRange": "$$$",
  "address": {
    "@type": "PostalAddress",
    // Helgeland is located in the Nordland county of Norway
    "addressLocality": "Helgeland", 
    "addressRegion": "Nordland",
    "addressCountry": "NO"
  },
  "geo": {
    "@type": "GeoCoordinates",
    // Rough coordinates for the Helgeland Coast (Fred can update to his exact marina)
    "latitude": 65.9000, 
    "longitude": 12.5000
  },
  "offers": {
    "@type": "AggregateOffer",
    "offerCount": "3",
    "lowPrice": "600",
    "highPrice": "6000",
    "priceCurrency": "USD"
  }
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <LangProvider>
          <Navbar />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
          
          
          <Footer />
        </LangProvider>
      </body>
    </html>
  )
}