import React from 'react';
import {Alert} from 'react-native';

export const  checkFetch = async function(response) {
    // console.info("response : " + response + "\n" + response.ok + "\n" + response.status);

    const type = response.headers.get('Content-Type');

    if( type == "application/json" ){
        const json = await response.json();
        
        if(response.ok){
            
            return Object.values(json.data);
        }
        else{
            throw json.error;
            /*alert("Il y a eu un problème lors de la connexion à la page. Veuillez rééssayer.");
            console.error("Erreur Fetch : " + response.text());
            return "-1";*/
        }
        
    }

    var texte = await response.text();
    throw texte;
	
}