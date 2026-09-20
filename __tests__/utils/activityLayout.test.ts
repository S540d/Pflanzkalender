import { calculateActivityRows } from '../../src/utils/activityLayout';
import type { Activity } from '../../src/types';

const act = (id: string, start: number, end: number): Activity => ({
  id,
  type: 'sow',
  startMonth: start,
  endMonth: end,
  color: '#fff',
  label: 'Test',
});

describe('calculateActivityRows', () => {
  it('returns empty array for empty input', () => {
    expect(calculateActivityRows([])).toEqual([]);
  });

  it('assigns row 0 to a single activity', async () => {
    const result = calculateActivityRows([await act('a', 0, 3)]);
    expect(result).toHaveLength(1);
    expect(result[0].row).toBe(0);
  });

  it('places non-overlapping activities in the same row', async () => {
    // Jan (0-3) and Jul (12-15) do not overlap
    const result = calculateActivityRows([await act('a', 0, 3), await act('b', 12, 15)]);
    expect(result.find((r) => r.id === 'a')!.row).toBe(0);
    expect(result.find((r) => r.id === 'b')!.row).toBe(0);
  });

  it('places overlapping activities in different rows', async () => {
    // Both span Jan–Mär (0-5)
    const result = calculateActivityRows([await act('a', 0, 5), await act('b', 3, 8)]);
    const rowA = result.find((r) => r.id === 'a')!.row;
    const rowB = result.find((r) => r.id === 'b')!.row;
    expect(rowA).not.toBe(rowB);
  });

  it('packs three activities: two in row 0, one in row 1', async () => {
    // a: 0-4, b: 6-10 (no overlap with a → row 0), c: 0-6 (overlaps a → row 1)
    const result = calculateActivityRows([
      await act('a', 0, 4),
      await act('b', 6, 10),
      await act('c', 0, 6),
    ]);
    const rows = Object.fromEntries(result.map((r) => [r.id, r.row]));
    expect(rows['a']).toBe(0);
    expect(rows['b']).toBe(0);
    expect(rows['c']).toBe(1);
  });

  it('sorts by startMonth before placing (input in reverse order)', async () => {
    const result = calculateActivityRows([await act('b', 10, 15), await act('a', 0, 5)]);
    expect(result.find((r) => r.id === 'a')!.row).toBe(0);
    expect(result.find((r) => r.id === 'b')!.row).toBe(0);
  });

  it('preserves all original activity fields and adds row', async () => {
    const input = [await act('x', 2, 6)];
    const result = calculateActivityRows(input);
    expect(result[0]).toMatchObject(input[0]);
    expect(typeof result[0].row).toBe('number');
  });

  it('boundary: a.endMonth === b.startMonth counts as overlap (share one half-month)', async () => {
    // overlaps() uses !(a.endMonth < b.startMonth || b.endMonth < a.startMonth)
    // When a.endMonth === b.startMonth = 5, neither strict inequality holds → overlap
    const result = calculateActivityRows([await act('a', 0, 5), await act('b', 5, 10)]);
    const rowA = result.find((r) => r.id === 'a')!.row;
    const rowB = result.find((r) => r.id === 'b')!.row;
    expect(rowA).not.toBe(rowB);
  });
});
