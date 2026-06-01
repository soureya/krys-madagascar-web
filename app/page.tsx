import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Booking from "./components/Booking";
import { OpenStatus, type Schedule } from "./components/OpenStatus";
import brandsData from "@/data/brands.json";

// Discover which brand IDs have an SVG logo in public/logos/.
// Drop a new file named `{id}.svg` and it appears automatically.
const logosDir = path.join(process.cwd(), "public", "logos");
const availableLogos = new Set<string>(
  fs.existsSync(logosDir)
    ? fs
        .readdirSync(logosDir)
        .filter((f) => f.endsWith(".svg"))
        .map((f) => f.replace(/\.svg$/, ""))
    : [],
);

const TICKER_ITEMS = [
  "Krys Madagascar",
  "5 cabinets agréés Ministère de la Santé",
  "Examen de vue sur RDV",
  "5 boutiques · Antananarivo, Antsiranana & Nosy-Be",
  "Ray-Ban · Oakley · Persol · Maui Jim",
];

const SERVICES = [
  {
    n: "01",
    title: "Examen de vue",
    desc: "Bilan complet de réfraction, prescription, contrôle pupillaire. Sur rendez-vous, 30 min.",
    cta: "Réserver →",
    href: "#rdv",
  },
  {
    n: "02",
    title: "Lunettes de vue",
    desc: "Conseil monture, prise de mesure et montage en atelier sous 48 heures.",
    cta: "Réserver →",
    href: "#rdv",
  },
  {
    n: "03",
    title: "Solaires",
    desc: "Solaires de prescription, polarisées ou photochromiques. Sélection saisonnière.",
    cta: "Voir vitrine →",
    href: "#rdv",
  },
  {
    n: "04",
    title: "Lentilles",
    desc: "Pose, adaptation et suivi. Souples, rigides, progressives. Sur rendez-vous.",
    cta: "Réserver →",
    href: "#rdv",
  },
  {
    n: "05",
    title: "Réparations",
    desc: "Vis, branche, plaquette. Sans rendez-vous, généralement le jour même.",
    cta: "En boutique →",
    href: "#boutiques",
  },
];

type Boutique = {
  name: string;
  schedule: Schedule;
  coords: { lng: number; lat: number };
  // Verified Google Business listing — used by the "Itinéraire" link so
  // the destination resolves to the right shop rather than just a pin.
  mapsUrl: string;
  address: React.ReactNode;
  hours: { label: string; value: string; cls?: "today" | "closed" }[];
  phone: string;
};

// Mapbox Static Images API URL. Krys-blue pin, "light-v11" style for
// editorial sobriety. Token is restricted to your domain in production.
function mapUrl(coords: { lng: number; lat: number }) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const { lng, lat } = coords;
  return `https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+1955d9(${lng},${lat})/${lng},${lat},15/600x360@2x?access_token=${token}`;
}

