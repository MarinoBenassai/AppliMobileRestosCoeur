import React, { useEffect, useState } from 'react';
import { StyleSheet, Button, Text, View, Image, TextInput, Pressable, ActivityIndicator} from 'react-native';
import * as Crypto from 'expo-crypto';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

import constantes from '../../constantes';
import {userContext} from '../../contexts/userContext';
import styles from '../../styles';
import logo from '../../../assets/logoRdC.png'


export default function IdScreen({navigation}) {

	const [textEmail, onChangeTextEmail] = React.useState('');
	const [textPassword, onChangeTextPassword] = React.useState('');

	const [loading, setLoading] = React.useState(false);

	const [expoPushToken, setExpoPushToken] = useState('');
	
	const changeID = React.useContext(userContext).changeID;
	const changeToken = React.useContext(userContext).changeToken;
    const handleError = React.useContext(userContext).handleError;

	// On va chercher le token de notification
/* 	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
	}, []); */

  
  function checkPassword() {
	if (textEmail != '' && textPassword != '') {
		setLoading(true);
		fetch('http://' + constantes.BDD + '/Axoptim.php/AUT/AP_LOGIN/P_EMAIL=' + textEmail +"/P_MOTDEPASSE=" + textPassword)

			.then((response) => {
				if (response.ok) {
					const a = response.json();
					const b = registerForPushNotificationsAsync();

					return Promise.all([a, b])
				}
				else {
					const json = response.json();
					throw new Error(json['error']);
				}
			})
			
			
			.then(([data, token]) => {
				fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_UPD_NOTIF/P_IDBENEVOLE=' + data.id + '/P_TOKENNOTIF=' + token + "/P_TOKEN=" + data.token);
				login(data);
			})

			//.then((response) => response.text())
			//.then(texte => console.log(texte))
			.catch((error) => {handleError(error); setLoading(false)})
		  

		onChangeTextPassword(''); //On vide le champ mot de passe
	}
  }
  
  
  function login(data) {
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
	  />
	  <Text style={styles.idTexte}>Mot de passe</Text>
	  <TextInput
		style={styles.idInput}
		placeholder="********"
		secureTextEntry = {true}
        onChangeText={onChangeTextPassword}
		value={textPassword}
		textContentType = "password"

	  />
	  <Button
		onPress = {() => checkPassword()} //{() => navigation.navigate('Engagements')}
		title="CONNEXION"
		color="#e7007d"
		accessibilityLabel="Bouton de connexion"

	  />
	  <Pressable title = "mdp" onPress = {() => navigation.navigate("Oublie")} >
		<Text style={styles.idTexte}>Mot de passe oublié ?</Text>
	  </Pressable>
	  	
    <Button
	  onPress = {() => {changeID(constantes.IDDebug); changeToken(constantes.IDDebug)}}
	  title="PASSER"
	  color="#041584"
    />
    </View>
	{loading &&
    <View style={styles.loading}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
	}
    </>
  );
}


// Fonction de création/registration du token de notification
async function registerForPushNotificationsAsync() {
	let token;
	if (Constants.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		// Notification non autorisée
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			//return;
		}

		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);

	} else {
	  	alert('Must use physical device for Push Notifications');
	}
  
	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}
  
	return token;
}
