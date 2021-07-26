import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput, useFocusEffect, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import {Picker} from '@react-native-picker/picker';

import {traitementSort} from '../../components/pickerActivite';
import {traitementFilter} from '../../components/pickerActivite';
import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';
import ModalContact from '../../components/modalContact';
import ViewStatus from '../../components/viewStatut';
import {checkFetch} from '../../components/checkFetch';

// Fonction Principale
function activiteScreen({route, navigation}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // Reload
  const [upToDate, setUpToDate] = useState(true);
  
  // Pour le pop up de commentaire
  const [modalVisibleAbsence, setmodalVisibleAbsence] = useState(false);
  const [modalVisibleCommentaireAbsence, setModalVisibleCommentaireAbsence] = useState(false);
  const [modalVisibleCommentaireActivite, setmodalVisibleCommentaireActivite] = useState(false);
  const [modalVisibleContact, setmodalVisibleContact] = useState(false);

  // Pour le commentaire
  const [comment, setComment] = useState('');
  const [infoComment, setInfoComment] = useState(['', '', '', '']);

  // Commentaire d'activité
  const [infoActivite, setInfoActivite] = useState('');
  const [commentActivite, setCommentActivite] = useState('');
  const [beneficiaireActivite, setBeneficiaireActivite] = useState('');
 
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
  function versListe({navigation}) {
  	navigation.navigate('ListeUtilisateur', {
  	  IDActivite: IDActivite, IDSite: IDSite, IDJour: IDJour
  	});
  }

  // On va chercher les données
  useEffect(() => {
    // Lors du focus de la page
    const unsubscribe = navigation.addListener('focus', () => {
	  setLoading(true);
    let body = new FormData();
	  body.append('token',token);
	  fetch('http://' + constantes.BDD + '/APP/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour , {
	    method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
        .then((texte) =>  {setData(texte);console.info("Infos bénévoles : chargées ")})
        .catch((error) => handleError (error))
        .finally(() => {setLoading(false); setUpToDate(true)});
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
	  body.append('token',token);
	  fetch('http://' + constantes.BDD + '/APP/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour , {
	    method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
        .then((texte) =>  {setData(texte);console.info("Infos bénévoles : chargées ")})
        .catch((error) => handleError (error))
        .finally(() => {setLoading(false); setUpToDate(true)});

      // Update commentaire d'activité (dans le fetch au dessus)
    }
    
  }, [upToDate]);
  
  

  // on met à jour la liste visible
  useEffect(() => {
    // On traite les données
    const ligne = data.split(/\n/);
    ligne.shift(); //enlève le premier élement (et le retourne)
    ligne.pop();   //enlève le dernier élement (et le retourne)
    
    const tr = traitementSort(picker.toUpperCase(), data, ligne, 0, 0, 4, 3, 0);

    setVisibleData( traitementFilter(affichage, tr, 6) );

  }, [data, affichage]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.split(/\t/)[5]] ]}>

      {/* Conteneur 1ere colonne */}
      <View style={{ justifyContent:"space-evenly", flexDirection: "column", marginLeft: 10, paddingLeft: "5%"}}>
        <Text>{item.split(/\t/)[4]}</Text>
        <Text>{item.split(/\t/)[3]}</Text>
      </View>
      
      <View style={{flexDirection: "row", paddingRight: "1%", justifyContent: "flex-end"}}>
        {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
        <ViewStatus fctStatut={() => changerStatut(constantes.BDD, item.split(/\t/)[6], item.split(/\t/)[9], IDJour, IDActivite, IDSite, (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2")}
                    fctCommentaire={() => {setModalVisibleCommentaireAbsence(true); setComment(item.split(/\t/)[7])}}
                    status={item.split(/\t/)[6]} role={idRole} align="row"/>

        {/* Conteneur 3eme colonne */}

        <View style={{justifyContent: "space-evenly", marginRight: 0}}>
          <Pressable onPress={() => {setMail(item.split(/\t/)[10]); setPhone(item.split(/\t/)[11]); setmodalVisibleContact(!modalVisibleContact)} }>
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
	    body.append('token',token);
	    fetch("http://" + bdd + "/APP/AP_DEL_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site , {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) =>  {console.info("changement status : non défini : "); console.log(texte)})
          .catch((error) => handleError (error))
          .finally(() => setUpToDate(false));
    }

    // Si présent
    else if(statut == "Présent"){
      console.info("Vous êtiez actuellement 'Présent'");

      setInfoComment([ jour, activite, site, benevole ]);
      //On rend le modal visible
      setmodalVisibleAbsence(true);
      
      // Le traitement se fait sur le modal afin d'éviter les désynchronisations

    }

    // Si non-défini
    else{
      console.info("Vous êtiez actuellement 'Non défini'");
      let body = new FormData();
      body.append('token',token);
      fetch("http://" + constantes.BDD + "/APP/AP_INS_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site + "/P_IDROLE=" + role , {
        method: 'POST',
        body: body})
          .then((response) => checkFetch(response))
          .then((texte) =>  {console.info("changement statut : présent : "); console.log(texte)})
          .catch((error) => handleError (error))
          .finally(() => setUpToDate(false));
    }
  }

  const handleChangeNumber = ( value ) => { 
    setBeneficiaireActivite( normalizeInputNumber(value, beneficiaireActivite) );
  };

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
                  defaultValue={'0'}
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Text style={styles.modalText}>Commentaire d'activité :</Text>
                <TextInput
                  style={styles.idInput}
                  onChangeText={setCommentActivite}
                  value={commentActivite}
                  maxLength={99}
                />
                <Pressable
                  style={styles.button}
                  // écrire et envoyer le commentaire
                  onPress={() => {setmodalVisibleCommentaireActivite(false)
                                  if(infoActivite.length == 0){
                                    let body = new FormData();
                                    body.append('token',token);
                                    fetch('http://' + constantes.BDD + '/APP/AP_INS_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour + '/P_NOMBREBENEFICIAIRE=' + beneficiaireActivite + '/P_COMMENTAIRE=' + commentActivite , {
                                      method: 'POST',
                                      body: body})
                                        .then((response) => checkFetch(response))
                                        .then((texte) => console.log(texte))
                                        .then(() => console.info("Nouvelle entrée : commentaire d'activité"))
                                        .catch((error) => handleError (error))
                                        .finally(() => setUpToDate(false));
                                  }
                                  else{
                                    let body = new FormData();
                                    body.append('token',token);
                                    fetch('http://' + constantes.BDD + '/APP/AP_UPD_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour + '/P_NOMBREBENEFICIAIRE=' + beneficiaireActivite + '/P_COMMENTAIRE=' + commentActivite , {
                                      method: 'POST',
                                      body: body})
                                        .then((response) => checkFetch(response))
                                        .then((texte) => console.log(texte))
                                        .then(() => console.info("update entrée : commentaire d'activité "))
                                        .catch((error) => handleError (error))
                                        .finally(() => setUpToDate(false));
                                  }
                          }}
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
          visible={modalVisibleAbsence}
          onRequestClose={() => {setmodalVisibleAbsence(false)}}
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
                // écrire et envoyer le commentaire
                onPress={() => {setmodalVisibleAbsence(!modalVisibleAbsence);
                  let body = new FormData();
				          body.append('token',token);
				          fetch("http://" + constantes.BDD + "/APP/AP_UPD_PRESENCE/P_IDBENEVOLE=" + infoComment[3] + "/P_JOURPRESENCE=" + infoComment[0] + "/P_IDACTIVITE=" + infoComment[1] + "/P_IDSITE=" + infoComment[2] + "/P_COMMENTAIRE=" + comment , {
				            method: 'POST',
				            body: body})
                      .then((response) => checkFetch(response))
                      .then((texte) =>  {console.info("changement statut : absent :"); console.log(texte)})
                      .catch((error) => handleError (error))
                      .finally(() => {setUpToDate(false); setComment("");});

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
          visible={modalVisibleCommentaireAbsence}
          onRequestClose={() => {setModalVisibleCommentaireAbsence(false); setComment("")}}
        >
            
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={[styles.modalText, {fontWeight: "bold"}]}>Commentaire d'absence</Text>
              <Text style={styles.modalText}>{comment}</Text>
              <Pressable
                  style={styles.button}
                  onPress={() => {setModalVisibleCommentaireAbsence(false)}}
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
                          body.append('token',token);
                          fetch('http://' + constantes.BDD + '/APP/AP_LST_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour , {
                            method: 'POST',
                            body: body})
                              .then((response) => checkFetch(response))
                              .then((texte) =>  {console.log(texte);setInfoActivite((texte.split("\n")[1])); console.info("Info commentaire d'activité : chargées");
                                setCommentActivite(texte.split("\n")[1].split("\t")[1]); setBeneficiaireActivite(texte.split("\n")[1].split("\t")[0])})
                              .catch((error) => handleError (error))
                              .finally(() => {setLoading(false); setUpToDate(true)});

                          setmodalVisibleCommentaireActivite(true)}}>
                        {({ pressed }) => (
                          <Icon 
                            name='repo' 
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
                      <Pressable onPress={() => versListe({navigation})}>
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
                <Picker
                  style={{height: 30, width: "50%", maxWidth: 190}}
                  selectedValue={picker}
                  onValueChange={(itemValue, itemIndex) =>
                      {setPicker(itemValue);
                      setVisibleData( traitementSort(itemValue, data, visibleData, 0, 0, 4, 3, 0) );}
                  }>

                        <Picker.Item label="nom" value="NOM" />
                        <Picker.Item label="prénom" value="PRENOM" />
                </Picker>

                <Picker
                  style={{height: 30, width: "45%", maxWidth: 180}}
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
          keyExtractor={item => item}
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
  if (!value || value == 0) return '0';
  const currentValue = value.replace(/[^\d]/g, '');

  if(previousValue == 0 && currentValue.length>0){
    return currentValue.replace(/0/g, '')
  }
  else if (!previousValue || value.length > previousValue.length) {
    return currentValue;
  }
  
};

// On exporte la fonction principale
export default activiteScreen;
