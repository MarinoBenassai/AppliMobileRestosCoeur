import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";

import SynthRef from '../src/screens/SynthRef';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('SynthRef', () => {

  function navigation(){
      const addListener = (nom, fct) => {
          return fct();
      }

      const objet = {addListener: addListener};
      return objet;
  }
  
  it('SynthRef', async () => {
	const handleError = jest.fn(() => {});
	const userID = 0;
	

	context = {
		handleError: handleError,
		userID: userID,
        navigation: navigation,
	}
	
    const { getAllByTestId, getByText } = render(
	<userContext.Provider value = {context}>
		<SynthRef />
	</userContext.Provider>, {}
	);


	await waitFor(() => expect(getAllByTestId('iconLettre')));
    fireEvent.press(getAllByTestId('iconLettre')[0]);
	await waitFor(() => expect(getByText("Informations de contact")));
	expect(getByText("00 00 00 00 00"));
	expect(getByText("veeeee@hotmail.fr"));
	  
  });

  
  
  
});