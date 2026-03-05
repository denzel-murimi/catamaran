export const dictionary = {
  en: {
    nav: { book: "Book Voyage", contact: "Contact" },
    hero: { 
      title: "The Fjord is Your Lounge.", 
      subtitle: "Experience the Fjord on our classic catamaran. Reliable diesel power, spacious decks, and authentic Norwegian adventures.",
      stats: {
        length: "39ft",
        type: "Catamaran",
        capacityNum: "10",
        capacityText: "Guest Capacity"
      },
      galleryBtn: "Explore the Vessel"
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
      placeholders: { name: "Full Name", email: "Corporate Email" },
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
        { q: "Is there a restroom on board?", a: "Yes, the catamaran is fully equipped with a marine restroom." },
        { q: "What happens if it rains?", a: "The boat has a spacious indoor lounge to keep you warm and dry." },
        { q: "Do you offer customized itineraries?", a: "Yes, we can tailor your voyage to include specific sights or activities. Just let us know your preferences!" }

      ]
    },
    footer: {
      tagline: "Experience the Oslofjord on our classic catamaran.",
      services: "Charter. Overnight. Expedition.",
      manager: "General Manager",
      location: "Aker Brygge, Oslo",
      rights: "All rights reserved."
    },
    experience: {
      title: "Experience the Fjord",
      desc: "Whether for business or pleasure, Valhalla Voyage offers an unmatched perspective of Oslo."
    },
  },
  
  no: {
    nav: { book: "Bestill Nå", contact: "Kontakt" },
    hero: { 
      title: "Fjorden er Din Stue.", 
      subtitle: "Opplev fjorden på vår klassiske katamaran. Pålitelige dieselmotorer, romslige dekk og autentiske norske opplevelser.",
      stats: {
        length: "39 fot",
        type: "Katamaran",
        capacityNum: "10",
        capacityText: "Gjesters Kapasitet"
      },
      galleryBtn: "Utforsk Fartøyet"
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
      placeholders: { name: "Fullt Navn", email: "Bedriftsepost" },
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
        { q: "Er det toalett om bord?", a: "Ja, katamaranen er fullt utstyrt med et marinetoalett." },
        { q: "Hva skjer hvis det regner?", a: "Båten har en romslig innendørs salong for å holde deg varm og tørr." },
        { q: "Tilbyr dere tilpassede reiseruter?", a: "Ja, vi kan skreddersy reisen din for å inkludere spesifikke severdigheter eller aktiviteter. Gi oss beskjed om dine preferanser!" }
      ]
    },
    footer: {
      tagline: "Opplev Oslofjorden på vår klassiske katamaran.",
      services: "Dagscruise. Overnatting. Eventyr.",
      manager: "Daglig Leder",
      location: "Aker Brygge, Oslo",
      rights: "Med enerett."
    },
    experience: {
      title: "Opplev Fjorden",
      desc: "Enten det er for forretninger eller fornøyelser, tilbyr Valhalla Voyage et uovertruffent perspektiv av Oslo."
    },
  }
}

export type Language = 'en' | 'no'