import React from 'react';
import { cleanup, render, act, fireEvent, waitFor, debug } from "@testing-library/react-native";

import Compte from '../src/screens/Compte';
import {userContext} from '../src/contexts/userContext'


import {show} from "../__mocks__/react-native-toast-notifications";

jest.mock("react-native-toast-notifications");

jest.mock("../src/components/sendAPI.js");

afterEach(cleanup);
afterEach(() => show.mockReset());

describe('Compte : info de contact', () => {

  
  it('numéro trop court : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('88 88 88 88 88')));
    fireEvent.changeText(getByPlaceholderText('88 88 88 88 88'), "0704");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Numéro de téléphone non valide", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "error"}  );
	  
  });

  it('numéro trop court +33 : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('88 88 88 88 88')));
    fireEvent.changeText(getByPlaceholderText('88 88 88 88 88'), "+330704");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Numéro de téléphone non valide", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "error"}  );
	  
  });

  it('numéro trop long : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('88 88 88 88 88')));
    fireEvent.changeText(getByPlaceholderText('88 88 88 88 88'), "07040000000");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Numéro de téléphone non valide", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "error"}  );
	  
  });

  it('numéro trop long +33 : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('88 88 88 88 88')));
    fireEvent.changeText(getByPlaceholderText('88 88 88 88 88'), "+330000007040");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Numéro de téléphone non valide", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "error"}  );
	  
  });


  it('numéro valide : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('88 88 88 88 88')));
    fireEvent.changeText(getByPlaceholderText('88 88 88 88 88'), "0704000000");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Vos informations ont bien été mises à jour.", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "success"}  );
  });

  it('numéro valide +33 : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('88 88 88 88 88')));
    fireEvent.changeText(getByPlaceholderText('88 88 88 88 88'), "+33704 000000");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Vos informations ont bien été mises à jour.", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "success"}  );
	  
  });


  it('email valide : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('h@f.fr')));
    fireEvent.changeText(getByPlaceholderText('h@f.fr'), "foucart@rf.fr");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Vos informations ont bien été mises à jour.", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "success"}  );
	  
  });
 

  it('email non valide : fetch', async () => {

	const handleError = jest.fn(() => {});
	const userID = 0;
	const token = 0;
	
	context = {
		handleError: handleError,
		userID: userID,
		token: token,
	}

    // render
    const { getAllByTestId, getByText, getByPlaceholderText } = render(
	<userContext.Provider value = {context}>
		<Compte />
	</userContext.Provider>, {}
	);

    // fireEvent
	await waitFor(() => expect(getByPlaceholderText('h@f.fr')));
    fireEvent.changeText(getByPlaceholderText('h@f.fr'), "foucartrf.fr");
    fireEvent.press(getByText('Valider Coordonnées'));

    //expect
    expect(show).toHaveBeenCalledWith("Email non valide", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "error"}  );
	  
  });
  
});


