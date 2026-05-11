import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';

type FilterCategory = 'all' | 'vegetable' | 'flower' | 'tree';

interface ClimateRecommendation {
  name: { de: string; en: string };
  category: 'vegetable' | 'flower' | 'tree';
  icon: string;
  traits: { de: string[]; en: string[] };
  tip: { de: string; en: string };
  droughtResistance: 1 | 2 | 3;
  heatTolerance: 1 | 2 | 3;
}

const RECOMMENDATIONS: ClimateRecommendation[] = [
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

const FILTER_TABS: { key: FilterCategory; de: string; en: string; icon: string }[] = [
  { key: 'all', de: 'Alle', en: 'All', icon: '🌍' },
  { key: 'vegetable', de: 'Nutzpflanzen', en: 'Crops', icon: '🥦' },
  { key: 'flower', de: 'Blumen', en: 'Flowers', icon: '🌸' },
  { key: 'tree', de: 'Bäume', en: 'Trees', icon: '🌳' },
];

function ResistanceDots({
  level,
  color,
  inactiveColor,
}: {
  level: 1 | 2 | 3;
  color: string;
  inactiveColor: string;
}) {
  return (
    <View style={styles.dotsRow}>
      {[1, 2, 3].map((i) => (
        <View
          key={i}
          style={[styles.dot, { backgroundColor: i <= level ? color : inactiveColor }]}
        />
      ))}
    </View>
  );
}

export const ClimateScreen: React.FC = () => {
  const { theme } = useTheme();
  const { language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');

  const filtered =
    activeFilter === 'all'
      ? RECOMMENDATIONS
      : RECOMMENDATIONS.filter((r) => r.category === activeFilter);

  const titleText = language === 'de' ? 'Klimafit gärtnern' : 'Climate-Resilient Gardening';
  const subtitleText =
    language === 'de'
      ? 'Empfehlenswerte Pflanzen für heiße, trockene Sommer'
      : 'Recommended plants for hot, dry summers';
  const droughtLabel = language === 'de' ? 'Trockenresistenz' : 'Drought resistance';
  const heatLabel = language === 'de' ? 'Hitzetoleranz' : 'Heat tolerance';

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>{titleText}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{subtitleText}</Text>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.tabsScroll}
            contentContainerStyle={styles.tabsContainer}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <TouchableOpacity
                  key={tab.key}
                  onPress={() => setActiveFilter(tab.key)}
                  style={[
                    styles.tab,
                    {
                      backgroundColor: isActive ? theme.primary : theme.surface,
                      borderColor: isActive ? theme.primary : theme.border,
                    },
                  ]}
                  accessibilityLabel={language === 'de' ? tab.de : tab.en}
                >
                  <Text style={styles.tabIcon}>{tab.icon}</Text>
                  <Text style={[styles.tabLabel, { color: isActive ? '#fff' : theme.text }]}>
                    {language === 'de' ? tab.de : tab.en}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Cards */}
          <View style={styles.cards}>
            {filtered.map((rec) => (
              <View
                key={`${rec.category}-${rec.name.de}`}
                style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardIcon}>{rec.icon}</Text>
                  <Text style={[styles.cardName, { color: theme.text }]}>
                    {language === 'de' ? rec.name.de : rec.name.en}
                  </Text>
                </View>

                <View style={styles.traits}>
                  {(language === 'de' ? rec.traits.de : rec.traits.en).map((trait) => (
                    <View
                      key={trait}
                      style={[styles.traitBadge, { backgroundColor: theme.background }]}
                    >
                      <Text style={[styles.traitText, { color: theme.primary }]}>{trait}</Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.tip, { color: theme.textSecondary }]}>
                  {language === 'de' ? rec.tip.de : rec.tip.en}
                </Text>

                <View style={styles.resistanceRow}>
                  <View style={styles.resistanceItem}>
                    <Text style={[styles.resistanceLabel, { color: theme.textSecondary }]}>
                      💧 {droughtLabel}
                    </Text>
                    <ResistanceDots
                      level={rec.droughtResistance}
                      color="#2196F3"
                      inactiveColor={theme.border}
                    />
                  </View>
                  <View style={styles.resistanceItem}>
                    <Text style={[styles.resistanceLabel, { color: theme.textSecondary }]}>
                      🌡️ {heatLabel}
                    </Text>
                    <ResistanceDots
                      level={rec.heatTolerance}
                      color="#FF5722"
                      inactiveColor={theme.border}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  tabsScroll: {
    marginBottom: 20,
  },
  tabsContainer: {
    gap: 8,
    paddingHorizontal: 2,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  tabIcon: {
    fontSize: 16,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  cards: {
    gap: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 10,
  },
  cardIcon: {
    fontSize: 28,
  },
  cardName: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
  },
  traits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  traitBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  traitText: {
    fontSize: 12,
    fontWeight: '600',
  },
  tip: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  resistanceRow: {
    flexDirection: 'row',
    gap: 20,
  },
  resistanceItem: {
    flex: 1,
  },
  resistanceLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
