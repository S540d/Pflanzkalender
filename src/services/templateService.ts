import { Platform, Share } from 'react-native';
import { Plant } from '../types';
import { ImportDataSchema } from '../schemas/plant';

export interface ExportData {
  version: '1.0.0';
  timestamp: string;
  plants: Plant[];
}

export function buildExportJson(plants: Plant[]): string {
  const data: ExportData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    plants,
  };
  return JSON.stringify(data, null, 2);
}

export function triggerWebDownload(jsonString: string, filename: string): void {
  if (Platform.OS !== 'web') return;
  // platform-safe: document can be undefined in SSR/test even when Platform.OS === 'web'
  if (typeof document === 'undefined') return;
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke asynchronously so the browser has time to start the download
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

export async function sharePlants(plants: Plant[]): Promise<void> {
  const jsonString = buildExportJson(plants);
  const filename = `Pflanzkalender_Export_${new Date().toISOString().split('T')[0]}.json`;

  if (Platform.OS === 'web') {
    triggerWebDownload(jsonString, filename);
    return;
  }

  await Share.share({
    message: jsonString,
    title: filename,
  });
}

export function importFromJson(jsonString: string): Plant[] {
  const raw = JSON.parse(jsonString);
  const result = ImportDataSchema.safeParse(raw);
  if (!result.success) {
    const details = result.error.issues
      .map((i) => `${i.path.join('.') || 'root'}: ${i.message}`)
      .join('; ');
    throw new Error(`Invalid import format: ${details}`);
  }
  return result.data.plants as Plant[];
}
