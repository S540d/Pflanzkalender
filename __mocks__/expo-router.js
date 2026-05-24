const React = require('react');

const Tabs = ({ children }) => children;
Tabs.Screen = ({ children }) => children;

module.exports = {
  useFocusEffect: jest.fn(),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  })),
  useLocalSearchParams: jest.fn(() => ({})),
  useSegments: jest.fn(() => []),
  Tabs,
  Link: ({ children }) => children,
};
