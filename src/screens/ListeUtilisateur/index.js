import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Linking, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import {checkFetch} from '../../components/checkFetch';
import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';

import ModalContact from '../../components/modalContact';

import { useToast } from "react-native-toast-notifications";

// Fonction Principale
function listeUtilisateurScreen({route, navigation: { goBack }}) {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Toast
  const toast = useToast();

  // Bénévole à chercher
  const [ajout, setAjout] = useState('');
  const [visibleData, setVisibleData] = useState('');
  
  //Pop-up infos de contact
  const [modalVisibleContact, setmodalVisibleContact] = useState(false);
  
  //Données pour le modal de contact
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');

  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;

  // On récupère les informations données en paramètres
  const { IDActivite, IDSite, IDJour, liste } = route.params;

  //Paramètres des fetch
  var params = {}

  // on va chercher les informations sur la BDD
  useEffect(() => {
    let body = new FormData();
    body.append('token',token);
    fetch('http://' + constantes.BDD + '/APP/AP_ALL_BENEVOLE' , {
      method: 'POST',
      body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setData(json); console.info("Liste Utilisateurs : chargées"); setLoading(false)})
        .catch((error) => {setLoading(false); handleError (error)});
  }, []);

  // on met à jour la liste visible
  useEffect(() => {
    
    setVisibleData( data.filter( (d) => ( d.prenom.toLowerCase().startsWith(ajout.toLowerCase()) && !(liste.map(l => l.prenom).includes(d.prenom) && liste.map(l => l.nom).includes(d.nom)) ) ) )

    //setVisibleData( ligne.map((nom) => (nom.toLowerCase().includes(ajout.toLowerCase()) ? nom : none)) );
  }, [ajout]);


  //Fonction d'ajout de bénévole
  const ajouterBenevole = (id, nom, prenom) => {
    console.info("Vous avez ajouter l'id : " + id + " " + IDJour + " " + IDActivite + " " + IDSite);
    let body = new FormData();
	  params = {"P_IDBENEVOLE":id, "P_JOURPRESENCE":IDJour, "P_IDACTIVITE":IDActivite, "P_IDSITE":IDSite, "P_IDROLE":1 };
	  body.append('params',JSON.stringify(params));
	  body.append('token',token);
    fetch("http://" + constantes.BDD + "/APP/AP_INS_PRESENCE/", {
      method: 'POST',
      body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {console.info("changement statut !"); console.log(json)})
        .then( () => {toastComponent("Ajout : " + prenom + " " + nom); goBack()})
        .catch((error) => handleError (error));
  }
  

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={[styles.item, styles.BENEVOLE]}>
      {/* Conteneur 1ere colonne : info personne */}

        <Pressable onPress={() => ajouterBenevole(item.idbenevole, item.nom, item.prenom)} style={{width: "75%"}}>
        {({ pressed }) => (
          <View style={styles.colomn}>
            <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.prenom}</Text>
            <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.nom}</Text>
          </View>
        )}
        </Pressable>
      

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={{marginRight: 40, justifyContent: "center"}}>
      <Pressable onPress={() => {setMail(item.email); setPhone(item.telephone); setmodalVisibleContact(!modalVisibleContact);}}>
          {({ pressed }) => (
            <Icon 
              name='mail' 
              size={30}
              color={pressed?'darkslategrey':'black'}
            />
          )}
      </Pressable>
      </View>
    </View>
  );


  // Affiche le toast
  const toastComponent = (texte) => {
        
    toast.show(texte, {
        type: "success",
        position: "bottom",
        duration: 2000,
        offset: 30,
        animationType: "zoom-in",
      });
  };

  // on retourne la flatliste
  return (
    <>
    <SafeAreaView style={styles.container}>
    {isLoading ? (
        <View style={styles.loading}>
         <ActivityIndicator size="large" color="green" />
	      </View>) : (
		<>
	    <ModalContact visible = {modalVisibleContact} setVisible = {setmodalVisibleContact} mail = {mail} phone = {phone}/>
		
		<>
		  <View>
			<TextInput
			  style={[, styles.input, styles.item, {backgroundColor: "#ebe0c3"}]}
			  onChangeText={text => setAjout(text)}
			  placeholder="Prénom du bénévole à ajouter :"
			/>
		  </View>
		</>
		
		{/*Header de la flatlist*/}
		<View style = {styles.header}>
	   	  <View style={{width:'50%'}}>
		   <Text style = {[styles.headerTitle, {textAlign: "left", marginLeft: 20}]}>Nom/Prénom</Text>
		  </View>
		  <View style={{width:'50%'}}>
		    <Text style = {[styles.headerTitle, {textAlign: "right", marginRight: 20}]}>Contacter</Text>
		  </View>
		</View>
		
        <FlatList
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
		</>
      )}
    </SafeAreaView>
	</>
  );

}


// On exporte la fonction principale
export default listeUtilisateurScreen;
