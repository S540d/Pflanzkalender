import {
  buildIcs,
  escapeIcsText,
  foldIcsLine,
  halfMonthStartDate,
  halfMonthEndExclusiveDate,
  plantsToIcsEvents,
} from '../../src/utils/icsExport';
import type { Plant } from '../../src/types';

const NOW = new Date(Date.UTC(2026, 9, 3, 12, 0, 0));

describe('halfMonth → Datum', () => {
  it('erste Hälfte beginnt am 1., zweite am 16.', () => {
    expect(halfMonthStartDate(2026, 0)).toBe('20260101');
    expect(halfMonthStartDate(2026, 1)).toBe('20260116');
    expect(halfMonthStartDate(2026, 23)).toBe('20261216');
  });

  it('DTEND ist exklusiv: 1. Hälfte → 16., 2. Hälfte → 1. des Folgemonats', () => {
    expect(halfMonthEndExclusiveDate(2026, 0)).toBe('20260116');
    expect(halfMonthEndExclusiveDate(2026, 1)).toBe('20260201');
    expect(halfMonthEndExclusiveDate(2026, 22)).toBe('20261216');
  });

  it('zweite Dezember-Hälfte läuft ins Folgejahr', () => {
    expect(halfMonthEndExclusiveDate(2026, 23)).toBe('20270101');
  });
});

describe('escapeIcsText', () => {
  it('maskiert Backslash, Semikolon, Komma und Zeilenumbrüche', () => {
    expect(escapeIcsText('a;b,c\\d\ne')).toBe('a\\;b\\,c\\\\d\\ne');
  });
});

describe('foldIcsLine', () => {
  it('lässt kurze Zeilen unverändert', () => {
    expect(foldIcsLine('SUMMARY:kurz')).toBe('SUMMARY:kurz');
  });

  it('faltet lange Zeilen auf max. 75 Oktette und stellt sie beim Entfalten wieder her', () => {
    const line = 'DESCRIPTION:' + 'äöü€'.repeat(40);
    const folded = foldIcsLine(line);
    const encoder = new TextEncoder();
    folded.split('\r\n').forEach((part) => {
      expect(encoder.encode(part).length).toBeLessThanOrEqual(75);
    });
    expect(folded.replace(/\r\n /g, '')).toBe(line);
  });
});

describe('buildIcs', () => {
  const event = {
    plantName: 'Tomaten',
    activityLabel: 'Aussäen',
    startMonth: 3,
    endMonth: 5,
    uid: 'p1-sow-2026@pflanzkalender',
    notes: 'Warm, sonnig; nicht zu früh',
  };

  it('erzeugt ein gültiges VCALENDAR mit CRLF-Zeilenenden', () => {
    const ics = buildIcs([event], { year: 2026, now: NOW });
    expect(ics.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\n')).toBe(true);
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true);
    expect(ics).not.toMatch(/[^\r]\n/);
  });

  it('enthält Ganztagstermin mit exklusivem Ende und escaped Notiz', () => {
    const ics = buildIcs([event], { year: 2026, now: NOW });
    expect(ics).toContain('UID:p1-sow-2026@pflanzkalender');
    expect(ics).toContain('DTSTAMP:20261003T120000Z');
    // Halbmonat 3 = Feb 2. Hälfte → 16.02.; Halbmonat 5 = Mär 2. Hälfte → exklusiv 01.04.
    expect(ics).toContain('DTSTART;VALUE=DATE:20260216');
    expect(ics).toContain('DTEND;VALUE=DATE:20260401');
    expect(ics).toContain('SUMMARY:Tomaten: Aussäen');
    expect(ics).toContain('DESCRIPTION:Warm\\, sonnig\\; nicht zu früh');
    expect(ics).toContain('TRIGGER;RELATED=START:PT9H');
  });

  it('lässt DESCRIPTION des Termins weg, wenn keine Notiz vorhanden ist', () => {
    const ics = buildIcs([{ ...event, notes: undefined }], { year: 2026, now: NOW });
    // nur die DESCRIPTION des VALARM
    expect(ics.match(/DESCRIPTION:/g)).toHaveLength(1);
  });

  it('erzeugt für n Termine n VEVENTs', () => {
    const ics = buildIcs([event, { ...event, uid: 'x' }], { year: 2026, now: NOW });
    expect(ics.match(/BEGIN:VEVENT/g)).toHaveLength(2);
    expect(ics.match(/END:VEVENT/g)).toHaveLength(2);
  });
});

describe('plantsToIcsEvents', () => {
  const plant: Plant = {
    id: 'p1',
    name: 'Tomaten',
    isDefault: false,
    userId: null,
    activities: [
      { id: 'a1', type: 'sow', startMonth: 3, endMonth: 5, color: '#000', label: 'Aussäen' },
      { id: 'a2', type: 'harvest', startMonth: 14, endMonth: 17, color: '#000', label: 'Ernten' },
    ],
    notes: 'Notiz',
    createdAt: 1,
    updatedAt: 1,
  };

  it('bildet jede Aktivität mit stabiler UID und aufgelösten Namen ab', () => {
    const events = plantsToIcsEvents([plant], 2026, {
      plantName: (p) => p.name.toUpperCase(),
      activityLabel: (a) => `L-${a.type}`,
      notes: (p) => p.notes,
    });
    expect(events).toHaveLength(2);
    expect(events[0]).toMatchObject({
      plantName: 'TOMATEN',
      activityLabel: 'L-sow',
      startMonth: 3,
      endMonth: 5,
      uid: 'p1-a1-2026@pflanzkalender',
      notes: 'Notiz',
    });
    expect(events[1].uid).toBe('p1-a2-2026@pflanzkalender');
  });
});
