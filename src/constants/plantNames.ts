export const PLANT_NAME_EN: Record<string, string> = {
  'Tomaten': 'Tomatoes',
  'Erdbeeren': 'Strawberries',
  'Salat': 'Lettuce',
  'Karotten': 'Carrots',
  'Rosen': 'Roses',
  'Paprika': 'Peppers',
  'Zucchini': 'Zucchini',
  'Gurken': 'Cucumbers',
  'Radieschen': 'Radishes',
  'Basilikum': 'Basil',
  'Kürbis': 'Squash',
  'Kartoffeln': 'Potatoes',
  'Zwiebeln': 'Onions',
  'Knoblauch': 'Garlic',
  'Himbeeren': 'Raspberries',
  'Lavendel': 'Lavender',
  'Petersilie': 'Parsley',
  'Schnittlauch': 'Chives',
  'Spinat': 'Spinach',
  'Apfelbaum': 'Apple Tree',
  'Tulpen': 'Tulips',
  'Sonnenblumen': 'Sunflowers',
  'Dahlien': 'Dahlias',
  'Geranien': 'Geraniums',
  'Hortensien': 'Hydrangeas',
  'Pfingstrosen': 'Peonies',
  'Chrysanthemen': 'Chrysanthemums',
  'Ringelblumen': 'Marigolds',
  'Birnbaum': 'Pear Tree',
  'Kirschbaum': 'Cherry Tree',
  'Pflaume': 'Plum Tree',
  'Haselnuss': 'Hazelnut',
};

export function getPlantDisplayName(name: string, language: string): string {
  if (language === 'de') return name;
  return PLANT_NAME_EN[name] ?? name;
}
