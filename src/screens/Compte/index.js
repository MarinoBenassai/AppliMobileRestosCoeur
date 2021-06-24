import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Button} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, TextInput, Alert} from 'react-native';
import * as Crypto from 'expo-crypto';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';

// Fonction Principale
const compteScreen = () => {
  const [isLoading, setLoading] = useState(true);

  // Info perso et Info Engagement
  const [dataEngagementDefaut, setDataEngagementDefaut] = useState('');
  const [dataPerso, setDataPerso] = useState('');

  // Champs remplissable
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [verifP, setVerifP] = useState('');
  const [persoUpToDate, setPersoUpToDate] = useState(false);
  
  // O récupère l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // On récupère les informations d'engagement par défaut
  useEffect(() => {
    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_ENG_BEN/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setDataEngagementDefaut(texte); console.log("Infos Engagement Défaut : chargées")})
      .catch((error) => {
        (setData(-1));
      });
  }, []);

  // On récupère les informations personelles
  useEffect(() => {
	if (persoUpToDate === false) {
	setPersoUpToDate(true);
	console.log("fait");
    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_MON_COMPTE/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setDataPerso(texte); console.log("Infos Perosnelles : chargées")})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));;
	}
  }, [persoUpToDate]);

  // On traite ces informations
  const ligneEngagementDefaut = dataEngagementDefaut.split(/\n/);
  ligneEngagementDefaut.shift(); //enlève le premier élement (et le retourne)
  ligneEngagementDefaut.pop();   //enlève le dernier élement (et le retourne)

  const lignePerso = dataPerso.split(/\n/);

  // On crée le renderer pour la liste
  const renderItem = ({ item }) => (
    <View style={[styles.item, styles[item.split(/\t/)[3]] ]}>
      <View>
        <Text>{item.split(/\t/)[0]}</Text>
      </View>
      <View>
        <Text>{item.split(/\t/)[1]}</Text>
      </View>
      <View>
        <Text>{item.split(/\t/)[2]}</Text>
      </View>
    </View>
  );

  // On retourne la flatliste
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
         <ActivityIndicator size="large" color="#00ff00" />
	      </View>) : (
        //View Principal, post chargement
        <View>

          {/* La vue des infos profil (au dessus des activités) se trouve dans le header de la flatlist */}

          {/* View des Activités */}
          <View>
            <FlatList
              data={ligneEngagementDefaut}
              ListHeaderComponent={
                <>
                  {/* View du Profil (info, contact, MdP) */}
                  <View>
                    {/* View des information de profil */}
                    <View>
                      <Text style={styles.title}>Profil de :</Text>
                      <Text style={styles.data}>Nom : {lignePerso[1].split("\t")[0]}</Text>
                      <Text style={styles.data}>Prenom : {lignePerso[1].split("\t")[1]}</Text>
                      <View style={styles.ligne}/>
                    </View>

                    {/* View des informations de contact */}
                    <View>
                      <Text style={styles.title}>Modification des coordonnées :</Text>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Téléphone : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder={lignePerso[1].split("\t")[3]}
                          autoCorrect={false}
                          textContentType='telephoneNumber'
                          keyboardType='phone-pad'
                          onChangeText={text => setPhone(text)}
						  value = {phone}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Email : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder={lignePerso[1].split("\t")[2]}
                          autoCorrect={false}
                          textContentType='emailAddress'
                          keyboardType='email-address'
                          onChangeText={text => setMail(text)}
						  value = {mail}
                        />
                      </View>
                      <Button
                        onPress={() => changeContact(phone, mail)}
                        title="Valider Coordonnées"
                        color="#841584"
                        accessibilityLabel="Valider vos nouvelles informations de contact"
                      />
                      <View style={styles.ligne}/>
                    </View>

                    {/* View des MdP */}
                    <View>
                      <Text style={styles.title}>Modification du mot de passe :</Text>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Ancien mot de passe : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='password'
                          onChangeText={text => setOldP(text)}
						  value = {oldP}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Nouveau mot de passe : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='newPassword'
                          onChangeText={text => setNewP(text)}
						  value = {newP}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Confirmation mot de passe : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='newPassword'
                          onChangeText={text => setVerifP(text)}
						  value = {verifP}
                        />
                      </View>
                      <Button
                        onPress={() => {changeMdP(oldP, newP, verifP);}}
                        title="Valider Mot de Passe"
                        color="#841584"
                        accessibilityLabel="Valider votre nouveau mot de passe"
                      />
                      <View style={styles.ligne}/>
                    </View>
                    <Text style={styles.title}>Mes Activités</Text>
                  </View>
                </>
              }
              renderItem={renderItem}
              keyExtractor={item => item}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );


	// Fonction de changement de mot de passe
	function changeMdP (oldP, newP, verifP){
	  // Champs vide
	  if(oldP == "" || newP == "" || verifP == ""){
		alert(
		  "Champs vide",
		  "\nAu moins un des champs est vide",
		  [
			{ text: "OK", onPress: () => console.log("Vide MdP Pressed") }
		  ]
		);
	  }
	  // vérif failled
	  else if(newP != verifP){
		alert(
		  "Erreur Nouveau Mot de Passe",
		  "\nLes champs correspondant au nouveau mot de passe ne sont pas identiques",
		  [
			{ text: "OK", onPress: () => console.log("verif failled MdP Pressed") }
		  ]
		);
	  }
	  // Condition (court)
	  else if(newP.length < 8){
		alert(
		  "Mot de passe trop court",
		  "\nVotre mot de passe doit contenir au moins 8 caractères",
		  [
			{ text: "OK", onPress: () => console.log("test MdP Pressed") }
		  ]
		);
	  }
	  // tout est bon
	  else {
		setLoading(true);
		fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_MON_COMPTE/P_IDBENEVOLE=' + userID)
		.then((response) => response.text())
		.then((texte) => {const emailAdd = getEmailFromData(texte); return fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_ACCES_BEN/P_EMAIL=' + emailAdd)})
		.then((response) => response.text())
		.then((texte) =>  {const hash = getPasswordFromData(texte); return compareToHash(oldP,hash);})
		.then((correct) => {
			// ancien mot de passe faux
			if(!correct){
				alert(
				"L'ancien mot de passe est incorrect.",
				"",
				[
				  { text: "OK", onPress: () => console.log("Error MdP Pressed") }
				]
			  );
			}

			else{
				setLoading(true);
				Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,newP)
				.then((hash) => fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_UPD_MOTDEPASSE/P_IDBENEVOLE=' + userID + '/P_MOTDEPASSE=' + hash))
				.then((rep) => rep.text())
				.then(texte => {if (texte != "1\n") {throw new Error("Erreur lors de la mise à jour de la base de données");}})
				.catch((error) => console.error(error));
			  alert(
				"Votre mot de passe a bien été modifié.",
				[
				  { text: "OK", onPress: () => console.log("OK MdP Pressed") }
				]
			  );
			}
		})
		.catch((error) => console.error(error))
        .finally(() => setLoading(false));

	  }
	  setOldP("");
	  setNewP("");
	  setVerifP("");

	}


	// Fonction de changement d'information de contact
	function changeContact (phone, mail) {
	  if (phone != "" || mail != ""){
	    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_MON_COMPTE/P_IDBENEVOLE=' + userID)
		.then((resp) => resp.text())
	    .then((texte) => {console.log(texte);if (phone === "") {phone = getPhoneFromData(texte)} if (mail === "") {mail = getEmailFromData(texte)}})
	    .then(() => fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_UPD_INFO_BENEVOLE/P_IDBENEVOLE=' + userID + '/P_EMAIL=' + mail + '/P_TELEPHONE=' + phone))
	    .then((rep) => rep.text())
	    .then(texte => {if (texte != "1\n") {throw new Error("Erreur lors de la mise à jour de la base de données");}})
		.catch((error) => console.error(error))
        .finally(() => {setPhone("");setMail("");setPersoUpToDate(false);setLoading(false)});
	    alert(
		  "Vos informations ont bien été mises à jour.",
		  [
		    { text: "OK", onPress: () => console.log("OK ContactPerso Pressed") }
		  ]

	    );
	  }
	}

}




async function compareToHash (mdp, hash) {
	try {
		let mdpHash = await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256,mdp);
		return mdpHash === hash;
	} catch(error) {
      console.error(error);
    }
}

  function getEmailFromData(data) {
	const lignes = data.split(/\n/);
	var i;
	var Email = null;
	for (i = 1; i<lignes.length; i++){
		if (lignes[i] != ""){
			const valeurs = lignes[i].split(/\t/);
			Email = valeurs[2];
		}
	}
	return Email;
  }
  
    function getPhoneFromData(data) {
	const lignes = data.split(/\n/);
	var i;
	var phone = null;
	for (i = 1; i<lignes.length; i++){
		if (lignes[i] != ""){
			const valeurs = lignes[i].split(/\t/);
			phone = valeurs[3];
		}
	}
	return phone;
  }
  
    function getPasswordFromData(data) {
	const lignes = data.split(/\n/);
	var i;
	var hPassword = null;
	for (i = 1; i<lignes.length; i++){
		if (lignes[i] != ""){
			const valeurs = lignes[i].split(/\t/);
			hPassword = valeurs[2];
		}
	}
	return hPassword;
  }

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    justifyContent:"space-around",
    flexDirection: "row",
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  data: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  input: {
    marginVertical: 4,
    marginHorizontal: -10,
  },
  field: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  ligne: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 20,
  },

  // pour changer la couleur de la flatlist dynamiquement
  BENEVOLE: {
    backgroundColor: '#6fe3d2',
  },
  REFERENT: {
    backgroundColor: '#f9c2ff',
  },

  // Chargement
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
	  backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 



// On exporte la fonction principale
export default compteScreen;
