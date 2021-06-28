import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Modal, TextInput} from 'react-native';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Clipboard from 'expo-clipboard';

import {userContext} from '../../contexts/userContext';
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
  const [toClipboard, setToClipboard] = useState("");

  useEffect(() => {
	if (toClipboard != "") {
	  Clipboard.setString(toClipboard);
	}
	setToClipboard("");
  }, [toClipboard]);
  
  
  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // on va chercher les informations sur la BDD
  useEffect(() => {
    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_CONTACT/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos Contact Référent : chargées")})
      .catch((error) => console.error(error))
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
      <View style={styles.colomn}>
        <Text>{item.split(/\t/)[3]}</Text>
        <Text>{item.split(/\t/)[4]}</Text>
      </View>

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={styles.colomn}>
        <Text>{item.split(/\t/)[0]}</Text>
        <Text>{item.split(/\t/)[2]}</Text>
        <Text>{item.split(/\t/)[1]}</Text>
      </View>

      {/* Conteneur 3eme colonne : contacter */}
      <View style={styles.colomn}> 
        <Icon 
          name='mail' 
          size={30}
          color='#000'
          onPress={() => {setMail(item.split(/\t/)[7]);setPhone(item.split(/\t/)[6]);setModalVisible(!modalVisible)}}
        />
        
      </View>
    </View>
  );

  // on retourne la flatliste
  return (
    <>
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalContactView}>
		      <Text style={styles.modalContactTitle}>Informations de contact</Text>
		      <View style={styles.modalContactContentView}>
            <Text style={styles.modalText} onPress={() => {setToClipboard(mail);alert('Copié dans le presse-papier');}}>{"Mail : " + mail}</Text> //TODO Comprendre pourquoi ça marche pas sans alerte
		        <Text style={styles.modalText} onPress={() => {setToClipboard(phone);alert('Copié dans le presse-papier');}}>{"Tel : " + phone}</Text>
		      </View>
          <View style={styles.modalContactButtonView}>
            <Pressable
              style={styles.buttonContactLeft}
              onPress={() => {setModalVisible(!modalVisible);console.log("OK  Contact Pressed");}}
            >
              <Text style={styles.textContactStyle}>OK</Text>
            </Pressable>
            <Pressable
              style={styles.buttonContactMid}
              onPress={() => {setModalVisible(!modalVisible);Linking.openURL(`sms:${phone}`);}}
            >
              <Text style={styles.textContactStyle}>SMS</Text>
            </Pressable>
            <Pressable
              style={styles.buttonContactRight}
              onPress={() => {setModalVisible(!modalVisible);Linking.openURL(`mailto:${mail}`);}}
            >
              <Text style={styles.textContactStyle}>MAIL</Text>
            </Pressable>
		      </View>
        </View>
      </View>
    </Modal>
    <SafeAreaView style={styles.container}>
    {isLoading ? (
        <View style={styles.loading}>
         <ActivityIndicator size="large" color="#00ff00" />
	      </View>) : (
        <FlatList
          data={ligne}
          renderItem={renderItem}
          keyExtractor={item => item}
        />
      )}
    </SafeAreaView>
	</>
  );

}

// On exporte la fonction principale
export default contactScreen;
