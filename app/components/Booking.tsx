"use client";

import { useState } from "react";

// Each boutique offers either:
//   - a phone-only booking (no `redirect`), or
//   - phone AND an external Madadoc page (with `redirect`).
// In both cases the phone number is the primary fallback, so it's
// required on every store.
type Store = {
  value: string;
  sub: string;
  phone: string;
  redirect?: string;
};

const STORES: Store[] = [
  {
    value: "KRYS - Antananarivo Akoor Digue",
    sub: "Antananarivo",
    phone: "034 85 708 16",
    redirect:
      "https://madadoc.com/fr/p/ophtalmologue/antananarivo/ophtalmologue-krys-akoor-digue",
  },
  {
    value: "Krys Antananarivo - Soarano",
    sub: "Gare Soarano",
    phone: "034 85 708 15",
    redirect:
      "https://madadoc.com/fr/p/ophtalmologue/antananarivo/ophtalmologue-krys-gare-soarano",
  },
  {
    value: "Krys Antananarivo - Cc Zoom",
    sub: "Centre commercial Zoom",
    phone: "034 85 708 14",
    redirect:
      "https://madadoc.com/fr/p/ophtalmologue/antananarivo/ophtalmologue-krys-zoom-optique",
  },
  {
    value: "Krys Optique",
    sub: "Nosy Be · Hell-Ville",
    phone: "032 12 698 00",
  },
  {
    value: "KRYS - Antsiranana Centre",
    sub: "Antsiranana",
    phone: "038 85 708 16",
  },
  {
    value: "KRYS - Antananarivo Analakely",
    sub: "Centre Commercial Arkadia",
    phone: "034 49 708 18",
  },
];

// Local "034 85 708 16" → "+261348570816" for the tel: scheme that
// mobile dialers expect.
function telHref(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "").replace(/^0/, "+261")}`;
}

export default function Booking() {
  const [store, setStore] = useState<string | null>(null);
  const selected = STORES.find((s) => s.value === store);

  return (
    <div className="booking" id="booking">
      <div className="panel active">
        <h4>Choisissez votre boutique</h4>
        <p className="hint">
          Tous nos cabinets couvrent l&apos;ensemble du parcours :
          examen de vue, sélection de lunettes de vue et solaires,
          adaptation de lentilles, et réparation de vos montures.
        </p>
        <div className="choice-grid">
          {STORES.map((s) => (
            <button
              key={s.value}
              type="button"
              className={`choice ${store === s.value ? "selected" : ""}`}
              onClick={() => setStore(s.value)}
            >
              <span className="title">{s.value}</span>
              <span className="sub">{s.sub}</span>
            </button>
          ))}
        </div>
        {selected && (
          <>
            <p className="hint" style={{ marginTop: 24, marginBottom: 16 }}>
              {selected.redirect
                ? "Cette boutique gère ses rendez-vous sur Madadoc. Vous pouvez aussi appeler directement."
                : "Réservation par téléphone."}
            </p>
            <div className="booking-cta-row">
              <a
                href={telHref(selected.phone)}
                className={`next-btn ${selected.redirect ? "ghost" : ""}`.trim()}
              >
                Appeler le {selected.phone}
              </a>
              {selected.redirect && (
                <a
                  href={selected.redirect}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="next-btn"
                >
                  Réserver sur Madadoc ↗
                </a>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
