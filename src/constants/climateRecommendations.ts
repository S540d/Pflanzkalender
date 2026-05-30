export interface ClimateRecommendation {
  name: { de: string; en: string };
  category: 'vegetable' | 'flower' | 'tree';
  icon: string;
  traits: { de: string[]; en: string[] };
  tip: { de: string; en: string };
  droughtResistance: 1 | 2 | 3;
  heatTolerance: 1 | 2 | 3;
}

export const RECOMMENDATIONS: ClimateRecommendation[] = [
  // Nutzpflanzen
  {
    name: { de: 'Süßkartoffel', en: 'Sweet Potato' },
    category: 'vegetable',
    icon: '🍠',
    traits: {
      de: ['Hitzeliebend', 'Trockenresistent', 'Nährstoffreich'],
      en: ['Heat-loving', 'Drought-resistant', 'Nutrient-rich'],
    },
    tip: {
      de: 'Benötigt kaum Wasser nach dem Anwachsen und gedeiht bei sommerlicher Hitze besonders gut.',
      en: 'Needs little water once established and thrives especially well in summer heat.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Linsen', en: 'Lentils' },
    category: 'vegetable',
    icon: '🫘',
    traits: {
      de: ['Trockenresistent', 'Stickstoffbindend', 'Genügsam'],
      en: ['Drought-resistant', 'Nitrogen-fixing', 'Undemanding'],
    },
    tip: {
      de: 'Bindet Stickstoff im Boden und wächst auch auf mageren, trockenen Standorten.',
      en: 'Fixes nitrogen in the soil and grows even on poor, dry sites.',
    },
    droughtResistance: 3,
    heatTolerance: 2,
  },
  {
    name: { de: 'Kichererbse', en: 'Chickpea' },
    category: 'vegetable',
    icon: '🟡',
    traits: {
      de: ['Sehr trockenresistent', 'Hitzetolerant', 'Proteinreich'],
      en: ['Very drought-resistant', 'Heat-tolerant', 'Protein-rich'],
    },
    tip: {
      de: 'Eine der trockenresistentesten Hülsenfrüchte – ideal für heiße, trockene Sommer.',
      en: 'One of the most drought-resistant legumes – ideal for hot, dry summers.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Mangold', en: 'Swiss Chard' },
    category: 'vegetable',
    icon: '🥬',
    traits: {
      de: ['Hitzeverträglich', 'Lange Erntezeit', 'Robust'],
      en: ['Heat-tolerant', 'Long harvest period', 'Robust'],
    },
    tip: {
      de: 'Verträgt hohe Temperaturen besser als Spinat und kann von Frühling bis Herbst geerntet werden.',
      en: 'Tolerates high temperatures better than spinach and can be harvested from spring to autumn.',
    },
    droughtResistance: 2,
    heatTolerance: 3,
  },
  {
    name: { de: 'Kürbis', en: 'Pumpkin' },
    category: 'vegetable',
    icon: '🎃',
    traits: {
      de: ['Tiefwurzelnd', 'Hitzeresistent', 'Ertragsreich'],
      en: ['Deep-rooted', 'Heat-resistant', 'High-yielding'],
    },
    tip: {
      de: 'Tiefe Wurzeln erschließen Wasserreserven im Untergrund – gut angepasst an trockene Sommer.',
      en: 'Deep roots tap water reserves underground – well adapted to dry summers.',
    },
    droughtResistance: 2,
    heatTolerance: 3,
  },
  // Blumen
  {
    name: { de: 'Lavendel', en: 'Lavender' },
    category: 'flower',
    icon: '💜',
    traits: {
      de: ['Sehr trockenresistent', 'Bienenfreundlich', 'Aromatisch'],
      en: ['Very drought-resistant', 'Bee-friendly', 'Aromatic'],
    },
    tip: {
      de: 'Mediterrane Herkunft macht ihn ideal für trockene, heiße Standorte. Benötigt kaum Pflege.',
      en: 'Mediterranean origin makes it ideal for dry, hot sites. Requires little maintenance.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Sonnenhut (Echinacea)', en: 'Coneflower (Echinacea)' },
    category: 'flower',
    icon: '🌸',
    traits: {
      de: ['Trockenresistent', 'Insektenmagnet', 'Mehrjährig'],
      en: ['Drought-resistant', 'Insect magnet', 'Perennial'],
    },
    tip: {
      de: 'Mehrjährig und tiefwurzelnd – übersteht Trockenperioden problemlos und lockt Schmetterlinge an.',
      en: 'Perennial and deep-rooted – survives dry periods easily and attracts butterflies.',
    },
    droughtResistance: 3,
    heatTolerance: 2,
  },
  {
    name: { de: 'Fetthenne (Sedum)', en: 'Stonecrop (Sedum)' },
    category: 'flower',
    icon: '🌿',
    traits: {
      de: ['Sukkulente', 'Extrem trockenresistent', 'Herbstblüher'],
      en: ['Succulent', 'Extremely drought-resistant', 'Autumn bloomer'],
    },
    tip: {
      de: 'Speichert Wasser in den Blättern – übersteht auch längere Trockenheit ohne Schäden.',
      en: 'Stores water in its leaves – survives even longer dry spells without damage.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Salbei', en: 'Sage' },
    category: 'flower',
    icon: '🌱',
    traits: {
      de: ['Mediterran', 'Bienenfreundlich', 'Aromatisch'],
      en: ['Mediterranean', 'Bee-friendly', 'Aromatic'],
    },
    tip: {
      de: 'Durch die silbrigen Blätter reflektiert er Sonnenlicht – perfekt für heiße, trockene Beete.',
      en: 'The silvery leaves reflect sunlight – perfect for hot, dry beds.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Ringelblume', en: 'Marigold' },
    category: 'flower',
    icon: '🟠',
    traits: {
      de: ['Hitzetolerant', 'Schädlingsabwehrend', 'Einjährig'],
      en: ['Heat-tolerant', 'Pest-repelling', 'Annual'],
    },
    tip: {
      de: 'Hält Blattläuse und Nematoden fern – ideal als Begleitpflanze im Gemüsebeet bei Hitze.',
      en: 'Keeps aphids and nematodes away – ideal as a companion plant in the vegetable bed in heat.',
    },
    droughtResistance: 2,
    heatTolerance: 3,
  },
  // Bäume
  {
    name: { de: 'Edelkastanie', en: 'Sweet Chestnut' },
    category: 'tree',
    icon: '🌰',
    traits: {
      de: ['Hitzeresistent', 'Trockenheitstolerant', 'Essbarer Ertrag'],
      en: ['Heat-resistant', 'Drought-tolerant', 'Edible yield'],
    },
    tip: {
      de: 'Besser an Hitze angepasst als Buche und Eiche – liefert essbares Obst auch in Trockenjahren.',
      en: 'Better adapted to heat than beech and oak – provides edible fruit even in dry years.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Robinie', en: 'Black Locust' },
    category: 'tree',
    icon: '🌳',
    traits: {
      de: ['Sehr trockenresistent', 'Stickstoffbindend', 'Hartholz'],
      en: ['Very drought-resistant', 'Nitrogen-fixing', 'Hardwood'],
    },
    tip: {
      de: 'Eine der trockenresistentesten Baumarten in Mitteleuropa – ideal für Klimawandel-Bepflanzung.',
      en: 'One of the most drought-resistant tree species in Central Europe – ideal for climate change planting.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Flaumeiche', en: 'Downy Oak' },
    category: 'tree',
    icon: '🪵',
    traits: {
      de: ['Klimaresilient', 'Heimische Art', 'Lebensraum für Insekten'],
      en: ['Climate-resilient', 'Native species', 'Habitat for insects'],
    },
    tip: {
      de: 'Heimische Eichenart mit höherer Trocken- und Hitzetoleranz als die Stieleiche.',
      en: 'Native oak species with higher drought and heat tolerance than the pedunculate oak.',
    },
    droughtResistance: 3,
    heatTolerance: 3,
  },
  {
    name: { de: 'Speierling', en: 'Service Tree' },
    category: 'tree',
    icon: '🍎',
    traits: {
      de: ['Selten & wertvoll', 'Trockenresistent', 'Heimisch'],
      en: ['Rare & valuable', 'Drought-resistant', 'Native'],
    },
    tip: {
      de: 'Seltener heimischer Baum, der Hitze und Trockenheit gut übersteht und Früchte trägt.',
      en: 'Rare native tree that withstands heat and drought well and bears fruit.',
    },
    droughtResistance: 3,
    heatTolerance: 2,
  },
  {
    name: { de: 'Walnuss', en: 'Walnut' },
    category: 'tree',
    icon: '🌰',
    traits: {
      de: ['Tiefwurzelnd', 'Hitzetolerant', 'Ertragsreich'],
      en: ['Deep-rooted', 'Heat-tolerant', 'High-yielding'],
    },
    tip: {
      de: 'Tiefes Wurzelsystem sichert Wasserversorgung in Trockenperioden – liefert wertvolle Nüsse.',
      en: 'Deep root system ensures water supply during dry periods – provides valuable nuts.',
    },
    droughtResistance: 2,
    heatTolerance: 3,
  },
];
