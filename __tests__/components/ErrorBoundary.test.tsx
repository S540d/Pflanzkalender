import React from 'react';
import { Text } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

const ThrowingChild = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error message');
  }
  return <Text>All good</Text>;
};

// Suppress expected console.error noise from error boundary
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});
afterAll(() => {
  console.error = originalConsoleError;
});

describe('ErrorBoundary', () => {
  it('renders children when no error occurs', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <Text>Child component</Text>
      </ErrorBoundary>
    );
    expect(getByText('Child component')).toBeTruthy();
  });

  it('renders error UI when a child throws', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(getByText('⚠️ App Fehler')).toBeTruthy();
  });

  it('displays the error message text', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(getByText(/Test error message/)).toBeTruthy();
  });

  it('shows a reset/reload button', () => {
    const { getByText } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );
    // On native (test env) the button reads "🔄 App zurücksetzen"
    expect(getByText(/zurücksetzen|Neu laden/)).toBeTruthy();
  });

  it('resets error state on native when reload button pressed', () => {
    const { getByText, queryByText } = render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error UI should be visible
    expect(getByText('⚠️ App Fehler')).toBeTruthy();

    // Press the reset button (native path: resets state)
    fireEvent.press(getByText(/zurücksetzen|Neu laden/));

    // After reset, children would re-render. Because ThrowingChild would throw again
    // in this test setup, the error boundary re-catches it — so error UI persists.
    // What we verify here is that the button is pressable and does not crash.
    expect(getByText('⚠️ App Fehler')).toBeTruthy();
  });

  it('calls console.error when an error is caught', () => {
    render(
      <ErrorBoundary>
        <ThrowingChild shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(console.error).toHaveBeenCalled();
  });

  it('is a valid React component class', () => {
    expect(typeof ErrorBoundary).toBe('function');
  });
});
