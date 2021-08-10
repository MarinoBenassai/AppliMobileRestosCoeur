import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";
import constantes from '../src/constantes';

import Identification from '../src/screens/Identification';
import App from "../App.js"
import {userContext} from '../src/contexts/userContext'
import {checkFetch} from '../src/components/checkFetch';
jest.mock("../src/components/registerForPushNotificationsAsync.js");

afterEach(cleanup)

const sendAPI =   async (apCode,sqlCode,params, tokenCo = null) => {
  var body = {};
  if (apCode === 'APP') {
	body = JSON.stringify({
	  'params' : params,
	  'token' : tokenCo,
	});
  }
  else {
	body = JSON.stringify({
	  'params' : params,
	});
  }
  const response = await fetch('http://' + constantes.BDD + '/' + apCode + '/' + sqlCode + '/', {
	method: 'POST',
	body: body});
  return checkFetch(response,apCode);
};

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
		sendAPI: sendAPI
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

	  
	const changeID = jest.fn(() => {});
	const changeToken = jest.fn(() => {});
	context = {
		changeID: changeID,
		changeToken: changeToken,
		sendAPI: sendAPI
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