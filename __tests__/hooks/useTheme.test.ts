import { useTheme } from '../../src/hooks/useTheme';

describe('useTheme Hook – Type Safety', () => {
  it('is a valid React hook function', () => {
    expect(typeof useTheme).toBe('function');
  });
});
