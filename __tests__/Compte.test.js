import React from 'react';
import { cleanup, render, act, fireEvent, waitFor, debug } from "@testing-library/react-native";

import Contacts from '../src/screens/Contacts';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('Contacts', () => {

  
  it('Modal visible avce bonnes infos', async () => {
	const handleError = jest.fn(() => {});
	const userID = 0;
	
	context = {
		handleError: handleError,
		userID: userID
	}
	
    const { getAllByTestId, getByText } = render(
	<userContext.Provider value = {context}>
		<Contacts />
	</userContext.Provider>, {}
	);


	await waitFor(() => expect(getAllByTestId('iconLettre')));
    fireEvent.press(getAllByTestId('iconLettre')[0]);
	await waitFor(() => expect(getByText("Informations de contact")));
	expect(getByText("00 00 00 00 00"));
	expect(getByText("veeeee@hotmail.fr"));
	  
  });

  it('catch', async () => {
	const handleError = jest.fn(() => {});
	const userID = 1;
	
	context = {
		handleError: handleError,
		userID: userID
	}
	
    render(
	<userContext.Provider value = {context}>
		<Contacts />
	</userContext.Provider>, {}
	);


	await waitFor(() => expect(handleError).toHaveBeenCalledWith("contact erreur"));
	  
  });
  
  
  
});