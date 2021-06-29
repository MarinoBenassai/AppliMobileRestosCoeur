import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Modal, TextInput} from 'react-native';
import { Dimensions } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';
import ViewStatus from '../../components/viewStatut';

// Fonction Principale
function engagementScreen({navigation}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // Reload
  const [upToDate, setUpToDate] = useState(false);
  
  // Pour le pop up de commentaire
  const [modalVisibleSet, setModalVisibleSet] = useState(false);
  const [modalVisibleGet, setModalVisibleGet] = useState(false);

  // Pour le commentaire
  const [comment, setComment] = useState('');
  const [infoComment, setInfoComment] = useState(['', '', '']);

  // Mode d'affichage
  const [affichage, setAffichage] = useState("CHRONOLOGIQUE"); // ("CHRONOLOGIQUE", "PRESENT", "ABSENT", "NONDEFINI");
  const [visibleData, setVisibleData] = useState('');

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
    if(upToDate == false){
      fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_PRE_BEN/P_IDBENEVOLE=' + userID)
        .then((response) => response.text())
        .then((texte) =>  {setData(texte); console.log("Infos Engagement: chargées"); setUpToDate(true);})
        .catch((error) => console.error(error))
        .finally(() => setLoading(false));
    }
  }, [upToDate]);


  // on met à jour la liste visible
  useEffect(() => {
    // On traite les données
    const ligne = data.split(/\n/);
    ligne.shift(); //enlève le premier élement (et le retourne)
    ligne.pop();   //enlève le dernier élement (et le retourne)
    console.log("debut affichage");
    if(affichage == "CHRONOLOGIQUE"){
      setVisibleData( ligne );
    }
    else if(affichage == "PRESENT") {
      setVisibleData( ligne.filter( (l) => ( l.split("\t")[4] == "Présent" ) ) );
    }
    else if(affichage == "ABSENT") {
      setVisibleData( ligne.filter( (l) => ( l.split("\t")[4] == "Absent" ) ) );
    }
    else if (affichage == "NONDEFINI") {
      setVisibleData( ligne.filter( (l) => ( l.split("\t")[4] == "Non défini" ) ) );
    }
    else{
      console.log("ERREUR : Affichage inconnu dans useEffect");
    }

  }, [data, affichage]);

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
      <ViewStatus fctStatut={() => changerStatut(constantes.BDD, item.split(/\t/)[4], userID, item.split(/\t/)[0], item.split(/\t/)[9], item.split(/\t/)[10], (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2")}
                  fctCommentaire={() => {setModalVisibleGet(true); setComment(item.split(/\t/)[5])}}
                  status={item.split(/\t/)[4]} role="2" align="column"/>
      
    </View>
  );


  // Fonction de changement de statut
  const changerStatut = (bdd, statut, benevole, jour, activite, site, role) => {

    // Si absent
    if(statut == "Absent"){
      console.log("Vous ête actuellement 'Absent'");
      fetch("http://" + bdd + "/Axoptim.php/REQ/AP_DEL_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site)
        .then((response) => response.text())
        .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
        .catch((error) => console.error(error))
        .finally(() => setUpToDate(false));
    }

    // Si présent
    else if(statut == "Présent"){
      console.log("Vous ête actuellement 'Présent'");

      setInfoComment([ jour, activite, site ]);
      //On rend le modal visible
      setModalVisibleSet(true);
      
      // Le traitement se fait sur le modal afin d'éviter les désynchronisations

    }

      // Si non-défini
      else{
        console.log("Vous êtes actuellement 'Non défini'");
        fetch("http://" + bdd + "/Axoptim.php/REQ/AP_INS_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site + "/P_IDROLE=" + role)
          .then((response) => response.text())
          .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
          .catch((error) => console.error(error))
          .finally(() => setUpToDate(false));
      }
      
      // On raffraichie les composants quoi qu'il arrive
      
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
          visible={modalVisibleSet}
          onRequestClose={() => {setModalVisibleSet(!modalVisibleSet)}}
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
                onPress={() => {setModalVisibleSet(!modalVisibleSet);
                  fetch("http://" + constantes.BDD + "/Axoptim.php/REQ/AP_UPD_PRESENCE/P_IDBENEVOLE=" + userID + "/P_JOURPRESENCE=" + infoComment[0] + "/P_IDACTIVITE=" + infoComment[1] + "/P_IDSITE=" + infoComment[2] + "/P_COMMENTAIRE=" + comment)
                  .then((response) => response.text())
                  .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
                  .catch((error) => console.error(error))
                  .finally(() => {setUpToDate(false); setComment("");})

                  // On raffraichi et reset le commentaire pour la prochaine fois (au dessus - finally)
                  
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
          visible={modalVisibleGet}
          onRequestClose={() => {setModalVisibleGet(false); setComment("")}}
        >
            
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Commentaire d'absence</Text>
              <Text style={styles.modalText}>{comment}</Text>
              <Pressable
                  style={styles.button}
                  onPress={() => {setModalVisibleGet(false)}}
              >
                <Text style={styles.modalText}>fermer</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
        
        <FlatList
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={item => item}
          ListHeaderComponent={
            <>
              {/* Réordonnancement - Sélection */}
              <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20}}>
                <Picker
                  style={{height: 30, width: "50%", maxWidth: 190, alignSelf: "flex-end"}}
                  selectedValue={affichage}
                  onValueChange={(itemValue, itemIndex) =>
                    setAffichage(itemValue)
                  }>
                  <Picker.Item label="chronologique" value="CHRONOLOGIQUE" />
                  <Picker.Item label="présent" value="PRESENT" />
                  <Picker.Item label="absent" value="ABSENT" />
                  <Picker.Item label="non défini" value="NONDEFINI" />
                </Picker>
              </View>
            </>
          }
        />
      </View>
      )}
    </SafeAreaView>

  );
}




// width: (Dimensions.get('window').width / 2) ,

// On exporte la fonction principale
export default engagementScreen;

