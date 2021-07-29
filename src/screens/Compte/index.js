import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Button} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, TextInput, Alert} from 'react-native';
import * as Crypto from 'expo-crypto';

import {normalizeInputPhone} from '../../components/normalizeInputPhone';
import {checkFetch} from '../../components/checkFetch';
import {modeAffichage} from '../../components/modeAffichage';
import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
const compteScreen = () => {
  const [isLoading, setLoading] = useState(true);

  // Info perso et Info Engagement
  const [dataEngagementDefaut, setDataEngagementDefaut] = useState([]);
  const [dataPerso, setDataPerso] = useState([]);

  // Champs remplissable
  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [verifP, setVerifP] = useState('');
  const [persoUpToDate, setPersoUpToDate] = useState(false);
  
  // On récupère l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token

  // Mode d'affichage
  const [header, setHeader] = useState({
                                        "jourdefaut": "\u25B2",
                                        "nomactivite": "",
                                        "nomsite": "",
                                      });
  const [visibleData, setVisibleData] = useState('');
  const [ancienMode, setAncienMode] = useState("jourdefaut");
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;
  
  //Paramètres des fetch
  var params = {}
  
  // On récupère les informations d'engagement par défaut
  useEffect(() => {
    let body = new FormData();
    params = {'P_IDBENEVOLE':userID};
    body.append('params',JSON.stringify(params));
    body.append('token',token);
    fetch('http://' + constantes.BDD + '/APP/AP_LST_ENG_BEN/', {
      method: 'POST',
      body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setDataEngagementDefaut(json); console.info("Infos Engagement Défaut : chargées")})
        .catch((error) => handleError (error))
  }, []);

  // On récupère les informations personelles
  useEffect(() => {
    if (persoUpToDate === false) {
      setPersoUpToDate(true);
      let body = new FormData();
	  params = {'P_IDBENEVOLE':userID};
	  body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch('http://' + constantes.BDD + '/APP/AP_MON_COMPTE/', {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((json) =>  {setDataPerso(json[0]); console.info("Infos Personelles : chargées"); setLoading(false)})
          .catch((error) => {setLoading(false); handleError (error)});
	  }
  }, [persoUpToDate]);


  // on met à jour la liste visible initiale
  useEffect(() => {
    setVisibleData(dataEngagementDefaut);
  }, [dataEngagementDefaut]);

  // On crée le renderer pour la liste des engagements par défaut
  const renderItem = ({ item }) => (
    <View style={[styles.item, styles[item.nomrole] ]}>
      <View style={{width:'33%'}}>
        <Text style= {{textAlign: "center"}}>{item.jourdefaut}</Text>
      </View>
      <View style={{width:'33%'}}>
        <Text style= {{textAlign: "center"}}>{item.nomactivite}</Text>
      </View>
      <View style={{width:'33%'}}>
        <Text style= {{textAlign: "center"}}>{item.nomsite}</Text>
      </View>
    </View>
  );

  // handler phone change
  const handleChangePhone = ( value ) => { 
    setPhone( normalizeInputPhone(value) );
  };

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
              data={visibleData}
              ListHeaderComponent={
                <>
                  {/* View du Profil (info, contact, MdP) */}
                  <View>
                    {/* View des information de profil */}
                    <View style={styles.browser}>
                      <Text style={styles.title}>Profil de :</Text>
                      <Text style={styles.data}>Nom : {dataPerso.nom}</Text>
                      <Text style={styles.data}>Prenom : {dataPerso.prenom}</Text>
                      <View style={styles.ligne}/>
                    </View>

                    {/* View des informations de contact */}
                    <View style={styles.browser}>
                      <Text style={styles.title}>Modification des coordonnées :</Text>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Téléphone : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder={normalizeInputPhone(dataPerso.telephone)}
                          autoCorrect={false}
                          textContentType='telephoneNumber'
                          keyboardType='phone-pad'
                          onChangeText={handleChangePhone}
						              value = {phone}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Email : </Text>
                        <TextInput
                          style={[styles.input, {width: "75%", maxWidth: 400, marginBottom: 5}]}
                          placeholder={dataPerso.email}
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
                    <View style={styles.browser}>
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
                          style={[styles.input, {marginBottom: 5}]}
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
					          <View style = {styles.item}>
                      <Text style={styles.title}>Mes Activités</Text>
					          </View>
					

                    {/*Header de la liste*/}
                    <View style = {styles.header}>
                      <Pressable style={{width:'33%'}} onPress={() => modeAffichage(dataEngagementDefaut, visibleData, setVisibleData, setAncienMode, ancienMode, "jourdefaut", header, setHeader)}>
                        <Text style = {styles.headerTitle}>Jour {header.jourdefaut}</Text>
                      </Pressable>
                      <Pressable style={{width:'33%'}} onPress={() => modeAffichage(dataEngagementDefaut, visibleData, setVisibleData, setAncienMode, ancienMode, "nomactivite", header, setHeader)}>
                        <Text style = {styles.headerTitle}>Activité {header.nomactivite}</Text>
                      </Pressable>
                      <Pressable style={{width:'33%'}} onPress={() => modeAffichage(dataEngagementDefaut, visibleData, setVisibleData, setAncienMode, ancienMode, "nomsite", header, setHeader)}>
                        <Text style = {styles.headerTitle}>Site {header.nomsite}</Text>
                      </Pressable>
                    </View>
					
                  </View>
                </>
              }
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
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
			{ text: "OK", onPress: () => console.info("Vide MdP Pressed") }
		  ]
		);
	  }
	  // vérif failled
	  else if(newP != verifP){
		alert(
		  "Erreur Nouveau Mot de Passe",
		  "\nLes champs correspondant au nouveau mot de passe ne sont pas identiques",
		  [
			{ text: "OK", onPress: () => console.info("verif failled MdP Pressed") }
		  ]
		);
	  }
	  // Condition (court)
	  else if(newP.length < 8){
		alert(
		  "Mot de passe trop court",
		  "\nVotre mot de passe doit contenir au moins 8 caractères",
		  [
			{ text: "OK", onPress: () => console.info("test MdP Pressed") }
		  ]
		);
	  }
	  // tout est bon
	  else {
		setLoading(true);
	    let body = new FormData();
		body.append('ancienMDP',oldP);
		body.append('nouveauMDP',newP);
		body.append('idBenevole',userID);
		fetch('http://' + constantes.BDD + '/AUT/AP_UPD_MOTDEPASSE', {
		method: 'POST',
		body: body})
		.then(async function (response) {
			if (response.ok) {
				return response.json();
			}
			else {
				const json = await response.json();
				throw json['error'];
			}
		})
		.then((json) => {
			alert("Votre mot de passe a bien été modifié.");
      setLoading(false);
		})
		.catch((error) => {setLoading(false); handleError (error)});

	  }
	  setOldP("");
	  setNewP("");
	  setVerifP("");

	}


	// Fonction de changement d'information de contact
	function changeContact (phone, mail) {
    phone = phone.replace(/[^\d+]/g, '');
    phone = phone.replace(/\+/g, '%2B');

	  if( (phone != "" && phone != dataPerso.telephone) || (mail != "" && mail != dataPerso.email) ){
	    
      if( phone == "" ){
        phone = dataPerso.telephone;
      }
      if( mail == "" ){
        mail = dataPerso.email;
      }

      let body = new FormData();
	  params = {'P_IDBENEVOLE':userID, 'P_EMAIL':mail, 'P_TELEPHONE':phone};
      body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch('http://' + constantes.BDD + '/APP/AP_UPD_INFO_BENEVOLE/', {
        method: 'POST',
        body: body})
      
      .then((response) => checkFetch(response))
      .then((texte) => {if (texte != "1") {throw new Error("Erreur lors de la mise à jour de la base de données");} setPhone("");setMail("");setPersoUpToDate(false);setLoading(false)})
      .catch((error) => {setPhone("");setMail("");setPersoUpToDate(false);setLoading(false); handleError (error)});


	    alert(
		  "Vos informations ont bien été mises à jour.",
		  [
		    { text: "OK", onPress: () => console.info("OK ContactPerso Pressed") }
		  ]

	    );
	  }

    setPhone("");
    setMail("");

	}

}


// On exporte la fonction principale
export default compteScreen;
