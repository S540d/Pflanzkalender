import { getPlantDisplayName, PLANT_NAME_EN } from '../../src/constants/plantNames';

describe('getPlantDisplayName', () => {
  it('returns the original German name when language is de', () => {
    expect(getPlantDisplayName('Tomaten', 'de')).toBe('Tomaten');
    expect(getPlantDisplayName('Erdbeeren', 'de')).toBe('Erdbeeren');
  });

  it('returns the English translation for known default plants', () => {
    expect(getPlantDisplayName('Tomaten', 'en')).toBe('Tomatoes');
    expect(getPlantDisplayName('Erdbeeren', 'en')).toBe('Strawberries');
    expect(getPlantDisplayName('Karotten', 'en')).toBe('Carrots');
  });

  it('falls back to the original name for unknown / custom plants in EN', () => {
    expect(getPlantDisplayName('Meine Pflanze', 'en')).toBe('Meine Pflanze');
    expect(getPlantDisplayName('Custom Plant', 'en')).toBe('Custom Plant');
  });

  it('falls back to the EN translation for other localized languages', () => {
    expect(getPlantDisplayName('Tomaten', 'fr')).toBe('Tomatoes');
    expect(getPlantDisplayName('Tomaten', 'es')).toBe('Tomatoes');
  });

  it('falls back to the original name for other languages with unknown plants', () => {
    expect(getPlantDisplayName('Unbekannt', 'fr')).toBe('Unbekannt');
  });

  it('PLANT_NAME_EN covers all 32 default plants', () => {
    const expectedNames = [
      'Tomaten', 'Erdbeeren', 'Salat', 'Karotten', 'Rosen', 'Paprika',
      'Zucchini', 'Gurken', 'Radieschen', 'Basilikum', 'Kürbis', 'Kartoffeln',
      'Zwiebeln', 'Knoblauch', 'Himbeeren', 'Lavendel', 'Petersilie', 'Schnittlauch',
      'Spinat', 'Apfelbaum', 'Tulpen', 'Sonnenblumen', 'Dahlien', 'Geranien',
      'Hortensien', 'Pfingstrosen', 'Chrysanthemen', 'Ringelblumen',
      'Birnbaum', 'Kirschbaum', 'Pflaume', 'Haselnuss',
    ];
    for (const name of expectedNames) {
      expect(PLANT_NAME_EN[name]).toBeDefined();
    }
  });
});
