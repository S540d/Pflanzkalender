import { ActivityBar } from '../../src/components/ActivityBar';

describe('ActivityBar Component – Type Safety', () => {
  it('is a valid React component', () => {
    expect(typeof ActivityBar).toBe('function');
  });
});
