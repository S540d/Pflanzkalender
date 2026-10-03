import { COMPANION_PAIRS, getCompanions } from '../../src/constants/companionPlanting';
import { DEFAULT_PLANTS } from '../../src/constants/defaultPlants';

describe('companionPlanting', () => {
  const defaultNames = new Set(DEFAULT_PLANTS.map((p) => p.name));

  it('verwendet nur Namen der vordefinierten Pflanzen (Tippfehler-Schutz)', () => {
    const all = [...COMPANION_PAIRS.good, ...COMPANION_PAIRS.bad].flat();
    const unknown = all.filter((n) => !defaultNames.has(n));
    expect(unknown).toEqual([]);
  });

  it('kein Paar ist gleichzeitig gut und schlecht', () => {
    const key = (a: string, b: string) => [a, b].sort().join('|');
    const good = new Set(COMPANION_PAIRS.good.map(([a, b]) => key(a, b)));
    const conflicts = COMPANION_PAIRS.bad.filter(([a, b]) => good.has(key(a, b)));
    expect(conflicts).toEqual([]);
  });

  it('enthält keine Selbstbezüge oder Duplikate', () => {
    const key = (a: string, b: string) => [a, b].sort().join('|');
    for (const list of [COMPANION_PAIRS.good, COMPANION_PAIRS.bad]) {
      list.forEach(([a, b]) => expect(a).not.toBe(b));
      const keys = list.map(([a, b]) => key(a, b));
      expect(new Set(keys).size).toBe(keys.length);
    }
  });

  it('Beziehungen sind symmetrisch', () => {
    expect(getCompanions('Tomaten').good).toContain('Basilikum');
    expect(getCompanions('Basilikum').good).toContain('Tomaten');
    expect(getCompanions('Kartoffeln').bad).toContain('Tomaten');
    expect(getCompanions('Tomaten').bad).toContain('Kartoffeln');
  });

  it('liefert für unbekannte oder eigene Pflanzen leere Listen', () => {
    expect(getCompanions('Eigene Pflanze')).toEqual({ good: [], bad: [] });
  });

  it('gibt Kopien zurück (keine Mutation der Daten möglich)', () => {
    getCompanions('Tomaten').good.push('X');
    expect(getCompanions('Tomaten').good).not.toContain('X');
  });
});
