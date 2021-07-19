import React, { useEffect, useState } from 'react';


// on met à jour la liste visible //mode : NOM, JOUR, AUTRE
// ARGUMENT : RowData, visibleData, setterVisibleData, setterIndexDuSplit, indexDuSplit, indexDuSplitChoisi, mode, setterIndexViseulDuHeader, indexVisuelHeader, headerArray, setterHeaderArray
export const modeAffichage = (data, visibleData, setVisibleData, setIndexActif, indexActif, indexChoisi, mode, indexAncienHeader, setIndexHeader, indexHeader, header, setHeader) => {
    // On traite les données
    const ligne = data.split(/\n/);
    ligne.shift(); //enlève le premier élement (et le retourne)
    ligne.pop();   //enlève le dernier élement (et le retourne)

    // On garde en mémoire 
    const ligneInit = ligne;
    const cpyVisibleData = [...visibleData]; // cpy of array


    // On met à jour le header
    const cpyHeader = [...header];
    if( indexActif === indexChoisi ){
        cpyHeader[indexHeader] = "\u25BC";
    }
    else{
        cpyHeader[indexAncienHeader] = "";
        cpyHeader[indexHeader] = "\u25B2";
    }
    setHeader( cpyHeader );
    setIndexHeader( indexHeader );


    // On met à jour la vue
    // Si on clique sur le nom
    if( mode === "NOM"){
        // Si on re-clique sur le nom
        if( indexActif === indexChoisi ){
            // TODO : sysytème complet full rotation (non juste 3 puis null)
        }
        else{
            // Première fois
            setVisibleData( ligneInit );

            setIndexActif( indexChoisi );
        }
    }
    // Si on re-clique autrepart que le nom
    else if( indexActif === indexChoisi ){
        // On inverse la liste visible actuelle
        setVisibleData( cpyVisibleData.reverse() )

        // On met l'index actif à null afin d'afficher le prochain élément dnas le bon ordre, quoi qu'il arrive
        setIndexActif( null );
    }

    // Si on clique pour la 1ere fois (modulo 2) autre part que le nom
    else{
        // Si s'est un jour, on laisse l'ordre de base
        if( mode === "JOUR" ){
            setVisibleData( ligneInit );
        }
        // Sinon, on trie
        else{
            cpyVisibleData.sort((a, b) => a.split(/\t/)[indexChoisi] > b.split(/\t/)[indexChoisi]);
            setVisibleData( cpyVisibleData );
        }

        setIndexActif( indexChoisi );
        
    }

}
