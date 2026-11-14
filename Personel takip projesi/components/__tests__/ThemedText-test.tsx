import * as React from 'react';
import { expect, it } from '@jest/globals';
import { render } from '@testing-library/react-native';

import { ThemedText } from '../ThemedText';

it('renders the supplied text', () => {
  const { getByText } = render(<ThemedText>Snapshot test!</ThemedText>);

  expect(getByText('Snapshot test!')).toBeTruthy();
});
