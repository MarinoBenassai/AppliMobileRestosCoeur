import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput} from 'react-native';
import { Dimensions } from 'react-native';
import {Picker} from '@react-native-picker/picker';

import {checkFetch} from '../../components/checkFetch';
import {userContext} from '../../contexts/userContext';
import {traitementSort} from '../../components/pickerActivite';
import {traitementFilter} from '../../components/pickerActivite';
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
  const [affichage, setAffichage] = useState("TOUT"); // ("TOUT", "PRESENT", "ABSENT", "NONDEFINI");
  const [visibleData, setVisibleData] = useState('');

  const [picker, setPicker] = useState("date");

  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token

  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;
  
  // Focntion de chargement de l'activité
  function versActivite({navigation}, item) {
  	navigation.navigate('Activite', {
  	  IDActivite: item.split(/\t/)[9], IDSite: item.split(/\t/)[10], IDJour: item.split(/\t/)[0].split(" ")[0], NomActivite: item.split(/\t/)[1], NomSite: item.split(/\t/)[2], idRole: (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2"
  	});
  }

  //Fonction pour chercher les données
  useEffect(() => {
    if(upToDate == false){
      setLoading(true);
      let body = new FormData();
      body.append('token',token);
      fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_LST_PRE_BEN/P_IDBENEVOLE=' + userID  , {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) =>  {setData(texte); console.log("Infos Engagement: chargées"); setUpToDate(true);})
          .catch((error) => handleError (error))
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
    
    const tr = traitementSort(picker.toUpperCase(), data, ligne, 1, 2, 3, 4, 6);
    

    setVisibleData( traitementFilter(affichage, tr, 4) );


  }, [data, affichage]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.split(/\t/)[3]]]}>
      
      {/* Conteneur 1ere colonne */}
      <Pressable onPress={() => versActivite({navigation}, item)} style={{width: "75%"}} >
      {({ pressed }) => (
        <View style={{flexDirection: "column",}}>
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.split(/\t/)[2]}</Text>
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.split(/\t/)[1]}</Text> 
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>
            {item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[0]}
          </Text>
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>Participants : {item.split(/\t/)[6]}</Text>
        </View> )}
      </Pressable>

      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <ViewStatus fctStatut={() => changerStatut(constantes.BDD, item.split(/\t/)[4], userID, item.split(/\t/)[0], item.split(/\t/)[9], item.split(/\t/)[10], (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2")}
                  fctCommentaire={() => {setModalVisibleGet(true); setComment(item.split(/\t/)[5])}}
                  status={item.split(/\t/)[4]} role="2" align="column-reverse"/>
      
    </View>
  );


  // Fonction de changement de statut
  const changerStatut = (bdd, statut, benevole, jour, activite, site, role) => {

    // Si absent
    if(statut == "Absent"){
      console.log("Vous ête actuellement 'Absent'");
	    setLoading(true);
      let body = new FormData();
      body.append('token',token);
      fetch("http://" + bdd + "/Axoptim.php/APP/AP_DEL_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site , {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
          .catch((error) => handleError (error))
          .finally(() => {setUpToDate(false); setLoading(false);});
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
		    setLoading(true);
        console.log("Vous êtes actuellement 'Non défini'");
        let body = new FormData();
        body.append('token',token);
        fetch("http://" + bdd + "/Axoptim.php/APP/AP_INS_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site + "/P_IDROLE=" + role , {
          method: 'POST',
          body: body})
            .then((response) => checkFetch(response))
            .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
            .catch((error) => handleError (error))
            .finally(() => {setUpToDate(false); setLoading(false);});
      }
      
      // On raffraichie les composants quoi qu'il arrive
      
  }

  // On retourne la flatliste
  return (

    <SafeAreaView style={styles.container}>
      <View style={{flex: 1}}>
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
                // TODO : envoyer le commentaire (fait?)
                onPress={() => {setModalVisibleSet(!modalVisibleSet);
                                setLoading(true);
                                let body = new FormData();
                                body.append('token',token);
                                fetch("http://" + constantes.BDD + "/Axoptim.php/APP/AP_UPD_PRESENCE/P_IDBENEVOLE=" + userID + "/P_JOURPRESENCE=" + infoComment[0] + "/P_IDACTIVITE=" + infoComment[1] + "/P_IDSITE=" + infoComment[2] + "/P_COMMENTAIRE=" + comment , {
                                  method: 'POST',
                                  body: body})
                                    .then((response) => checkFetch(response))
                                    .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
                                    .catch((error) => handleError (error))
                                    .finally(() => {setUpToDate(false); setComment(""); setLoading(false);})

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
              <Text style={[styles.modalText, {fontWeight: "bold"}]}>Commentaire d'absence</Text>
              <Text style={styles.modalText}>{comment}</Text>
              <Pressable
                  style={[styles.button, {justifyContent: "center", alignItems: "center"}]}
                  onPress={() => {setModalVisibleGet(false)}}
              >
                {({ pressed }) => (
                  <Text style={{color:pressed?'darkslategrey':'black', textAlign: "center"}}>fermer</Text>
                )}
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
              <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20, flexDirection: "row", justifyContent: "space-between"}}>

                <Picker
                  style={{height: 30, width: "45%", maxWidth: 190}}
                  selectedValue={picker}
                  onValueChange={(itemValue, itemIndex) =>
                      {setPicker(itemValue);
                      setVisibleData( traitementSort(itemValue, data, visibleData, 1, 2, 3, 4, 6) );}
                  }>

                        <Picker.Item label="date" value="DATE" />
                        <Picker.Item label="activite" value="ACTIVITE" />
                        <Picker.Item label="site" value="SITE" />
                        <Picker.Item label="participant" value="PARTICIPANT" />
                </Picker>

                <Picker
                  style={{height: 30, width: "45%", maxWidth: 190, textAlign: "right"}}
                  selectedValue={affichage}
                  onValueChange={(itemValue, itemIndex) =>
                    setAffichage(itemValue)
                  }>
                  <Picker.Item label="tout" value="TOUT" />
                  <Picker.Item label="présent" value="PRESENT" />
                  <Picker.Item label="absent" value="ABSENT" />
                  <Picker.Item label="non défini" value="NONDEFINI" />
                </Picker>
              </View>
			  
			  {/*Header de la flatlist*/}
			  <View style = {styles.header}>
			  	<View style={{width:'50%'}}>
			      <Text style = {[styles.headerTitle, {textAlign: "left",  marginLeft: 40}]}>Activité</Text>
				</View>
				<View style={{width:'50%'}}>
				  <Text style = {[styles.headerTitle, {textAlign: "right",  marginRight: 20}]}>Présence</Text>
			    </View>
  			  </View>
            </>
          }
        />
      </View>
      {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
	  }
    </SafeAreaView>

  );
}




// width: (Dimensions.get('window').width / 2) ,

// On exporte la fonction principale
export default engagementScreen;

