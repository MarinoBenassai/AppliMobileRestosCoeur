import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";
import constantes from '../src/constantes';

import MdpOublie from '../src/screens/MdpOublie';
import App from "../App.js"
import {userContext} from '../src/contexts/userContext'
import {checkFetch} from '../src/components/checkFetch';

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

describe('MdpOublie', () => {
	
  it('should display "ENVOYER" button', () => {

    const {getByText} = render(<MdpOublie />);

    expect(getByText('ENVOYER').props.children).toEqual('ENVOYER');
  });
  
  it('should warn on incorrect email', async () => {
	const handleError = jest.fn(() => {});
	const fctModalApp = jest.fn(() => {});
	
	context = {
		handleError: handleError,
		sendAPI: sendAPI,
		fctModalApp: fctModalApp
	}
	
    const { getByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<MdpOublie />
	</userContext.Provider>
	);

	fireEvent.changeText(getByPlaceholderText('votre@email.fr'), "aaa");
    fireEvent.press(getByText('ENVOYER'));
	await waitFor(() => expect(fctModalApp).toHaveBeenCalledTimes(1));
	expect(fctModalApp).toBeCalledWith("Attention", "Email non valide");
	  
  });
  
  it('should display message on correct email', async () => {
	const handleError = jest.fn(() => {});
	const fctModalApp = jest.fn(() => {});
	
	context = {
		handleError: handleError,
		sendAPI: sendAPI,
		fctModalApp: fctModalApp
	}
	
    const { getByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<MdpOublie />
	</userContext.Provider>
	);

	fireEvent.changeText(getByPlaceholderText('votre@email.fr'), "a@a.a");
    fireEvent.press(getByText('ENVOYER'));
	await waitFor(() => expect(fctModalApp).toHaveBeenCalledTimes(1));
	expect(fctModalApp).toBeCalledWith("succès", "Si cette adresse est associée à un compte, un mail contenant votre nouveau mot de passe vient de vous être envoyé. Votre nouveau mot de passe est nouveaumotdepasse.");
	  
  });
  
  
  it('should send request on keypress enter', async () => {
	const handleError = jest.fn(() => {});
	const fctModalApp = jest.fn(() => {});
	
	context = {
		handleError: handleError,
		sendAPI: sendAPI,
		fctModalApp: fctModalApp
	}
	
    const { getByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<MdpOublie />
	</userContext.Provider>
	);

	fireEvent.changeText(getByPlaceholderText('votre@email.fr'), "a@a.a");
	fireEvent(getByPlaceholderText('votre@email.fr'), 'onSubmitEditing');
	//getByPlaceholderText('votre@email.fr').focus();
	//var event = new KeyboardEvent('keypress', {'keyCode': 37});
	//global.dispatchEvent(event);
	await waitFor(() => expect(fctModalApp).toHaveBeenCalledTimes(1));
	  
  });
  
});