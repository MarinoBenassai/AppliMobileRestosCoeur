import React from 'react';
import { cleanup, render, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native";

import Activite from '../src/screens/Activite';
import {userContext} from '../src/contexts/userContext'
jest.mock("../src/components/sendAPI.js");

afterEach(cleanup)
afterEach(() => jest.clearAllMocks())


jest.mock('react-native/Libraries/Modal/Modal', () => {
  const Modal = jest.requireActual('react-native/Libraries/Modal/Modal')
  return props => <Modal {...props} />
})

describe('Activite - Changement de statut', () => {
	
  it('Should display limited informations if role = benevole', async () => {
	
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
	const route = {params : {
	  "IDActivite": "4",
	  "IDSite": "1",
	  "IDJour": "2021-09-06",
	  "NomActivite": "Traçabilité",
	  "NomSite": "Lalande",
	  "idRole": "1"
    }}
	
    const context = {
		userID: 1005,
		token: 0,
	    handleError: jest.fn(() => {}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);

	await waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy());
	
	//Vérification de l'affichage de la liste et des icônes de présence.
	//Seul les dix premiers éléments sont chargés.
	expect(getAllByTestId("Présent")).toHaveLength(3);
	expect(getAllByTestId("Absent")).toHaveLength(3);
	expect(getAllByTestId("Non défini")).toHaveLength(4);
	
	//Les benevoles ne doivent pas avoir accès aux commentaires des autres
	expect(queryByTestId("CommentaireAbsence")).toBeNull();
	
	//Vérification de l'afficahge de l'activité et du site
	expect(getByText(/Traçabilité/i)).toBeTruthy();
	expect(getByText(/Lalande/i)).toBeTruthy();
	
	//Les bénévoles ne doivent pas avoir accès aux boutons situés au dessus de la liste
	expect(queryByTestId("infoActivite")).toBeNull();
	expect(queryByTestId("mailAll")).toBeNull();
	expect(queryByTestId("ajoutBenevole")).toBeNull();
	expect(queryByTestId("changeAffichage")).toBeNull();
  });
  
  it('Should display all informations if role = référent', async () => {
	  
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
	const route = {params : {
	  "IDActivite": "4",
	  "IDSite": "1",
	  "IDJour": "2021-09-06",
	  "NomActivite": "Traçabilité",
	  "NomSite": "Lalande",
	  "idRole": "2"
    }}
	
    const context = {
		userID: 1005,
		token: 0,
	    handleError: jest.fn(() => {}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);

	await waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy());
	
	//Vérification de l'affichage de la liste et des icônes de présence.
	//Seul les dix premiers éléments sont chargés.
	expect(getAllByTestId("Présent")).toHaveLength(3);
	expect(getAllByTestId("Absent")).toHaveLength(3);
	expect(getAllByTestId("Non défini")).toHaveLength(4);
	
	//Les référents doivent avoir accès aux commentaires des autres
	//Le nombre de commentaire doit être égal au nombre d'absents
	expect(getAllByTestId("CommentaireAbsence")).toHaveLength(3);
	
	//Vérification de l'afficahge de l'activité et du site
	expect(getByText(/Traçabilité/i)).toBeTruthy();
	expect(getByText(/Lalande/i)).toBeTruthy();
	
	//Les référents doivent avoir accès aux boutons situés au dessus de la liste
	expect(getByTestId("infoActivite")).toBeTruthy();
	expect(getByTestId("mailAll")).toBeTruthy();
	expect(getByTestId("ajoutBenevole")).toBeTruthy();
	expect(getByTestId("changeAffichage")).toBeTruthy();
  });
  
  it('Should not allow benevoles to change others statuses', async () => {
	
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
	const route = {params : {
	  "IDActivite": "4",
	  "IDSite": "1",
	  "IDJour": "2021-09-06",
	  "NomActivite": "Traçabilité",
	  "NomSite": "Lalande",
	  "idRole": "1"
    }}
	
    const context = {
		userID: 1005,
		token: 0,
	    handleError: jest.fn(() => {}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);

	await waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy());
	
	//On clique sur le premier bouton de chaque type qui apparait dans la liste
	fireEvent.press(getAllByTestId("Présent")[0]);
	fireEvent.press(getAllByTestId("Non défini")[0]);
	
	//L'icone d'absence ne doit même pas être cliquable
	expect(() => {fireEvent.press(getAllByTestId("Absent")[0])}).toThrow();
	
	//On vérifie que rien n'a changé
	expect(getAllByTestId("Présent")).toHaveLength(3);
	expect(getAllByTestId("Absent")).toHaveLength(3);
	expect(getAllByTestId("Non défini")).toHaveLength(4);
	expect(queryByTestId("CommentaireAbsence")).toBeNull();
	
	//On n'a normalement effectué qu'un seul fetch
	expect(fetch).toHaveBeenCalledTimes(1);
  });
  
  it('Should allow benevoles to change their own status', (done) => {
	
	
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
	const route = {params : {
	  "IDActivite": "4",
	  "IDSite": "1",
	  "IDJour": "2021-09-06",
	  "NomActivite": "Traçabilité",
	  "NomSite": "Lalande",
	  "idRole": "1"
    }}
	
    const context = {
		userID: 485,
		token: 1,
	    handleError: jest.fn(() => {}),
		cacherInfoBulle: jest.fn(() => {}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId, queryByText, getByPlaceholderText, getByDisplayValue} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);

	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(10);
		
		//On clique sur le bouton "Non Défini" et on vérifie qu'il devient "Présent" 
		fireEvent.press(getAllByTestId("Non défini")[0]);
		return waitFor(() => expect(getByTestId("Présent")).toBeTruthy());
	})
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(9);
		
		//On clique sur le bouton "Présent", on vérifie que le modal s'affiche
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	
	.then(() => {
		//On annule et on vérifie que le modal a disparu et que rien n'a changé
		fireEvent.press(getByText("Annuler"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
		.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(9);
		expect(getByTestId("Présent")).toBeTruthy();
		expect(queryByTestId("Absent")).toBeNull();
		//On clique à nouveau sur le bouton présent et on attend le modal
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	.then(() => {
		//On entre le message d'absence, on clique sur le bouton valider, et on vérifie que le modal disparait
		fireEvent.changeText(getByPlaceholderText("Raison de votre absence"),"Ceci est un test é*##°ç");

		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
		})
		.then(() => {
		//On vérifie que le bouton devient "Absent", et on ouvre le modal à nouveau
		expect(getByTestId("Absent")).toBeTruthy();
		expect(queryByTestId("Présent")).toBeNull();
		fireEvent.press(getByTestId("CommentaireAbsence"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	.then(() => {
		//On vérifie que le commentaire est le bon et on ferme le modal
		expect(getByDisplayValue("Ceci est un test é*##°ç")).toBeTruthy();
		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
	.then(() => {
		//On clique à nouveau sur le bouton et on vérifie qu'on revient dans l'état initial
		fireEvent.press(getByTestId("Absent"));
		return waitForElementToBeRemoved(() => queryByTestId("Absent"));
	})
	.then(() => {
		expect(queryByTestId("Présent")).toBeNull();
		expect(getAllByTestId("Non défini")).toHaveLength(10);
		done();
	})
	.catch((error) => done(error));

  });
  
  
  it('Should allow referents to change the status of others', (done) => {
	
	
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
	const route = {params : {
	  "IDActivite": "4",
	  "IDSite": "1",
	  "IDJour": "2021-09-06",
	  "NomActivite": "Traçabilité",
	  "NomSite": "Lalande",
	  "idRole": "2"
    }}
	
    const context = {
		userID:	1005,
		token: 2,
	    handleError: jest.fn(() => {}),
		cacherInfoBulle: jest.fn(() => {}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId, queryByText, getByPlaceholderText, getByDisplayValue} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);

	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(10);
		
		//On clique sur le bouton "Non Défini" et on vérifie qu'il devient "Présent" 
		fireEvent.press(getAllByTestId("Non défini")[4]);
		return waitFor(() => expect(getByTestId("Présent")).toBeTruthy());
	})
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(9);
		
		//On clique sur le bouton "Présent", on vérifie que le modal s'affiche
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	
	.then(() => {
		//On annule et on vérifie que le modal a disparu et que rien n'a changé
		fireEvent.press(getByText("Annuler"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
		.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(9);
		expect(getByTestId("Présent")).toBeTruthy();
		expect(queryByTestId("Absent")).toBeNull();
		//On clique à nouveau sur le bouton présent et on attend le modal
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	.then(() => {
		//On entre le message d'absence, on clique sur le bouton valider, et on vérifie que le modal disparait
		fireEvent.changeText(getByPlaceholderText("Raison de votre absence"),"Ceci est un autre test !!//..??");

		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
		})
		.then(() => {
		//On vérifie que le bouton devient "Absent", et on ouvre le modal à nouveau
		expect(getByTestId("Absent")).toBeTruthy();
		expect(queryByTestId("Présent")).toBeNull();
		fireEvent.press(getByTestId("CommentaireAbsence"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	.then(() => {
		//On vérifie que le commentaire est le bon et on ferme le modal
		expect(getByDisplayValue("Ceci est un autre test !!//..??")).toBeTruthy();
		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
	.then(() => {
		//On clique à nouveau sur le bouton et on vérifie qu'on revient dans l'état initial
		fireEvent.press(getByTestId("Absent"));
		return waitForElementToBeRemoved(() => queryByTestId("Absent"));
	})
	.then(() => {
		expect(queryByTestId("Présent")).toBeNull();
		expect(getAllByTestId("Non défini")).toHaveLength(10);
		done();
	})
	.catch((error) => done(error));

  });
  
  /*
  it('should change status on button press', (done) => {
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
    const context = {
		userID: 1005,
		token: 1,
	    handleError: jest.fn(() => {}),
		cacherInfoBulle: jest.fn(() => {})
    }

    const {queryByTestId, queryByText, getByPlaceholderText,getByDisplayValue, getByText, getByTestId, getAllByText, getAllByTestId} = render(
	  <userContext.Provider value = {context}>
		  <Engagements navigation={navigation}/>
	  </userContext.Provider>
	);

	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(8);
		expect(getAllByText("Raisin")).toHaveLength(4);
		expect(getAllByText("06/09/2021")).toHaveLength(2);
		
		//On clique sur le premier bouton "Non Défini" et on vérifie qu'il devient "Présent" 
		fireEvent.press(getAllByTestId("Non défini")[0]);
		return waitFor(() => expect(getByTestId("Présent")).toBeTruthy());
	})
	.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(7);
		
		//On clique sur le bouton "Présent", on vérifie que le modal s'affiche
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	
	.then(() => {
		//On annule et on vérifie que le modal a disparu et que rien n'a changé
		fireEvent.press(getByText("Annuler"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
		.then(() => {
		expect(getAllByTestId("Non défini")).toHaveLength(7);
		expect(getByTestId("Présent")).toBeTruthy();
		expect(queryByTestId("Absent")).toBeNull();
		
		//On clique à nouveau sur le bouton présent et on attend le modal
		fireEvent.press(getByTestId("Présent"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	.then(() => {
		//On entre le message d'absence, on clique sur le bouton valider, et on vérifie que le modal disparait
		fireEvent.changeText(getByPlaceholderText("Raison de votre absence"),"Ceci est un test é/°ç");
		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
	.then(() => {
		//On vérifie que le bouton devient "Absent", et on ouvre le modal à nouveau
		expect(getByTestId("Absent")).toBeTruthy();
		expect(queryByTestId("Présent")).toBeNull();
		fireEvent.press(getByTestId("CommentaireAbsence"));
		return waitFor(() => expect(getByText("Commentaire d'Absence :")).toBeTruthy());
	})
	.then(() => {
		//On vérifie que le commentaire est le bon et on ferme le modal
		expect(getByDisplayValue("Ceci est un test é°ç")).toBeTruthy();
		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Commentaire d'Absence :")).toBeNull());
	})
	.then(() => {
		//On clique à nouveau sur le bouton et on vérifie qu'il retourne à l'état non défini
		fireEvent.press(getByTestId("Absent"));
		return waitFor(() => expect(getAllByTestId("Non défini")).toHaveLength(8));
	})
	.then(() => {	
		done();
	})
	.catch((error) => done(error))
	
  });*/
  
});