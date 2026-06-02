"use client";

import { useMemo, useState } from "react";

// `redirect` (optional) routes the booking flow to a third-party site
// (Madadoc, for the three Antananarivo boutiques). When set, selecting
// the store swaps the in-app "Continuer" CTA for a link to that URL,
// skipping the service/date/time/contact steps entirely.
type Store = {
  value: string;
  sub: string;
  redirect?: string;
};

const STORES: Store[] = [
  {
    value: "KRYS - Antananarivo Akoor Digue",
    sub: "Antananarivo",
    redirect:
      "https://madadoc.com/fr/p/ophtalmologue/antananarivo/ophtalmologue-krys-akoor-digue",
  },
  {
    value: "Krys Antananarivo - Soarano",
    sub: "Gare Soarano",
    redirect:
      "https://madadoc.com/fr/p/ophtalmologue/antananarivo/ophtalmologue-krys-gare-soarano",
  },
  {
    value: "Krys Antananarivo - Cc Zoom",
    sub: "Centre commercial Zoom",
    redirect:
      "https://madadoc.com/fr/p/ophtalmologue/antananarivo/ophtalmologue-krys-zoom-optique",
  },
  { value: "Krys Optique", sub: "Nosy Be · Hell-Ville" },
  { value: "KRYS - Antsiranana Centre", sub: "Antsiranana" },
  {
    value: "KRYS - Antananarivo Analakely",
    sub: "Centre Commercial Arkadia",
  },
];

const SERVICES = [
  { value: "Examen de vue", sub: "30 min" },
  { value: "Lentilles", sub: "45 min · adaptation" },
  { value: "Choix de monture", sub: "30 min" },
  { value: "Solaires Rx", sub: "30 min" },
  { value: "Bilan enfant", sub: "30 min · ≥ 6 ans" },
  { value: "Suivi annuel", sub: "20 min" },
];

const SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00",
];
const UNAVAILABLE = new Set(["10:30", "14:00", "16:00"]);

const DAYS = ["DIM", "LUN", "MAR", "MER", "JEU", "VEN", "SAM"];
const MONTHS = ["JAN", "FÉV", "MAR", "AVR", "MAI", "JUI", "JUL", "AOÛ", "SEP", "OCT", "NOV", "DÉC"];

type DateChoice = { iso: string; label: string; day: string; date: string; month: string };

const STEP_LABELS = ["Boutique", "Service", "Date", "Heure", "Vous"];

