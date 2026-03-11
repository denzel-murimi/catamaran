import { u } from "framer-motion/client"

export const dictionary = {
  en: {
    nav: { book: "Book Voyage", contact: "Contact" },
    hero: { 
      title: "Sailing a Catamaran on the Helgeland Coast", 
      subtitle: "Experience sailing a catamaran under the midnight sun. Whether you are looking for world-class fishing in Norway, an unforgettable whale safari, or a private bareboat adventure, your Arctic voyage starts here.",
      stats: {
        length: "39ft",
        type: "Catamaran",
        capacityNum: "10",
        capacityText: "Guest Capacity"
      },
      galleryBtn: "View Catamaran",
      photos: "Photos"
    },
    booking: {
      tabs: { day: "Day", stay: "Stay", adv: "Adventure" },
      guests: "Guests",
      min: "Min",
      max: "Max",
      captainTitle: "I am an experienced Captain",
      captainDesc: "Rent bareboat ($4k-$6k/week). Uncheck to include Captain & Full Board ($400/day).",
      estimatedTotal: "Estimated Total",
      fullBoard: "Full board for",
      bareboatRate: "Bareboat base rate",
      timeSlots: {
        morning: "Morning Cruise (09:00 - 13:00)",
        afternoon: "Afternoon Cruise (14:00 - 18:00)",
        evening: "Evening Champagne (19:00 - 23:00)"
      },
      placeholders: { name: "Full Name", email: "Email" },
      terms: {
        agree: "I agree to the",
        link: "Cancellation Policy & Terms",
        safety: ". I understand that the Captain has final authority on safety."
      },
      btnPending: "Processing...",
      btnRequest: "Request Booking",
      btnAdventure: "Request Adventure"
    },
    faq: { 
      title: "Common Inquiries",
      questions: [
        { q: "Can we bring our own food and drinks?", a: "Yes, you are welcome to bring your own catering, or we can arrange it for you." },

        { q: "What happens if it rains?", a: "The boat has a spacious indoor lounge to keep you warm and dry." },
        { q: "Do you offer customized itineraries?", a: "Yes, we can tailor your voyage to include specific sights or activities. Just let us know your preferences!" }

      ]
    },
    footer: {
      tagline: "Sailing a Catamaran on the Helgeland Coast.",
      services: "Charter. Overnight. Expedition.",
      manager: "General Manager",
      location: "Aker Brygge, Oslo",
      rights: "All rights reserved."
    },
    experience: {
      title: "Experience the Helgeland Coast",
      desc: "Whether for business or pleasure, Valhalla Voyage offers an unmatched perspective of the Helgeland Coast."
    },
    termsModal: {
      title: "Terms & Conditions",
      safety: {
        title: "Captain's Authority",
        conductTitle: "Conduct:",
        conductDesc: "The Captain has final say on all matters regarding safety, weather conditions, and guest behavior.",
        damagesTitle: "Damages:",
        damagesDesc: "Guests are fully liable for any intentional or reckless damages caused to the vessel."
      },
      weather: {
        title: "Weather Policy",
        desc: "Tours proceed in light rain. In case of severe or unsafe weather, we offer a reschedule or full refund."
      },
      cancel: {
        title: "Cancellation",
        b1: "7+ Days Prior: Full refund (100%).",
        b2: "48 Hours - 7 Days: 50% refund.",
        b3: "Less than 48 Hours: No refund."
      },
      close: "Close",
      understand: "I Understand"
    }
  },
  
  no: {
    nav: { book: "Bestill Nå", contact: "Kontakt" },
    hero: { 
      title: "Seiling med Katamaran på Helgelandskysten.",
      subtitle: "Opplev seiling med katamaran under midnattssolen. Enten du ønsker verdensklasse fiske i Norge, en uforglemmelig hvalsafari, eller et privat bareboat-eventyr, starter ditt arktiske eventyr her.",
      stats: {
        length: "39 fot",
        type: "Katamaran",
        capacityNum: "10",
        capacityText: "Gjesters Kapasitet"
      },
      galleryBtn: "Se Katamaran",
      photos: "Bilder"
    },
    booking: {
      tabs: { day: "Dag", stay: "Overnatting", adv: "Eventyr" },
      guests: "Gjester",
      min: "Min",
      max: "Maks",
      captainTitle: "Jeg er en erfaren kaptein",
      captainDesc: "Lei uten mannskap ($4k-$6k/uke). Fjern avkrysning for kaptein og fullpensjon ($400/dag).",
      estimatedTotal: "Estimert Totalsum",
      fullBoard: "Fullpensjon for",
      bareboatRate: "Grunnpris uten mannskap",
      timeSlots: {
        morning: "Morgencruise (09:00 - 13:00)",
        afternoon: "Ettermiddagscruise (14:00 - 18:00)",
        evening: "Kveldschampagne (19:00 - 23:00)"
      },
      placeholders: { name: "Fullt Navn", email: "E-post" },
      terms: {
        agree: "Jeg godtar",
        link: "Avbestillingsregler og vilkår",
        safety: ". Jeg forstår at kapteinen har siste ord når det gjelder sikkerhet."
      },
      btnPending: "Behandler...",
      btnRequest: "Send Forespørsel",
      btnAdventure: "Forespør Eventyr"
    },
    faq: { 
      title: "Vanlige Spørsmål",
      questions: [
        { q: "Kan vi ta med egen mat og drikke?", a: "Ja, du er velkommen til å ta med egen servering, eller vi kan ordne det for deg." },
        { q: "Hva skjer hvis det regner?", a: "Båten har en romslig innendørs salong for å holde deg varm og tørr." },
        { q: "Tilbyr dere tilpassede reiseruter?", a: "Ja, vi kan skreddersy reisen din for å inkludere spesifikke severdigheter eller aktiviteter. Gi oss beskjed om dine preferanser!" }
      ]
    },
    footer: {
      tagline: "Seiling med Katamaran på Helgelandskysten.",
      services: "Dagscruise. Overnatting. Eventyr.",
      manager: "Daglig Leder",
      location: "Aker Brygge, Oslo",
      rights: "Med enerett."
    },
    experience: {
      title: "Opplev Fjorden",
      desc: "Enten det er for forretninger eller fornøyelser, tilbyr Valhalla Voyage et uovertruffent perspektiv av Oslo."
    },
    termsModal: {
      title: "Vilkår og Betingelser",
      safety: {
        title: "Kapteinens Autoritet",
        conductTitle: "Adferd:",
        conductDesc: "Kapteinen har siste ord i alle saker som gjelder sikkerhet, værforhold og gjesteadferd.",
        damagesTitle: "Skader:",
        damagesDesc: "Gjester er fullt ansvarlige for eventuelle tilsiktede eller uforsiktige skader på fartøyet."
      },
      weather: {
        title: "Værpolicy",
        desc: "Turene gjennomføres i lett regn. Ved alvorlig eller usikkert vær tilbyr vi ombooking eller full refusjon."
      },
      cancel: {
        title: "Avbestilling",
        b1: "7+ Dager Før: Full refusjon (100%).",
        b2: "48 Timer - 7 Dager: 50% refusjon.",
        b3: "Mindre enn 48 Timer: Ingen refusjon."
      },
      close: "Lukk",
      understand: "Jeg Forstår"
    }
  }
}

export type Language = 'en' | 'no'