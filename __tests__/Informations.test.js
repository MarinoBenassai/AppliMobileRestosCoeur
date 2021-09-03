import React from 'react';
import {Linking} from 'react-native';

import { render, fireEvent, waitFor } from "@testing-library/react-native";

import Informations from '../src/screens/Informations';
import {userContext} from '../src/contexts/userContext'

jest.mock("../src/components/sendAPI.js");


describe('Informations', () => {


  it('Montre les informations', (done) => {
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

  it('Informations clickable', (done) => {
	const handleError = jest.fn(() => {});
	const userID = 0;

	const navigation = {addListener : (arg1,arg2) => {arg2()}};

	context = {
		handleError: handleError,
		userID: userID,
	}
	
    const { getAllByTestId, getByText } = render(
	<userContext.Provider value = {context}>
		<Informations navigation={navigation}/>
	</userContext.Provider>, {}
	);


	waitFor(() => expect(getByText(/Collégiale : Liste de tous les bénévoles/)))
	.then(() => {
		fireEvent.press(getByText(/Collégiale : Liste de tous les bénévoles/));
		return	waitFor(() => expect(Linking.openURL).toBeCalledTimes(1));
    })
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });
  
});