/**
 * Mischkultur-Hinweise für die vordefinierten Pflanzen (Issue-Vorschlag „Fruchtfolge &
 * Mischkultur", nur statische Daten).
 *
 * WICHTIG – Datenqualität: Die Paare stammen aus gängigen, im deutschsprachigen Raum
 * verbreiteten Mischkultur-Tabellen und sind **Orientierungswerte**, keine
 * wissenschaftlich belegten Garantien; Quellen widersprechen sich teilweise. Bewusst nur
 * weit verbreitete Paarungen aufgenommen – im Zweifel weglassen statt raten. Vor einem
 * Ausbau der Liste fachlich gegenprüfen (z. B. Gartenbau-Fachliteratur).
 *
 * Schlüssel sind die deutschen Standard-Pflanzennamen aus `defaultPlants.ts`
 * (`__tests__/constants/companionPlanting.test.ts` stellt das sicher). Beziehungen sind
 * symmetrisch und werden aus den Paarlisten abgeleitet.
 */

type Pair = readonly [string, string];

/** Gute Nachbarn. */
const GOOD_PAIRS: readonly Pair[] = [
  ['Tomaten', 'Basilikum'],
  ['Tomaten', 'Knoblauch'],
  ['Tomaten', 'Karotten'],
  ['Tomaten', 'Petersilie'],
  ['Tomaten', 'Ringelblumen'],
  ['Paprika', 'Basilikum'],
  ['Karotten', 'Zwiebeln'],
  ['Karotten', 'Knoblauch'],
  ['Karotten', 'Schnittlauch'],
  ['Karotten', 'Radieschen'],
  ['Karotten', 'Salat'],
  ['Erdbeeren', 'Knoblauch'],
  ['Erdbeeren', 'Zwiebeln'],
  ['Erdbeeren', 'Schnittlauch'],
  ['Erdbeeren', 'Spinat'],
  ['Erdbeeren', 'Salat'],
  ['Salat', 'Radieschen'],
  ['Salat', 'Zwiebeln'],
  ['Salat', 'Gurken'],
  ['Gurken', 'Zwiebeln'],
  ['Gurken', 'Sonnenblumen'],
  ['Spinat', 'Radieschen'],
  ['Rosen', 'Lavendel'],
  ['Rosen', 'Knoblauch'],
  ['Rosen', 'Schnittlauch'],
];

/** Besser getrennt halten. */
const BAD_PAIRS: readonly Pair[] = [
  ['Kartoffeln', 'Tomaten'],
  ['Kartoffeln', 'Paprika'],
  ['Kartoffeln', 'Gurken'],
  ['Gurken', 'Tomaten'],
  ['Gurken', 'Radieschen'],
];

export interface Companions {
  good: string[];
  bad: string[];
}

function buildIndex(pairs: readonly Pair[]): Map<string, string[]> {
  const index = new Map<string, string[]>();
  const add = (from: string, to: string) => {
    const list = index.get(from) ?? [];
    if (!list.includes(to)) list.push(to);
    index.set(from, list);
  };
  for (const [a, b] of pairs) {
    add(a, b);
    add(b, a);
  }
  return index;
}

const GOOD_INDEX = buildIndex(GOOD_PAIRS);
const BAD_INDEX = buildIndex(BAD_PAIRS);

export const COMPANION_PAIRS = { good: GOOD_PAIRS, bad: BAD_PAIRS } as const;

/** Namen sind deutsche Standardnamen; unbekannte (eigene) Pflanzen liefern leere Listen. */
export function getCompanions(plantName: string): Companions {
  return {
    good: [...(GOOD_INDEX.get(plantName) ?? [])],
    bad: [...(BAD_INDEX.get(plantName) ?? [])],
  };
}
