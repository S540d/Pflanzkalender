import { renderHook, act } from '@testing-library/react-native';
import { useTheme } from '../../src/hooks/useTheme';

const mockGetItem = jest.fn().mockResolvedValue(null);
const mockSetItem = jest.fn().mockResolvedValue(undefined);

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: (...args: any[]) => mockGetItem(...args),
  setItem: (...args: any[]) => mockSetItem(...args),
  removeItem: jest.fn().mockResolvedValue(undefined),
}));

describe('useTheme Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetItem.mockResolvedValue(null);
    mockSetItem.mockResolvedValue(undefined);
  });

  it('returns theme object with required properties', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current).toHaveProperty('theme');
    expect(result.current).toHaveProperty('themeMode');
    expect(result.current).toHaveProperty('setThemeMode');
    expect(typeof result.current.setThemeMode).toBe('function');
  });

  it('theme object has all color properties', () => {
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

  it('returns valid hex color strings', () => {
    const { result } = renderHook(() => useTheme());

    const { theme } = result.current;
    const isValidColor = (color: string) => /^#[0-9A-Fa-f]{6}$/.test(color);

    expect(isValidColor(theme.background)).toBe(true);
    expect(isValidColor(theme.text)).toBe(true);
    expect(isValidColor(theme.primary)).toBe(true);
  });

  it('defaults to system theme mode', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.themeMode).toBe('system');
  });

  it('allows changing theme mode to dark', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setThemeMode('dark');
    });

    expect(result.current.themeMode).toBe('dark');
  });

  it('allows changing theme mode to light', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setThemeMode('light');
    });

    expect(result.current.themeMode).toBe('light');
  });

  it('allows changing theme mode to system', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setThemeMode('dark');
    });
    await act(async () => {
      await result.current.setThemeMode('system');
    });

    expect(result.current.themeMode).toBe('system');
  });

  it('persists theme preference to AsyncStorage', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setThemeMode('dark');
    });

    expect(mockSetItem).toHaveBeenCalledWith('theme', 'dark');
  });

  it('loads persisted theme preference from AsyncStorage (dark)', async () => {
    mockGetItem.mockResolvedValueOnce('dark');

    const { result } = renderHook(() => useTheme());

    // Wait for async load
    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.themeMode).toBe('dark');
  });

  it('loads persisted theme preference from AsyncStorage (light)', async () => {
    mockGetItem.mockResolvedValueOnce('light');

    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    expect(result.current.themeMode).toBe('light');
  });

  it('ignores invalid values from AsyncStorage', async () => {
    mockGetItem.mockResolvedValueOnce('invalid-mode');

    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await new Promise((r) => setTimeout(r, 50));
    });

    // Falls back to default 'system'
    expect(result.current.themeMode).toBe('system');
  });

  it('isDark is true when themeMode is dark', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setThemeMode('dark');
    });

    expect(result.current.isDark).toBe(true);
  });

  it('isDark is false when themeMode is light', async () => {
    const { result } = renderHook(() => useTheme());

    await act(async () => {
      await result.current.setThemeMode('light');
    });

    expect(result.current.isDark).toBe(false);
  });
});