export default function Booking() {
  const dates = useMemo<DateChoice[]>(() => {
    const out: DateChoice[] = [];
    const d = new Date();
    d.setDate(d.getDate() + 1);
    while (out.length < 10) {
      if (d.getDay() !== 0) {
        const day = DAYS[d.getDay()];
        const date = String(d.getDate());
        const month = MONTHS[d.getMonth()];
        out.push({
          iso: d.toISOString().slice(0, 10),
          label: `${day} ${date} ${month}`,
          day,
          date,
          month,
        });
      }
      d.setDate(d.getDate() + 1);
    }
    return out;
  }, []);

  const [step, setStep] = useState(1);
  const [store, setStore] = useState<string | null>(null);
  const [service, setService] = useState<string | null>(null);
  const [date, setDate] = useState<DateChoice | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const canNext =
    (step === 1 && !!store) ||
    (step === 2 && !!service) ||
    (step === 3 && !!date) ||
    (step === 4 && !!time);

  // If the selected store delegates booking to a third-party site, we
  // surface that URL on the step 1 CTA and skip the remaining steps.
  const externalUrl = STORES.find((s) => s.value === store)?.redirect;

  function restart() {
    setStep(1);
    setStore(null);
    setService(null);
    setDate(null);
    setTime(null);
    setConfirmed(false);
  }

  const stepperState = (n: number): string => {
    if (confirmed) return "done";
    if (n === step) return "active";
    if (n < step) return "done";
    return "";
  };

  return (
    <div className="booking" id="booking">
      <div className="stepper">
        {STEP_LABELS.map((lbl, i) => {
          const n = i + 1;
          const cls = stepperState(n);
          return (
            <div key={lbl} className={`step ${cls}`.trim()} data-step={n}>
              <div className="n">
                <span>{n}</span>
              </div>
              <div className="lbl">{lbl}</div>
            </div>
          );
        })}
      </div>

      {!confirmed && step === 1 && (
        <div className="panel active">
          <h4>Choisissez votre boutique</h4>
          <p className="hint">Tous nos cabinets proposent l&apos;ensemble des services.</p>
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
          {externalUrl && (
            <p className="hint" style={{ marginTop: 16, marginBottom: 0 }}>
              Cette boutique gère ses rendez-vous sur Madadoc. Vous serez
              redirigé vers leur site.
            </p>
          )}
          <div className="actions">
            <span />
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="next-btn"
              >
                Réserver sur Madadoc ↗
              </a>
            ) : (
              <button
                type="button"
                className="next-btn"
                disabled={!canNext}
                onClick={() => setStep(2)}
              >
                Continuer →
              </button>
            )}
          </div>
        </div>
      )}

      {!confirmed && step === 2 && (
        <div className="panel active">
          <h4>Quel service ?</h4>
          <p className="hint">Choisissez le motif de votre visite.</p>
          <div className="choice-grid">
            {SERVICES.map((s) => (
              <button
                key={s.value}
                type="button"
                className={`choice ${service === s.value ? "selected" : ""}`}
                onClick={() => setService(s.value)}
              >
                <span className="title">{s.value}</span>
                <span className="sub">{s.sub}</span>
              </button>
            ))}
          </div>
          <div className="actions">
            <button type="button" className="back-link" onClick={() => setStep(1)}>
              ← Retour
            </button>
            <button
              type="button"
              className="next-btn"
              disabled={!canNext}
              onClick={() => setStep(3)}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {!confirmed && step === 3 && (
        <div className="panel active">
          <h4>Quelle date ?</h4>
          <p className="hint">Sélectionnez un jour dans les deux semaines à venir.</p>
          <div className="choice-grid cols-5">
            {dates.map((d) => (
              <button
                key={d.iso}
                type="button"
                className={`choice ${date?.iso === d.iso ? "selected" : ""}`}
                onClick={() => setDate(d)}
              >
                <span className="day">{d.day}</span>
                <span className="date">{d.date}</span>
                <span className="day">{d.month}</span>
              </button>
            ))}
          </div>
          <div className="actions">
            <button type="button" className="back-link" onClick={() => setStep(2)}>
              ← Retour
            </button>
            <button
              type="button"
              className="next-btn"
              disabled={!canNext}
              onClick={() => setStep(4)}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {!confirmed && step === 4 && (
        <div className="panel active">
          <h4>Quel créneau ?</h4>
          <p className="hint">Les créneaux grisés ne sont plus disponibles.</p>
          <div className="choice-grid cols-5">
            {SLOTS.map((s) => {
              const disabled = UNAVAILABLE.has(s);
              return (
                <button
                  key={s}
                  type="button"
                  className={`choice ${time === s ? "selected" : ""}`}
                  disabled={disabled}
                  onClick={() => setTime(s)}
                >
                  <span className="time">{s}</span>
                </button>
              );
            })}
          </div>
          <div className="actions">
            <button type="button" className="back-link" onClick={() => setStep(3)}>
              ← Retour
            </button>
            <button
              type="button"
              className="next-btn"
              disabled={!canNext}
              onClick={() => setStep(5)}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {!confirmed && step === 5 && (
        <div className="panel active">
          <h4>Vos coordonnées</h4>
          <p className="hint">Confirmation par e-mail et SMS.</p>
          <div className="summary">
            <div className="row">
              <span>Boutique</span>
              <b>{store}</b>
            </div>
            <div className="row">
              <span>Service</span>
              <b>{service}</b>
            </div>
            <div className="row">
              <span>Date</span>
              <b>{date?.label}</b>
            </div>
            <div className="row">
              <span>Heure</span>
              <b>{time}</b>
            </div>
          </div>
          <div className="form-row">
            <div className="field">
              <label htmlFor="firstname">Prénom</label>
              <input id="firstname" type="text" placeholder="Hery" />
            </div>
            <div className="field">
              <label htmlFor="lastname">Nom</label>
              <input id="lastname" type="text" placeholder="Rakotoarisoa" />
            </div>
          </div>
          <div className="form-row" style={{ marginTop: 10 }}>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" type="email" placeholder="hery@example.mg" />
            </div>
            <div className="field">
              <label htmlFor="phone">Téléphone</label>
              <input id="phone" type="tel" placeholder="+261 34 ..." />
            </div>
          </div>
          <div className="form-row single" style={{ marginTop: 10 }}>
            <div className="field">
              <label htmlFor="notes">Précisions (facultatif)</label>
              <textarea id="notes" rows={2} placeholder="Renouvellement, première visite..." />
            </div>
          </div>
          <div className="actions">
            <button type="button" className="back-link" onClick={() => setStep(4)}>
              ← Retour
            </button>
            <button type="button" className="next-btn" onClick={() => setConfirmed(true)}>
              Confirmer
            </button>
          </div>
        </div>
      )}

      {confirmed && (
        <div className="panel active">
          <div className="confirmed">
            <div className="check">✓</div>
            <h4>Rendez-vous confirmé</h4>
            <p>
              Confirmation envoyée. Nous vous attendons à <b>{store}</b>,{" "}
              <span>
                {date?.label.toLowerCase()} à {time}
              </span>
              .
            </p>
            <div style={{ marginTop: 24 }}>
              <button type="button" className="back-link" onClick={restart}>
                Prendre un autre rendez-vous
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
