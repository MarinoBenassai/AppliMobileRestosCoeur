import React, { useEffect, useState } from 'react';


/*
*
* data = Row Data, Data originelles afin de retrouver l'ordre pour les jours
* visibleData = Data actuellement affichées, pour les inverser si necessaires
* setVisibleData = Setter des visibleData, afin d'afficher les modifications éffectuées
*
* setIndexActif = Setter de l'index cliqué en mémoire (donc pseudo-précédement)
* indexActif = Index du split effectué le plus recement jusqu'à mise à jour, afin de savoir si on a cliqué au même endroit
* indexChoisi = Index de split sur lequel on vient de cliquer (d'appeler la fct)
*
* mode = Sert à détecter les cas particulier, où l'ordre de triage n'est pas trivial : NOM, JOUR, AUTRE
*
* indexAncienHeader = Index Visuel du dernier endroit sur lequel on a cliqué, permet de mettre à jour le header
* setIndexHeader = Setter de l'index actuel et visuel du header cliqué
* indexHeader = Index actuel et visuel du header cliqué, permet de mettre à jour le header
*
* header = Array contenant le header actuel, pour faire les changement directement dessus
* setHeader = Setter du header
*
*/
export const modeAffichage = (data, visibleData, setVisibleData, setAncienMode, ancienMode, modeChoisi, indexAncienHeader, setIndexAncienHeader, indexHeader, header, setHeader) => {

    // On garde en mémoire 
    const cpyData = [...data];
    const cpyVisibleData = [...visibleData]; // cpy of array
    const cpyHeader = [...header];


    // On met à jour le header
    if( ancienMode === modeChoisi ){
        cpyHeader[indexHeader] = "\u25BC";
    }
    else{
        cpyHeader[indexAncienHeader] = "";
        cpyHeader[indexHeader] = "\u25B2";
    }
    setHeader( cpyHeader );
    setIndexAncienHeader( indexHeader );


    // On met à jour la vue
    // Si on clique sur le nom
    if( modeChoisi === "nom"){
        // Si on re-clique sur le nom
        if( ancienMode === modeChoisi ){
            // TODO : sysytème complet full rotation (non juste 3 puis null)
        }
        else{
            // Première fois
            setVisibleData( cpyData );

            setAncienMode( modeChoisi );
        }
    }
    // Si on re-clique autrepart que le nom
    else if( ancienMode === modeChoisi ){
        // On inverse la liste visible actuelle
        setVisibleData( cpyVisibleData.reverse() )

        // On met l'index actif à null afin d'afficher le prochain élément dnas l'ordre normal, peu importe où l'on clique
        setAncienMode( null );
    }

    // Si on clique pour la 1ere fois (modulo 2) autre part que le nom
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
