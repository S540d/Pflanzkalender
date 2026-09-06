export async function withStorageError(label: string, op: () => Promise<void>): Promise<void> {
  try {
    await op();
  } catch (error) {
    console.error(label, error);
  }
}

// Like withStorageError, but for reads that need a fallback value instead of void
// (e.g. "return [] on failure" rather than "swallow and do nothing").
export async function withStorageErrorFallback<T>(
  label: string,
  op: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await op();
  } catch (error) {
    console.error(label, error);
    return fallback;
  }
}
