import React from 'react';
import {Alert} from 'react-native';

export const  checkFetch = async function(response) {
    console.log("response : " + response + "\n" + response.ok + "\n" + response.status);
	const texte = await response.text();
	
    if(response.ok){
        return texte;
    }
    else{
		throw texte;
        /*alert("Il y a eu un problème lors de la connexion à la page. Veuillez rééssayer.");
        console.log("Erreur Fetch : " + response.text());
        return "-1";*/
    }
}