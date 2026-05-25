import { storageService } from '../../src/services/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Plant } from '../../src/types';

const mockShareFn = jest.fn();

jest.mock('react-native', () => {
  const platformState = { OS: 'ios' };
  return {
    Share: { share: (...args: unknown[]) => mockShareFn(...args) },
    Platform: platformState,
    __platformState: platformState,
  };
});

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { __platformState: mockPlatform } = require('react-native') as {
  __platformState: { OS: string };
};

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
    mockPlatform.OS = 'ios';
  });

  it('calls Share.share on native with valid JSON containing the plants', async () => {
    mockPlatform.OS = 'ios';
    const plants = [makePlant('e1')];
    await storageService.savePlants(plants);
    mockShareFn.mockResolvedValueOnce({ action: 'sharedAction' });

    await storageService.exportPlants();

    expect(mockShareFn).toHaveBeenCalledTimes(1);
    const callArg = mockShareFn.mock.calls[0][0];
    const parsed = JSON.parse(callArg.message);
    expect(parsed.plants).toHaveLength(1);
    expect(parsed.plants[0].id).toBe('e1');
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.timestamp).toBeTruthy();
    expect(callArg.title).toBe('pflanzkalender-export.json');
  });

  it('triggers Blob download on web without calling Share.share', async () => {
    mockPlatform.OS = 'web';
    const plants = [makePlant('e2')];
    await storageService.savePlants(plants);

    const mockClick = jest.fn();
    const mockAnchor = { href: '', download: '', click: mockClick };
    const mockCreateElement = jest.fn().mockReturnValue(mockAnchor);
    const mockUrl = 'blob:mock-url';
    const mockCreateObjectURL = jest.fn().mockReturnValue(mockUrl);
    const mockRevokeObjectURL = jest.fn();

    // Inject browser globals not present in node test env
    (global as Record<string, unknown>).document = {
      createElement: mockCreateElement,
    };
    (global as Record<string, unknown>).URL = {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    };
    (global as Record<string, unknown>).Blob = jest.fn().mockReturnValue({});

    await storageService.exportPlants();

    expect(mockShareFn).not.toHaveBeenCalled();
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.download).toBe('pflanzkalender-export.json');
    expect(mockAnchor.href).toBe(mockUrl);
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith(mockUrl);

    delete (global as Record<string, unknown>).document;
    delete (global as Record<string, unknown>).URL;
    delete (global as Record<string, unknown>).Blob;
  });

  it('web export Blob contains all plants and correct metadata', async () => {
    mockPlatform.OS = 'web';
    const plants = [makePlant('e3'), makePlant('e4')];
    await storageService.savePlants(plants);

    let capturedContent = '';
    const mockCreateObjectURL = jest.fn().mockReturnValue('blob:x');
    const mockRevokeObjectURL = jest.fn();

    (global as Record<string, unknown>).Blob = jest.fn().mockImplementation((parts: string[]) => {
      capturedContent = parts[0];
      return {};
    });
    (global as Record<string, unknown>).document = {
      createElement: jest.fn().mockReturnValue({ href: '', download: '', click: jest.fn() }),
    };
    (global as Record<string, unknown>).URL = {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    };

    await storageService.exportPlants();

    const parsed = JSON.parse(capturedContent);
    expect(parsed.version).toBe('1.0.0');
    expect(parsed.plants).toHaveLength(2);
    expect(parsed.plants.map((p: Plant) => p.id)).toEqual(['e3', 'e4']);

    delete (global as Record<string, unknown>).document;
    delete (global as Record<string, unknown>).URL;
    delete (global as Record<string, unknown>).Blob;
  });
});

describe('storageService.importPlants', () => {
  it('parses a valid JSON export string and returns the plants array', async () => {
    const plants = [makePlant('p1')];
    const validJson = JSON.stringify({
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      plants,
    });
    const result = await storageService.importPlants(validJson);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('p1');
  });

  it('throws when plants is not an array', async () => {
    const badJson = JSON.stringify({
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      plants: 'not-an-array',
    });
    await expect(storageService.importPlants(badJson)).rejects.toThrow('Invalid import format');
  });

  it('throws when JSON is malformed', async () => {
    await expect(storageService.importPlants('not json')).rejects.toThrow();
  });

  it('returns an empty array when plants field is an empty array', async () => {
    const emptyExport = JSON.stringify({
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      plants: [],
    });
    const result = await storageService.importPlants(emptyExport);
    expect(result).toEqual([]);
  });

  it('throws with path info when a plant field is invalid', async () => {
    const badPlant = { ...makePlant('p2'), name: '' };
    const json = JSON.stringify({
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      plants: [badPlant],
    });
    await expect(storageService.importPlants(json)).rejects.toThrow('Invalid import format');
  });

  it('throws when version is not 1.0.0', async () => {
    const plants = [makePlant('p3')];
    const json = JSON.stringify({ version: '2.0.0', timestamp: new Date().toISOString(), plants });
    await expect(storageService.importPlants(json)).rejects.toThrow('Invalid import format');
  });

  it('throws when timestamp is not ISO datetime', async () => {
    const plants = [makePlant('p4')];
    const json = JSON.stringify({ version: '1.0.0', timestamp: 'yesterday', plants });
    await expect(storageService.importPlants(json)).rejects.toThrow('Invalid import format');
  });

  it('throws when version field is missing', async () => {
    const json = JSON.stringify({ timestamp: new Date().toISOString(), plants: [] });
    await expect(storageService.importPlants(json)).rejects.toThrow('Invalid import format');
  });
});

describe('storageService.loadPlants – Zod-Filterung', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  it('filtert korrupte Einträge heraus und behält valide', async () => {
    const good = makePlant('good');
    const corrupt = { id: 'bad', name: '' }; // name leer → schlägt fehl
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(JSON.stringify([good, corrupt]));
    const result = await storageService.loadPlants();
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('good');
  });

  it('wirft STORAGE_CORRUPTED wenn alle Einträge ungültig sind', async () => {
    const allCorrupt = [
      { id: 'x', name: '' },
      { id: 'y', name: '' },
    ];
    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(JSON.stringify(allCorrupt));
    jest.spyOn(console, 'error').mockImplementation(() => {});
    await expect(storageService.loadPlants()).rejects.toThrow('STORAGE_CORRUPTED');
    jest.restoreAllMocks();
  });

  it('gibt leeres Array zurück wenn Storage leer ist', async () => {
    const result = await storageService.loadPlants();
    expect(result).toEqual([]);
  });
});
