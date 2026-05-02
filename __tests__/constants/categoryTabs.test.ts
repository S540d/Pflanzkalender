import { CATEGORY_TABS, CATEGORY_TABS_I18N, CategoryFilter } from '../../src/constants/categoryTabs';

describe('categoryTabs Constants', () => {
  describe('CATEGORY_TABS', () => {
    it('exports an array of category tabs', () => {
      expect(Array.isArray(CATEGORY_TABS)).toBe(true);
      expect(CATEGORY_TABS.length).toBe(4);
    });

    it('has correct tab structure', () => {
      CATEGORY_TABS.forEach(tab => {
        expect(tab).toHaveProperty('value');
        expect(tab).toHaveProperty('label');
        expect(tab).toHaveProperty('icon');
        expect(tab).toHaveProperty('color');
      });
    });

    it('includes all required categories', () => {
      const values = CATEGORY_TABS.map(tab => tab.value);
      expect(values).toContain('all');
      expect(values).toContain('vegetable');
      expect(values).toContain('flower');
      expect(values).toContain('tree');
    });

    it('has distinct colors for each tab', () => {
      const colors = CATEGORY_TABS.map(tab => tab.color);
      const uniqueColors = new Set(colors);
      expect(uniqueColors.size).toBe(colors.length);
    });

    it('has valid emoji icons', () => {
      CATEGORY_TABS.forEach(tab => {
        expect(tab.icon.length).toBeGreaterThan(0);
        expect(typeof tab.icon).toBe('string');
      });
    });

    it('has German labels', () => {
      expect(CATEGORY_TABS[0].label).toBe('Alle');
      expect(CATEGORY_TABS[1].label).toBe('Nutzpflanzen');
      expect(CATEGORY_TABS[2].label).toBe('Blumen');
      expect(CATEGORY_TABS[3].label).toBe('Bäume');
    });
  });

  describe('CATEGORY_TABS_I18N', () => {
    it('exports an array of i18n category tabs', () => {
      expect(Array.isArray(CATEGORY_TABS_I18N)).toBe(true);
      expect(CATEGORY_TABS_I18N.length).toBe(4);
    });

    it('has German and English labels', () => {
      CATEGORY_TABS_I18N.forEach(tab => {
        expect(tab).toHaveProperty('labelDe');
        expect(tab).toHaveProperty('labelEn');
        expect(typeof tab.labelDe).toBe('string');
        expect(typeof tab.labelEn).toBe('string');
      });
    });

    it('includes all required categories with i18n', () => {
      const values = CATEGORY_TABS_I18N.map(tab => tab.value);
      expect(values).toContain('all');
      expect(values).toContain('vegetable');
      expect(values).toContain('flower');
      expect(values).toContain('tree');
    });

    it('has matching icons and colors with CATEGORY_TABS', () => {
      CATEGORY_TABS_I18N.forEach((tab, index) => {
        expect(tab.icon).toBe(CATEGORY_TABS[index].icon);
        expect(tab.color).toBe(CATEGORY_TABS[index].color);
      });
    });

    it('translates all labels correctly', () => {
      const deTranslations = {
        all: 'Alle',
        vegetable: 'Nutzpflanzen',
        flower: 'Blumen',
        tree: 'Bäume',
      };

      const enTranslations = {
        all: 'All',
        vegetable: 'Vegetables',
        flower: 'Flowers',
        tree: 'Trees',
      };

      CATEGORY_TABS_I18N.forEach(tab => {
        expect(tab.labelDe).toBe(deTranslations[tab.value]);
        expect(tab.labelEn).toBe(enTranslations[tab.value]);
      });
    });
  });

  describe('CategoryFilter Type', () => {
    it('accepts valid category values', () => {
      const validValues: CategoryFilter[] = ['all', 'vegetable', 'flower', 'tree'];
      expect(validValues.length).toBe(4);
    });
  });
});
