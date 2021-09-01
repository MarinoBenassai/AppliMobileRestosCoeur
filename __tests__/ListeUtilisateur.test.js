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

  beforeEach(() => {
    jest.setTimeout(10000);
  });
  
  it('ListeUtilisateur', async () => {
	const handleError = jest.fn(() => {});
	const liste = [];
    const IDActivite = 1;
    const IDSite = 1;
    const IDJour = "2021-08-27";

    
        const goBack = jest.fn();
      
        const props = ({ navigation: { goBack }, route: { params: { IDActivite, IDSite, IDJour, liste } } });
        /* const { getByTestId } = render((<ListeUtilisateur {...props} />));
      
        const backButton = getByTestId('headerBackButton');
      
        fireEvent.press(backButton);
      
        expect(goBack).toBeCalledTimes(1); */
      
	

	context = {
		handleError: handleError,
		liste: liste,
	}
	
    const { getAllByTestId, getByText, getByPlaceholderText, getByDisplayValue} = render(
	<userContext.Provider value = {context}>
		<ListeUtilisateur {...props} />
	</userContext.Provider>, {}
	);


    await waitFor(() => expect(getByPlaceholderText('Prénom du bénévole à ajouter :'))); 

    fireEvent.changeText(getByPlaceholderText('Prénom du bénévole à ajouter :'), 'Aa');
 
    const backButton = await waitFor(() => getAllByTestId('goBack')[0]);
    
    fireEvent.press(backButton);
  
    await waitFor(() => expect(goBack).toBeCalledTimes(1));

	  
  });

  
  
  
});