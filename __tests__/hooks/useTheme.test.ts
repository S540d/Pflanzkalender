import { renderHook, act } from '@testing-library/react-native';
import { useTheme } from '../../src/hooks/useTheme';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

describe('useTheme Hook', () => {
  it('returns theme object with required properties', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('themeMode');
    expect(result.current).toHaveProperty('setThemeMode');
    expect(typeof result.current.setThemeMode).toBe('function');
  });

  it('theme object has color properties', () => {
    const { result } = renderHook(() => useTheme());

    const { theme } = result.current;
    expect(theme).toHaveProperty('background');
    expect(theme).toHaveProperty('text');
    expect(theme).toHaveProperty('textSecondary');
    expect(theme).toHaveProperty('border');
    expect(theme).toHaveProperty('surface');
    expect(theme).toHaveProperty('primary');
    expect(theme).toHaveProperty('error');
  });

  it('returns valid color strings', () => {
    const { result } = renderHook(() => useTheme());

    const { theme } = result.current;
    const isValidColor = (color: string) => /^#[0-9A-Fa-f]{6}$/.test(color);

    expect(isValidColor(theme.background)).toBe(true);
    expect(isValidColor(theme.text)).toBe(true);
    expect(isValidColor(theme.primary)).toBe(true);
  });

  it('allows changing theme mode', async () => {
    const { result } = renderHook(() => useTheme());

    const initialMode = result.current.themeMode;

    await act(async () => {
      result.current.setThemeMode(initialMode === 'dark' ? 'light' : 'dark');
    });

    expect(result.current.themeMode).not.toBe(initialMode);
  });
});
