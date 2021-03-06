import React from 'react';
import { render, fireEvent, waitFor } from "@testing-library/react-native";

import SynthRef from '../src/screens/SynthRef';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");


describe('SynthRef', () => {


  it('Référent', (done) => {
	const handleError = jest.fn(() => {});
	const userID = 0;

	const navigation = {addListener : (arg1,arg2) => {arg2()}};

	context = {
		handleError: handleError,
		userID: userID,
	}
	
    const { getAllByTestId, getAllByText } = render(
	<userContext.Provider value = {context}>
		<SynthRef navigation={navigation}/>
	</userContext.Provider>, {}
	);


	waitFor(() => expect(getAllByText('Distribution')))
	.then(() => {
		return expect(getAllByText('23/08/2021'));
	})
	.then(() => {
		return expect(getAllByText('Raisin'));
	})
	.then(() => {
		return expect(getAllByText('1/1'));
	})
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });


  it('Bénévole', (done) => {
	const handleError = jest.fn(() => {});
	const userID = 1;

	const navigation = {addListener : (arg1,arg2) => {arg2()}};

	context = {
		handleError: handleError,
		userID: userID,
	}
	
    const { getAllByTestId, getAllByText } = render(
	<userContext.Provider value = {context}>
		<SynthRef navigation={navigation}/>
	</userContext.Provider>, {}
	);


	waitFor(() => expect(getAllByText(/Il semblerait/)))
	.then(() => {
		done();
	})
	.catch((error) => done(error));

	  
  });
  
  
});