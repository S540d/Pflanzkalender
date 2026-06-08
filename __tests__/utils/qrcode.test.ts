import {
  buildQrMatrix,
  toUtf8ByteString,
  utf8ByteLength,
  QR_MAX_BYTES,
} from '../../src/utils/qrcode';

describe('qrcode util', () => {
  describe('toUtf8ByteString / utf8ByteLength', () => {
    it('encodes ASCII as one byte per character', () => {
      expect(toUtf8ByteString('hello')).toBe('hello');
      expect(utf8ByteLength('hello')).toBe(5);
    });

    it('encodes German umlauts as two UTF-8 bytes each', () => {
      // 'ä' = U+00E4 → 0xC3 0xA4
      const bytes = toUtf8ByteString('ä');
      expect(bytes.length).toBe(2);
      expect(bytes.charCodeAt(0)).toBe(0xc3);
      expect(bytes.charCodeAt(1)).toBe(0xa4);
      expect(utf8ByteLength('Düngen')).toBe(7); // D, ü(2), n, g, e, n
    });

    it('encodes emoji (surrogate pair) as four UTF-8 bytes', () => {
      expect(utf8ByteLength('🍅')).toBe(4);
    });
  });

  describe('buildQrMatrix', () => {
    it('returns a non-empty square matrix for normal input', () => {
      const matrix = buildQrMatrix('Pflanzkalender');
      expect(matrix).not.toBeNull();
      const m = matrix as boolean[][];
      expect(m.length).toBeGreaterThan(0);
      // Square
      expect(m.every((row) => row.length === m.length)).toBe(true);
      // Contains both dark and light modules
      const flat = m.flat();
      expect(flat.some((v) => v)).toBe(true);
      expect(flat.some((v) => !v)).toBe(true);
    });

    it('is deterministic for the same input', () => {
      const a = buildQrMatrix('share-me');
      const b = buildQrMatrix('share-me');
      expect(a).toEqual(b);
    });

    it('returns null for empty input', () => {
      expect(buildQrMatrix('')).toBeNull();
    });

    it('returns null for oversized input', () => {
      const huge = 'x'.repeat(QR_MAX_BYTES + 1);
      expect(buildQrMatrix(huge)).toBeNull();
    });
  });
});
