import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, TextInput, Button, StatusBar, Pressable, Alert} from 'react-native';

import constantes from '../../constantes';

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
	    alert("Un mail contenant votre nouveau mot de passe vient d'être envoyé à " + tempEmail);
		navigation.goBack();
	  }
	
	  else {
	    alert("Adresse email incorrecte");
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
	<View style={styles.container}>
<Text style={styles.texte}>Entrez votre addresse email ci-dessous. Un nouveau mot de passe vous sera envoyé.</Text>
	  <TextInput
		style={styles.input}
		placeholder="votre@email.fr"
		onChangeText={onChangeTextEmail}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    input: {
    height: 40,
	width : 200,
    margin: 12,
	borderBottomColor: '#000000',
	borderBottomWidth: 1,
  },
    logo: {
    width: 200,
    height: 200,
  },
    texte : {
    margin : 20,
	textAlign: 'center',
  },
    loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
	backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default oublieScreen;