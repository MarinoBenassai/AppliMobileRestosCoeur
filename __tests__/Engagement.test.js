import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";

import Engagements from '../src/screens/Engagements';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('Engagement', () => {
	
  it('should display the list on loading', async () => {
	 const navigation = {addListener : (arg1,arg2) => {arg2()}};
  
    const context = {
	    handleError: () => {},
    }

    const {getByText, getByTestId} = render(
	  <userContext.Provider value = {context}>
		  <Engagements navigation={navigation}/>
	  </userContext.Provider>
	);

    //await waitFor(() => expect(getByText('Raisin')).toBeTruthy());
	await waitFor(() => expect(getByTestId("CeciEstUnTestt")).toBeTruthy());
	fireEvent.press(getByTestId("CeciEstUnTestt"));
	
  });
  
});