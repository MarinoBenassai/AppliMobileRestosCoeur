import React from 'react';
import { cleanup, render, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native";

import Engagements from '../src/screens/Engagements';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)



jest.mock('react-native/Libraries/Modal/Modal', () => {
  const Modal = jest.requireActual('react-native/Libraries/Modal/Modal')
  // @ts-ignore
  return props => <Modal {...props} />
})

describe.skip('Engagement', () => {
	
  it('should display the list on loading', async () => {
	  
	 const navigation = {addListener : (arg1,arg2) => {arg2()}};
  
    const context = {
		userID: 1005,
		token: 0,
	    handleError: () => {},
    }

    const {getAllByText, getAllByTestId} = render(
	  <userContext.Provider value = {context}>
		  <Engagements navigation={navigation}/>
	  </userContext.Provider>
	);

	await waitFor(() => expect(getAllByTestId("Présent")).toBeTruthy());
	expect(getAllByTestId("Présent")).toHaveLength(3);
	expect(getAllByTestId("Absent")).toHaveLength(3);
	expect(getAllByTestId("Non défini")).toHaveLength(2);
	expect(getAllByText("Raisin")).toHaveLength(4);
	expect(getAllByText("30/08/2021")).toHaveLength(2);
  });
  
  it('should change status on button press', (done) => {
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
    const context = {
		userID: 1005,
		token: 1,
	    handleError: () => {},
    }

    const {queryByTestId, queryByText, getByPlaceholderText, getByText, getByTestId, getAllByText, getAllByTestId} = render(
	  <userContext.Provider value = {context}>
		  <Engagements navigation={navigation}/>
	  </userContext.Provider>
	);

	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(8);
		expect(getAllByText("Raisin")).toHaveLength(4);
		expect(getAllByText("30/08/2021")).toHaveLength(2);
		
		//On clique sur le premier bouton "Non Défini" et on vérifie qu'il devient "Présent" 
		fireEvent.press(getAllByTestId("Non défini")[0]);
		return waitFor(() => expect(getByTestId("Présent")).toBeTruthy());
	})
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(7);
		
		//On clique sur le bouton "Présent", on vérifie que le modal s'affiche
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	
	.then(() => {
		//On annule et on vérifie que le modal a disparu et que rien n'a changé
		fireEvent.press(getByText("Annuler"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
		.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(7);
		expect(getByTestId("Présent")).toBeTruthy();
		expect(queryByTestId("Absent")).toBeNull();
		
		//On clique à nouveau sur le bouton présent et on attend le modal
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	.then(() => {
		//On entre le message d'absence, on clique sur le bouton valider, et on vérifie que le modal disparait
		fireEvent.changeText(getByPlaceholderText("Raison de votre absence"),"Ceci est un test é*/°ç");
		fireEvent.press(getByTestId("Valider"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
	.then(() => {
		//On vérifie que le bouton devient "Absent", et on vérifie que le commentaire est le bon en cliquant sur le bouton pour le modifier
		
		
		
	})
	.catch((error) => done(error))
	//On clique sur le bouton présent, 
	
	
		
	//expect(getByText("Ceci est un test é*/°ç"))
	done();

  });
  
});