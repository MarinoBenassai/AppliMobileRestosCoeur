import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, TextInput, Button, StatusBar, Pressable, Alert} from 'react-native';

import constantes from '../../constantes';
import styles from '../../styles';
import * as Crypto from 'expo-crypto';
import * as Random from 'expo-random';


function oublieScreen({navigation}){
  const [textEmail, onChangeTextEmail] = React.useState('');
  const [tempEmail, setTempEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState('');
  
  function resetPassword() {
	if (textEmail != '') {
		setLoading(true);
		setTempEmail(textEmail);
		fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_ACCES_BEN/P_EMAIL=' + textEmail) //A changer
		  .then((response) => response.text())
		  .then((texte) =>  {setData(texte);setLoading(false);})
		  .catch((error) => {
			(setData(-1));
			setLoading(false);
		  });
	}
  }
  
  useEffect(() => {
	if (data != "" && tempEmail != "") {
	  const ID = getIDFromData(data);
	  if (ID != null) {
		const nouveauMDP = "rdc-" + getRandomWord(5);
		Crypto.digestStringAsync(
			Crypto.CryptoDigestAlgorithm.SHA256,
			nouveauMDP
		  )
		.then((hash1) => fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_UPD_MOTDEPASSE/P_IDBENEVOLE=' + ID + '/P_MOTDEPASSE=' + hash1))
		.then((rep) => rep.text())
		.then(texte => {if (texte != "1\n") {throw new Error("Erreur lors de la miseà jour de la base de données");}})
		.catch();
	    alert("Un mail contenant votre nouveau mot de passe vient d'être envoyé à " + tempEmail +". Votre nouveau mot de passe est " + nouveauMDP +".");
		navigation.goBack();
	  }
	
	  else {
	    alert("Adresse email incorrecte.");
	  }
	  setData("");
	  setTempEmail("");
	}
	
  }, [data]);
  
  function getIDFromData(data) {
	const lignes = data.split(/\n/);
	var i;
	var ID = null;
	for (i = 1; i<lignes.length; i++){
		if (lignes[i] != ""){
			const valeurs = lignes[i].split(/\t/);
			ID = valeurs[3];
		}
	}
	return ID;
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
		color="#841584"
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

function getRandomWord(nbChar){
	var bytes = [];
	while (bytes.length < nbChar){
		const byt = Random.getRandomBytes(1)[0];
		if ((byt > 47 && byt < 58) || (byt > 64 && byt < 91) || (byt > 96 && byt < 123)){
			bytes.push(byt);
		}
	}		
	const word = bytes.map((elem) => String.fromCharCode(elem));
	return word.join("");
	
}


export default oublieScreen;