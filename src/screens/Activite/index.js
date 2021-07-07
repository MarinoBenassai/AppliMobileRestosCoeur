import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput, useFocusEffect } from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';
import {Picker} from '@react-native-picker/picker';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';
import ModalContact from '../../components/modalContact';
import ViewStatus from '../../components/viewStatut';

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
  const [affichage, setAffichage] = useState("ALPHABETIQUE"); // ("ALPHABETIQUE", "PRESENT", "ABSENT", "NONDEFINI");
  const [visibleData, setVisibleData] = useState('');

  //Données pour le modal de contact
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');

  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID;
  const token = React.useContext(userContext).token;

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
	  setLoading(true);
      let body = new FormData();
	  body.append('token',token);
	  fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour , {
	  method: 'POST',
	  body: body})
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos bénévoles : chargées ");})
      .then(() => {
	  let body = new FormData();
	  body.append('token',token);
	  return fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_LST_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour , {
	  method: 'POST',
	  body: body})
	  })
      .then((response) => response.text())
      .then((texte) =>  {console.log(texte);setInfoActivite(texte.split("\n")[1]); console.log("Info commentaire d'activité : chargées");
      setCommentActivite(texte.split("\n")[1].split("\t")[1]); setBeneficiaireActivite(texte.split("\n")[1].split("\t")[0])})

      .catch((error) => console.error(error))
      .finally(() => {setLoading(false); setUpToDate(true)});
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    
  }, [navigation]);

  // On va chercher le commentaire d'activité
  useEffect(() => {
    if(!upToDate){
	  setLoading(true);
      // Update la liste et les info Activité
      let body = new FormData();
	  body.append('token',token);
	  fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour , {
	  method: 'POST',
	  body: body})
        .then((response) => response.text())
        .then((texte) =>  {setData(texte); console.log("Infos bénévoles : chargées ");})
        .then(() => {
			let body = new FormData();
			body.append('token',token);
			return fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_LST_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour , {
			method: 'POST',
			body: body})
		})
        .then((response) => response.text())
        .then((texte) =>  {console.log(texte);setInfoActivite(""); console.log("Info commentaire d'activité : chargées");
          setCommentActivite(texte.split("\n")[1].split("\t")[1]); setBeneficiaireActivite(texte.split("\n")[1].split("\t")[0])})
        
        .catch((error) => console.error(error))
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
    
    if(affichage == "ALPHABETIQUE"){
      setVisibleData( ligne );
    }
    else if(affichage == "PRESENT") {
      setVisibleData( ligne.filter( (l) => ( l.split("\t")[6] == "Présent" ) ) );
    }
    else if(affichage == "ABSENT") {
      setVisibleData( ligne.filter( (l) => ( l.split("\t")[6] == "Absent" ) ) );
    }
    else if (affichage == "NONDEFINI") {
      setVisibleData( ligne.filter( (l) => ( l.split("\t")[6] == "Non défini" ) ) );
    }
    else{
      console.log("ERREUR : Affichage inconnu dans useEffect");
    }

  }, [data, affichage]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.split(/\t/)[5]] ]}>

      {/* Conteneur 1ere colonne */}
      <View style={{ justifyContent:"space-evenly", flexDirection: "column",}}>
        <Text>{item.split(/\t/)[4]}</Text>
        <Text>{item.split(/\t/)[3]}</Text>
      </View>
      
      <View style={{flexDirection: "row", marginRight: 20}}>
      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <ViewStatus fctStatut={() => changerStatut(constantes.BDD, item.split(/\t/)[6], item.split(/\t/)[9], IDJour, IDActivite, IDSite, (item.split(/\t/)[3] == "BENEVOLE") ? "1" : "2")}
                  fctCommentaire={() => {setModalVisibleCommentaireAbsence(true); setComment(item.split(/\t/)[7])}}
                  status={item.split(/\t/)[6]} role={idRole} align="row"/>

        {/* Conteneur 3eme colonne */}

        <View style={{justifyContent: "space-evenly", marginRight: 0}}>
          <Pressable>
            {({ pressed }) => (
              <Icon 
                name='mail' 
                size={32}
                color={pressed?'darkslategrey':'black'}
                onPress={() => {setMail(item.split(/\t/)[10]); setPhone(item.split(/\t/)[11]); setmodalVisibleContact(!modalVisibleContact)} }
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
      console.log("Vous êtiez actuellement 'Absent'");
      let body = new FormData();
	  body.append('token',token);
	  fetch("http://" + bdd + "/Axoptim.php/APP/AP_DEL_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site , {
	  method: 'POST',
	  body: body})
        .then((response) => response.text())
        .then((texte) =>  {console.log("changement status : non défini : "); console.log(texte)})
        .catch((error) => console.error(error))
        .finally(() => setUpToDate(false));
    }

    // Si présent
    else if(statut == "Présent"){
      console.log("Vous êtiez actuellement 'Présent'");

      setInfoComment([ jour, activite, site, benevole ]);
      //On rend le modal visible
      setmodalVisibleAbsence(true);
      
      // Le traitement se fait sur le modal afin d'éviter les désynchronisations

    }

      // Si non-défini
      else{
        console.log("Vous êtiez actuellement 'Non défini'");
        let body = new FormData();
		body.append('token',token);
		fetch("http://" + constantes.BDD + "/Axoptim.php/APP/AP_INS_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + jour + "/P_IDACTIVITE=" + activite + "/P_IDSITE=" + site + "/P_IDROLE=" + role , {
		method: 'POST',
		body: body})
          .then((response) => response.text())
          .then((texte) =>  {console.log("changement statut : présent : "); console.log(texte)})
          .catch((error) => console.error(error))
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
                  keyboardType="numeric"
                  maxLength={10}
                />
                <Text style={styles.modalText}>Commentaire d'activité :</Text>
                <TextInput
                  style={styles.idInput}
                  onChangeText={setCommentActivite}
                  defaultValue={commentActivite}
                  maxLength={99}
                />
                <Pressable
                  style={styles.button}
                  // écrire et envoyer le commentaire
                  onPress={() => {setmodalVisibleCommentaireActivite(false)
                                  if(infoActivite.length == 0){
                                    let body = new FormData();
									body.append('token',token);
									fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_INS_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour + '/P_NOMBREBENEFICIAIRE=' + beneficiaireActivite + '/P_COMMENTAIRE=' + commentActivite , {
									method: 'POST',
									body: body})
                                    .then((response) => response.text())
                                    .then((texte) => console.log(texte))
                                    .then(() => console.log("Nouvelle entrée : commentaire d'activité"))
                                    .catch((error) => console.error(error))
                                    .finally(() => setUpToDate(false));
                                  }
                                  else{
                                    let body = new FormData();
									body.append('token',token);
									fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_UPD_SUIVI_ACTIVITE/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour + '/P_NOMBREBENEFICIAIRE=' + beneficiaireActivite + '/P_COMMENTAIRE=' + commentActivite , {
									method: 'POST',
									body: body})
                                    .then((response) => response.text())
                                    .then((texte) => console.log(texte))
                                    .then(() => console.log("update entrée : commentaire d'activité "))
                                    .catch((error) => console.error(error))
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
				  fetch("http://" + constantes.BDD + "/Axoptim.php/APP/AP_UPD_PRESENCE/P_IDBENEVOLE=" + infoComment[3] + "/P_JOURPRESENCE=" + infoComment[0] + "/P_IDACTIVITE=" + infoComment[1] + "/P_IDSITE=" + infoComment[2] + "/P_COMMENTAIRE=" + comment , {
				  method: 'POST',
				  body: body})
                  .then((response) => response.text())
                  .then((texte) =>  {console.log("changement statut : absent :"); console.log(texte)})
                  .catch((error) => console.error(error))
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
              <Text style={styles.modalText}>Commentaire d'absence</Text>
              <Text style={styles.modalText}>{comment}</Text>
              <Pressable
                  style={styles.button}
                  onPress={() => {setModalVisibleCommentaireAbsence(false)}}
              >
                {({ pressed }) => (
                  <Text style={[styles.modalText, {color:pressed?'darkslategrey':'black'}]}>fermer</Text>
                )}
              </Pressable>
            </View>
          </View>
        </Modal>

        <FlatList
          data={visibleData}
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
                <Text style={[styles.info, {fontWeight: "bold"}]}>Liste des Engagés :</Text>
                {(idRole == "2") &&	
                  <View style={{flexDirection: "row"}}>

                    {/* Comentaire d'activité */}
                    <Pressable>
                      {({ pressed }) => (
                        <Icon 
                          name='repo' 
                          size={30}
                          color={pressed?'darkslategrey':'black'}
                          onPress={() =>  setmodalVisibleCommentaireActivite(true)}
                          style={{paddingRight: 20}}
                        />
                      )}
                    </Pressable>
                    
                    {/* Ajout bénévole */}
                    <Pressable>
                      {({ pressed }) => (
                        <Icon 
                          name='plus' 
                          size={30}
                          color={pressed?'darkslategrey':'black'}
                          onPress={() => versListe({navigation})}
                          style={{paddingLeft: 20, paddingRight: 20}}
                        />
                      )}
                    </Pressable>
                
                  </View>
                }
              </View>

              {/* Réordonnancement - Sélection */}
              <View style={{alignSelf: "center", width: "100%", maxWidth: 550}}>
                <Picker
                  style={{height: 30, width: "45%", maxWidth: 180, alignSelf: "flex-end"}}
                  selectedValue={affichage}
                  onValueChange={(itemValue, itemIndex) =>
                    setAffichage(itemValue)
                  }>
                  <Picker.Item label="alphabétique" value="ALPHABETIQUE" />
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
  if (!value) return value;
  const currentValue = value.replace(/[^\d]/g, '');

  if (!previousValue || value.length > previousValue.length) {
    return currentValue;
  }
  
};

// On exporte la fonction principale
export default activiteScreen;
