import React, {useRef } from 'react';
import { Button, Text, View, Image, TextInput, Pressable, ActivityIndicator} from 'react-native';

import {userContext} from '../../contexts/userContext';
import {sendAPI} from '../../components/sendAPI';

import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';

import constantes from '../../constantes';
import styles from '../../styles';
import logo from '../../../assets/logoRdC.png';




export default function IdScreen({navigation}) {

	// On récupère la fonction pour gérer le token de notification
	const registerForPushNotificationsAsync = React.useContext(userContext).registerForPushNotificationsAsync;

	const refMdp = useRef(null);

	const [textEmail, onChangeTextEmail] = React.useState('');
	const [textPassword, onChangeTextPassword] = React.useState('');

	const [loading, setLoading] = React.useState(false);
	
	const changeID = React.useContext(userContext).changeID;
	const changeToken = React.useContext(userContext).changeToken;
	
    //Handler des erreurs de serveur
    const handleError = React.useContext(userContext).handleError;
  
  function checkPassword() {
	if (textEmail != '' && textPassword != '') {
		setLoading(true);
		sendAPI('AUT', 'AP_LOGIN', {'email':textEmail, 'motDePasse':textPassword})	
		.then(async function (data){
			
			const device = await Device.getDeviceTypeAsync();
			const token = await registerForPushNotificationsAsync(device);
			
			//On n'envoie le token de notification que s'il est différent de celui stocké sur le serveur
			if (data.tokennotification != token && token != "-1"){
				sendAPI('APP', 'AP_UPD_NOTIF', {'P_IDBENEVOLE':data.id, 'P_TOKENNOTIF':token}, data.token)
				.catch((error) => {handleError(error); setLoading(false)});
			}
			login(data);
		})
		.catch((error) => {handleError(error); setLoading(false)})
		  
		onChangeTextPassword(''); //On vide le champ mot de passe
	}
  }
  
  
  function login(data) {
	  if (Device.brand){
		SecureStore.setItemAsync('id', data.id);
		SecureStore.setItemAsync('token', data.token);
	  }
	  changeToken(data.token);
	  changeID(data.id);
    }

  return (
    <>
    <View style={[styles.container,{alignItems: "center"}]}>
	  <Image
		style={styles.logo}
        source={logo}
      />
      <Text style={styles.idTexte}>Adresse mail</Text>
	  <TextInput
		style={styles.idInput}
		placeholder="votre@email.fr"
		onChangeText={onChangeTextEmail}
		keyboardType = "email-address"
		textContentType = "emailAddress"
		autoCompleteType = "email"
		autoCorrect = {false}
		onSubmitEditing={() => refMdp.current.focus()}
	  />
	  <Text style={styles.idTexte}>Mot de passe</Text>
	  <TextInput
	  	ref={refMdp}
		style={styles.idInput}
		placeholder="********"
		secureTextEntry = {true}
        onChangeText={onChangeTextPassword}
		value={textPassword}
		textContentType = "password"
		onSubmitEditing={() => checkPassword()}

	  />
	  <Button
		onPress = {() => checkPassword()} //{() => navigation.navigate('Engagements')}
		title="CONNEXION"
		color="#e7007d"
		accessibilityLabel="Bouton de connexion"
		testID="LoginButton"

	  />
	  <Pressable title = "mdp" onPress = {() => navigation.navigate("Oublie")} >
		<Text style={styles.idTexte}>Mot de passe oublié ?</Text>
	  </Pressable>
    </View>
	{loading &&
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#e92682" />
    </View>
	}
    </>
  );
}


