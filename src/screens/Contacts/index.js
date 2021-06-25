import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Modal, TextInput} from 'react-native';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import Clipboard from 'expo-clipboard';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';

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
    <View style={styles.item}>

      {/* Conteneur 1ere colonne : info personne */}
      <View style={styles.colomn}>
        <Text>{item.split(/\t/)[3]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[4]}{"\t\t\t"}</Text>
      </View>

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={styles.colomn}>
        <Text>{item.split(/\t/)[0]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[2]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[1]}{"\t\t\t"}</Text>
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
        <View style={styles.modalView}>
		  <Text style={styles.modalTitle}>Informations de contact</Text>
		  <View style={styles.modalContentView}>
            <Text style={styles.modalText} onPress={() => {setToClipboard(mail);alert('Copié dans le presse-papier');}}>{"Mail : " + mail}</Text> //TODO Comprendre pourquoi ça marche pas sans alerte
		    <Text style={styles.modalText} onPress={() => {setToClipboard(phone);alert('Copié dans le presse-papier');}}>{"Tel : " + phone}</Text>
		  </View>
		  <View style={styles.modalButtonView}>
            <Pressable
              style={styles.buttonLeft}
              onPress={() => {setModalVisible(!modalVisible);console.log("OK  Contact Pressed");}}
            >
              <Text style={styles.textStyle}>OK</Text>
            </Pressable>
			            <Pressable
              style={styles.buttonMid}
              onPress={() => {setModalVisible(!modalVisible);Linking.openURL(`sms:${phone}`);}}
            >
              <Text style={styles.textStyle}>SMS</Text>
            </Pressable>
			            <Pressable
              style={styles.buttonRight}
              onPress={() => {setModalVisible(!modalVisible);Linking.openURL(`mailto:${mail}`);}}
            >
              <Text style={styles.textStyle}>MAIL</Text>
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





// styles
const styles = StyleSheet.create({
  
  // le conteneur
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },

  // chaque item de la flatlist
  item: {
    justifyContent:"space-around",
    flexDirection: "row",
    backgroundColor: '#00ffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },

  // chaque colonne d'un item de la flatlist
  colomn: { 
    flexDirection: "column", 
    marginVertical: 8, 
    justifyContent:"space-around",
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
  },
    modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
	paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
	alignSelf: "center",
  },
    modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalTitle: {
    textAlign: "center",
	fontSize: 20,
    fontWeight: "bold",
	marginBottom: 20,
  },
  modalContentView: {
    alignItems: "flex-start",
	},
  modalButtonView: {
    alignItems: "flex-start",
	flexDirection: "row",
	},
    buttonLeft: {
	flex: 3,
    padding: 10,
    elevation: 2,
	alignSelf: "flex-start"
  },
  buttonMid: {
    alignItems: "flex-start",
	flex: 1,
    padding: 10,
    elevation: 2,
	alignSelf: "flex-end"
  },
  buttonRight: {
    alignItems: "flex-start",
	flex: 1,
    padding: 10,
    elevation: 2,
	alignSelf: "flex-end"
  },
    centeredView: {
    flex: 1,
    justifyContent: "center",
    marginTop: 22,

  },
}); 


// On exporte la fonction principale
export default contactScreen;
