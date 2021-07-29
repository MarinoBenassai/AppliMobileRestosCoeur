import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput, ActionSheetIOS} from 'react-native';
import { Dimensions } from 'react-native';

import {checkFetch} from '../../components/checkFetch';
import {userContext} from '../../contexts/userContext';
import {traitementSort} from '../../components/pickerActivite';
import {traitementFilter} from '../../components/pickerActivite';
import constantes from '../../constantes';
import styles from '../../styles';
import ViewStatus from '../../components/viewStatut';

import RNPickerSelect from 'react-native-picker-select';


// Fonction Principale
function engagementScreen({navigation}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Reload
  const [upToDate, setUpToDate] = useState(false);
  
  // Pour le pop up de commentaire
  const [modalVisibleSet, setModalVisibleSet] = useState(false);

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
  
  //Paramètres des fetch
  var params = {}
  
  // Focntion de chargement de l'activité
  function versActivite({navigation}, item) {
  	navigation.navigate('Activite', {
  	  IDActivite: item.idactivite, IDSite: item.idsite, IDJour: item.jourpresence.split(" ")[0], NomActivite: item.nomactivite, NomSite: item.nomsite, idRole: (item.nomrole == "BENEVOLE") ? "1" : "2"
  	});
  }

  // On va chercher les données
  useEffect(() => {
    // Lors du focus de la page
    const unsubscribe = navigation.addListener('focus', () => {
	  setLoading(true);
      let body = new FormData();
	  params = {'P_IDBENEVOLE':userID};
	  body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch('http://' + constantes.BDD + '/APP/AP_LST_PRE_BEN/', {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((json) =>  {setData(json); console.info("Infos Engagement: chargées"); setUpToDate(true); setLoading(false)})
          .catch((error) => {setLoading(false); handleError (error)});
    });


    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    
  }, [navigation]);

  // Lors d'un changement
  useEffect(() => {
    if(upToDate == false){
      setLoading(true);
      let body = new FormData();
	  params = {'P_IDBENEVOLE':userID};
	  body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch('http://' + constantes.BDD + '/APP/AP_LST_PRE_BEN/', {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((json) =>  {setData(json); console.info("Infos Engagement: chargées"); setUpToDate(true); setLoading(false)})
          .catch((error) => {setLoading(false); handleError (error)});
    }
  }, [upToDate]);


  // on met à jour la liste visible
  useEffect(() => {

    const tr = traitementSort(picker.toUpperCase(), data, data, 1, 2, 3, 4, 6);

    setVisibleData( traitementFilter(affichage, tr) );

  }, [data, affichage]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.nomrole]]}>
      
      {/* Conteneur 1ere colonne */}
      <Pressable onPress={() => versActivite({navigation}, item)} style={{width: "75%"}} >
      {({ pressed }) => (
        <View style={{flexDirection: "column",}}>
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.nomsite}</Text>
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>{item.nomactivite}</Text> 
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>
            {item.jourpresence.split(" ")[0].split("-")[2]}/
            {item.jourpresence.split(" ")[0].split("-")[1]}/
            {item.jourpresence.split(" ")[0].split("-")[0]}
          </Text>
          <Text style={{color: pressed ? 'white' : 'black', marginLeft: 30}}>Participants : {item.nombre_present}</Text>
        </View> )}
      </Pressable>

      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <ViewStatus fctStatut={() => changerStatut(constantes.BDD, item.etat, userID, item.jourpresence, item.idactivite, item.idsite, (item.nomrole == "BENEVOLE") ? "1" : "2")}
                  fctCommentaire={() => {setModalVisibleSet(true); setComment(item.commentaire)}} //TODO get ??
                  status={item.etat} role="2" align="column-reverse"/>
      
    </View>
  );


  // Fonction de changement de statut
  const changerStatut = (bdd, statut, benevole, jour, activite, site, role) => {

    // Si absent
    if(statut == "Absent"){
      console.info("Vous êtes actuellement 'Absent'");
	    setLoading(true);
      let body = new FormData();
	  params = {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site};
	  body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch("http://" + bdd + "/APP/AP_DEL_PRESENCE/", {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) =>  {console.info("changement statut !"); console.log(texte); setUpToDate(false); setLoading(false);})
          .catch((error) => {setUpToDate(false); setLoading(false); handleError (error)});
    }

    // Si présent
    else if(statut == "Présent"){
      console.info("Vous êtes actuellement 'Présent'");

      setInfoComment([ jour, activite, site ]);
      //On rend le modal visible
      setModalVisibleSet(true);
      
      // Le traitement se fait sur le modal afin d'éviter les désynchronisations

    }

      // Si non-défini
      else{
		    setLoading(true);
        console.info("Vous êtes actuellement 'Non défini'");
        let body = new FormData();
	    params = {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site, "P_IDROLE":role };
		body.append('params',JSON.stringify(params));
        body.append('token',token);
        fetch("http://" + bdd + "/APP/AP_INS_PRESENCE/", {
          method: 'POST',
          body: body})
            .then((response) => checkFetch(response))
            .then((texte) =>  {console.info("changement statut !"); console.log(texte); setUpToDate(false); setLoading(false);})
            .catch((error) => {setUpToDate(false); setLoading(false);; handleError (error)});
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
          onRequestClose={() => {setModalVisibleSet(!modalVisibleSet); setComment("")}}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Commentaire d'Absence :</Text>
              <TextInput
                style={[styles.input, {borderWidth: 1}]}
                multiline
                numberOfLines={3}
                onChangeText={setComment}
                defaultValue={comment}
                placeholder="Raison de votre absence"
                autoCompleteType="off"
                maxLength={99}
              />

              <View style={styles.modalContactButtonView}>
                <Pressable
                  style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-end"}}
                  onPress={() => {setModalVisibleSet(!modalVisibleSet);
                                  setLoading(true);
                                  let body = new FormData();
								  params = {"P_IDBENEVOLE":userID, "P_JOURPRESENCE":infoComment[0], "P_IDACTIVITE":infoComment[1], "P_IDSITE":infoComment[2], "P_COMMENTAIRE":comment};
								  body.append('params',JSON.stringify(params));
                                  body.append('token',token);
                                  fetch("http://" + constantes.BDD + "/APP/AP_UPD_PRESENCE/", {
                                    method: 'POST',
                                    body: body})
                                      .then((response) => checkFetch(response))
                                      .then((texte) =>  {console.info("changement statut !"); console.log(texte); setUpToDate(false); setComment(""); setLoading(false);})
                                      .catch((error) => {setUpToDate(false); setComment(""); setLoading(false); handleError (error)});

                                    // On raffraichi et reset le commentaire pour la prochaine fois (au dessus)
                    
                  }}
                >
                  {({ pressed }) => (
                    <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black"}]}>Valider</Text>
                  )}
                </Pressable>

                <Pressable
                  style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-start"}}
                  onPress={() => {setModalVisibleSet(!modalVisibleSet);
                                  setComment("");}}
                >
                  {({ pressed }) => (
                    <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black"}]}>Annuler</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      
		
        <FlatList
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <>

              {/* Réordonnancement - Sélection */}
              <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20, flexDirection: "row", justifyContent: "space-between"}}>

                <RNPickerSelect
                  placeholder={{}}
                  useNativeAndroidPickerStyle={true}
                  onValueChange={(itemValue, itemIndex) =>
                    {setPicker(itemValue);
                    setVisibleData( traitementSort(itemValue, data, visibleData, 1, 2, 3, 4, 6) );}}
                  selectedValue={picker}
                  items={[
                      { label: 'date', value: 'DATE' },
                      { label: 'activite', value: 'ACTIVITE' },
                      { label: 'site', value: 'SITE' },
                      { label: 'participant', value: 'PARTICIPANT' },
                  ]}
                  style={pickerSelectStyles}
                  InputAccessoryView={() => null}
                />

                <RNPickerSelect
                  placeholder={{}}
                  useNativeAndroidPickerStyle={true}
                  onValueChange={(itemValue, itemIndex) =>
                    setAffichage(itemValue)
                  }
                  selectedValue={affichage}
                  items={[
                      { label: 'tout', value: 'TOUT' },
                      { label: 'présent', value: 'PRESENT' },
                      { label: 'absent', value: 'ABSENT' },
                      { label: 'non défini', value: 'NONDEFINI' },
                  ]}
                  style={pickerSelectStyles}
                  InputAccessoryView={() => null}
                />
                  
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


// Style
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    margin: 20,
    fontSize: 16,
    width: 160,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
  },

  inputAndroid: {
    margin: 20,
    fontSize: 16,
    width: 160,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
  },
  inputWeb: {
    margin: 20,
    fontSize: 16,
    width: 160,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
  }
});
