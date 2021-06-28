import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Modal, TextInput, useFocusEffect } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
function activiteScreen({route, navigation}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // Reload
  const [upToDate, setUpToDate] = useState(false);
  
  // Pour le pop up de commentaire
  const [modalVisible, setModalVisible] = useState(false);
  const [modal2Visible, setModal2Visible] = useState(false);

  // Pour le commentaire
  const [comment, setComment] = useState('');
  const [infoComment, setInfoComment] = useState(['', '', '', '']);

  // Commentaire d'activité
  const [infoActivite, setInfoActivite] = useState('');
  const [commentActivite, setCommentActivite] = useState('');
  const [beneficiaireActivite, setBeneficiaireActivite] = useState('');
  
  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // On récupère les informations données en paramètres
  const { IDActivite, IDSite, IDJour, NomActivite, NomSite, idRole } = route.params;

  // Fonction de sélection de l'activité
  function versListe({navigation}) {
  	navigation.navigate('ListeUtilisateur', {
  	  IDActivite: IDActivite, IDSite: IDSite, IDJour: IDJour
  	});
  }

  // On va chercher les données
  useEffect(() => {
    // Lors du focus de la page
    const unsubscribe = navigation.addListener('focus', () => {
      fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos Activité : chargées ");})
      .then(
        fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour)
        .then((response) => response.text())
        .then((texte) =>  {setInfoActivite(texte.split("\n")[1]); console.log("Info commentaire d'activité : chargées");})
        .then(() => {setCommentActivite(infoActivite.split("\t")[1]); setBeneficiaireActivite(infoActivite.split("\t")[0])})
        .catch((error) => console.error(error))
      )
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    
  }, [navigation]);

    
  useEffect(() => {
    if(true){ // if !upTodate, mais ne marche pas ... TODO(val defaut 'livre')
      // Update la liste et les info Activité
      fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour)
        .then((response) => response.text())
        .then((texte) =>  {setData(texte); console.log("Infos Activité : chargées ");})
        .then(
          fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour)
          .then((response) => response.text())
          .then((texte) =>  {setInfoActivite(texte.split("\n")[1]); console.log("Info commentaire d'activité : chargées");})
          .then(() => {setCommentActivite(infoActivite.split("\t")[1]); setBeneficiaireActivite(infoActivite.split("\t")[0])})
          .catch((error) => console.error(error))
        )
        .catch((error) => console.error(error))
        .finally(() => {setLoading(false); setUpToDate(true)});

      // Update commenatire d'activité (dans le fetch au dessus)
    }
    
  }, [upToDate]);
  
  // On traite les données
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)


  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.split(/\t/)[5]] ]}>

      {/* Conteneur 1ere colonne */}
      <View style={{ justifyContent:"space-evenly", flexDirection: "column",}}>
        <Text>{item.split(/\t/)[4]}</Text>
        <Text>{item.split(/\t/)[3]}</Text>
      </View>
      

      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <View style={{ justifyContent:"space-evenly", flexDirection: "column"}}>

        {/* Statut */}
        <Pressable onPress={() => changerStatut(item.split(/\t/)[6], item.split(/\t/)[9], IDJour, IDActivite, IDSite, (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2")}
                   disabled={(idRole=="2") ? false : true}>
          <Text style={{ color: (item.split(/\t/)[6] == "Absent") ? 'black' : 
            ((item.split(/\t/)[6] == "Présent") ? "green" : "red") }}>
              {item.split(/\t/)[6]}
          </Text>
        </Pressable>

        {/* Commentaire */}
        <Pressable onPress={() => chargerCommentaire(item.split(/\t/)[7])}
                    disabled={(idRole=="2") ? false : true}>
          <Text>Commentaire</Text>
        </Pressable>
      </View>

      {/* Conteneur 3eme colonne */}
      <View>
        <Icon 
          name='mail' 
          size={30}
          color='#000'
          onPress={() => {createContactAlert(item.split(/\t/)[10], item.split(/\t/)[11])} }
        />
        
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

      setInfoComment([ jour, activite, site, benevole ]);
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

  // Fonction de changement du commentaire d'activité
  const commentaireActivite = () => {
    setModal2Visible(true);
  }



  // On retourne la flatlist
  return (
    <>
    <SafeAreaView style={styles.container}>
    {isLoading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>) : (
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal2Visible}
          onRequestClose={() => {setModal2Visible(false)}}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Nombre de Bénéficiaire :</Text>
              <TextInput
                style={styles.input}
                onChangeText={setBeneficiaireActivite}
                defaultValue={beneficiaireActivite}
                keyboardType="numeric"
                maxLength={10}
              />
              <Text style={styles.modalText}>Commentaire d'activité :</Text>
              <TextInput
                style={styles.input}
                onChangeText={setCommentActivite}
                defaultValue={commentActivite}
                maxLength={99}
              />
              <Pressable
                style={styles.button}
                // TODO : envoyer le commentaire
                onPress={() => {setModal2Visible(false)
                                if(infoActivite.length == 0){
                                  fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_INS_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour + '/P_NOMBREBENEFICIAIRE=' + beneficiaireActivite + '/P_COMMENTAIRE=' + commentActivite)
                                  .then((response) => response.text())
                                  .then((texte) => console.log(texte))
                                  .then(() => console.log("Nouvelle entrée : commentaire d'activité"))
                                  .catch((error) => console.error(error));
                                }
                                else{
                                  fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_UPD_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour + '/P_NOMBREBENEFICIAIRE=' + beneficiaireActivite + '/P_COMMENTAIRE=' + commentActivite)
                                  .then((response) => response.text())
                                  .then((texte) => console.log(texte))
                                  .then(() => console.log("update entrée : commentaire d'activité "))
                                  .catch((error) => console.error(error));
                                }
                                // On raffraichi et reset le commentaire pour la prochaine fois
                                setUpToDate(false);
                }}
              >
                <Text style={styles.textStyle}>Valider</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {setModalVisible(false)}}
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
                  fetch("http://" + constantes.BDD + "/Axoptim.php/REQ/AP_UPD_PRESENCE/P_IDBENEVOLE=" + infoComment[3] + "/P_JOURPRESENCE=" + infoComment[0] + "/P_IDACTIVITE=" + infoComment[1] + "/P_IDSITE=" + infoComment[2] + "/P_COMMENTAIRE=" + comment)
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
          ListHeaderComponent={
            <>
              <View style={{marginVertical: 16,}}>
                {/* Info générales */}
                <View style={[styles.item, {justifyContent:"flex-start",}]}>
                  <Text style={[styles.info, {fontWeight: "bold",}]}>Activité : </Text>
                  <Text style={styles.info}>{NomActivite}</Text>
                </View>
                <View style={[styles.item, {justifyContent:"flex-start",}]}>
                  <Text style={[styles.info, {fontWeight: "bold",}]}>Site : </Text>
                  <Text style={styles.info}>{NomSite}</Text>
                </View>
                <View style={[styles.item, {justifyContent:"flex-start",}]}>
                  <Text style={[styles.info, {fontWeight: "bold",}]}>Jour : </Text>
                  <Text style={styles.info}>{IDJour.split(" ")[0].split("-")[2]}/
                                            {IDJour.split(" ")[0].split("-")[1]}/
                                            {IDJour.split(" ")[0].split("-")[0]}</Text>
                </View>
              </View>


              {/* "header" de la flatlist */}
              <View style={[styles.item, {flexDirection: "row", justifyContent: "space-between"}]}>
                <Text style={[styles.info, {fontWeight: "bold"}]}>Engagé : </Text>
                {(idRole == "2") &&	
                  <View style={{flexDirection: "row"}}>
                    <Icon 
                      name='repo' 
                      size={30}
                      color='#000'
                      onPress={() => commentaireActivite()}
                      disabled={(idRole=="2") ? false : true}
                      style={{paddingRight: 40}}
                    />
                    <Icon 
                      name='plus' 
                      size={30}
                      color='#000'
                      onPress={() => versListe({navigation})}
                      disabled={(idRole=="2") ? false : true}
                    />
                  </View>
                }
              </View>
            </>
          }
          renderItem={renderItem}
          keyExtractor={item => item}
        />
      </View>
      )}
    </SafeAreaView>
	</>
  );
}



// Fonction d'affichage pop-up des informations de contact
const createContactAlert = (mail, phone) =>{
  Alert.alert(
    "Contact information",
    "\nmail : " + mail + "\n\n" + "tel : " + phone,
    [
      { text: "OK", onPress: () => console.log("OK  Contact Pressed") }
    ]
  );
}



// Fonction de changement de statut
const chargerCommentaire = (commentaire) => {
  Alert.alert(
    "Commenaire d'Absence",
    commentaire,
    [
      { text: "OK", onPress: () => console.log("OK Commentaire d'activité") }
    ]

  );
}

// On exporte la fonction principale
export default activiteScreen;
