import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { useLanguage } from '../contexts/LanguageContext';
import { usePlants } from '../contexts/PlantContext';
import { ClimateRecommendation, RECOMMENDATIONS } from '../constants/climateRecommendations';

type FilterCategory = 'all' | 'vegetable' | 'flower' | 'tree';

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
  const { plants, addPlant } = usePlants();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [addedKeys, setAddedKeys] = useState<Set<string>>(new Set());
  const timerRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timers = timerRefs.current;
    return () => {
      timers.forEach((id) => clearTimeout(id));
    };
  }, []);

  const isInGarden = useCallback(
    (rec: ClimateRecommendation) => {
      return plants.some((p) => p.name === rec.name.de || p.name === rec.name.en);
    },
    [plants]
  );

  const handleAddToGarden = useCallback(
    (rec: ClimateRecommendation) => {
      const cardKey = `${rec.category}-${rec.name.de}`;
      if (isInGarden(rec) || timerRefs.current.has(cardKey)) return;
      const name = language === 'de' ? rec.name.de : rec.name.en;
      addPlant({
        name,
        isDefault: false,
        userId: null,
        category: rec.category,
        location: undefined,
        activities: [],
        notes: '',
      });
      setAddedKeys((prev) => new Set(prev).add(cardKey));
      const id = setTimeout(() => {
        setAddedKeys((prev) => {
          const next = new Set(prev);
          next.delete(cardKey);
          return next;
        });
        timerRefs.current.delete(cardKey);
      }, 2000);
      timerRefs.current.set(cardKey, id);
    },
    [language, addPlant, isInGarden]
  );

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
  const addLabel = language === 'de' ? 'Zum Garten hinzufügen' : 'Add to garden';
  const addedLabel = language === 'de' ? 'Hinzugefügt ✓' : 'Added ✓';
  const alreadyLabel = language === 'de' ? 'Bereits im Garten' : 'Already in garden';

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
            {filtered.map((rec) => {
              const cardKey = `${rec.category}-${rec.name.de}`;
              const inGarden = isInGarden(rec);
              const justAdded = addedKeys.has(cardKey);
              return (
                <View
                  key={cardKey}
                  style={[
                    styles.card,
                    { backgroundColor: theme.surface, borderColor: theme.border },
                  ]}
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

                  <TouchableOpacity
                    onPress={() => !inGarden && !justAdded && handleAddToGarden(rec)}
                    disabled={inGarden || justAdded}
                    style={[
                      styles.addButton,
                      {
                        backgroundColor: justAdded
                          ? '#4CAF50'
                          : inGarden
                            ? theme.border
                            : theme.primary,
                      },
                    ]}
                    accessibilityLabel={inGarden ? alreadyLabel : addLabel}
                  >
                    <Text
                      style={[
                        styles.addButtonText,
                        { color: inGarden ? theme.textSecondary : '#fff' },
                      ]}
                    >
                      {justAdded ? addedLabel : inGarden ? alreadyLabel : addLabel}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
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
  addButton: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
