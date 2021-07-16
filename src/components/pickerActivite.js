import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Pressable} from 'react-native';


// on met à jour la liste visible
export const  traitement = async function(affichage, data, visibleData, setVisibleData, activite, site, nom, prenom, participant) {
    // On traite les données
    const ligne = data.split(/\n/);
    ligne.shift(); //enlève le premier élement (et le retourne)
    ligne.pop();   //enlève le dernier élement (et le retourne)

    const ligneInit = ligne;
    const cpyVisibleData = [...visibleData];

    if( affichage === "ACTIVITE" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[activite] > b.split(/\t/)[activite]);
        setVisibleData( cpyVisibleData );
    }
    else if( affichage === "SITE" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[site] > b.split(/\t/)[site]);
        setVisibleData( cpyVisibleData );
    }
    else if( affichage === "JOUR" ){
        setVisibleData( ligneInit );
    }
    else if( affichage === "DATE" ){
        setVisibleData( ligneInit );
    }
    else if( affichage === "NOM" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[nom] > b.split(/\t/)[nom]);
        setVisibleData( cpyVisibleData );
    }
    else if( affichage === "PRENOM" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[prenom] > b.split(/\t/)[prenom]);
        setVisibleData( cpyVisibleData );
    }
    else if( affichage === "PARTICIPANT" ){
        cpyVisibleData.sort((a, b) => a.split(/\t/)[participant] > b.split(/\t/)[participant]);
        setVisibleData( cpyVisibleData );
    }
    else{
      console.log("ERREUR : Affichage inconnu dans Picker");
    }

  }
