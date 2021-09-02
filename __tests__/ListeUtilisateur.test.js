import React from 'react';
import {Linking} from 'react-native';

import { cleanup, render, fireEvent, waitFor } from "@testing-library/react-native";

import ListeUtilisateur from '../src/screens/ListeUtilisateur';

import {userContext} from '../src/contexts/userContext'
import {setString} from "../__mocks__/expo-clipboard";

jest.mock("../src/components/sendAPI.js");
jest.mock("expo-clipboard");


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
  
  it('ListeUtilisateur', (done) => {
	const handleError = jest.fn(() => {});
	const liste = [];
    const IDActivite = 1;
    const IDSite = 1;
    const IDJour = "2021-08-27";

    const goBack = jest.fn();
    
    const props = ({ navigation: { goBack }, route: { params: { IDActivite, IDSite, IDJour, liste } } });

	context = {
		handleError: handleError,
		liste: liste,
	}
	
    const { getAllByTestId, getByText, getByPlaceholderText, getByDisplayValue} = render(
	<userContext.Provider value = {context}>
		<ListeUtilisateur {...props} />
	</userContext.Provider>, {}
	);


    waitFor(() => expect(getByPlaceholderText('Prénom du bénévole à ajouter :')))
	
	.then(() => {
		fireEvent.changeText(getByPlaceholderText('Prénom du bénévole à ajouter :'), 'Aa');
	 
		return waitFor(() => getAllByTestId('goBack')[0]);
    })
	.then((backButton) => {
		fireEvent.press(backButton);
		
		return waitFor(() => expect(goBack).toBeCalledTimes(1));
	})
  	.then(() => {
		done();
	})
	.catch((error) => done(error));
    

	  
  });

  
  it('Informations de contact', (done) => {
	const handleError = jest.fn(() => {});
	const liste = [];
    const IDActivite = 1;
    const IDSite = 1;
    const IDJour = "2021-08-27";

    const goBack = jest.fn();
    
    const props = ({ navigation: { goBack }, route: { params: { IDActivite, IDSite, IDJour, liste } } });

    context = {
        handleError: handleError,
        liste: liste,
    }
    
    const { getAllByTestId, getByText, getByPlaceholderText, getByDisplayValue} = render(
    <userContext.Provider value = {context}>
        <ListeUtilisateur {...props} />
    </userContext.Provider>, {}
    );


    waitFor(() => expect(getByPlaceholderText('Prénom du bénévole à ajouter :')))
	.then(() => {
		fireEvent.changeText(getByPlaceholderText('Prénom du bénévole à ajouter :'), 'Aa');
		return waitFor(() => expect(getAllByTestId('iconLettre')));
	})
	.then(() => {
		fireEvent.press(getAllByTestId('iconLettre')[0]);
	    return waitFor(() => expect(getByText("Informations de contact")));
    })
	.then(() => {
	    return	waitFor(() => expect(getByText("bedfg@gmail.com")));
    })
    .then(() => {
	    return	waitFor(() => expect(getByText("05 44 55 5")));
    })
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });

  it('ModalContact : Copy to clipboard', (done) => {
	const handleError = jest.fn(() => {});
	const liste = [];
    const IDActivite = 1;
    const IDSite = 1;
    const IDJour = "2021-08-27";

    const goBack = jest.fn();
    
    const props = ({ navigation: { goBack }, route: { params: { IDActivite, IDSite, IDJour, liste } } });

    context = {
        handleError: handleError,
        liste: liste,
    }
    
    const { getAllByTestId, getByText, getByPlaceholderText, getByDisplayValue} = render(
    <userContext.Provider value = {context}>
        <ListeUtilisateur {...props} />
    </userContext.Provider>, {}
    );

    waitFor(() => expect(getByPlaceholderText('Prénom du bénévole à ajouter :')))
	.then(() => {
		fireEvent.changeText(getByPlaceholderText('Prénom du bénévole à ajouter :'), 'Aa');
		return waitFor(() => expect(getAllByTestId('iconLettre')));
	})
	.then(() => {
		fireEvent.press(getAllByTestId('iconLettre')[0]);
	    return waitFor(() => expect(getByText("Informations de contact")));
    })
	.then(() => {
        fireEvent.press(getByText("05 44 55 5"));
        fireEvent.press(getByText("bedfg@gmail.com"));
	    return	waitFor(() => expect(setString).toBeCalledTimes(2));
    })
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });


  it('Modal Contact : Envoie de Mail', (done) => {
	const handleError = jest.fn(() => {});
	const liste = [];
    const IDActivite = 1;
    const IDSite = 1;
    const IDJour = "2021-08-27";

    const goBack = jest.fn();

    const fctModalMail = jest.fn();
    
    const props = ({ navigation: { goBack }, route: { params: { IDActivite, IDSite, IDJour, liste } } });

    context = {
        handleError: handleError,
        liste: liste,
        fctModalMail: fctModalMail,
    }
    
    const { getAllByTestId, getByText, getByPlaceholderText, getByDisplayValue} = render(
    <userContext.Provider value = {context}>
        <ListeUtilisateur {...props} />
    </userContext.Provider>, {}
    );

    waitFor(() => expect(getByPlaceholderText('Prénom du bénévole à ajouter :')))
	.then(() => {
		fireEvent.changeText(getByPlaceholderText('Prénom du bénévole à ajouter :'), 'Aa');
		return waitFor(() => expect(getAllByTestId('iconLettre')));
	})
	.then(() => {
		fireEvent.press(getAllByTestId('iconLettre')[0]);
	    return waitFor(() => expect(getByText("Informations de contact")));
    })
	.then(() => {
        fireEvent.press(getByText("MAIL"));
	    return	waitFor(() => expect(fctModalMail).toBeCalledTimes(1));
    })
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });
  

  it('Modal Contact : Envoie de SMS', (done) => {
	const handleError = jest.fn(() => {});
	const liste = [];
    const IDActivite = 1;
    const IDSite = 1;
    const IDJour = "2021-08-27";

    const goBack = jest.fn();

    const props = ({ navigation: { goBack }, route: { params: { IDActivite, IDSite, IDJour, liste } } });

    context = {
        handleError: handleError,
        liste: liste,
    }
    
    const { getAllByTestId, getByText, getByPlaceholderText, getByDisplayValue} = render(
    <userContext.Provider value = {context}>
        <ListeUtilisateur {...props} />
    </userContext.Provider>, {}
    );

    waitFor(() => expect(getByPlaceholderText('Prénom du bénévole à ajouter :')))
	.then(() => {
		fireEvent.changeText(getByPlaceholderText('Prénom du bénévole à ajouter :'), 'Aa');
		return waitFor(() => expect(getAllByTestId('iconLettre')));
	})
	.then(() => {
		fireEvent.press(getAllByTestId('iconLettre')[0]);
	    return waitFor(() => expect(getByText("Informations de contact")));
    })
	.then(() => {
        fireEvent.press(getByText("SMS"));
	    return	waitFor(() => expect(Linking.openURL).toBeCalledTimes(1));
    })
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });
  
});