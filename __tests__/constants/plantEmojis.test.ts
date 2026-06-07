import { getPlantEmoji, PLANT_EMOJI } from '../../src/constants/plantEmojis';

describe('plantEmojis', () => {
  it('returns the specific emoji for a known plant', () => {
    expect(getPlantEmoji('Tomaten', 'vegetable')).toBe('🍅');
    expect(getPlantEmoji('Rosen', 'flower')).toBe('🌹');
    expect(getPlantEmoji('Apfelbaum', 'tree')).toBe('🍎');
  });

  it('ignores the category when a specific emoji exists', () => {
    // Even with a mismatched category the specific mapping wins
    expect(getPlantEmoji('Tomaten', 'tree')).toBe('🍅');
  });

  it('falls back to the category emoji for unknown plants', () => {
    expect(getPlantEmoji('Unbekannt', 'vegetable')).toBe('🥦');
    expect(getPlantEmoji('Unbekannt', 'flower')).toBe('🌸');
    expect(getPlantEmoji('Unbekannt', 'tree')).toBe('🌳');
  });

  it('falls back to a generic seedling when no category is given', () => {
    expect(getPlantEmoji('Unbekannt')).toBe('🌱');
  });

  it('maps every entry to a non-empty string', () => {
    for (const [name, emoji] of Object.entries(PLANT_EMOJI)) {
      expect(typeof emoji).toBe('string');
      expect(emoji.length).toBeGreaterThan(0);
      expect(name.length).toBeGreaterThan(0);
    }
  });
});
