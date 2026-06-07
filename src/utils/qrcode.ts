import qrcode from 'qrcode-generator';

/**
 * Maximale UTF-8-Bytelänge, die wir in einen QR-Code packen.
 * QR (Version 40, Fehlerkorrektur M) fasst ~2331 Bytes – wir bleiben mit
 * Sicherheitsabstand darunter, damit der Code auf Handy-Kameras scanbar bleibt.
 */
export const QR_MAX_BYTES = 1800;

/**
 * Wandelt einen JS-String in einen Binär-String seiner UTF-8-Bytes um
 * (jedes Zeichen entspricht genau einem Byte 0–255). So werden Umlaute und
 * andere Nicht-ASCII-Zeichen korrekt kodiert, unabhängig von der Byte-Funktion
 * der QR-Bibliothek. Eigenimplementierung statt `unescape` (deprecated, nicht
 * überall verfügbar).
 */
export function toUtf8ByteString(input: string): string {
  let out = '';
  for (let i = 0; i < input.length; i++) {
    const code = input.charCodeAt(i);
    if (code < 0x80) {
      out += String.fromCharCode(code);
    } else if (code < 0x800) {
      out += String.fromCharCode(0xc0 | (code >> 6));
      out += String.fromCharCode(0x80 | (code & 0x3f));
    } else if (code >= 0xd800 && code <= 0xdbff) {
      // High surrogate – combine with following low surrogate into a code point
      const lo = input.charCodeAt(++i);
      const cp = 0x10000 + ((code - 0xd800) << 10) + (lo - 0xdc00);
      out += String.fromCharCode(0xf0 | (cp >> 18));
      out += String.fromCharCode(0x80 | ((cp >> 12) & 0x3f));
      out += String.fromCharCode(0x80 | ((cp >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | (cp & 0x3f));
    } else {
      out += String.fromCharCode(0xe0 | (code >> 12));
      out += String.fromCharCode(0x80 | ((code >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | (code & 0x3f));
    }
  }
  return out;
}

/** UTF-8-Bytelänge eines Strings (ohne ihn zu materialisieren ist nicht nötig – kurz genug). */
export function utf8ByteLength(input: string): number {
  return toUtf8ByteString(input).length;
}

/**
 * Baut die QR-Modul-Matrix für einen Wert.
 * Gibt `null` zurück, wenn der Wert leer oder zu groß für einen scanbaren
 * QR-Code ist (oder die Generierung fehlschlägt). So kann die UI sauber einen
 * Hinweis statt eines unleserlichen Codes anzeigen.
 */
export function buildQrMatrix(value: string): boolean[][] | null {
  const bytes = toUtf8ByteString(value);
  if (bytes.length === 0 || bytes.length > QR_MAX_BYTES) return null;
  try {
    const qr = qrcode(0, 'M');
    qr.addData(bytes, 'Byte');
    qr.make();
    const count = qr.getModuleCount();
    const matrix: boolean[][] = [];
    for (let row = 0; row < count; row++) {
      const cells: boolean[] = [];
      for (let col = 0; col < count; col++) {
        cells.push(qr.isDark(row, col));
      }
      matrix.push(cells);
    }
    return matrix;
  } catch {
    return null;
  }
}
