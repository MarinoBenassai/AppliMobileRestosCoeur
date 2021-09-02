import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react-native";

import Informations from '../src/screens/Informations';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");


describe('Informations', () => {


  it('Informations', (done) => {
	const handleError = jest.fn(() => {});
	const userID = 0;

	const navigation = {addListener : (arg1,arg2) => {arg2()}};

	context = {
		handleError: handleError,
		userID: userID,
	}
	
    const { getAllByTestId, getAllByText } = render(
	<userContext.Provider value = {context}>
		<Informations navigation={navigation}/>
	</userContext.Provider>, {}
	);


	waitFor(() => expect(getAllByText(/Collégiale : Liste de tous les bénévoles/)))
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });

  
});