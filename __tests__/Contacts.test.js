import React from 'react';
import { cleanup, render, act, fireEvent, waitFor, debug } from "@testing-library/react-native";

import Contacts from '../src/screens/Contacts';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('Contacts', () => {

  
  it('Pas de test sur flatlist .....?', async () => {
	const handleError = jest.fn(() => {});
	const userID = 1005;

	const a = "a";
	
	context = {
		handleError: handleError,
		userID: userID
	}
	
    const { getAllByTestId, debug, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Contacts />
	</userContext.Provider>, {}
	);





	/* const first = within(getby...(''));
	expect(first.getByText('')).toBe...();

 */

	//const flatlist = getByTestId('flatlist');




	//await waitFor(() => expect(getByTestId('flatlist')));
	//debug("làààà\n\n");
	//debug("ici : " + JSON.stringify(getByTestId('flatlist').props.children));
	//expect(getByTestId('flatlist').props.children).toHaveLength(2);

	await waitFor(() => expect(getAllByTestId('iconLettre')));
    fireEvent.press(getAllByTestId('iconLettre'));
	await waitFor(() => expect(fctModalApp).toHaveBeenCalledTimes(1));
	expect(fctModalApp).toBeCalledWith("Attention", "Email non valide");
	  
  });
  
  
  
});