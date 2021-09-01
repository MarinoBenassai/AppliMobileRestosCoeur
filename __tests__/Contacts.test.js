import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";

import Contacts from '../src/screens/Contacts';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('Contacts', () => {

  
  it('Modal visible avce bonnes infos', (done) => {
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


	waitFor(() => expect(getAllByTestId('iconLettre')))
	
	.then(() => {
		// On clique sur le bouton de contact de la première ligne et on attend l'afficahge du modal
		fireEvent.press(getAllByTestId('iconLettre')[0]);
		return waitFor(() => expect(getByText("Informations de contact")));
	})
	.then(() => {
		
		// On vérifie que les informations affichées par le modale sont correctes
		expect(getByText("00 00 00 00 00"));
		expect(getByText("veeeee@hotmail.fr"));
		
		done();
	})
	.catch((error) => done(error));

	  
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

	// On vérifie qu'on reçoit bien l'erreur et qu'on la traite
	await waitFor(() => expect(handleError).toHaveBeenCalledWith("contact erreur"));
	  
  });
  
  
  
});