const BOUTIQUES: Boutique[] = [
  {
    name: "Opticien Krys Akoor Digue",
    schedule: {
      weekdays: { open: "8h30", close: "19h00" },
      sunday: { open: "9h00", close: "12h30" },
    },
    // Approx. Centre Commercial Magri area, Antananarivo — to confirm
    coords: { lng: 47.5197, lat: -18.9043 },
    mapsUrl:
      "https://www.google.com/maps/place/Opticien+Krys+Akoor+Digue/@-18.8927457,47.4898732,17z/data=!3m1!4b1!4m6!3m5!1s0x21f081be9ede8c87:0xd71b33a4471119c2!8m2!3d-18.8927508!4d47.4924481!16s%2Fg%2F11vb1y0l2y",
    address: (
      <>
        Centre Commercial Magri, 12011 Poste Zoom
        <br />
        101 Antananarivo · Madagascar
      </>
    ),
    hours: [
      { label: "Aujourd'hui", value: "8h30 — 19h00", cls: "today" },
      { label: "Lun — Sam", value: "8h30 — 19h00" },
      { label: "Dimanche", value: "9h00 — 12h30" },
    ],
    phone: "+261 20 22 67 754",
  },
  {
    name: "Krys Antananarivo - Soarano",
    schedule: {
      weekdays: { open: "9h00", close: "18h30" },
      sunday: null,
    },
    // Gare Soarano, Antananarivo (historic train station area)
    coords: { lng: 47.5223, lat: -18.9099 },
    mapsUrl:
      "https://www.google.com/maps/place/Krys+Antananarivo+-+Soarano/@-18.8926989,47.4718485,14z/data=!4m10!1m2!2m1!1sKrys+Antananarivo+-+Soarano!3m6!1s0x21f07e0243e7dde5:0xb43eca121964d6b!8m2!3d-18.903342!4d47.521061!15sChtLcnlzIEFudGFuYW5hcml2byAtIFNvYXJhbm8iA4gBAZIBCG9wdGljaWFu4AEA!16s%2Fg%2F11gd67wklj",
    address: (
      <>
        Centre commercial Gare Soarano
        <br />
        101 Antananarivo · Madagascar
      </>
    ),
    hours: [
      { label: "Aujourd'hui", value: "9h00 — 18h30", cls: "today" },
      { label: "Lun — Sam", value: "9h00 — 18h30" },
      { label: "Dimanche", value: "Fermé", cls: "closed" },
    ],
    phone: "+261 34 07 677 54",
  },
  {
    name: "Krys Antananarivo - Cc Zoom",
    schedule: {
      weekdays: { open: "9h00", close: "19h00" },
      sunday: { open: "9h00", close: "13h00" },
    },
    // Centre commercial Arkadia/Zoom, Ankorondrano, Antananarivo
    coords: { lng: 47.5274, lat: -18.8783 },
    mapsUrl:
      "https://www.google.com/maps/place/Krys+Antananarivo+-+Cc+Zoom/@-18.8926989,47.4718485,14z/data=!4m10!1m2!2m1!1sKrys+Antananarivo+-+Soarano!3m6!1s0x21f080ca09f63af1:0x6fc10faa1b2fb006!8m2!3d-18.8836263!4d47.5234948!15sChtLcnlzIEFudGFuYW5hcml2byAtIFNvYXJhbm8iA4gBAZIBCG9wdGljaWFu4AEA!16s%2Fg%2F11b6d43c13",
    address: (
      <>
        Galerie Zoom Ankorondrano
        <br />
        Antananarivo 101 · Madagascar
      </>
    ),
    hours: [
      { label: "Aujourd'hui", value: "9h00 — 19h00", cls: "today" },
      { label: "Lun — Sam", value: "9h00 — 19h00" },
      { label: "Dimanche", value: "9h00 — 13h00" },
    ],
    phone: "+261 34 07 677 54",
  },
  {
    name: "Krys Optique",
    schedule: {
      weekdays: { open: "8h30", close: "19h00" },
      sunday: { open: "9h00", close: "12h30" },
    },
    // Hell-Ville (Andoany), Nosy Be
    coords: { lng: 48.2746, lat: -13.4072 },
    mapsUrl:
      "https://www.google.com/maps/place/KRYS+OPTIQUE/@-13.3926892,48.2516687,17z/data=!3m1!4b1!4m6!3m5!1s0x2213c75e1c1732cb:0xa722bf4470085725!8m2!3d-13.3926945!4d48.2565396!16s%2Fg%2F11kqfpntxj",
    address: (
      <>
        Centre commercial le Mail, Djabala, Hell-Ville
        <br />
        Nosy Be · Madagascar
      </>
    ),
    hours: [
      { label: "Aujourd'hui", value: "8h30 — 19h00", cls: "today" },
      { label: "Lun — Sam", value: "8h30 — 19h00" },
      { label: "Dimanche", value: "9h00 — 12h30" },
    ],
    phone: "+261 32 49 698 73",
  },
  {
    name: "Opticien Krys Antsiranana",
    schedule: {
      weekdays: { open: "9h00", close: "18h30" },
      sunday: null,
    },
    // Rue Lafayette / Jean Bart, quartier Bazarikely, Antsiranana
    coords: { lng: 49.2926, lat: -12.2787 },
    mapsUrl:
      "https://www.google.com/maps/place/Opticien+Krys+ANTSIRANANA/@-12.2825095,49.289078,17z/data=!3m1!4b1!4m6!3m5!1s0x226b1d00469e9f45:0x12d8372d78b93f9a!8m2!3d-12.2825148!4d49.2916529!16s%2Fg%2F11w46rdwpr",
    address: (
      <>
        Rue Lafayette et Jean Bart, Bazarikely
        <br />
        Antsiranana 201 · Madagascar
      </>
    ),
    hours: [
      { label: "Aujourd'hui", value: "9h00 — 18h30", cls: "today" },
      { label: "Lun — Sam", value: "9h00 — 18h30" },
      { label: "Dimanche", value: "Fermé", cls: "closed" },
    ],
    phone: "+261 34 07 677 54",
  },
];

