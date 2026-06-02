// Schema.org structured data for the five Krys Madagascar boutiques.
// Embedded as JSON-LD via <JsonLd> so Google can show rich local
// results (opening hours, phone, address) for each store.

const SHARED = {
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  url: "https://www.krys-madagascar.com",
  image: "https://www.krys-madagascar.com/hero.png",
  priceRange: "$$",
  currenciesAccepted: "MGA",
  areaServed: "Madagascar",
} as const;

const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const storesSchema = [
  {
    ...SHARED,
    name: "Optique de la Grande Ile",
    telephone: "+261348570816",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Centre Commercial Magri, 12011 Poste Zoom",
      addressLocality: "Antananarivo",
      postalCode: "101",
      addressCountry: "MG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "08:30",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "12:30",
      },
    ],
  },
  {
    ...SHARED,
    name: "Zoom Optique Gare Soarano",
    telephone: "+261348570815",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Centre commercial Gare Soarano",
      addressLocality: "Antananarivo",
      postalCode: "101",
      addressCountry: "MG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "09:00",
        closes: "18:30",
      },
    ],
  },
  {
    ...SHARED,
    name: "Arkadia Optique",
    telephone: "+261348570814",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Galerie Zoom Ankorondrano",
      addressLocality: "Antananarivo",
      postalCode: "101",
      addressCountry: "MG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "09:00",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "13:00",
      },
    ],
  },
  {
    ...SHARED,
    name: "Ylang Optique (Krys Optique)",
    telephone: "+261321269800",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Centre commercial le Mail, Djabala, Hell-Ville",
      addressLocality: "Nosy Be",
      postalCode: "207",
      addressCountry: "MG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "08:30",
        closes: "19:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Sunday",
        opens: "09:00",
        closes: "12:30",
      },
    ],
  },
  {
    ...SHARED,
    name: "Optique de l'Ankarana",
    telephone: "+261388570816",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Rue Lafayette et Jean Bart, Bazarikely",
      addressLocality: "Antsiranana",
      postalCode: "201",
      addressCountry: "MG",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: WEEKDAYS,
        opens: "09:00",
        closes: "18:30",
      },
    ],
  },
];
