import React, { useEffect, useState } from 'react';


/*
*
* data = Row Data, Data originelles afin de retrouver l'ordre pour les jours
* visibleData = Data actuellement affichées, pour les inverser si necessaires
* setVisibleData = Setter des visibleData, afin d'afficher les modifications éffectuées
*
* setAncienMode = setter
* ancienMode = mode précédement cliqué et traité
* modeChoisi = mode cliqué à l'instant et en cours de traitement, vaut le nom du champs json
*
* header = json servant à affiché la flèche sur le bon header, utilise aussi la clé : "mode"
* setHeader = Setter du header
*
*/
export const modeAffichage = (data, visibleData, setVisibleData, setAncienMode, ancienMode, modeChoisi, header, setHeader) => {

    // On garde en mémoire 
    const cpyData = [...data];
    const cpyVisibleData = [...visibleData]; // cpy of array
    const cpyHeader = header;


    // On met à jour le header
    if( ancienMode === modeChoisi ){
        cpyHeader[modeChoisi] = "\u25BC";
    }
    else{
        Object.keys(header).forEach((h, index) => {
            cpyHeader[h] = "";
        })
        cpyHeader[modeChoisi] = "\u25B2";
    }
    setHeader( cpyHeader );
    

    // Si on clique 2 fois (modulo 2) quelque part
    if( ancienMode === modeChoisi ){
        // On inverse la liste visible actuelle
        setVisibleData( cpyVisibleData.reverse() )

        // On met l'index actif à null afin d'afficher le prochain élément dnas l'ordre normal, peu importe où l'on clique
        setAncienMode( null );
    }

    // Si on clique pour la 1ere fois (modulo 2) sur un header
    else{
        // Si s'est un jour, on laisse l'ordre de base
        if( modeChoisi === "jourdefaut" ){
            setVisibleData( cpyData );
        }
        // Sinon, on trie
        else{
            //cpyVisibleData.sort((a, b) => a.split(/\t/)[indexChoisi] > b.split(/\t/)[indexChoisi]);
            cpyVisibleData.sort( (a,b) => a[modeChoisi].localeCompare(b[modeChoisi]) );
            setVisibleData( cpyVisibleData );
        }

        setAncienMode( modeChoisi );
        
    }

}
