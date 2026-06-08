import React from 'react';
import { render } from '@testing-library/react-native';
import { QRCodeView } from '../../src/components/QRCodeView';
import { QR_MAX_BYTES } from '../../src/utils/qrcode';

describe('QRCodeView', () => {
  it('renders a QR code (no fallback) for a normal value', () => {
    const { queryByText } = render(
      <QRCodeView value="Pflanzkalender" tooLargeLabel="zu groß" />
    );
    expect(queryByText('zu groß')).toBeNull();
  });

  it('renders the fallback label when the value is too large', () => {
    const huge = 'x'.repeat(QR_MAX_BYTES + 1);
    const { getByText } = render(<QRCodeView value={huge} tooLargeLabel="zu groß" />);
    expect(getByText('zu groß')).toBeTruthy();
  });

  it('renders the fallback for an empty value', () => {
    const { getByText } = render(<QRCodeView value="" tooLargeLabel="leer" />);
    expect(getByText('leer')).toBeTruthy();
  });
});
