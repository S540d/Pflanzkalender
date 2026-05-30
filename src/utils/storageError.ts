export async function withStorageError(label: string, op: () => Promise<void>): Promise<void> {
  try {
    await op();
  } catch (error) {
    console.error(label, error);
  }
}
