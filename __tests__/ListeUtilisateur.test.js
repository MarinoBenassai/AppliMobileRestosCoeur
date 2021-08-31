import React from 'react';
import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";

import ListeUtilisateur from '../src/screens/ListeUtilisateur';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)

describe('ListeUtilisateur', () => {

  const navigation = () =>{
      const addListener = (nom, fct) => {
          return fct();
      }

      const objet = {addListener: addListener};
      return objet;
  }
  
  it('ListeUtilisateur', async () => {
	const handleError = jest.fn(() => {});
	const userID = 0;

    
        const goBack = jest.fn();
      
        const props = ({ navigation: { goBack }, route: { params: {} } });
        /* const { getByTestId } = render((<ListeUtilisateur {...props} />));
      
        const backButton = getByTestId('headerBackButton');
      
        fireEvent.press(backButton);
      
        expect(goBack).toBeCalledTimes(1); */
      
	

	context = {
		handleError: handleError,
		userID: userID,
	}
	
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<ListeUtilisateur {...props} />
	</userContext.Provider>, {}
	);


    //const backButton = await waitFor(() => getAllByTestId('goBack')[0]);
    await waitFor(() => expect(getByPlaceholderText('Prénom du bénévole à ajouter :'))); 
    //await waitFor(() => expect(getAllByTestId('goBack')));  

    fireEvent.press(backButton);
  
    expect(goBack).toBeCalledTimes(1);

	/* await waitFor(() => expect(getAllByTestId('iconLettre')));
    fireEvent.press(getAllByTestId('iconLettre')[0]);
	await waitFor(() => expect(getByText("Informations de contact")));
	expect(getByText("00 00 00 00 00"));
	expect(getByText("veeeee@hotmail.fr")); */
	  
  });

  
  
  
});