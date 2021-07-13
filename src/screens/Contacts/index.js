import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput} from 'react-native';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import {checkFetch} from '../../components/checkFetch';
import {userContext} from '../../contexts/userContext';
import ModalContact from '../../components/modalContact';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
function contactScreen() {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");
  
  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;
  
  // on va chercher les informations sur la BDD
  useEffect(() => {
    let body = new FormData();
    body.append('token',token);
    fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_LST_CONTACT/P_IDBENEVOLE=' + userID , {
      method: 'POST',
      body: body})
        .then((response) => checkFetch(response))
        .then((texte) =>  {setData(texte); console.log("Infos Contact Référent : chargées")})
        .catch((error) => handleError (error))
        .finally(() => setLoading(false));
  }, []);

  // On traite ces informations
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={[styles.item, styles.REFERENT]}>

      {/* Conteneur 1ere colonne : info personne */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Text style = {{textAlign: "center"}}>{item.split(/\t/)[3]}</Text>
        <Text style = {{textAlign: "center"}}>{item.split(/\t/)[4]}</Text>
      </View>

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Text style = {{textAlign: "center"}}>{item.split(/\t/)[0]}</Text>
        <Text style = {{textAlign: "center"}}>{item.split(/\t/)[2]}</Text>
        <Text style = {{textAlign: "center"}}>{item.split(/\t/)[1]}</Text>
      </View>

      {/* Conteneur 3eme colonne : contacter */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Pressable onPress={() => {setMail(item.split(/\t/)[7]);setPhone(item.split(/\t/)[6]);setModalVisible(!modalVisible)}}>
          {({ pressed }) => (
            <Icon 
              style = {{alignSelf: "center"}}
              name='mail' 
              size={30}
              color={pressed?'darkslategrey':'black'}
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
	<ModalContact visible = {modalVisible} setVisible = {setModalVisible} mail = {mail} phone = {phone}/>
    {isLoading ? (
        <View style={styles.loading}>
         <ActivityIndicator size="large" color="#00ff00" />
	      </View>) : (
		<>
		{/*Header de la liste*/}
		<View style = {styles.header}>
			<View style={{width:'33%'}}>
				<Text style = {styles.headerTitle}>Nom/Prénom</Text>
			</View>
			<View style={{width:'33%'}}>
				<Text style = {styles.headerTitle}>Activité et jour</Text>
			</View>
			<View style={{width:'33%'}}>
				<Text style = {styles.headerTitle}>Info contact</Text>
			</View>
		</View>
        <FlatList
          data={ligne}
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
export default contactScreen;
