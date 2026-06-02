"use client";

import { useEffect, useState } from "react";

export type DayHours = { open: string; close: string };

/**
 * Opening hours for a boutique. Each day is a list of ranges:
 *   - empty array → closed that day
 *   - one range   → continuous opening (e.g. 9h00–18h00)
 *   - two ranges  → split shift with a midday break
 *     (e.g. 9h00–12h00 then 14h00–18h00)
 *
 * Hour strings accept the French "8h30" form as well as "08:30".
 */
export type Schedule = {
  weekdays: DayHours[];
  sunday: DayHours[];
};

// "8h30", "08:30", "9h" → minutes since midnight.
function parseHHMM(s: string): number {
  const m = s.match(/(\d{1,2})\s*[h:]\s*(\d{0,2})/);
  if (!m) return 0;
  return parseInt(m[1], 10) * 60 + parseInt(m[2] || "0", 10);
}

/**
 * Returns the day-of-week (0 = Sunday) and minutes-since-midnight for
 * the given instant, evaluated in Madagascar local time. Madagascar is
 * a fixed UTC+3 zone (no DST), shared with Africa/Nairobi.
 */
function madagascarNow(d: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Nairobi",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  const dayMap: Record<string, number> = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };
  return {
    dayOfWeek: dayMap[get("weekday")] ?? 1,
    minutes: parseInt(get("hour"), 10) * 60 + parseInt(get("minute"), 10),
  };
}

function isOpen(schedule: Schedule, d: Date): boolean {
  const { dayOfWeek, minutes } = madagascarNow(d);
  const ranges = dayOfWeek === 0 ? schedule.sunday : schedule.weekdays;
  return ranges.some(
    (r) => minutes >= parseHHMM(r.open) && minutes < parseHHMM(r.close),
  );
}

export function OpenStatus({ schedule }: { schedule: Schedule }) {
  // `now` stays null during SSR and the initial client render, so server
  // and client output the same placeholder (no hydration mismatch).
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    // Re-evaluate every minute so the badge flips on its own when a
    // boutique opens or closes — no page reload required.
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!now) {
    // Reserve layout space so the row doesn't jump on hydration.
    return (
      <span className="tag" aria-hidden="true" style={{ visibility: "hidden" }}>
        ● Fermé
      </span>
    );
  }

  const open = isOpen(schedule, now);
  return (
    <span className={`tag ${open ? "open" : ""}`.trim()}>
      {open ? "● Ouvert" : "● Fermé"}
    </span>
  );
}
