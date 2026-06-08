import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TemplateScreen } from '../../src/screens/TemplateScreen';
import { LanguageProvider } from '../../src/contexts/LanguageContext';
import { PlantProvider } from '../../src/contexts/PlantContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('../../src/services/templateService', () => ({
  sharePlants: jest.fn().mockResolvedValue(undefined),
  importFromJson: jest.fn(),
  buildShareString: jest.fn(() => '{"version":"1.0.0","timestamp":"t","plants":[]}'),
}));

jest.mock('../../src/hooks/useTheme', () => ({
  useTheme: () => ({
    theme: {
      background: '#fff',
      text: '#000',
      textSecondary: '#666',
      border: '#ddd',
      surface: '#f5f5f5',
      primary: '#4CAF50',
      error: '#f44336',
    },
    isDark: false,
  }),
}));

jest.mock('@react-native-async-storage/async-storage');

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LanguageProvider>
    <PlantProvider>{children}</PlantProvider>
  </LanguageProvider>
);

const renderScreen = () => render(<TemplateScreen />, { wrapper: Providers });

describe('TemplateScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockImplementation(() => Promise.resolve(null));
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
    (AsyncStorage.multiRemove as jest.Mock).mockResolvedValue(undefined);
  });

  it('renders without crashing', () => {
    const { root } = renderScreen();
    expect(root).toBeTruthy();
  });

  it('renders the title text', () => {
    const { getAllByText } = renderScreen();
    // Title "Vorlagen" also appears as a tab label
    expect(getAllByText(/^Vorlagen$|^Templates$/).length).toBeGreaterThan(0);
  });

  it('shows community templates by default', () => {
    const { getByText } = renderScreen();
    expect(getByText(/Balkon-Garten Starter|Balcony Garden Starter/)).toBeTruthy();
  });

  it('shows all three community template cards', () => {
    const { getByText } = renderScreen();
    expect(getByText(/Balkon-Garten Starter|Balcony Garden Starter/)).toBeTruthy();
    expect(getByText(/Gemüsegarten Anfänger|Vegetable Garden Beginner/)).toBeTruthy();
    expect(getByText(/Kräutergarten|Herb Garden/)).toBeTruthy();
  });

  it('community template cards show plant names', () => {
    const { getByText } = renderScreen();
    expect(getByText(/Tomaten/)).toBeTruthy();
    expect(getByText(/Salat/)).toBeTruthy();
  });

  it('switches to Export section on tab press', () => {
    const { getByText } = renderScreen();
    fireEvent.press(getByText(/^Exportieren$|^Export$/));
    expect(getByText(/^EXPORTIEREN$|^EXPORT$/)).toBeTruthy();
  });

  it('switches to Import section on tab press', async () => {
    const { getAllByText, getByPlaceholderText } = renderScreen();
    // Section tabs are rendered before card buttons, so index 0 is the section tab
    const allImportLabels = getAllByText(/^Importieren$|^Import$/);
    fireEvent.press(allImportLabels[0]);
    await waitFor(() => {
      expect(getByPlaceholderText(/JSON/i)).toBeTruthy();
    });
  });

  it('shows at least 4 Import buttons (tab + 3 cards)', () => {
    const { getAllByText } = renderScreen();
    const importBtns = getAllByText(/^Importieren$|^Import$/);
    expect(importBtns.length).toBeGreaterThanOrEqual(4);
  });

  it('shows alert when pressing a community template import button', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByText } = renderScreen();
    // [0] is the section tab, [1] is the first card's import button
    const importBtns = getAllByText(/^Importieren$|^Import$/);
    fireEvent.press(importBtns[1]);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
    alertSpy.mockRestore();
  });

  it('shows alert when export is triggered with no plants', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getByText } = renderScreen();
    fireEvent.press(getByText(/^Exportieren$|^Export$/));
    await waitFor(() => getByText(/^EXPORTIEREN$|^EXPORT$/));
    // Export button contains plant count placeholder replaced with 0
    fireEvent.press(getByText(/📤/));
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
    alertSpy.mockRestore();
  });

  it('renders JSON text input on import section', async () => {
    const { getAllByText, getByPlaceholderText } = renderScreen();
    const allImportLabels = getAllByText(/^Importieren$|^Import$/);
    fireEvent.press(allImportLabels[0]);
    await waitFor(() => {
      expect(getByPlaceholderText(/JSON/i)).toBeTruthy();
    });
  });

  it('shows note alert when Import button pressed with empty text', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByText } = renderScreen();
    const allImportLabels = getAllByText(/^Importieren$|^Import$/);
    fireEvent.press(allImportLabels[0]);
    await waitFor(() => {
      // The import action button contains the tab import label with emoji
      expect(getAllByText(/📥/).length).toBeGreaterThan(0);
    });
    fireEvent.press(getAllByText(/📥/)[0]);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
    });
    alertSpy.mockRestore();
  });

  it('shows mode dialog when valid JSON is pasted and import triggered', async () => {
    const { importFromJson } = require('../../src/services/templateService');
    importFromJson.mockReturnValue([
      {
        id: 'p1',
        name: 'Tomate',
        isDefault: false,
        userId: null,
        activities: [],
        notes: '',
        createdAt: 1,
        updatedAt: 1,
      },
    ]);
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    const { getAllByText, getByPlaceholderText } = renderScreen();
    const allImportLabels = getAllByText(/^Importieren$|^Import$/);
    fireEvent.press(allImportLabels[0]);
    await waitFor(() => {
      expect(getByPlaceholderText(/JSON/i)).toBeTruthy();
    });
    fireEvent.changeText(getByPlaceholderText(/JSON/i), '{"valid":"json"}');
    fireEvent.press(getAllByText(/📥/)[0]);
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalled();
      // Should show mode dialog with 3 buttons (Cancel, Append, Replace)
      const call = alertSpy.mock.calls[0];
      expect(call[2]).toHaveLength(3);
    });
    alertSpy.mockRestore();
  });

  it('normalises isDefault to false for JSON imports with isDefault:true source', async () => {
    const { importFromJson } = require('../../src/services/templateService');
    importFromJson.mockReturnValue([
      {
        id: 'ext-1',
        name: 'Exportierte Pflanze',
        isDefault: true, // as if imported from another user's export
        userId: null,
        activities: [],
        notes: '',
        createdAt: 1,
        updatedAt: 1,
      },
    ]);

    let appendHandler: (() => void) | undefined;
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((_title, _msg, buttons) => {
      if (Array.isArray(buttons)) {
        const appendBtn = buttons.find((b) => /Anhängen|Append/i.test(String(b.text)));
        appendHandler = appendBtn?.onPress ?? undefined;
      }
    });

    const { getAllByText, getByPlaceholderText } = renderScreen();
    fireEvent.press(getAllByText(/^Importieren$|^Import$/)[0]);
    await waitFor(() => expect(getByPlaceholderText(/JSON/i)).toBeTruthy());
    fireEvent.changeText(getByPlaceholderText(/JSON/i), '{"dummy":"data"}');
    fireEvent.press(getAllByText(/📥/)[0]);
    await waitFor(() => expect(appendHandler).toBeDefined());

    // Clear previous setItem calls (initialization) before triggering append
    (AsyncStorage.setItem as jest.Mock).mockClear();

    await act(async () => {
      appendHandler!();
    });

    await waitFor(() => {
      const calls = (AsyncStorage.setItem as jest.Mock).mock.calls;
      const plantsCall = calls.find(([key]: [string]) => key === '@Pflanzkalender:plants');
      expect(plantsCall).toBeDefined();
      const saved = JSON.parse(plantsCall[1]) as Array<{ name: string; isDefault: boolean }>;
      const imported = saved.find((p) => p.name === 'Exportierte Pflanze');
      expect(imported?.isDefault).toBe(false);
    });

    alertSpy.mockRestore();
  });
});
