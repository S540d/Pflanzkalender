import { PlantCategory } from '../types';
import { PLANT_CATEGORY_METADATA } from './plantMetadata';

/**
 * Repräsentatives Emoji je Pflanze (Schlüssel = deutscher Pflanzenname).
 *
 * Ziel (Issue #161): Pflanzen sollen auch ohne Sprachkenntnisse erkennbar sein.
 * Ein Bild/Emoji ist sprachunabhängig – ideal für internationale Nutzer.
 *
 * Pflanzen ohne eindeutiges Emoji werden bewusst NICHT gemappt und fallen über
 * getPlantEmoji() auf das Kategorie-Emoji zurück (Single Source of Truth in
 * plantMetadata.ts). So bleibt die Anzeige immer aussagekräftig.
 */
export const PLANT_EMOJI: Record<string, string> = {
  Tomaten: '🍅',
  Erdbeeren: '🍓',
  Salat: '🥬',
  Karotten: '🥕',
  Rosen: '🌹',
  Paprika: '🫑',
  Zucchini: '🥒',
  Gurken: '🥒',
  Basilikum: '🌿',
  Kürbis: '🎃',
  Kartoffeln: '🥔',
  Zwiebeln: '🧅',
  Knoblauch: '🧄',
  Himbeeren: '🫐',
  Lavendel: '🪻',
  Petersilie: '🌿',
  Schnittlauch: '🌿',
  Spinat: '🥬',
  Apfelbaum: '🍎',
  Tulpen: '🌷',
  Sonnenblumen: '🌻',
  Dahlien: '🌸',
  Geranien: '🌺',
  Hortensien: '💐',
  Pfingstrosen: '🌸',
  Chrysanthemen: '🌼',
  Ringelblumen: '🌼',
  Birnbaum: '🍐',
  Kirschbaum: '🍒',
  Pflaume: '🍑',
  Haselnuss: '🌰',
};

const DEFAULT_EMOJI = '🌱';

/**
 * Liefert ein sprachunabhängiges Emoji für eine Pflanze.
 * Reihenfolge: spezifisches Pflanzen-Emoji → Kategorie-Emoji → generischer Sämling.
 */
export function getPlantEmoji(name: string, category?: PlantCategory): string {
  return PLANT_EMOJI[name] ?? (category ? PLANT_CATEGORY_METADATA[category].icon : DEFAULT_EMOJI);
}
