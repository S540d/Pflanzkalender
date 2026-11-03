// expo-font lädt im Jest-Lauf keine echten Schriften: Ionicons ruft beim Mount
// Font.loadAsync auf, was mit jest-expo 58 am Asset-Registry scheitert.
jest.mock('expo-font', () => ({
  ...jest.requireActual('expo-font'),
  loadAsync: jest.fn().mockResolvedValue(undefined),
  isLoaded: jest.fn().mockReturnValue(true),
}));
