import { Language } from '../contexts/LanguageContext';

export const PLANT_NAME_EN: Record<string, string> = {
  Tomaten: 'Tomatoes',
  Erdbeeren: 'Strawberries',
  Salat: 'Lettuce',
  Karotten: 'Carrots',
  Rosen: 'Roses',
  Paprika: 'Peppers',
  Zucchini: 'Zucchini',
  Gurken: 'Cucumbers',
  Radieschen: 'Radishes',
  Basilikum: 'Basil',
  Kürbis: 'Squash',
  Kartoffeln: 'Potatoes',
  Zwiebeln: 'Onions',
  Knoblauch: 'Garlic',
  Himbeeren: 'Raspberries',
  Lavendel: 'Lavender',
  Petersilie: 'Parsley',
  Schnittlauch: 'Chives',
  Spinat: 'Spinach',
  Apfelbaum: 'Apple Tree',
  Tulpen: 'Tulips',
  Sonnenblumen: 'Sunflowers',
  Dahlien: 'Dahlias',
  Geranien: 'Geraniums',
  Hortensien: 'Hydrangeas',
  Pfingstrosen: 'Peonies',
  Chrysanthemen: 'Chrysanthemums',
  Ringelblumen: 'Marigolds',
  Birnbaum: 'Pear Tree',
  Kirschbaum: 'Cherry Tree',
  Pflaume: 'Plum Tree',
  Haselnuss: 'Hazelnut',
};

export function getPlantDisplayName(name: string, language: Language): string {
  if (language === 'de') return name;
  return PLANT_NAME_EN[name] ?? name;
}

// Default notes as shipped in defaultPlants.ts (German), keyed by plant name.
// Used to detect whether a plant's notes are still the untouched default text.
const PLANT_NOTES_DE: Record<string, string> = {
  Tomaten: 'Beliebtes Gemüse für Garten und Balkon',
  Erdbeeren: 'Mehrjährige Pflanze',
  Salat: 'Schnell wachsend',
  Karotten: 'Wurzelgemüse',
  Rosen: 'Zierpflanze',
  Paprika: 'Wärmeliebendes Gemüse',
  Zucchini: 'Ertragreiche Kürbispflanze',
  Gurken: 'Kletterpflanze',
  Radieschen: 'Schnellwachsend',
  Basilikum: 'Beliebtes Küchenkraut',
  Kürbis: 'Große Früchte',
  Kartoffeln: 'Grundnahrungsmittel',
  Zwiebeln: 'Lagerfähig',
  Knoblauch: 'Herbstpflanzung',
  Himbeeren: 'Beerenobst',
  Lavendel: 'Duftpflanze',
  Petersilie: 'Zweijähriges Kraut',
  Schnittlauch: 'Mehrjährig',
  Spinat: 'Frühjahrs- und Herbstanbau',
  Apfelbaum: 'Obstbaum',
  Tulpen: 'Frühjahrszwiebel',
  Sonnenblumen: 'Einjährige Sommerblume',
  Dahlien: 'Knollenblume, nicht frosthart',
  Geranien: 'Balkonpflanze (Pelargonien)',
  Hortensien: 'Schattenliebender Strauch',
  Pfingstrosen: 'Mehrjährige Staude',
  Chrysanthemen: 'Herbstblüher',
  Ringelblumen: 'Einjährige Heilpflanze',
  Birnbaum: 'Obstbaum',
  Kirschbaum: 'Süß- oder Sauerkirsche',
  Pflaume: 'Steinobst / Zwetschge',
  Haselnuss: 'Strauch / kleiner Baum',
};

const PLANT_NOTES_EN: Record<string, string> = {
  Tomaten: 'Popular vegetable for garden and balcony',
  Erdbeeren: 'Perennial plant',
  Salat: 'Fast growing',
  Karotten: 'Root vegetable',
  Rosen: 'Ornamental plant',
  Paprika: 'Heat-loving vegetable',
  Zucchini: 'High-yielding squash plant',
  Gurken: 'Climbing plant',
  Radieschen: 'Fast growing',
  Basilikum: 'Popular culinary herb',
  Kürbis: 'Large fruits',
  Kartoffeln: 'Staple food',
  Zwiebeln: 'Good keeper',
  Knoblauch: 'Autumn planting',
  Himbeeren: 'Berry fruit',
  Lavendel: 'Fragrant plant',
  Petersilie: 'Biennial herb',
  Schnittlauch: 'Perennial',
  Spinat: 'Spring and autumn cultivation',
  Apfelbaum: 'Fruit tree',
  Tulpen: 'Spring bulb',
  Sonnenblumen: 'Annual summer flower',
  Dahlien: 'Tuberous flower, not frost-hardy',
  Geranien: 'Balcony plant (pelargoniums)',
  Hortensien: 'Shade-loving shrub',
  Pfingstrosen: 'Perennial',
  Chrysanthemen: 'Autumn bloomer',
  Ringelblumen: 'Annual medicinal plant',
  Birnbaum: 'Fruit tree',
  Kirschbaum: 'Sweet or sour cherry',
  Pflaume: 'Stone fruit / plum',
  Haselnuss: 'Shrub / small tree',
};

// Translates a plant's notes ONLY if they still match the untouched default
// German text for that plant name. User-edited notes are left untouched.
export function getPlantDisplayNotes(
  name: string,
  notes: string | undefined,
  language: Language
): string | undefined {
  if (!notes || language === 'de') return notes;
  if (PLANT_NOTES_DE[name] !== notes) return notes;
  return PLANT_NOTES_EN[name] ?? notes;
}
