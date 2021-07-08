import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, TextInput, Button, StatusBar, Pressable, Alert} from 'react-native';

import constantes from '../../constantes';
import styles from '../../styles';
import {userContext} from '../../contexts/userContext';



function oublieScreen({navigation}){
  const [textEmail, onChangeTextEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState('');
  
  const handleError = React.useContext(userContext).handleError;
  
  function resetPassword() {
	if (textEmail != '') {
		setLoading(true);
		let body = new FormData();
		body.append('email',textEmail);
		fetch('http://' + constantes.BDD + '/Axoptim.php/AUT/AP_RST_MOTDEPASSE', {
		method: 'POST',
		body: body})	
		  .then((response) => {
			if (response.ok) {
				return response.json();
			}
			else {
				const json = response.json();
				throw new Error(json['error']);
			}
		  })
		  .then((json) => {
			  alert("Si cette adresse est associée à un compte, un mail contenant votre nouveau mot de passe vient de vous être envoyé. Votre nouveau mot de passe est " + json["mdp"] +".");
		      navigation.goBack();
		  })
		  .catch((error) => handleError)
		  .finally(() => setLoading(false));
		  
	    onChangeTextEmail(""); //On vide le champ email
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
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
	}
    </>
  );

}

export default oublieScreen;