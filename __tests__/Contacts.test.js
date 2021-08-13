import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";

import Contacts from '../src/screens/Contacts';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('Contacts', () => {

  
  it('should display contact information', async () => {
	const handleError = jest.fn(() => {});
	const fctModalApp = jest.fn(() => {});
	
	context = {
		handleError: handleError,
		fctModalApp: fctModalApp
	}
	
    const { getByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Contacts />
	</userContext.Provider>
	);

	fireEvent.changeText(getByPlaceholderText('votre@email.fr'), "aaa");
    fireEvent.press(getByText('ENVOYER'));
	await waitFor(() => expect(fctModalApp).toHaveBeenCalledTimes(1));
	expect(fctModalApp).toBeCalledWith("Attention", "Email non valide");
	  
  });
  
  
  
});