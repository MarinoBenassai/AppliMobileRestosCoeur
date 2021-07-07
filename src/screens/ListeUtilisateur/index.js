import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Linking, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';

import ModalContact from '../../components/modalContact';

// Fonction Principale
function listeUtilisateurScreen({route, navigation: { goBack }}) {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

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

  // On récupère les informations données en paramètres
  const { IDActivite, IDSite, IDJour } = route.params;

  // on va chercher les informations sur la BDD
  useEffect(() => {
    fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_ALL_BENEVOLE' + '/P_TOKEN=' + token)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Liste Utilisateurs : chargées")})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // On traite ces informations
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  // on met à jour la liste visible
  useEffect(() => {
    
    setVisibleData( ligne.filter( (nom) => ( nom.toLowerCase().startsWith(ajout.toLowerCase()) ) ) )

    //setVisibleData( ligne.map((nom) => (nom.toLowerCase().includes(ajout.toLowerCase()) ? nom : none)) );
  }, [ajout]);


  //Fonction d'ajout de bénévole
  const ajouterBenevole = (benevole) => {
    console.log("Vous avez ajouter l'id : " + benevole + " " + IDJour + " " + IDActivite + " " + IDSite);
      fetch("http://" + constantes.BDD + "/Axoptim.php/APP/AP_INS_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + IDJour + "/P_IDACTIVITE=" + IDActivite + "/P_IDSITE=" + IDSite + "/P_IDROLE=1" + '/P_TOKEN=' + token)
        .then((response) => response.text())
        .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
        .then( () => goBack() )
        .catch((error) => console.error(error));
  }
  

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={[styles.item, styles.BENEVOLE]}>
      {/* Conteneur 1ere colonne : info personne */}

        <Pressable onPress={() => ajouterBenevole(item.split(/\t/)[4])} style={{width: "75%"}}>
        {({ pressed }) => (
          <View style={styles.colomn}>
            <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.split(/\t/)[0]}</Text>
            <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.split(/\t/)[1]}</Text>
          </View>
        )}
        </Pressable>
      

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={{marginRight: 40, justifyContent: "center"}}>
      <Pressable>
          {({ pressed }) => (
            <Icon 
              name='mail' 
              size={30}
              color={pressed?'darkslategrey':'black'}
              onPress={() => {setMail(item.split(/\t/)[2]); setPhone(item.split(/\t/)[3]); setmodalVisibleContact(!modalVisibleContact);}}
            />
          )}
      </Pressable>
      </View>
    </View>
  );

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
			  placeholder="Nom du bénévole à ajouter :"
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
          keyExtractor={item => item}
        />
		</>
      )}
    </SafeAreaView>
	</>
  );

}


// On exporte la fonction principale
export default listeUtilisateurScreen;
