import { storageService } from '../../src/services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Share } from 'react-native';
import type { Plant } from '../../src/types';

jest.mock('react-native', () => ({
  Share: { share: jest.fn() },
}));

const makePlant = (id: string): Plant => ({
  id,
  name: `Pflanze ${id}`,
  isDefault: false,
  userId: null,
  activities: [],
  notes: '',
  location: 'sun',
  category: 'vegetable',
  createdAt: 1000000,
  updatedAt: 1000000,
});

describe('storageService.savePlants / loadPlants', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('saves and reloads an empty array', async () => {
    await storageService.savePlants([]);
    const result = await storageService.loadPlants();
    expect(result).toEqual([]);
  });

  it('saves and reloads a list of plants', async () => {
    const plants = [makePlant('1'), makePlant('2')];
    await storageService.savePlants(plants);
    const result = await storageService.loadPlants();
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('1');
    expect(result[1].id).toBe('2');
  });

  it('loadPlants returns empty array when storage is empty', async () => {
    const result = await storageService.loadPlants();
    expect(result).toEqual([]);
  });

  it('savePlants rethrows when AsyncStorage.setItem fails', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('disk full'));
    await expect(storageService.savePlants([makePlant('x')])).rejects.toThrow('disk full');
  });

  it('loadPlants returns empty array when AsyncStorage.getItem fails', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('read error'));
    const result = await storageService.loadPlants();
    expect(result).toEqual([]);
  });
});

describe('storageService.setGuestMode / isGuestMode', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('defaults to true (guest mode) when not set', async () => {
    const result = await storageService.isGuestMode();
    expect(result).toBe(true);
  });

  it('saves false and reads back false', async () => {
    await storageService.setGuestMode(false);
    const result = await storageService.isGuestMode();
    expect(result).toBe(false);
  });

  it('saves true and reads back true', async () => {
    await storageService.setGuestMode(true);
    const result = await storageService.isGuestMode();
    expect(result).toBe(true);
  });

  it('setGuestMode silently ignores AsyncStorage errors', async () => {
    jest.spyOn(AsyncStorage, 'setItem').mockRejectedValueOnce(new Error('write error'));
    await expect(storageService.setGuestMode(true)).resolves.toBeUndefined();
  });

  it('isGuestMode returns true when AsyncStorage.getItem fails', async () => {
    jest.spyOn(AsyncStorage, 'getItem').mockRejectedValueOnce(new Error('read error'));
    const result = await storageService.isGuestMode();
    expect(result).toBe(true);
  });
});

describe('storageService.clearAll', () => {
  beforeEach(() => jest.clearAllMocks());

  it('removes plants and resets guest mode to default', async () => {
    await storageService.savePlants([makePlant('x')]);
    await storageService.setGuestMode(false);
    await storageService.clearAll();

    const plants = await storageService.loadPlants();
    const isGuest = await storageService.isGuestMode();

    expect(plants).toEqual([]);
    expect(isGuest).toBe(true);
  });

  it('silently ignores AsyncStorage.multiRemove errors', async () => {
    jest.spyOn(AsyncStorage, 'multiRemove').mockRejectedValueOnce(new Error('remove error'));
    await expect(storageService.clearAll()).resolves.toBeUndefined();
  });
});

describe('storageService.exportPlants', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('calls Share.share with a JSON string containing the current plants', async () => {
    const plants = [makePlant('e1')];
    await storageService.savePlants(plants);
    (Share.share as jest.Mock).mockResolvedValueOnce({ action: 'sharedAction' });

    await storageService.exportPlants();

    expect(Share.share).toHaveBeenCalledTimes(1);
    const callArg = (Share.share as jest.Mock).mock.calls[0][0];
    const parsed = JSON.parse(callArg.message);
    expect(parsed.plants).toHaveLength(1);
    expect(parsed.plants[0].id).toBe('e1');
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.timestamp).toBeTruthy();
  });

  it('does not throw when Share.share rejects (falls back to alert)', async () => {
    global.alert = jest.fn();
    await storageService.savePlants([]);
    (Share.share as jest.Mock).mockRejectedValueOnce(new Error('share failed'));
    await expect(storageService.exportPlants()).resolves.toBeUndefined();
    expect(global.alert).toHaveBeenCalled();
  });
});

describe('storageService.importPlants', () => {
  it('parses a valid JSON export string and returns the plants array', async () => {
    const plants = [makePlant('p1')];
    const validJson = JSON.stringify({ version: '1.0.0', timestamp: new Date().toISOString(), plants });
    const result = await storageService.importPlants(validJson);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  it('throws when plants is not an array', async () => {
    const badJson = JSON.stringify({ version: '1.0.0', plants: 'not-an-array' });
    await expect(storageService.importPlants(badJson)).rejects.toThrow(
      'Invalid export format: plants must be an array',
    );
  });

  it('throws when JSON is malformed', async () => {
    await expect(storageService.importPlants('not json')).rejects.toThrow();
  });

  it('returns an empty array when plants field is an empty array', async () => {
    const emptyExport = JSON.stringify({ version: '1.0.0', plants: [] });
    const result = await storageService.importPlants(emptyExport);
    expect(result).toEqual([]);
  });
});
