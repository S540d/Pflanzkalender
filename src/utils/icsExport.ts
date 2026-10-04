import type { Plant } from '../types';

/**
 * iCalendar-Export (RFC 5545): jede Aktivität wird zu einem ganztägigen Termin.
 * Halbmonats-Index → Datum: gerade Indizes = 1.–15., ungerade = 16.–Monatsende.
 */

const CRLF = '\r\n';

export interface IcsEventSource {
  plantName: string;
  activityLabel: string;
  startMonth: number;
  endMonth: number;
  uid: string;
  notes?: string;
}

/** Escaping für TEXT-Werte (RFC 5545 §3.3.11). */
export function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/** Faltet Zeilen auf max. 75 Oktette (UTF-8-sicher, trennt nie mitten im Zeichen). */
export function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;

  const parts: string[] = [];
  let current = '';
  let currentBytes = 0;
  // Folgezeilen beginnen mit einem Leerzeichen (1 Oktett) → 74 Nutzoktette
  let limit = 75;
  for (const ch of line) {
    const bytes = encoder.encode(ch).length;
    if (currentBytes + bytes > limit) {
      parts.push(current);
      current = '';
      currentBytes = 0;
      limit = 74;
    }
    current += ch;
    currentBytes += bytes;
  }
  parts.push(current);
  return parts.join(CRLF + ' ');
}

const pad = (n: number): string => String(n).padStart(2, '0');

function formatDate(year: number, month: number, day: number): string {
  // Date.UTC normalisiert Überläufe (z. B. 32. Dez → 1. Jan Folgejahr)
  const d = new Date(Date.UTC(year, month, day));
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

/** Erster Tag des Halbmonats-Index (als YYYYMMDD). */
export function halfMonthStartDate(year: number, index: number): string {
  const month = Math.floor(index / 2);
  return formatDate(year, month, index % 2 === 0 ? 1 : 16);
}

/** Tag NACH dem Ende des Halbmonats-Index (DTEND ist bei Ganztagsterminen exklusiv). */
export function halfMonthEndExclusiveDate(year: number, index: number): string {
  const month = Math.floor(index / 2);
  // 1. Hälfte endet am 15. → exklusiv 16.; 2. Hälfte → 1. des Folgemonats
  return index % 2 === 0 ? formatDate(year, month, 16) : formatDate(year, month + 1, 1);
}

function formatTimestamp(date: Date): string {
  return (
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}` +
    `T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`
  );
}

export function buildIcs(
  events: IcsEventSource[],
  options: { year: number; now?: Date; calendarName?: string }
): string {
  const { year, now = new Date(), calendarName = 'Pflanzkalender' } = options;
  const stamp = formatTimestamp(now);

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pflanzkalender//DE',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
  ];

  for (const ev of events) {
    lines.push(
      'BEGIN:VEVENT',
      `UID:${ev.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${halfMonthStartDate(year, ev.startMonth)}`,
      `DTEND;VALUE=DATE:${halfMonthEndExclusiveDate(year, ev.endMonth)}`,
      `SUMMARY:${escapeIcsText(`${ev.plantName}: ${ev.activityLabel}`)}`
    );
    if (ev.notes) lines.push(`DESCRIPTION:${escapeIcsText(ev.notes)}`);
    lines.push(
      'TRANSP:TRANSPARENT',
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${escapeIcsText(`${ev.plantName}: ${ev.activityLabel}`)}`,
      // Erinnerung am Starttag um 09:00 Uhr (relativ zum Beginn des Ganztagstermins)
      'TRIGGER;RELATED=START:PT9H',
      'END:VALARM',
      'END:VEVENT'
    );
  }

  lines.push('END:VCALENDAR');
  return lines.map(foldIcsLine).join(CRLF) + CRLF;
}

/** Wandelt Pflanzen in Termin-Quellen um; Namen/Labels kommen vom Aufrufer (i18n). */
export function plantsToIcsEvents(
  plants: Plant[],
  year: number,
  resolve: {
    plantName: (plant: Plant) => string;
    activityLabel: (activity: Plant['activities'][number]) => string;
    notes?: (plant: Plant) => string | undefined;
  }
): IcsEventSource[] {
  const events: IcsEventSource[] = [];
  for (const plant of plants) {
    for (const activity of plant.activities) {
      events.push({
        plantName: resolve.plantName(plant),
        activityLabel: resolve.activityLabel(activity),
        startMonth: activity.startMonth,
        endMonth: activity.endMonth,
        uid: `${plant.id}-${activity.id}-${year}@pflanzkalender`,
        notes: resolve.notes?.(plant),
      });
    }
  }
  return events;
}
