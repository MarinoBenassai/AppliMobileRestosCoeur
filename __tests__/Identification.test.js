import React from 'react';
import {cleanup, render} from '@testing-library/react-native';

import Identification from '../src/screens/Identification';

afterEach(cleanup);

describe('Identification', () => {
  it('should display login button', () => {
    const testIdButton = 'LoginButton';

    const {toJSON, getByTestId} = render(<Identification />);

    const foundButton = getByTestId(testIdButton);

    expect(foundButton).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });
});