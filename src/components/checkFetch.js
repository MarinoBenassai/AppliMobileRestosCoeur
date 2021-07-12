import React from 'react';
import {Alert} from 'react-native';

export const  checkFetch = function(response) {
    console.log("response : " + response + "\n" + response.ok + "\n" + response.status);

    if(response.ok){
        return response.text();
    }
    else{
        alert("Il y a eu un problème lors de la connexion à la page. Veuillez rééssayer.");
        console.log("Erreur Fetch : " + response.text());
        return "-1";
    }
}