describe('Compte : pwd', () => {

  
    it('vide', async () => {
  
      const handleError = jest.fn(() => {});
      const userID = 0;
      const token = 0;
      
      context = {
          handleError: handleError,
          userID: userID,
          token: token,
      }
  
      // render
      const { getAllByPlaceholderText, getByText, getByPlaceholderText } = render(
      <userContext.Provider value = {context}>
          <Compte />
      </userContext.Provider>, {}
      );
  
      // fireEvent
      await waitFor(() => expect(getAllByPlaceholderText('******')));
      fireEvent.changeText(getAllByPlaceholderText('******')[1], "0704");
      fireEvent.press(getByText('Valider Mot de Passe'));
  
      //expect
      expect(show).toHaveBeenCalledWith("Au moins un des champs est vide", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "warning"}  );
        
    });

    it('non identique', async () => {
  
        const handleError = jest.fn(() => {});
        const userID = 0;
        const token = 0;
        
        context = {
            handleError: handleError,
            userID: userID,
            token: token,
        }
    
        // render
        const { getAllByPlaceholderText, getByText, getByPlaceholderText } = render(
        <userContext.Provider value = {context}>
            <Compte />
        </userContext.Provider>, {}
        );
    
        // fireEvent
        await waitFor(() => expect(getAllByPlaceholderText('******')));
        fireEvent.changeText(getAllByPlaceholderText('******')[0], "0704");
        fireEvent.changeText(getAllByPlaceholderText('******')[1], "0705");
        fireEvent.changeText(getAllByPlaceholderText('******')[2], "0706");
        fireEvent.press(getByText('Valider Mot de Passe'));
    
        //expect
        expect(show).toHaveBeenCalledWith("Les champs correspondant au nouveau mot de passe ne sont pas identiques", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "danger"}  );
          
      });

      it('lenght < 8', async () => {
        //show.mockReset();
        const handleError = jest.fn(() => {});
        const userID = 0;
        const token = 0;
        
        context = {
            handleError: handleError,
            userID: userID,
            token: token,
        }
    
        // render
        const { getAllByPlaceholderText, getByText, getByPlaceholderText } = render(
        <userContext.Provider value = {context}>
            <Compte />
        </userContext.Provider>, {}
        );
    
        // fireEvent
        await waitFor(() => expect(getAllByPlaceholderText('******')));
        fireEvent.changeText(getAllByPlaceholderText('******')[0], "0704");
        fireEvent.changeText(getAllByPlaceholderText('******')[1], "0707000");
        fireEvent.changeText(getAllByPlaceholderText('******')[2], "0707000");
        fireEvent.press(getByText('Valider Mot de Passe'));
    
        //expect
        expect(show).toHaveBeenCalledWith("Votre mot de passe doit contenir au moins 8 caractères", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "danger"}  );
          
      });

      it('ancien mdp faux', async () => {
        //show.mockReset();
        const handleError = jest.fn(() => {});
        const userID = 1;
        const token = 1;
        const oldP = "oldP";
        const newP = "newP";
        
        context = {
            handleError: handleError,
            userID: userID,
            token: token,
            oldP: oldP,
            newP: newP,
        }
    
        // render
        const { getAllByPlaceholderText, getByText, getByPlaceholderText } = render(
        <userContext.Provider value = {context}>
            <Compte />
        </userContext.Provider>, {}
        );
    
        // fireEvent
        await waitFor(() => expect(getAllByPlaceholderText('******')));
        fireEvent.changeText(getAllByPlaceholderText('******')[0], "0704");
        fireEvent.changeText(getAllByPlaceholderText('******')[1], "07070000");
        fireEvent.changeText(getAllByPlaceholderText('******')[2], "07070000");
        fireEvent.press(getByText('Valider Mot de Passe'));
    
        //expect
        await waitFor(() => expect(handleError).toBeCalledWith("Ancien mot de passe incorrect."));
        
      });

      it('changement mdp', async () => {
        //show.mockReset();
        const handleError = jest.fn(() => {});
        const userID = 0;
        const token = 0;
        const oldP = "oldP";
        const newP = "newP";
        
        context = {
            handleError: handleError,
            userID: userID,
            token: token,
            oldP: oldP,
            newP: newP,
        }
    
        // render
        const { getAllByPlaceholderText, getByText, getByPlaceholderText } = render(
        <userContext.Provider value = {context}>
            <Compte />
        </userContext.Provider>, {}
        );
    
        // fireEvent
        await waitFor(() => expect(getAllByPlaceholderText('******')));
        fireEvent.changeText(getAllByPlaceholderText('******')[0], "0704");
        fireEvent.changeText(getAllByPlaceholderText('******')[1], "07070000");
        fireEvent.changeText(getAllByPlaceholderText('******')[2], "07070000");
        fireEvent.press(getByText('Valider Mot de Passe'));
    
        //expect
        await waitFor(() => expect(show).toHaveBeenCalledWith("Votre mot de passe a bien été modifié.", {"animationType": "zoom-in", "duration": 2000, "offset": 30, "position": "bottom", "type": "success"}  ));
          
      });

});  