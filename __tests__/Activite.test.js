import React from 'react';
import { cleanup, render, fireEvent, waitFor, waitForElementToBeRemoved } from "@testing-library/react-native";

import Activite, {normalizeInputNumber} from '../src/screens/Activite';
import {userContext} from '../src/contexts/userContext'
import {Linking, Platform} from 'react-native';
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
	expect(queryByTestId("messageAll")).toBeNull();
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
	expect(getByTestId("messageAll")).toBeTruthy();
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
  
  
});
  
describe('Activite - Boutons des référents', () => {
	  
  it('Should allow referents to change the inforations of the activity', (done) => {
	
	
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
		token: 0,
	    handleError: jest.fn((error) => {console.log("################################################",error)}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId, queryByText, getByPlaceholderText, getByDisplayValue} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);
	
	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {

		//On clique sur le bouton pour modifier les infos de l'activite et on attend l'apparition du modal 
		fireEvent.press(getByTestId("infoActivite"));
		return waitFor(() => expect(getByText("Nombre de Bénéficiaire :")).toBeTruthy());
	})
	.then(() => {
		//On remplit le modal, on valide et on attend qu'il disparaisse
		expect(getByText("Commentaire d'activité :"));
		fireEvent.changeText(getByDisplayValue("0"), "42");
		fireEvent.changeText(getByDisplayValue(""),'Ceci est un test **//è&)');
		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Nombre de Bénéficiaire :")).toBeNull());
	})
	.then(() => {

		//On clique sur le bouton pour modifier les infos de l'activite et on attend l'apparition du modal 
		fireEvent.press(getByTestId("infoActivite"));
		return waitFor(() => expect(getByText("Nombre de Bénéficiaire :")).toBeTruthy());
	})
	
	.then(() => {
		//On remplit le modal, on valide et on attend qu'il disparaisse
		expect(getByText("Commentaire d'activité :"));
		fireEvent.changeText(getByDisplayValue("42"), "ABC42(-è");
		fireEvent.changeText(getByDisplayValue("Ceci est un test **//è&)"),'Ceci est un autre test ..~~µµ');
		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Nombre de Bénéficiaire :")).toBeNull());
	})
	
	.then(() => {

		//On clique sur le bouton pour modifier les infos de l'activite et on attend l'apparition du modal 
		fireEvent.press(getByTestId("infoActivite"));
		return waitFor(() => expect(getByText("Nombre de Bénéficiaire :")).toBeTruthy());
	})
	
	.then(() => {
		//On remplit le modal, on valide et on attend qu'il disparaisse
		expect(getByText("Commentaire d'activité :"));
		expect(getByDisplayValue("42")).toBeTruthy();
		expect(getByDisplayValue('Ceci est un autre test ..~~µµ')).toBeTruthy();
		fireEvent.press(getByText("Valider"));
		return waitFor(() => expect(queryByText("Nombre de Bénéficiaire :")).toBeNull());
	})
	.then(() => {
		done();
	})
	.catch((error) => done(error));

  });
  
  
  it('Should allow referents to send a SMS to everybody', (done) => {
	
	
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
		token: 0,
	    handleError: jest.fn((error) => {console.log("################################################",error)}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId, queryByText, getByPlaceholderText, getByDisplayValue} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);
	
	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {

		//On clique sur le bouton pour envoyer un message à tous et on attend l'apparition du modal 
		fireEvent.press(getByTestId("messageAll"));
		return waitFor(() => expect(getByText("Contacter tout le monde :")).toBeTruthy());
	})
	.then(() => {
		//On ferme le modal
		fireEvent.press(getByText("ANNULER"));
		return waitFor(() => expect(queryByText("Contacter tout le monde :")).toBeNull());
	})
	.then(() => {

		//On ouvre à nouveau le modal
		fireEvent.press(getByTestId("messageAll"));
		return waitFor(() => expect(getByText("Contacter tout le monde :")).toBeTruthy());
	})
	
	.then(() => {
		//On choisis sms et on vérifie qu'on est bien redirigé vers l'envoi de SMS
        fireEvent.press(getByText("SMS"));
	    return	waitFor(() => expect(Linking.openURL).toBeCalledTimes(1));
    })
	.then(() => {
		
		var phones = "0000000000,0000000000,0000000000,0000000000,0000000000,0000000000,0000000000,0000000000,0000000000,0000000000,0000000000,0000000000,0000000000";
		const url = (Platform.OS === 'android')
		? `sms:${phones}?body=`
		: `sms:/open?addresses=${phones}&body=`;
		
		expect(Linking.openURL).toHaveBeenCalledWith(url)
		done();
	})
	.catch((error) => done(error));

  });


  it('Should allow referents to send an email to everybody', (done) => {
	
	
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
	const route = {params : {
	  "IDActivite": "4",
	  "IDSite": "1",
	  "IDJour": "2021-09-06",
	  "NomActivite": "Traçabilité",
	  "NomSite": "Lalande",
	  "idRole": "2"
    }}
	
    const fctModalMail = jest.fn();
	
    const context = {
		userID:	1005,
		token: 0,
	    handleError: jest.fn((error) => {console.log("################################################",error)}),
		fctModalMail : fctModalMail,
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId, queryByText, getByPlaceholderText, getByDisplayValue} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);
	
	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {

		//On clique sur le bouton pour envoyer un message à tous et on attend l'apparition du modal 
		fireEvent.press(getByTestId("messageAll"));
		return waitFor(() => expect(getByText("Contacter tout le monde :")).toBeTruthy());
	})
	
	.then(() => {
		//On choisis mail et on vérifie qu'on ouvre bien le modal de mail
        fireEvent.press(getByText("MAIL"));
	    return	waitFor(() => expect(fctModalMail).toBeCalledTimes(1));
    })
	.then(() => {
		
		const idListe = ["485", "1592", "337", "493", "1500", "1582", "471", "473", "499", "476", "1572", "492"];
		
		expect(fctModalMail).toHaveBeenCalledWith(idListe);
		done();
	})
	.catch((error) => done(error));

  });
  
  
  it('Should allow referents to filter by status', (done) => {
	
	const navigation = {addListener : (arg1,arg2) => {arg2()}};
	
	const route = {params : {
	  "IDActivite": "4",
	  "IDSite": "1",
	  "IDJour": "2021-09-06",
	  "NomActivite": "Traçabilité",
	  "NomSite": "Lalande",
	  "idRole": "2"
    }}
	
    const fctModalMail = jest.fn();
	
    const context = {
		userID:	1005,
		token: 0,
	    handleError: jest.fn((error) => {console.log("################################################",error)}),
		fctModalMail : fctModalMail,
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId, queryByText, getByPlaceholderText, getByDisplayValue, queryAllByTestId} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);
	
	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {

		//Seul les dix premiers éléments sont chargés.
		expect(getAllByTestId("Présent")).toHaveLength(3);
		expect(getAllByTestId("Absent")).toHaveLength(3);
		expect(getAllByTestId("Non défini")).toHaveLength(4);
		
		//On appuie une première fois sur le bouton => Affichage des présents seulement
		fireEvent.press(getByTestId("changeAffichage"));
		return	waitFor(() => expect(queryAllByTestId("Absent")).toHaveLength(0));
	})
	
	.then(() => {
		//On vérifie que seul les présents sont affichés
		expect(queryAllByTestId("Présent")).toHaveLength(3);
		expect(queryAllByTestId("Non défini")).toHaveLength(0);
		
		//On appuie une deuxième fois sur le bouton => Affichage des absents seulement
		fireEvent.press(getByTestId("changeAffichage"));
		return	waitFor(() => expect(queryAllByTestId("Présent")).toHaveLength(0));
    })
	
	.then(() => {
		//On vérifie que seul les Non définis sont affichés
		expect(queryAllByTestId("Non défini")).toHaveLength(0);
		expect(queryAllByTestId("Absent")).toHaveLength(6);
		
		//On appuie une quatrième fois sur le bouton => Affichage de la liste de départ
		fireEvent.press(getByTestId("changeAffichage"));
		return	waitFor(() => expect(queryAllByTestId("Absent")).toHaveLength(0));
    })
	
	.then(() => {
		//On vérifie que seul les Non définis sont affichés
		expect(queryAllByTestId("Absent")).toHaveLength(0);
		expect(queryAllByTestId("Non défini")).toHaveLength(4);
		
		//On appuie une quatrième fois sur le bouton => Affichage de la liste de départ
		fireEvent.press(getByTestId("changeAffichage"));
		return	waitFor(() => expect(queryAllByTestId("Absent")).toHaveLength(3));
    })
	
	.then(() => {
		
		// On vérifie qu'on est de retour à l'état initial 
		expect(getAllByTestId("Présent")).toHaveLength(3);
		expect(getAllByTestId("Absent")).toHaveLength(3);
		expect(getAllByTestId("Non défini")).toHaveLength(4);
		done();
	})
	.catch((error) => done(error));

  });
  
  it('Should allow referents to add someone to the activity', (done) => {
	
	
	const navigation = {addListener : (arg1,arg2) => {arg2()}, navigate : jest.fn(() =>{})};
	
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
		token: 0,
	    handleError: jest.fn((error) => {console.log("################################################",error)}),
    }

    const {getAllByText, getAllByTestId, queryByTestId, getByText, getByTestId, queryByText, getByPlaceholderText, getByDisplayValue} = render(
	  <userContext.Provider value = {context}>
		  <Activite navigation={navigation} route = {route}/>
	  </userContext.Provider>
	);
	
	waitFor(() => expect(getAllByTestId("Non défini")).toBeTruthy())
	.then(() => {

		//On clique sur le bouton pour ajouter un bénévole à l'activité. 
		fireEvent.press(getByTestId("ajoutBenevole"));
		return waitFor(() => expect(navigation.navigate).toHaveBeenCalledTimes(1));
	})
	
	.then(() => {

		done();
	})
	.catch((error) => done(error));

  });
  
});
  
describe('Activite - Fonction normalizeInputNumber', () => {
	  
  it('Should return 0 if empty', () => {
	
	expect(normalizeInputNumber("","0")).toEqual("0");
	expect(normalizeInputNumber("","123")).toEqual("0");

  });
  
  it('Should return 0 if no number', () => {
	
	expect(normalizeInputNumber("&azer'(-%^^","0")).toEqual("0");
	expect(normalizeInputNumber("&azer'(-%^^","123")).toEqual("0");

  });
  
  it('Should return the number without 0 at start', () => {
	
	expect(normalizeInputNumber("0045600","0")).toEqual("45600");
	expect(normalizeInputNumber("080760","123")).toEqual("80760");
	expect(normalizeInputNumber("&azer'(-0%1^020^30","0")).toEqual("102030");
	expect(normalizeInputNumber("&azer'(0-0%1^020^30//0","654")).toEqual("1020300");

  });
  
});