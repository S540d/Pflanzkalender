const React = require('react');

module.exports = {
  useFocusEffect: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  Tabs: ({ children }) => children,
  Link: ({ children }) => children,
};
