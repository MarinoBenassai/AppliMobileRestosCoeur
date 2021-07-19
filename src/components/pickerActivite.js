import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Pressable} from 'react-native';


// on met à jour la liste visible
export const traitementSort = function(affichage, data, visibleData, activite, site, nom, prenom, participant) {
    // On traite les données
    const ligne = data.split(/\n/);
    ligne.shift(); //enlève le premier élement (et le retourne)
    ligne.pop();   //enlève le dernier élement (et le retourne)

    const ligneInit = ligne;
    const cpyVisibleData = [...visibleData];

    if( affichage === "ACTIVITE" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[activite] > b.split(/\t/)[activite]);
        return( cpyVisibleData );
    }
    else if( affichage === "SITE" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[site] > b.split(/\t/)[site]);
        return( cpyVisibleData );
    }
    else if( affichage === "JOUR" || affichage === "DATE" ){
        return( ligneInit.filter( (l) => ( cpyVisibleData.indexOf(l) >= 0 ) ) );
    }
    else if( affichage === "NOM" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[nom] > b.split(/\t/)[nom]);
        return( cpyVisibleData );
    }
    else if( affichage === "PRENOM" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[prenom] > b.split(/\t/)[prenom]);
        return( cpyVisibleData );
    }
    else if( affichage === "PARTICIPANT" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[participant] > b.split(/\t/)[participant]);
        return( cpyVisibleData );
    }
    else{
      console.log("ERREUR : Affichage inconnu dans Picker");
    }

}

export const traitementFilter = function(affichage, visibleData, index) {

    if(affichage == "TOUT"){
        return( visibleData );
      }
      else if(affichage == "PRESENT") {
        return( visibleData.filter( (l) => ( l.split("\t")[index] == "Présent" ) ) );
      }
      else if(affichage == "ABSENT") {
        return( visibleData.filter( (l) => ( l.split("\t")[index] == "Absent" ) ) );
      }
      else if (affichage == "NONDEFINI") {
        return( visibleData.filter( (l) => ( l.split("\t")[index] == "Non défini" ) ) );
      }
      else{
        console.log("ERREUR : Affichage inconnu dans useEffect");
      }

}
