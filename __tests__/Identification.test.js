import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";

import Identification from '../src/screens/Identification';
import App from "../App.js"
import {userContext} from '../src/contexts/userContext'
import {registerForPushNotificationsAsync} from '../src/components/__mocks__/registerForPushNotificationsAsync'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('Identification', () => {
	
  it('should display "CONNEXION" button', () => {

    const {getByText} = render(<Identification />);

    expect(getByText('CONNEXION').props.children).toEqual('CONNEXION');
  });
  
  it('should not display "PASSER" button', () => {

    const {queryByText} = render(<Identification />);

    const foundButton = queryByText("PASSER");

    expect(foundButton).toBeNull();
  });
  
  it('should fail on incorrect password', async () => {
	const handleError = jest.fn(() => {});	
	context = {
		handleError: handleError,
	}
	
    const { getByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Identification />
	</userContext.Provider>
	);

	fireEvent.changeText(getByPlaceholderText('votre@email.fr'), "a@a.a");
	fireEvent.changeText(getByPlaceholderText('********'), "zzz");
    fireEvent.press(getByText('CONNEXION'));
	await waitFor(() => expect(handleError).toHaveBeenCalledTimes(1));
	expect(handleError).toBeCalledWith("Login ou mot de passe incorrect");
	  
  });
  
  it('should store id/token on correct login', async () => {

	const handleError = jest.fn(() => {});	
	const changeID = jest.fn(() => {});
	const changeToken = jest.fn(() => {});
	context = {
		changeID: changeID,
		changeToken: changeToken,
		registerForPushNotificationsAsync: registerForPushNotificationsAsync,
		handleError: handleError,
	}
	
	const { getByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Identification />
	</userContext.Provider>
	);
	
	fireEvent.changeText(getByPlaceholderText('votre@email.fr'), "a@a.a");
	fireEvent.changeText(getByPlaceholderText('********'), "aaaaaaaa");
    fireEvent.press(getByText('CONNEXION'));

	await waitFor(() => expect(changeID).toHaveBeenCalledTimes(1));
	expect(changeID).toBeCalledWith("1005");
	expect(changeToken).toHaveBeenCalledTimes(1);
	expect(changeToken).toBeCalledWith("123456789");
	
  });
});