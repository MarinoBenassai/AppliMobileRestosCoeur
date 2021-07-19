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
