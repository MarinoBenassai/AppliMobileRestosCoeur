import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, View, Button} from 'react-native';
import {SafeAreaView, Pressable, TextInput} from 'react-native';

import {normalizeInputPhone} from '../../components/normalizeInputPhone';
import {modeAffichage} from '../../components/modeAffichage';
import {sendAPI} from '../../components/sendAPI';
import {userContext} from '../../contexts/userContext';

import { useToast } from "react-native-toast-notifications";
import * as Device from 'expo-device';

import styles from '../../styles';


// Fonction Principale
const compteScreen = () => {
  const [isLoading, setLoading] = useState(true);

  // Toast
  const toast = useToast();

  const refEmail = useRef(null);
  const refNewP = useRef(null);
  const refVerifP = useRef(null);

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
  

  // On récupère la fonction pour gérer le modal d'informations
  const fctModalApp = React.useContext(userContext).fctModalApp;
  
  // On récupère les informations d'engagement par défaut
  useEffect(() => {
	sendAPI('APP', 'AP_LST_ENG_BEN',{'P_IDBENEVOLE':userID},token)
	.then((json) =>  setDataEngagementDefaut(json))
	.catch((error) => handleError (error))
  }, []);

  // On récupère les informations personelles
  useEffect(() => {
    if (persoUpToDate === false) {
      setPersoUpToDate(true);
	  sendAPI('APP', 'AP_MON_COMPTE',{'P_IDBENEVOLE':userID},token)
	  .then((json) =>  {setDataPerso(json[0]); setLoading(false)})
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

  // Affiche le toast
  const toastComponent = (texte, type) => {
        
    toast.show(texte, {
        type: type,
        position: "bottom",
        duration: 2000,
        offset: 30,
        animationType: "zoom-in",
      });
  };


  // On retourne la flatliste
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
         <ActivityIndicator size="large" color="#00ff00" />
	      </View>) : (
        //View Principal, post chargement
        <View style={{flex: 1}}>

          {/* La vue des infos profil (au dessus des activités) se trouve dans le header de la flatlist */}

          {/* View des Activités */}
          <View>
            <FlatList
              data={visibleData}
              ListHeaderComponent={
                <>
                  {/* View du Profil (info, contact, MdP) */}
                  <View style={{marginTop: 10}}>
                    {/* View des information de profil */}
                    <View style={[styles.browser]}>
                      
                      <Text style={{textAlign: "center"}}>
                        <Text>Profil de </Text>
                        <Text style={{fontWeight: "bold"}}>{dataPerso.prenom} {dataPerso.nom}</Text>
                      </Text>
                      <View style={styles.ligne}/>
                    </View>

                    {/* View des informations de contact */}
                    <View style={[styles.browser, {marginBottom: 10}]}>
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
                          blurOnSubmit={false}
                          onSubmitEditing={() => refEmail.current.focus()}
						              value = {phone}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Email : </Text>
                        <TextInput
                          ref={refEmail}
                          style={[styles.input, {width: "75%", maxWidth: 400, marginBottom: 5}]}
                          placeholder={dataPerso.email}
                          autoCorrect={false}
                          textContentType='emailAddress'
                          keyboardType='email-address'
                          onChangeText={text => setMail(text)}
						              value = {mail}
                          onSubmitEditing={() => changeContact(phone, mail)}
                        />
                      </View>
                      <Button
                        onPress={() => changeContact(phone, mail)}
                        title="Valider Coordonnées"
                        color="#841584"
                        accessibilityLabel="Valider vos nouvelles informations de contact"
                      />
                    </View>

                    {/* View des MdP */}
                    <View style={[styles.browser, {marginBottom: 10}]}>
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
                          onSubmitEditing={() => refNewP.current.focus()}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Nouveau mot de passe : </Text>
                        <TextInput
                          ref={refNewP}
                          style={styles.input}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='newPassword'
                          onChangeText={text => setNewP(text)}
						              value = {newP}
                          onSubmitEditing={() => refVerifP.current.focus()}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Confirmation mot de passe : </Text>
                        <TextInput
                          ref={refVerifP}
                          style={[styles.input, {marginBottom: 5}]}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='newPassword'
                          onChangeText={text => setVerifP(text)}
						              value = {verifP}
                          onSubmitEditing={() => changeMdP(oldP, newP, verifP)}
                        />
                      </View>
                      <Button
                        onPress={() => {changeMdP(oldP, newP, verifP);}}
                        title="Valider Mot de Passe"
                        color="#841584"
                        accessibilityLabel="Valider votre nouveau mot de passe"
                      />
                    </View>
					          {/* <View style = {styles.item}>
                      <Text style={styles.title}>Mes Activités</Text>
					          </View> */}
					

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
    
      Device.brand ? toastComponent("Au moins un des champs est vide", "warning") : fctModalApp("Attention", "Au moins un des champs est vide");

	  }
	  // vérif failled
	  else if(newP != verifP){
      Device.brand ? toastComponent("Les champs correspondant au nouveau mot de passe ne sont pas identiques", "danger") : fctModalApp("Attention", "Les champs du nouveau mot de passe ne concordent pas");
		
	  }
	  // Condition (court)
	  else if(newP.length < 8){
      Device.brand ? toastComponent("Votre mot de passe doit contenir au moins 8 caractères", "danger") : fctModalApp("Mot de passe trop court", "Le mot de passe doit contenir au moins 8 caractères");

	  }
	  // tout est bon
	  else {
		setLoading(true);
		sendAPI('AUT', 'AP_UPD_MOTDEPASSE', {'ancienMDP':oldP, 'nouveauMDP':newP, 'idBenevole':userID})
    .then((json) => {
			Device.brand ? toastComponent("Votre mot de passe a bien été modifié.", "success") : fctModalApp("succès", "Votre mot de passe a bien été modifié");
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

    // Regex
    var regexMail = /^(?:[a-zA-Z0-9!#$%&'*+/=?^_‘{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_‘{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-zA-Z0-9-]*[a-zA-Z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
    var regexPhone = /^(([0-9]{10})|(\+33[0-9]{9}))$/;

    // On vérifie les entrées
    if( phone == "" ){
      phone = dataPerso.telephone;
    }
    if( mail == "" ){
      mail = dataPerso.email;
    }
    if( !regexMail.test(mail) ){
      mail = dataPerso.email;
      Device.brand ? toastComponent("Email non valide", "error") : fctModalApp("Attention", "Email non valide");
    }
    if( !regexPhone.test(phone) ){
      phone = dataPerso.telephone;
      Device.brand ? toastComponent("Numéro de téléphone non valide", "error") : fctModalApp("Attention", "Numéro de téléphone non valide");
    }


	  if( (phone != dataPerso.telephone) || (mail != dataPerso.email) ){

      sendAPI('APP', 'AP_UPD_INFO_BENEVOLE', {'P_TOKEN':token, 'P_EMAIL':mail, 'P_TELEPHONE':phone},token)
      .then((texte) => {if (texte != "1") {throw "Erreur lors de la mise à jour de la base de données";} setPhone("");setMail("");setPersoUpToDate(false);setLoading(false)})
      .catch((error) => {setPhone("");setMail("");setPersoUpToDate(false);setLoading(false); handleError (error)});

      Device.brand ? toastComponent("Vos informations ont bien été mises à jour.", "success") : fctModalApp("succès", "Vos informations ont bien été mise à jour");
    }

    setPhone("");
    setMail("");

	}

}


// On exporte la fonction principale
export default compteScreen;
