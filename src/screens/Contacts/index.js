import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput} from 'react-native';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import {Picker} from '@react-native-picker/picker';

import {checkFetch} from '../../components/checkFetch';
import {traitementSort} from '../../components/pickerActivite';
import {userContext} from '../../contexts/userContext';
import ModalContact from '../../components/modalContact';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
function contactScreen() {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [visibleData, setVisibleData] = useState("");
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");

  const [picker, setPicker] = useState("nom");
  
  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;
  
  // on va chercher les informations sur la BDD
  useEffect(() => {
    let body = new FormData();
    body.append('token',token);
    fetch('http://' + constantes.BDD + '/APP/AP_LST_CONTACT/P_IDBENEVOLE=' + userID , {
      method: 'POST',
      body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setData(json); console.info("Infos Contact Référent : chargées");})
        .catch((error) => handleError (error))
        .finally(() => setLoading(false));
  }, []);

  // on met à jour la liste visible initiale
  useEffect(() => {
    setVisibleData( traitementSort("NOM", data, data, 1, 2, 3, 4, 0) ); // ordonne la liste initiale
  }, [data]);

  

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={[styles.item, styles.REFERENT]}>

      {/* Conteneur 1ere colonne : info personne */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Text style = {{textAlign: "center"}}>{item.nom}</Text>
        <Text style = {{textAlign: "center"}}>{item.prenom}</Text>
      </View>

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Text style = {{textAlign: "center"}}>{item.jourdefaut}</Text>
        <Text style = {{textAlign: "center"}}>{item.nomsite}</Text>
        <Text style = {{textAlign: "center"}}>{item.nomactivite}</Text>
      </View>

      {/* Conteneur 3eme colonne : contacter */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Pressable onPress={() => {setMail(item.email);setPhone(item.telephone);setModalVisible(!modalVisible)}}>
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

      {/*Picker*/}
      <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20}}>
        <Picker
            style={{height: 30, width: "50%", maxWidth: 190, alignSelf: "flex-end" }}
            selectedValue={picker}
            onValueChange={(itemValue, itemIndex) =>
                {setPicker(itemValue);
                setVisibleData (traitementSort(itemValue, data, visibleData, 1, 2, 3, 4, 0) );}
            }>

            <Picker.Item label="nom" value="NOM" />
            <Picker.Item label="prénom" value="PRENOM" />
            <Picker.Item label="jour" value="JOUR" />
            <Picker.Item label="site" value="SITE" />
            <Picker.Item label="activité" value="ACTIVITE" />
        </Picker>
      </View>

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
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index}
        />
      </>
      )}
    </SafeAreaView>
	</>
  );

}

// On exporte la fonction principale
export default contactScreen;
