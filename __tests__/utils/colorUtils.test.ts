import { getContrastTextColor } from '../../src/utils/colorUtils';

describe('getContrastTextColor', () => {
  describe('light backgrounds → black text', () => {
    it('returns black for white', () => {
      expect(getContrastTextColor('#FFFFFF')).toBe('#000000');
    });

    it('returns black for yellow (FFEB3B)', () => {
      expect(getContrastTextColor('#FFEB3B')).toBe('#000000');
    });

    it('returns black for light gray', () => {
      expect(getContrastTextColor('#F5F5F5')).toBe('#000000');
    });

    it('returns black for pure green (#00FF00, high luminance)', () => {
      expect(getContrastTextColor('#00FF00')).toBe('#000000');
    });
  });

  describe('dark backgrounds → white text', () => {
    it('returns white for black', () => {
      expect(getContrastTextColor('#000000')).toBe('#FFFFFF');
    });

    it('returns white for dark gray', () => {
      expect(getContrastTextColor('#1a1a1a')).toBe('#FFFFFF');
    });

    it('returns white for pure blue', () => {
      expect(getContrastTextColor('#0000FF')).toBe('#FFFFFF');
    });

    it('returns black for pure red (luminance 0.2126 > 0.179)', () => {
      expect(getContrastTextColor('#FF0000')).toBe('#000000');
    });

    it('returns white for dark navy', () => {
      expect(getContrastTextColor('#0D47A1')).toBe('#FFFFFF');
    });
  });

  describe('3-digit hex shorthand expansion (lines 19-22)', () => {
    it('expands #FFF → #FFFFFF → black text', () => {
      expect(getContrastTextColor('#FFF')).toBe('#000000');
    });

    it('expands #000 → #000000 → white text', () => {
      expect(getContrastTextColor('#000')).toBe('#FFFFFF');
    });

    it('expands #F00 → #FF0000 → black text (luminance 0.2126 > 0.179)', () => {
      expect(getContrastTextColor('#F00')).toBe('#000000');
    });

    it('expands #0F0 → #00FF00 → black text', () => {
      expect(getContrastTextColor('#0F0')).toBe('#000000');
    });
  });

  describe('invalid hex handling (line 27: length !== 6 after expansion)', () => {
    it('returns black for 5-char hex', () => {
      expect(getContrastTextColor('#12345')).toBe('#000000');
    });

    it('returns black for 7-char hex', () => {
      expect(getContrastTextColor('#1234567')).toBe('#000000');
    });

    it('returns black for empty string', () => {
      expect(getContrastTextColor('')).toBe('#000000');
    });

    it('returns black for 1-char hex', () => {
      expect(getContrastTextColor('#A')).toBe('#000000');
    });
  });

  describe('NaN component handling (line 35)', () => {
    it('returns black for non-hex characters in 6-char string', () => {
      expect(getContrastTextColor('#GGGGGG')).toBe('#000000');
    });

    it('returns black for mixed invalid chars', () => {
      expect(getContrastTextColor('#XYZ123')).toBe('#000000');
    });
  });

  describe('medium luminance boundary', () => {
    it('returns black for medium green (#4CAF50, luminance ~0.3)', () => {
      expect(getContrastTextColor('#4CAF50')).toBe('#000000');
    });

    it('returns white for dark purple (#6200EE)', () => {
      expect(getContrastTextColor('#6200EE')).toBe('#FFFFFF');
    });

    it('returns black for orange (#FF9800)', () => {
      expect(getContrastTextColor('#FF9800')).toBe('#000000');
    });

    it('returns white for dark cyan (#006064)', () => {
      expect(getContrastTextColor('#006064')).toBe('#FFFFFF');
    });
  });
});