export default function Home() {
  return (
    <>
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>

      <header className="top">
        <div className="top-inner">
          <div className="brand">
            <Image src="/krys.svg" alt="Krys" width={62} height={28} priority />
            <span className="name">Krys Madagascar</span>
          </div>
          <nav className="nav-links">
            <a href="#frames">Vitrine</a>
            <a href="#services">Services</a>
            <a href="#boutiques">Boutiques</a>
            <a href="#partenaires">Marques</a>
            <a href="#histoire">Histoire</a>
          </nav>
          <div className="top-right">
            <span className="secondary">+261 20 22 234 56</span>
            <a href="#rdv" className="cta">
              Prendre rendez-vous
            </a>
          </div>
        </div>
      </header>

      <section className="hero" id="frames">
        <div className="container">
          <div className="hero-grid">
            <div className="hero-text">
              <div className="hero-text-top">
                <span className="mono" style={{ color: "var(--ink-3)" }}>
                  §00 — Accueil
                </span>
                <h1>
                  <b>Krys,</b> votre opticien de référence à{" "}
                  <i>Madagascar</i>
                </h1>
              </div>
              <div className="hero-text-bottom">
                <p className="lede">
                  Lunettes de vue, solaire, lentilles et accompagnement personnalisé par nos
                  opticiens.
                </p>
                <div className="ctas">
                  <a href="#rdv" className="btn primary">
                    Prendre rendez-vous →
                  </a>
                  <a href="#boutiques" className="btn ghost">
                    Nos boutiques
                  </a>
                </div>
              </div>
            </div>
            <div className="hero-photo">
              <Image
                src="/hero.png"
                alt="Femme essayant des lunettes de vue dans un magasin Krys Madagascar à Antananarivo"
                fill
                priority
                sizes="(max-width: 1000px) 100vw, 50vw"
                className="hero-photo-img"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="services">
        <div className="container">
          <div className="section-head">
            <span className="num">§01</span>
            <h2>
              <b>Services</b> en magasins
            </h2>
            <div className="right">
              Examens, montages, lentilles et ajustements — tout se fait sur place, par nos
              opticiens diplômés.
            </div>
          </div>
          <div className="services">
            {SERVICES.map((s) => (
              <a key={s.n} className="service" href={s.href}>
                <div className="ico">{s.n}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <span className="more">{s.cta}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="boutiques">
        <div className="container">
          <div className="section-head">
            <span className="num">§02</span>
            <h2>
              <b>Cinq</b> boutiques
            </h2>
            <div className="right">
              Trois adresses à Antananarivo, une à Nosy Be et une dans le Nord. Les cinq cabinets
              sont agréés par le Ministère de la Santé.
            </div>
          </div>
          <div className="boutiques">
            {BOUTIQUES.map((b) => (
              <article key={b.name} className="boutique">
                <div className="boutique-head">
                  <h3>{b.name}</h3>
                  <OpenStatus schedule={b.schedule} />
                </div>
                <div className="map">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mapUrl(b.coords)}
                    alt={`Carte ${b.name}`}
                    className="map-img"
                    loading="lazy"
                    width={600}
                    height={360}
                  />
                </div>
                <div className="boutique-body">
                  <p className="addr">{b.address}</p>
                  <div className="hours">
                    {b.hours.map((h) => (
                      <div key={h.label} className={`row ${h.cls ?? ""}`.trim()}>
                        <span>{h.label}</span>
                        <span>{h.value}</span>
                      </div>
                    ))}
                  </div>
                  <div className="phone">{b.phone}</div>
                  <div className="accred">
                    <span className="accred-mark">✓</span>
                    Cabinet agréé&nbsp;— Ministère de la Santé
                  </div>
                </div>
                <div className="boutique-foot">
                  <a
                    href={b.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Itinéraire
                  </a>
                  <a href="#rdv" className="primary">
                    Réserver
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section partners-section" id="partenaires">
        <div className="container">
          <div className="section-head">
            <span className="num">§03</span>
            <h2>
              <b>Parmi les marques</b> partenaires
            </h2>
            <div className="right">
              Une sélection rigoureuse. Distribution officielle, garantie internationale, et essais
              sans engagement en boutique.
            </div>
          </div>
          <div className="partners-grid">
            {brandsData.brands
              .filter((b) => availableLogos.has(b.id))
              .map((b) => (
                <div key={b.id} className="partner-cell" title={b.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/logos/${b.id}.svg`}
                    alt={b.name}
                    className="partner-logo"
                    loading="lazy"
                  />
                </div>
              ))}
          </div>
        </div>
      </section>

      <section className="heritage" id="histoire">
        <div className="container">
          <div>
            <span className="mono" style={{ color: "rgba(255,255,255,0.5)" }}>
              §04 — Histoire
            </span>
            <h2 style={{ marginTop: 14 }}>
              Krys Madagascar, votre référence en optique <b>depuis 1997.</b>
            </h2>
            <p>
              Née d&apos;une volonté simple : offrir à chaque Malgache un service
              d&apos;optique d&apos;excellence, sans avoir à quitter l&apos;île. Près de trois
              décennies plus tard, c&apos;est une histoire qui continue de grandir : cinq
              boutiques, cinq opticiens diplômés et plus de 100 marques partenaires.
            </p>
            <p>Nos cinq cabinets sont agréés par le Ministère de la Santé.</p>
          </div>
          <div className="stats">
            <div className="stat">
              <b>1997</b>
              <span>Première boutique</span>
            </div>
            <div className="stat">
              <b>05</b>
              <span>Adresses à Madagascar</span>
            </div>
            <div className="stat">
              <b>05</b>
              <span>Opticiens diplômés</span>
            </div>
            <div className="stat">
              <b>100+</b>
              <span>Marques partenaires</span>
            </div>
          </div>
        </div>
      </section>

      <section className="booking-section" id="rdv">
        <div className="container">
          <div className="booking-wrap">
            <div className="booking-side">
              <span className="mono" style={{ color: "var(--ink-3)" }}>
                §05 — Rendez-vous
              </span>
              <h2 style={{ marginTop: 14 }}>
                <b>Réservez</b>
                <br />
                en deux minutes.
              </h2>
              <p className="lede">
                Disponibilités en temps réel sur les trois boutiques. Confirmation par e-mail et
                SMS, gratuite, sans engagement.
              </p>
              <ul>
                <li>
                  <b>30 minutes</b>&nbsp; en moyenne par examen
                </li>
                <li>
                  <b>Tiers payant</b>&nbsp; avec les principales mutuelles
                </li>
                <li>
                  <b>Annulation libre</b>&nbsp; jusqu&apos;à 24 heures avant
                </li>
              </ul>
            </div>
            <Booking />
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="foot-grid">
            <div>
              <div className="brand">
                <Image src="/krys.svg" alt="Krys" width={62} height={28} />
                <span className="name">Krys Madagascar</span>
              </div>
              <p
                style={{
                  marginTop: 14,
                  color: "var(--ink-2)",
                  fontSize: 13,
                  maxWidth: "32ch",
                  lineHeight: 1.55,
                }}
              >
                Cinq cabinets d&apos;optique à Madagascar, affiliés au réseau Krys.
              </p>
            </div>
            <div>
              <h4>Boutiques</h4>
              <ul>
                <li>
                  <a href="#boutiques">Opticien Krys Akoor Digue</a>
                </li>
                <li>
                  <a href="#boutiques">Krys Antananarivo - Soarano</a>
                </li>
                <li>
                  <a href="#boutiques">Krys Antananarivo - Cc Zoom</a>
                </li>
                <li>
                  <a href="#boutiques">Krys Optique, Nosy Be</a>
                </li>
                <li>
                  <a href="#boutiques">Opticien Krys Antsiranana</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Services</h4>
              <ul>
                <li>
                  <a href="#services">Examens</a>
                </li>
                <li>
                  <a href="#services">Lunettes</a>
                </li>
                <li>
                  <a href="#services">Lentilles</a>
                </li>
                <li>
                  <a href="#services">Réparations</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Maison</h4>
              <ul>
                <li>
                  <a href="#histoire">Histoire</a>
                </li>
                <li>
                  <a href="#partenaires">Marques</a>
                </li>
              </ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul className="contact-list">
                <li>
                  <a href="#">+261 20 22 234 56</a>
                </li>
                <li>
                  <a href="mailto:o.ingenierie@gmail.com">
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="4" width="20" height="16" rx="2" />
                      <path d="M22 7 12 13 2 7" />
                    </svg>
                    o.ingenierie@gmail.com
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/opticien.krys.madagascar/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <rect x="2" y="2" width="20" height="20" rx="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.facebook.com/profile.php?id=100091237004354"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                    </svg>
                    Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="foot-bottom">
            <span>© 2026 Krys Madagascar</span>
            <span>Mentions légales · Confidentialité</span>
          </div>
        </div>
      </footer>
    </>
  );
}
