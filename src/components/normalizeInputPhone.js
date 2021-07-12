

// Phone only
export const normalizeInputPhone = (value) => {
    // retourne rien si rien
    if (!value) return value; 
  
    // nombre et +
    //const currentValue = value.replace(/[^\d+]|(?<=[\d+])\+/g, ''); //Ne fonctionne pas sur portable
    const currentValue = value.slice(0,1).replace(/[^\d+]/g, '') + value.slice(1).replace(/[^\d]/g, '');
    
    var newValue = "";
    for(let i = 0; i<currentValue.length; i++){
      // on gère le +33
      if( currentValue[0] == "+" ){
        if( i == 3 ){
          newValue += " "
        }
      }
      // on met un espace tous les 2 nombres
      if( (i != 0) && (i%2 == 0) && (( currentValue[0] != "+" ) || ( i>=3 )) ){
        newValue += " "
      }
  
      // on écrit le nombre
      newValue += currentValue[i];
    }
  
    return newValue;
    
  };
  