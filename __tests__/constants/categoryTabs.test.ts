import { CATEGORY_TABS, CategoryFilter } from '../../src/constants/categoryTabs';

describe('categoryTabs Constants', () => {
  describe('CATEGORY_TABS', () => {
    it('exports an array of category tabs', () => {
      expect(Array.isArray(CATEGORY_TABS)).toBe(true);
      expect(CATEGORY_TABS.length).toBe(4);
    });

    it('has correct tab structure with i18n labels', () => {
      CATEGORY_TABS.forEach((tab) => {
        expect(tab).toHaveProperty('value');
        expect(tab).toHaveProperty('labelDe');
        expect(tab).toHaveProperty('labelEn');
        expect(tab).toHaveProperty('icon');
        expect(tab).toHaveProperty('color');
      });
    });

    it('includes all required categories', () => {
      const values = CATEGORY_TABS.map((tab) => tab.value);
      expect(values).toContain('all');
      expect(values).toContain('vegetable');
      expect(values).toContain('flower');
      expect(values).toContain('tree');
    });

    it('has distinct colors for each tab', () => {
      const colors = CATEGORY_TABS.map((tab) => tab.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('has valid emoji icons', () => {
      CATEGORY_TABS.forEach((tab) => {
        expect(tab.icon.length).toBeGreaterThan(0);
        expect(typeof tab.icon).toBe('string');
      });
    });

    it('has correct German labels', () => {
      expect(CATEGORY_TABS[0].labelDe).toBe('Alle');
      expect(CATEGORY_TABS[1].labelDe).toBe('Nutzpflanzen');
      expect(CATEGORY_TABS[2].labelDe).toBe('Blumen');
      expect(CATEGORY_TABS[3].labelDe).toBe('Bäume');
    });

    it('has correct English labels', () => {
      expect(CATEGORY_TABS[0].labelEn).toBe('All');
      expect(CATEGORY_TABS[1].labelEn).toBe('Vegetables');
      expect(CATEGORY_TABS[2].labelEn).toBe('Flowers');
      expect(CATEGORY_TABS[3].labelEn).toBe('Trees');
    });

    it('translates all labels correctly', () => {
      const deTranslations: Record<string, string> = {
        all: 'Alle',
        vegetable: 'Nutzpflanzen',
        flower: 'Blumen',
        tree: 'Bäume',
      };

      const enTranslations: Record<string, string> = {
        all: 'All',
        vegetable: 'Vegetables',
        flower: 'Flowers',
        tree: 'Trees',
      };

      CATEGORY_TABS.forEach((tab) => {
        expect(tab.labelDe).toBe(deTranslations[tab.value]);
        expect(tab.labelEn).toBe(enTranslations[tab.value]);
      });
    });
  });

  describe('CategoryFilter Type', () => {
    it('has 4 valid category filter values', () => {
      const validValues: CategoryFilter[] = ['all', 'vegetable', 'flower', 'tree'];
      expect(validValues.length).toBe(4);
    });

    it('CategoryFilter type covers all CATEGORY_TABS values', () => {
      const tabValues = CATEGORY_TABS.map((tab) => tab.value as CategoryFilter);
      expect(tabValues.length).toBe(4);

      const validFilterValues: CategoryFilter[] = ['all', 'vegetable', 'flower', 'tree'];
      tabValues.forEach((value) => {
        expect(validFilterValues).toContain(value);
      });
    });
  });
});
