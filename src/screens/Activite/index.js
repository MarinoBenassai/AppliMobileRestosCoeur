import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput, useFocusEffect, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import RNPickerSelect from 'react-native-picker-select';
import {Linking} from 'react-native';

import {traitementSort} from '../../components/pickerActivite';
import {traitementFilter} from '../../components/pickerActivite';
import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';
import ModalContact from '../../components/modalContact';
import ViewStatus from '../../components/viewStatut';
import {checkFetch} from '../../components/checkFetch';

import { useToast } from "react-native-toast-notifications";
import * as Device from 'expo-device';

// Fonction Principale
function activiteScreen({route, navigation}) {

  // Toast
  const toast = useToast();

  const refBenef = useRef(null);

  const [myCtrl, setMyCtrl] = useState(false);
  const [myCarret, setMyCarret] = useState(0);

  // basic
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  // Reload
  const [upToDate, setUpToDate] = useState(true);
  
  // Pour le pop up de commentaire
  const [modalVisibleCommentaireAbsence, setModalVisibleCommentaireAbsence] = useState(false);
  const [modalVisibleCommentaireActivite, setmodalVisibleCommentaireActivite] = useState(false);
  const [modalVisibleContact, setmodalVisibleContact] = useState(false);

  // Pour le commentaire
  const [comment, setComment] = useState('');
  const [infoComment, setInfoComment] = useState(['', '', '', '']);

  // Commentaire d'activité
  const [infoActivite, setInfoActivite] = useState('');
  const [commentActivite, setCommentActivite] = useState('');
  const [beneficiaireActivite, setBeneficiaireActivite] = useState("0");
 
  // Mode d'affichage
  const [affichage, setAffichage] = useState("TOUT"); // ("TOUT", "PRESENT", "ABSENT", "NONDEFINI");
  const [visibleData, setVisibleData] = useState('');
  const [picker, setPicker] = useState("prenom");

  //Données pour le modal de contact
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');

  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID;
  const token = React.useContext(userContext).token;

  // On récupère les informations données en paramètres
  const { IDActivite, IDSite, IDJour, NomActivite, NomSite, idRole } = route.params;

  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;

  // Fonction de sélection de l'activité
  function versListe({navigation}, liste) {
  	navigation.navigate('ListeUtilisateur', {
  	  IDActivite: IDActivite, IDSite: IDSite, IDJour: IDJour, liste: liste
  	});
  }
  
  //Paramètres des fetch
  var params = {}

  // On va chercher les données
  useEffect(() => {
    // Lors du focus de la page
    const unsubscribe = navigation.addListener('focus', () => {
	  setLoading(true);
      let body = new FormData();
	  params = {'P_IDBENEVOLE':userID, 'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour };
	  body.append('params',JSON.stringify(params));
	  body.append('token',token);
	  fetch('http://' + constantes.BDD + '/APP/AP_LST_PRE_EQU/', {
	    method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setData(json);console.info("Infos bénévoles : chargées "); setLoading(false); setUpToDate(true)})
        .catch((error) => {setLoading(false); setUpToDate(true); handleError (error)});
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    
  }, [navigation]);

  // Lors d'un changement
  useEffect(() => {
    if(!upToDate){
	  setLoading(true);
      // Update la liste
      let body = new FormData();
	  params = {'P_IDBENEVOLE':userID, 'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour};
	  body.append('params',JSON.stringify(params));
	  body.append('token',token);
	  fetch('http://' + constantes.BDD + '/APP/AP_LST_PRE_EQU/', {
	    method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setData(json);console.info("Infos bénévoles : chargées "); setLoading(false); setUpToDate(true)})
        .catch((error) => {setLoading(false); setUpToDate(true); handleError (error)});

      // Update commentaire d'activité (dans le fetch au dessus)
    }
    
  }, [upToDate]);
  
  

  // on met à jour la liste visible
  useEffect(() => {
    
    const tr = traitementSort(picker.toUpperCase(), data, data, 0, 0, 4, 3, 0);

    setVisibleData( traitementFilter(affichage, tr, 6) );

  }, [data, affichage]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.nomrole]]}>

      {/* Conteneur 1ere colonne */}
      <View style={{ justifyContent:"space-evenly", flexDirection: "column", marginLeft: 10, paddingLeft: "5%"}}>
        <Text>{item.nom}</Text>
        <Text>{item.prenom}</Text>
      </View>
      
      <View style={{flexDirection: "row", paddingRight: "1%", justifyContent: "flex-end"}}>
        {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
        <ViewStatus fctStatut={() => changerStatut(constantes.BDD, item.etat, item.idbenevole, IDJour, IDActivite, IDSite, (item.nomrole == "BENEVOLE") ? "1" : "2")}
                    fctCommentaire={() => {setModalVisibleCommentaireAbsence(true); setComment(item.commentaire);  setInfoComment([ IDJour, IDActivite, IDSite, item.idbenevole ])}}
                    status={item.etat} role={idRole} align="row" id1={userID} id2={item.idbenevole}/>

        {/* Conteneur 3eme colonne */}

        <View style={{justifyContent: "space-evenly", marginRight: 0}}>
          <Pressable onPress={() => {setMail(item.email); setPhone(item.telephone); setmodalVisibleContact(!modalVisibleContact)} }>
            {({ pressed }) => (
              <Icon 
                name='mail' 
                size={32}
                color={pressed?'darkslategrey':'black'}
                style={styles.statusIcon}
              />
            )}
          </Pressable>
         
        </View>
      </View>
    </View>
  );


  // Fonction de changement de statut
  const changerStatut = (bdd, statut, benevole, jour, activite, site, role) => {

    // Si absent
    if(statut == "Absent"){
      console.info("Vous êtiez actuellement 'Absent'");
      let body = new FormData();
      params = {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site};
      body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch("http://" + bdd + "/APP/AP_DEL_PRESENCE/", {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) =>  {Device.brand && toastComponent("Statut : Non défini", "warning"); console.info("changement status : non défini : "); console.log(texte); setUpToDate(false)})
          .catch((error) => {setUpToDate(false); handleError (error)});
    }

    // Si présent
    else if(statut == "Présent"){
      console.info("Vous êtiez actuellement 'Présent'");

      setInfoComment([ jour, activite, site, benevole ]);
      //On rend le modal visible
      setModalVisibleCommentaireAbsence(true);
      
      // Le traitement se fait sur le modal afin d'éviter les désynchronisations

    }

    // Si non-défini
    else{
      console.info("Vous êtiez actuellement 'Non défini'");
      let body = new FormData();
	  params = {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site, "P_IDROLE":role};
	  body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch("http://" + constantes.BDD + "/APP/AP_INS_PRESENCE/", {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) =>  {Device.brand && toastComponent("Statut : Présent", "success"); console.info("changement statut : présent : "); console.log(texte); setUpToDate(false)})
          .catch((error) => {setUpToDate(false); handleError (error)});
    }
  }

  const handleChangeNumber = ( value ) => { 
    setBeneficiaireActivite( normalizeInputNumber(value, beneficiaireActivite) );
  };


  const mailAll = (  ) => { 

    var mails = "";
    for(let d of data){
      mails += d.email;
    }

    Linking.openURL(`mailto:${mails}`);
  };

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

  const fctCommentaireActivite = () => {
    setmodalVisibleCommentaireActivite(false)
    if(infoActivite == 0){
      let body = new FormData();
      params = {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour, 'P_NOMBREBENEFICIAIRE':beneficiaireActivite, 'P_COMMENTAIRE':commentActivite};
      body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch('http://' + constantes.BDD + '/APP/AP_INS_SUIVI_ACTIVITE/', {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((json) => console.log(json))
          .then(() => {console.info("Nouvelle entrée : commentaire d'activité"); setUpToDate(false)})
          .catch((error) => {setUpToDate(false); handleError (error)});
    }
    else{
      let body = new FormData();
      params = {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour, 'P_NOMBREBENEFICIAIRE':beneficiaireActivite, 'P_COMMENTAIRE':commentActivite};
      body.append('params',JSON.stringify(params));
      body.append('token',token);
      fetch('http://' + constantes.BDD + '/APP/AP_UPD_SUIVI_ACTIVITE/', {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) => console.log(texte))
          .then(() => {console.info("update entrée : commentaire d'activité "); setUpToDate(false)})
          .catch((error) => {setUpToDate(false); handleError (error)});
    }
  }

  const fctCommentaireAbsence = () => {
    setModalVisibleCommentaireAbsence(!modalVisibleCommentaireAbsence);
    let body = new FormData();
    params = {"P_IDBENEVOLE":infoComment[3], "P_JOURPRESENCE":infoComment[0], "P_IDACTIVITE":infoComment[1], "P_IDSITE":infoComment[2], "P_COMMENTAIRE":comment};
    body.append('params',JSON.stringify(params));
    body.append('token',token);
    fetch("http://" + constantes.BDD + "/APP/AP_UPD_PRESENCE/", {
      method: 'POST',
      body: body})
        .then((response) => checkFetch(response))
        .then((texte) =>  {Device.brand && toastComponent("Statut : Absent", "normal"); console.info("changement statut : absent :"); console.log(texte); setUpToDate(false); setComment("")})
        .catch((error) => {setUpToDate(false); setComment(""); handleError (error)});

  }

  // On retourne la flatlist
  return (
    <>
      <SafeAreaView style={styles.container}>	  
        <View>
	        <ModalContact visible = {modalVisibleContact} setVisible = {setmodalVisibleContact} mail = {mail} phone = {phone}/>
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleCommentaireActivite}
            onRequestClose={() => {setmodalVisibleCommentaireActivite(false)}}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Nombre de Bénéficiaire :</Text>
                <TextInput
                  style={styles.idInput}
                  onChangeText={handleChangeNumber}
                  value={beneficiaireActivite}
                  keyboardType="numeric"
                  maxLength={10}
                  onSubmitEditing={() => refBenef.current.focus()}
                />
                <Text style={styles.modalText}>Commentaire d'activité :</Text>
                <TextInput
                  ref={refBenef}
                  multiline
                  numberOfLines={3}
                  style={styles.idInput}
                  onChangeText={setCommentActivite}
                  value={commentActivite}
                  onKeyUp={(keyUp) => keyUp.keyCode == 17 && setMyCtrl(false)}
                  onKeyPress={(keyPress) => { (!myCtrl && keyPress.keyCode == 13) && fctCommentaireActivite();
                                              (keyPress.keyCode == 13) && setCommentActivite(commentActivite + "\n");
                                              keyPress.keyCode == 17 && setMyCtrl(true)} }
                  maxLength={299}
                />
                <Pressable
                  style={styles.button}
                  // écrire et envoyer le commentaire
                  onPress={() => fctCommentaireActivite()}
                >
                  {({ pressed }) => (
                    <Text style={[styles.textStyle, {color:pressed?"lightgrey":"black"}]}>Valider</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </Modal>
        

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleCommentaireAbsence}
          onRequestClose={() => {setModalVisibleCommentaireAbsence(false); setComment("")}}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Commentaire d'Absence :</Text>
              <TextInput
                multiline
                numberOfLines={3}
                value={comment}
                style={[styles.input, {borderWidth: 1}]}
                onChangeText={setComment}
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
                  // écrire et envoyer le commentaire
                  onPress={() => fctCommentaireAbsence()}
                >
                  {({ pressed }) => (
                    <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", textAlign: "center"}]}>Valider</Text>
                  )}
                </Pressable>

                <Pressable
                  style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-start"}}
                  onPress={() => {setModalVisibleCommentaireAbsence(!modalVisibleCommentaireAbsence);
                                  setComment("");}}
                >
                  {({ pressed }) => (
                    <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", textAlign: "center"}]}>Annuler</Text>
                  )}
                </Pressable>
              </View>

            </View>
          </View>
        </Modal>

        <FlatList
          data={visibleData}
          ListHeaderComponent={
            <>
              <View style={{marginTop: 16, }}>
                {/* Info générales */}
                <View style={[styles.item, {justifyContent:"flex-start", padding: 5}]}>
                  <Text style={[styles.info, {fontWeight: "bold",}]}>Activité : </Text>
                  <Text style={styles.info}>{NomActivite}</Text>
                </View>
                <View style={[styles.item, {justifyContent:"flex-start", padding: 5}]}>
                  <Text style={[styles.info, {fontWeight: "bold",}]}>Site : </Text>
                  <Text style={styles.info}>{NomSite}</Text>
                </View>
                <View style={[styles.item, {justifyContent:"flex-start", padding: 5}]}>
                  <Text style={[styles.info, {fontWeight: "bold",}]}>Jour : </Text>
                  <Text style={styles.info}>{IDJour.split(" ")[0].split("-")[2]}/
                                            {IDJour.split(" ")[0].split("-")[1]}/
                                            {IDJour.split(" ")[0].split("-")[0]}</Text>
                </View>

                {/* Icone d'administraion si référent */}
                {(idRole == "2") &&	
                  <View >

                    {/* Comentaire d'activité */}
                    <View style={[styles.item, {justifyContent:"flex-start", padding: 5, paddingTop: 40}]}>
                      <Text style={[styles.info, {fontWeight: "bold",}]}>Commentaire d'Activité : </Text>
                      <Pressable onPress={() =>  {
                          let body = new FormData();
                          params = {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour};
                          body.append('params',JSON.stringify(params));
                          body.append('token',token);
                          fetch('http://' + constantes.BDD + '/APP/AP_LST_SUIVI_ACTIVITE/', {
                            method: 'POST',
                            body: body})
                          .then((response) => checkFetch(response))
                          .then((json) =>  {if( json.length != 0 ){
                            setInfoActivite(1); console.info("Info commentaire d'activité : chargées");
                            setCommentActivite(json[0].commentaire); setBeneficiaireActivite(json[0].nombre_beneficiaire || "0");
                            setLoading(false); setUpToDate(true);}
                            else{
                              setInfoActivite(0); console.info("Info commentaire d'activité : chargées");
                              setCommentActivite(""); setBeneficiaireActivite("0");
                              setLoading(false); setUpToDate(true);
                            }})
                          .catch((error) => {setLoading(false); setUpToDate(true); handleError (error)});

                          setmodalVisibleCommentaireActivite(true)}}>
                        {({ pressed }) => (
                          <Icon 
                            name='comment-discussion' //repo
                            size={30}
                            color={pressed?'darkslategrey':'black'}
                            style={{paddingLeft: 20}}
                          />
                        )}
                      </Pressable>
                    </View>

                    {/* onPress={() => {props.setVisible(!props.visible);;}} */}
                    <View style={[styles.item, {justifyContent:"flex-start", padding: 5}]}>
                      <Text style={[styles.info, {fontWeight: "bold",}]}>Mail à tous : </Text>
                      <Pressable onPress={() => mailAll()}>
                        {({ pressed }) => (
                          <Icon 
                            name='megaphone' 
                            size={30}
                            color={pressed?'darkslategrey':'black'}
                            style={{paddingLeft: 20}}
                          />
                        )}
                      </Pressable>
                    </View>

                    {/* Ajout bénévole */}
                    <View style={[styles.item, {justifyContent:"flex-start", padding: 5, paddingBottom: 40}]}>
                      <Text style={[styles.info, {fontWeight: "bold",}]}>Ajout Bénévole : </Text>
                      <Pressable onPress={() => versListe({navigation}, data)}>
                        {({ pressed }) => (
                          <Icon 
                            name='plus' 
                            size={30}
                            color={pressed?'darkslategrey':'black'}
                            style={{paddingLeft: 20}}
                          />
                        )}
                      </Pressable>
                    </View>
                
                  </View>
                }

              </View>
              

              {/* "header" de la flatlist */}
              <View style={[ styles.item, {paddingBottom: 0, justifyContent: "flex-start", padding: 5}]}>
                <Text style={[styles.info, {fontWeight: "bold"}]}>Liste des Engagés :</Text>
              </View>

              {/* Réordonnancement - Sélection */}
              <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20, flexDirection: "row", justifyContent: "space-between"}}>
                
                <RNPickerSelect
                  placeholder={{}}
                  useNativeAndroidPickerStyle={true}
                  onValueChange={(itemValue, itemIndex) =>
                    {setPicker(itemValue);
                    setVisibleData( traitementSort(itemValue, data, visibleData, 0, 0, 4, 3, 0) );}
                  }
                  selectedValue={picker}
                  items={[
                      { label: 'prénom', value: 'PRENOM' },
                      { label: 'nom', value: 'NOM' },
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
              <View style = {[styles.header,{paddingRight: 5}]}>
                <View style={{width:'50%'}}>
                  <Text style = {[styles.headerTitle, {textAlign: "left",  marginLeft: 5}]}>Nom/Prénom</Text>
                </View>
                <View style={{width:'50%', justifyContent: "flex-end"}}>
                  <Text style = {[styles.headerTitle, {textAlign: "right", paddingRight: 20}]}>Présence/Contacter</Text>
                </View>
              </View>
            </>
          }
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
	  {isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
	  }
    </SafeAreaView>
	</>
  );
}


// Number only
const normalizeInputNumber = (value, previousValue) => {
  
  if (!value || value == 0 ) return '0';
  const currentValue = value.replace(/[^\d]/g, '');

  console.log("value : " + value);
  console.log("current : " + currentValue);
  console.log("prev : " + previousValue);

  if(previousValue == 0  && currentValue.length>1){
    return currentValue.replace(/0/g, '');
  }
  else if( currentValue.length === 0 ){
    return '0';
  }
  else if (!previousValue || value.length > previousValue.length) {
    return currentValue;
  }
  
};

// On exporte la fonction principale
export default activiteScreen;


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
