import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Modal, TextInput} from 'react-native';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';

// Fonction Principale
function engagementScreen({navigation}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // Reload
  const [upToDate, setUpToDate] = useState(false);
  
  // Pour le pop up de commentaire
  const [modalVisible, setModalVisible] = useState(false);

  // Pour le commentaire
  const [comment, setComment] = useState('');
  const [infoComment, setInfoComment] = useState(['', '', '']);

  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // Focntion de chargement de l'activité
  function versActivite({navigation}, item) {
  	navigation.navigate('Activite', {
  	  IDActivite: item.split(/\t/)[9], IDSite: item.split(/\t/)[10], IDJour: item.split(/\t/)[0].split(" ")[0], NomActivite: item.split(/\t/)[1], NomSite: item.split(/\t/)[2], idRole: (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2"
  	});
  }

  //Fonction pour chercher les données
  useEffect(() => {
    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_PRE_BEN/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos Engagement: chargées"); setUpToDate(true);})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, [upToDate]);


  // On traite les données
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.split(/\t/)[3]]]}>
      
      {/* Conteneur 1ere colonne */}
      <Pressable onPress={() => versActivite({navigation}, item)} >
      {({ pressed }) => (
        <View style={{flexDirection: "column",}}>
          <Text style={{color: pressed ? 'white' : 'black',}}>{item.split(/\t/)[2]}</Text>
          <Text style={{color: pressed ? 'white' : 'black',}}>{item.split(/\t/)[1]}</Text> 
          <Text style={{color: pressed ? 'white' : 'black',}}>
            {item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[0]}
          </Text>
          <Text style={{color: pressed ? 'white' : 'black',}}>Participants : {item.split(/\t/)[6]}</Text>
        </View> )}
      </Pressable>

      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <View style={{ flexDirection: "column"}}>
        <Pressable onPressOut={() => changerStatut(item.split(/\t/)[4], userID, item.split(/\t/)[0], item.split(/\t/)[9], item.split(/\t/)[10], (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2")}>
          <Text style={{ color: (item.split(/\t/)[4] == "Absent") ? 'black' : 
            ((item.split(/\t/)[4] == "Présent") ? "green" : "red") }}>{item.split(/\t/)[4]}</Text>
        </Pressable>
        
        <Text style={{width: 100}}>{item.split(/\t/)[5]}</Text>
      </View>
    </View>
  );


  // Fonction de changement de statut
  const changerStatut = (statut, benevole, jour, activite, site, role) => {

    // Si absent
    if(statut == "Absent"){
      console.log("Vous ête actuellement 'Absent'");
      fetch("http://" + constantes.BDD + "/Axoptim.php/REQ/AP_DEL_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site)
        .then((response) => response.text())
        .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
        .catch((error) => console.error(error));
    }

    // Si présent
    else if(statut == "Présent"){
      console.log("Vous ête actuellement 'Présent'");

      setInfoComment([ jour, activite, site ]);
      //On rend le modal visible
      setModalVisible(true);
      
      // Le traitement se fait sur le modal afin d'éviter les désynchronisations

    }

      // Si non-défini
      else{
        console.log("Vous êtes actuellement 'Non défini'");
        fetch("http://" + constantes.BDD + "/Axoptim.php/REQ/AP_INS_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site + "/P_IDROLE=" + role)
          .then((response) => response.text())
          .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
          .catch((error) => console.error(error))
      }
      
      // On raffraichie les composants quoi qu'il arrive
      setUpToDate(false);
  }

  // On retourne la flatliste
  return (

    <SafeAreaView style={styles.container}>
    {isLoading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>) : (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Changement annulé.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Commentaire d'Absence :</Text>
              <TextInput
                style={styles.input}
                onChangeText={setComment}
                placeholder="Raison de votre absence"
                autoCompleteType="off"
                maxLength={99}
              />
              <Pressable
                style={styles.button}
                // TODO : envoyer le commentaire
                onPress={() => {setModalVisible(!modalVisible);
                  fetch("http://" + constantes.BDD + "/Axoptim.php/REQ/AP_UPD_PRESENCE/P_IDBENEVOLE=" + userID + "/P_JOURPRESENCE=" + infoComment[0] + "/P_IDACTIVITE=" + infoComment[1] + "/P_IDSITE=" + infoComment[2] + "/P_COMMENTAIRE=" + comment)
                  .then((response) => response.text())
                  .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
                  .catch((error) => console.error(error));

                  // On raffraichi et reset le commentaire pour la prochaine fois
                  setComment("");
                  setUpToDate(false);
                }}
              >
                <Text style={styles.textStyle}>Valider</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

        <FlatList
          data={ligne}
          renderItem={renderItem}
          keyExtractor={item => item}
        />
      </View>
      )}
    </SafeAreaView>

  );
}




// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: "row",
    justifyContent:"space-evenly",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  // Couleur dynamique
  BENEVOLE: {
    backgroundColor: '#6fe3d2',
  },
  REFERENT: {
    backgroundColor: '#f9c2ff',
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  // vue gloabl du modal
  modalView: {
    justifyContent: "space-evenly",
    height: "40%",
    minHeight: 300,
    width: "80%",
    maxWidth: 600,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // button "fermé" du modal
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  // Titre du modal
  modalText: {
    marginBottom: 5,
    textAlign: "center"
  },
  // inputTexte du modal
  input: {
    padding: 10
  }
});


// On exporte la fonction principale
export default engagementScreen;

