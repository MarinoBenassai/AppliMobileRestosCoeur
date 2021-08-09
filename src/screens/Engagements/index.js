import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, ImageBackground, ScrollView} from 'react-native';
import {SafeAreaView, Pressable, Modal, TextInput} from 'react-native';

import {userContext} from '../../contexts/userContext';
import { useToast } from "react-native-toast-notifications";

//import {traitementFilter} from '../../components/pickerActivite';
//import RNPickerSelect from 'react-native-picker-select';

import styles from '../../styles';
import ViewStatus from '../../components/viewStatut';
import * as Device from 'expo-device';
import logoVide from '../../../assets/logovide.png';


// Fonction Principale
function engagementScreen({navigation}) {

  // Toast
  const toast = useToast();

  const [myCtrl, setMyCtrl] = useState(false);
  const [myCarret, setMyCarret] = useState(0);

  // basic
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Reload
  const [upToDate, setUpToDate] = useState(true);
  
  // Pour le pop up de commentaire
  const [modalVisibleSet, setModalVisibleSet] = useState(false);

  // Pour le commentaire
  const [comment, setComment] = useState('');
  const [infoComment, setInfoComment] = useState(['', '', '']);

  // Mode d'affichage
  const [visibleData, setVisibleData] = useState('');
  //const [affichage, setAffichag] = useState("TOUT");

  //const [picker, setPicker] = useState("date");

  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;
  
  //Fonction de communication avec l'API
  const sendAPI = React.useContext(userContext).sendAPI;
  
  //Affichage ou non du menu synthese referent
  const setReferent = React.useContext(userContext).setReferent;
  
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
	  sendAPI('APP', 'AP_LST_PRE_BEN', {'P_IDBENEVOLE':userID})
	  .then((json) =>  {setData(json); console.info("Infos Engagement: chargées"); setUpToDate(true); setLoading(false)})
	  .catch((error) => {setLoading(false);handleError (error)});
    });


    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    
  }, [navigation]);

  useEffect(() => {
	sendAPI('APP', 'AP_LST_SYN_REF', {'P_IDBENEVOLE':userID})
	.then(data => setReferent(data.length !== 0))
    .catch((error) => handleError (error));
  }, []);



  // Lors d'un changement
  useEffect(() => {
    if(upToDate == false){
      setLoading(true);
	  sendAPI('APP', 'AP_LST_PRE_BEN', {'P_IDBENEVOLE':userID})
	  .then((json) =>  {setData(json); console.info("Infos Engagement: chargées"); setUpToDate(true); setLoading(false)})
	  .catch((error) => {setLoading(false); handleError (error)});
    }
  }, [upToDate]);


  // on met à jour la liste visible
  useEffect(() => {

    //const tr = traitementSort(picker.toUpperCase(), data, data, 1, 2, 3, 4, 6);

    setVisibleData( data ); //traitementFilter(affichage, data) );

  }, [data]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    <View style={[styles.item, styles[item.nomrole], {paddingVertical: 0}]}>
      <Pressable onPress={() => versActivite({navigation}, item)} style={{marginVertical: 5, alignSelf: "center", width: "100%", maxWidth: 600, padding: 0, justifyContent: "space-between",}}>
        {({ pressed }) => (
        <View style={{flexDirection: "row"}}>

          {/* Conteneur 1ere colonne : site */}
          <View style={[styles.colomn, {width:'33%'}]}>
            <Text style={{color: pressed ? 'white' : 'black',textAlign: "center", fontSize: 12}}>{item.nomsite}</Text>
            <Text style={{color: pressed ? 'white' : 'black', textAlign: "center", fontSize: 12}}>{item.nomactivite}</Text> 
          </View>

          {/* Conteneur 2eme colonne : jour */}
          <View style={[styles.colomn, {width:'33%'}]}>
          <Text style={{color: pressed ? 'white' : 'black', textAlign: "center", fontSize: 12}}>
              {item.jourpresence.split(" ")[0].split("-")[2]}/
              {item.jourpresence.split(" ")[0].split("-")[1]}/
              {item.jourpresence.split(" ")[0].split("-")[0]}
            </Text>
            <Text style={{color: pressed ? 'white' : 'black', textAlign: "center", fontSize: 12}}>Participants : {item.nombre_present}</Text>
          </View>

          {/* Conteneur 3eme colonne : statut */}
          <View style={[styles.colomn, {width:'33%'}]}>
            <ViewStatus fctStatut={() => changerStatut(item.etat, userID, item.jourpresence, item.idactivite, item.idsite, (item.nomrole == "BENEVOLE") ? "1" : "2")}
                        fctCommentaire={() => {setModalVisibleSet(true); setComment(item.commentaire); setInfoComment([ item.jourpresence, item.idactivite, item.idsite ])}} //TODO get ??
                        status={item.etat} role="2" align="row" id1={userID} id2={userID} commentaire = {item.commentaire}/>
          </View>

        </View>
        )}
      </Pressable>
    </View>
  );


  // Fonction de changement de statut
  const changerStatut = (statut, benevole, jour, activite, site, role) => {

    // Si absent
    if(statut == "Absent"){
      console.info("Vous êtiez actuellement : 'Absent'");
      setLoading(true);
      sendAPI('APP', 'AP_DEL_PRESENCE', {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site})
      .then((texte) =>  {Device.brand && toastComponent("Statut : Non défini", "warning"); console.info("changement statut !"); console.log(texte); setUpToDate(false); setLoading(false);})
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
        console.info("Vous étiez actuellement 'Non défini'");
        sendAPI('APP', 'AP_INS_PRESENCE', {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site, "P_IDROLE":role})
        .then((texte) =>  {Device.brand && toastComponent("Statut : Présent", "success"); console.info("changement statut !"); console.log(texte); setUpToDate(false); setLoading(false);})
        .catch((error) => {setUpToDate(false); setLoading(false); handleError (error)});
      }
      
      // On raffraichie les composants quoi qu'il arrive
      
  }

  // Affiche le toast
  const toastComponent = (texte, type) => {
        
    toast.show(texte, {
        type: type,
        position: "bottom",
        duration: 2000,
        offset: 30,
        animationType: "zoom-in",
      });
  };

  // Met le commentaire d'absence
  const fctCommentaireAbsence = () => {
    setModalVisibleSet(!modalVisibleSet);
    setLoading(true);
    sendAPI('APP', 'AP_UPD_PRESENCE', {"P_IDBENEVOLE":userID, "P_JOURPRESENCE":infoComment[0], "P_IDACTIVITE":infoComment[1], "P_IDSITE":infoComment[2], "P_COMMENTAIRE":comment})
    .then((texte) =>  {Device.brand && toastComponent("Statut : Absent", "normal"); console.info("changement statut !"); console.log(texte); setUpToDate(false); setComment(""); setLoading(false);})
    .catch((error) => {setUpToDate(false); setComment(""); setLoading(false); handleError (error)});

    // On raffraichi et reset le commentaire pour la prochaine fois (au dessus)
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
          <ScrollView >
            <View style={styles.centeredView}>
              <ImageBackground source={logoVide} resizeMode="cover" style={styles.modalContactView} imageStyle={styles.modalContactView2}>
                <Text style={styles.modalContactTitle}>Commentaire d'Absence :</Text>
                <TextInput
                  style={[styles.input, {borderWidth: 1}]}
                  multiline
                  numberOfLines={3}
                  onChangeText={setComment}
                  value={comment}
                  placeholder="Raison de votre absence"
                  autoCompleteType="off"
                  onSelectionChange={(event) => setMyCarret(event.nativeEvent.selection.end)}
                  onKeyUp={(keyUp) => keyUp.keyCode == 17 && setMyCtrl(false)}
                  onKeyPress={(keyPress) => { (!myCtrl && keyPress.keyCode == 13) && fctCommentaireAbsence();
                                              (keyPress.keyCode == 13) && setComment(comment.slice(0, myCarret) + "\n" + comment.slice(myCarret));
                                              keyPress.keyCode == 17 && setMyCtrl(true)} }
                  maxLength={999}
                />

                <View style={styles.modalContactButtonView}>
                  <Pressable
                    style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-end"}}
                    onPress={() =>  fctCommentaireAbsence()}
                  >
                    {({ pressed }) => (
                      <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", fontWeight: "bold"}]}>Valider</Text>
                    )}
                  </Pressable>

                  <Pressable
                    style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-start"}}
                    onPress={() => {setModalVisibleSet(!modalVisibleSet);
                                    setComment("");}}
                  >
                    {({ pressed }) => (
                      <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", fontWeight: "bold"}]}>Annuler</Text>
                    )}
                  </Pressable>
                </View>
              </ImageBackground>
            </View>
          </ScrollView>
        </Modal>
      
		
        <FlatList
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={(item, index) => (index.toString())}
          ListHeaderComponent={
            <>

              {/* Réordonnancement - Sélection */}
              {/* <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20, flexDirection: "row", justifyContent: "space-between"}}>

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
                  
              </View> */}
			  
              {/*Header de la flatlist*/}
              <View style = {styles.header}>
                <View style={{width:'33%'}}>
                  <Text style = {[styles.headerTitle, {textAlign: "center"}]}>Activité</Text>
                </View>
                <View style={{width:'33%'}}>
                  <Text style = {[styles.headerTitle, {textAlign: "center"}]}>Infos</Text>
                </View>
                <View style={{width:'33%'}}>
                  <Text style = {[styles.headerTitle, {textAlign: "center"}]}>Présence</Text>
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
/* const pickerSelectStyles = StyleSheet.create({
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
    paddingHorizontal: 2,
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
 */