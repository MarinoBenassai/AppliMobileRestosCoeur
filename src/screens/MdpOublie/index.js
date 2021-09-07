import React from 'react';
import { ActivityIndicator, Text, View} from 'react-native';
import {TextInput, Button} from 'react-native';

import styles from '../../styles';
import {userContext} from '../../contexts/userContext';
import {sendAPI} from '../../components/sendAPI';


function oublieScreen({navigation}){
  const [textEmail, onChangeTextEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const handleError = React.useContext(userContext).handleError;

  // On récupère la fonction pour gérer le modal d'informations
  const fctModalApp = React.useContext(userContext).fctModalApp;
  
  function resetPassword() {
	
	// Regex
    var regexMail = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_‘{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    
	if( !regexMail.test(textEmail) ){
		fctModalApp("Attention", "Email non valide");
	}
	else{

		if (textEmail != '') {
			setLoading(true);
			sendAPI('AUT', 'AP_RST_MOTDEPASSE',{'email':textEmail})
			.then((json) => {
				fctModalApp("succès", "Si cette adresse est associée à un compte, un mail contenant un lien pour réinitialiser votre mot de passe vient de vous être envoyé. Si vous n'avez rien reçu, vérifiez votre dossier de spam et réessayez dans quelques minutes.");
				setLoading(false);
				navigation.goBack();
			})
			.catch((error) => {setLoading(false); handleError (error)});
			
			onChangeTextEmail(""); //On vide le champ email
		}
	}
  }
  
  return (
    <>
	<View style={[styles.container,{alignItems: "center"}]}>
      <Text style={styles.idTexte}>Entrez votre addresse email ci-dessous. Un nouveau mot de passe vous sera envoyé.</Text>
	  <TextInput
		style={styles.idInput}
		placeholder="votre@email.fr"
		onChangeText={onChangeTextEmail}
		keyboardType = "email-address"
		textContentType = "emailAddress"
		autoCompleteType = "email"
		autoCorrect = {false}
		onSubmitEditing={() => resetPassword()}
	  />
	  <Button
		onPress = {() => resetPassword()}
		title="ENVOYER"
		color="#e7007d"
		accessibilityLabel="Envoyer email"
	  />	  	
    </View>
	{loading &&
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#e92682" />
    </View>
	}
    </>
  );

}

export default oublieScreen;