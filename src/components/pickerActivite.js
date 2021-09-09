// on met à jour la liste visible
/*export const traitementSort = function(affichage, data, visibleData) {

    // const ligneInit = ligne; 
    const cpyVisibleData = [...visibleData];

    if( affichage === "ACTIVITE" ){
        //cpyVisibleData.sort((a, b) => a.split(/\t/)[activite] > b.split(/\t/)[activite]);
        cpyVisibleData.sort( (a,b) => a.nomactivite.localeCompare(b.nomactivite) );
        return( cpyVisibleData );
    }
    else if( affichage === "SITE" ){
        //cpyVisibleData.sort((a, b) => a.split(/\t/)[site] > b.split(/\t/)[site]);
        cpyVisibleData.sort( (a,b) => a.nomsite.localeCompare(b.nomsite) );
        return( cpyVisibleData );
    }
    else if( affichage === "JOUR" || affichage === "DATE" ){
        return( data.filter( (l) => ( cpyVisibleData.indexOf(l) >= 0 ) ) );
    }
    else if( affichage === "NOM" ){
        //cpyVisibleData.sort((a, b) => a.split(/\t/)[nom] > b.split(/\t/)[nom]);
        cpyVisibleData.sort( (a,b) => a.nom.localeCompare(b.nom) );
        return( cpyVisibleData );
    }
    else if( affichage === "PRENOM" ){
        //cpyVisibleData.sort((a, b) => a.split(/\t/)[prenom] > b.split(/\t/)[prenom]);
        cpyVisibleData.sort( (a,b) => a.prenom.localeCompare(b.prenom) );
        return( cpyVisibleData );
    }
    else if( affichage === "PARTICIPANT" ){
        //cpyVisibleData.sort((a, b) => a.split(/\t/)[participant] > b.split(/\t/)[participant]);
        cpyVisibleData.sort( (a,b) => a.nombre_present.localeCompare(b.nombre_present) );
        return( cpyVisibleData );
    }
    else{
      // TODO : erreur
    }

}*/

export const traitementFilter = function(affichage, visibleData) {

    if(affichage == "TOUT"){
        return( visibleData );
      }
      else if(affichage == "PRESENT") {
        return( visibleData.filter( (l) => ( l.etat == "Présent" ) ) );
      }
      else if(affichage == "ABSENT") {
        return( visibleData.filter( (l) => ( l.etat == "Absent" ) ) );
      }
      else if (affichage == "NONDEFINI") {
        return( visibleData.filter( (l) => ( l.etat == "Non défini" ) ) );
      }
      else{
        //console.error("ERREUR : Affichage inconnu dans useEffect");
      }

}
