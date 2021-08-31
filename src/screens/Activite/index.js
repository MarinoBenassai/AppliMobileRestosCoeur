import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, View, ScrollView, ImageBackground} from 'react-native';
import {SafeAreaView, Pressable, Modal, TextInput} from 'react-native';
import {Linking} from 'react-native';

import {traitementFilter} from '../../components/pickerActivite';
import {userContext} from '../../contexts/userContext';

import { useToast } from "react-native-toast-notifications";
import {sendAPI} from '../../components/sendAPI';
//import RNPickerSelect from 'react-native-picker-select';

import Icon from 'react-native-vector-icons/Octicons';
import * as Device from 'expo-device';

import constantes from '../../constantes';
import styles from '../../styles';
import ModalContact from '../../components/modalContact';
import ViewStatus from '../../components/viewStatut';

import logoVide from '../../../assets/logovide.png';


// Fonction Principale
function activiteScreen({route, navigation}) {

  // Toast
  const toast = useToast();

  const refBenef = useRef(null);
  //const refMailTxt = useRef(null);

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
  const [modalVisibleMailATous, setModalVisibleMailATous] = useState(false);

  // Icone
  const [icone, setIcone] = useState('person');

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
  //const [picker, setPicker] = useState("prenom");

  //Données pour le modal de contact
  const [mail, setMail] = useState('');
  const [phone, setPhone] = useState('');

  // Mail Txt
  const [idDestinataire, setIdDestinataire] = useState();

  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID;
  const token = React.useContext(userContext).token;
  
  // On récupère les informations données en paramètres
  const { IDActivite, IDSite, IDJour, NomActivite, NomSite, idRole } = route.params;

  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;

  // On récupère la fonction pour gérer le modal d'Email
  const fctModalMail = React.useContext(userContext).fctModalMail;

  // Fonction de sélection de l'activité
  function versListe({navigation}, liste) {
  	navigation.navigate('ListeUtilisateur', {
  	  IDActivite: IDActivite, IDSite: IDSite, IDJour: IDJour, liste: liste
  	});
  }

  // On va chercher les données
  useEffect(() => {
    // Lors du focus de la page
    const unsubscribe = navigation.addListener('focus', () => {
	  setLoading(true);
	  sendAPI('APP', 'AP_LST_PRE_EQU', {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour },token)
	  .then((json) =>  {setData(json); setLoading(false); setUpToDate(true)})
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
	  sendAPI('APP', 'AP_LST_PRE_EQU', {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour},token)
      .then((json) =>  {setData(json); setLoading(false); setUpToDate(true)})
      .catch((error) => {setLoading(false); setUpToDate(true); handleError (error)});

      // Update commentaire d'activité (dans le fetch au dessus)
    }
    
  }, [upToDate]);
  
  

  // on met à jour la liste visible
  useEffect(() => {
    
    //const tr = traitementSort(picker.toUpperCase(), data, data, 0, 0, 4, 3, 0);

    setVisibleData( traitementFilter(affichage, data, 6) );

  }, [data, affichage]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.nomrole]]}>

      {/* Conteneur 1ere colonne */}
      <View style={{ justifyContent:"space-evenly", flexDirection: "column", marginLeft: 10, paddingLeft: "5%"}}>
        <Text>{item.prenom}</Text>
        <Text>{item.nom}</Text>
      </View>
      
      <View style={{flexDirection: "row", paddingRight: "1%", justifyContent: "flex-end"}}>
        {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
        <ViewStatus fctStatut={() => changerStatut(constantes.BDD, item.etat, item.idbenevole, IDJour, IDActivite, IDSite, (item.nomrole == "BENEVOLE") ? "1" : "2")}
                    fctCommentaire={() => {setModalVisibleCommentaireAbsence(true); setComment(item.commentaire);  setInfoComment([ IDJour, IDActivite, IDSite, item.idbenevole ])}}
                    status={item.etat} role={idRole} align="row" id1={userID} id2={item.idbenevole} commentaire = {item.commentaire}/>

        {/* Conteneur 3eme colonne */}

        <View style={{justifyContent: "space-evenly", marginRight: 0}}>
          <Pressable onPress={() => {setMail(item.email); setPhone(item.telephone); setIdDestinataire(item.idbenevole); setmodalVisibleContact(!modalVisibleContact)} }>
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
      sendAPI('APP', 'AP_DEL_PRESENCE', {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site},token)
      .then((texte) =>  {Device.brand && toastComponent("Statut : Non défini", "warning"); setUpToDate(false)})
      .catch((error) => {setUpToDate(false); handleError (error)});
    }

    // Si présent
    else if(statut == "Présent"){

      setInfoComment([ jour, activite, site, benevole ]);
      //On rend le modal visible
      setModalVisibleCommentaireAbsence(true);
      
      // Le traitement se fait sur le modal afin d'éviter les désynchronisations

    }

    // Si non-défini
    else{
	  sendAPI('APP', 'AP_INS_PRESENCE', {"P_IDBENEVOLE":benevole, "P_JOURPRESENCE":jour, "P_IDACTIVITE":activite, "P_IDSITE":site, "P_IDROLE":role},token)
	  .then((texte) =>  {Device.brand && toastComponent("Statut : Présent", "success"); setUpToDate(false)})
	  .catch((error) => {setUpToDate(false); handleError (error)});
    }
  }

  const handleChangeNumber = ( value ) => { 
    setBeneficiaireActivite( normalizeInputNumber(value, beneficiaireActivite) );
  };

  // retourne la liste des ids des bénévoles
  const listeID = () => { 

    var ids = []
    for(let d of data){
      if(d.idbenevole != userID){
        ids.push(d.idbenevole);
      }
    }

    return ids;
  };

  // préparation des numéro pour envoie collectif
  const smsAll = (  ) => { 

    var phones = "";
    for(let d of data){
      phones += d.telephone + ",";
    }
    phones = phones.slice(0, -1);

    const url = (Platform.OS === 'android')
    ? `sms:${phones}?body=`
    : `sms:/open?addresses=${phones}&body=`;

  Linking.canOpenURL(url).then((supported) => {
    if (!supported) {
      //TOTO : erreur
    } else {
      Linking.openURL(url).then(() => {
      });
    }
  }).catch();
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

  const fctCommentaireActivite = () => {
    setmodalVisibleCommentaireActivite(false)
    if(infoActivite == 0){
	  sendAPI('APP', 'AP_INS_SUIVI_ACTIVITE', {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour, 'P_NOMBREBENEFICIAIRE':beneficiaireActivite, 'P_COMMENTAIRE':commentActivite},token)
	  .then(() =>  setUpToDate(false))
	  .catch((error) => {setUpToDate(false); handleError (error)});
    }
    else{
	  sendAPI('APP', 'AP_UPD_SUIVI_ACTIVITE', {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour, 'P_NOMBREBENEFICIAIRE':beneficiaireActivite, 'P_COMMENTAIRE':commentActivite},token)
	  .then(() => setUpToDate(false))
	  .catch((error) => {setUpToDate(false); handleError (error)});
    }
  }

  const fctCommentaireAbsence = () => {
    setModalVisibleCommentaireAbsence(!modalVisibleCommentaireAbsence);
    sendAPI('APP', 'AP_UPD_PRESENCE', {"P_IDBENEVOLE":infoComment[3], "P_JOURPRESENCE":infoComment[0], "P_IDACTIVITE":infoComment[1], "P_IDSITE":infoComment[2], "P_COMMENTAIRE":comment},token)
	.then((json) =>  {Device.brand && toastComponent("Statut : Absent", "normal"); setUpToDate(false); setComment("")})
	.catch((error) => {setUpToDate(false); setComment(""); handleError (error)});

  }

  // change l'affichage
  const changeAffichage = () => {
    if(affichage == "TOUT"){
      setAffichage("PRESENT");
      setIcone("check");
    }
    else if(affichage == "PRESENT"){
      setAffichage("ABSENT");
      setIcone("x");
    }
    else if(affichage == "ABSENT"){
      setAffichage("NONDEFINI");
      setIcone("unverified");
    }
    else{
      setAffichage("TOUT");
      setIcone("person");
    }
    
    
  }

  // On retourne la flatlist
  return (
    <>
      <SafeAreaView style={styles.container}>	  
        <View style={{flex: 1}}>
	        <ModalContact idDestinataire={idDestinataire} visible={modalVisibleContact} setVisible={setmodalVisibleContact} mail={mail} phone={phone}/>
          
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisibleCommentaireActivite}
            onRequestClose={() => {setmodalVisibleCommentaireActivite(false)}}
          >
            <ScrollView >
              <View style={styles.centeredView}>
                <ImageBackground source={logoVide} resizeMode="cover" style={[styles.modalContactView, {width: 500, maxWidth: "95%"}]} imageStyle={styles.modalContactView2}>
                  <Text style={styles.modalContactTitle}>Nombre de Bénéficiaire :</Text>
                  <TextInput
                    style={[styles.input, {borderWidth: 1, width:"100%"}]}
                    onChangeText={handleChangeNumber}
                    value={beneficiaireActivite}
                    keyboardType="numeric"
                    maxLength={10}
                    onSubmitEditing={() => refBenef.current.focus()}
                  />
                  <Text style={styles.modalContactTitle}>Commentaire d'activité :</Text>
                  <TextInput
                    ref={refBenef}
                    multiline
                    numberOfLines={3}
                    style={[styles.input, {borderWidth: 1, width:"100%", minHeight: 100}]}
                    onChangeText={setCommentActivite}
                    value={commentActivite}
                    onKeyUp={(keyUp) => keyUp.keyCode == 17 && setMyCtrl(false)}
                    onKeyPress={(keyPress) => { (!myCtrl && keyPress.keyCode == 13) && fctCommentaireActivite();
                                                (keyPress.keyCode == 13) && setCommentActivite(commentActivite + "\n");
                                                keyPress.keyCode == 17 && setMyCtrl(true)} }
                    maxLength={299}
                  />
                  <View style={styles.modalContactContentView}>
                    <Pressable
                      style={styles.button}
                      // écrire et envoyer le commentaire
                      onPress={() => fctCommentaireActivite()}
                    >
                      {({ pressed }) => (
                        <Text style={[styles.textStyle, {color:pressed?"lightgrey":"black", fontWeight: "bold"}]}>Valider</Text>
                      )}
                    </Pressable>
                  </View>
                </ImageBackground>
              </View>
            </ScrollView>
          </Modal>
        

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleCommentaireAbsence}
          onRequestClose={() => {setModalVisibleCommentaireAbsence(false); setComment("")}}
        >
          <ScrollView >
            <View style={styles.centeredView}>
              <ImageBackground source={logoVide} resizeMode="cover" style={styles.modalContactView} imageStyle={styles.modalContactView2}>
                <Text style={styles.modalContactTitle}>Commentaire d'Absence :</Text>
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
                      <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", textAlign: "center", fontWeight: "bold"}]}>Valider</Text>
                    )}
                  </Pressable>

                  <Pressable
                    style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-start"}}
                    onPress={() => {setModalVisibleCommentaireAbsence(!modalVisibleCommentaireAbsence);
                                    setComment("");}}
                  >
                    {({ pressed }) => (
                      <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", textAlign: "center", fontWeight: "bold"}]}>Annuler</Text>
                    )}
                  </Pressable>
                </View>
              </ImageBackground>
            </View>
          </ScrollView>
        </Modal>


        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleMailATous}
          onRequestClose={() => {setModalVisibleMailATous(false)}}
        >
          <View style={styles.centeredView}>
            <ImageBackground source={logoVide} resizeMode="cover" style={styles.modalContactView} imageStyle={styles.modalContactView2}>
              <Text style={styles.modalContactTitle}>Contacter tout le monde :</Text>
              
              <View style={[styles.modalContactButtonView, {minHeight: 100}]}>
                <Pressable
                  style={{alignSelf: "center", padding: 10}}
                  onPress={() => setModalVisibleMailATous(false)}
                >
                  {({ pressed }) => (
                    <View>
                      <Text style={{color:pressed?"lightgrey":"black", fontWeight: "bold"}}>ANNULER</Text>
                    </View>
                  )}
                </Pressable>
                {Device.brand && <Pressable
                  style={{alignSelf: "center", padding: 10}}
                  onPress={() => {setModalVisibleMailATous(false); smsAll()}}
                >
                  {({ pressed }) => (
                    <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", fontWeight: "bold"}]}>SMS</Text>
                  )}
                </Pressable>}
                <Pressable
                  style={{alignSelf: "center", padding: 10}}
                  onPress={() => {setModalVisibleMailATous(false); fctModalMail(listeID())}}
                >
                  {({ pressed }) => (
                    <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", fontWeight: "bold"}]}>MAIL</Text>
                  )}
                </Pressable>
              </View>
              
            </ImageBackground>
          </View>
        </Modal>


        <FlatList
          data={visibleData}
          ListHeaderComponent={
            <>
              <View style={{justifyContent:"flex-start", padding: 0}}>
                {/* Info générales */}
                <View style={[styles.item, styles.activite, {justifyContent: "center", paddingTop: 10}]}>
                  <Text>
                    <Text>Activité de </Text>
                    <Text style={{fontWeight: "bold"}}>{NomActivite} </Text>
                    <Text>à </Text>
                    <Text style={{fontWeight: "bold"}}>{NomSite} </Text>
                    <Text>le </Text>
                    <Text style={{fontWeight: "bold"}}>{IDJour.split(" ")[0].split("-")[2]}/
                                                        {IDJour.split(" ")[0].split("-")[1]}/
                                                        {IDJour.split(" ")[0].split("-")[0]} </Text>
                  </Text>

                </View>
                <View style={[styles.ligne, styles.browser]}/>

                {/* Icone d'administraion si référent */}
                {(idRole == "2") &&	
                  <View>

                    <View style={[styles.item, styles.activite, {justifyContent: "space-evenly"}]}>

                      <Pressable onPress={() =>  {
                        sendAPI('APP', 'AP_LST_SUIVI_ACTIVITE', {'P_IDACTIVITE':IDActivite, 'P_IDSITE':IDSite, 'P_JOUR':IDJour},token)
                        .then((json) =>  {if( json.length != 0 ){
                          setInfoActivite(1);
                          setCommentActivite(json[0].commentaire); setBeneficiaireActivite(json[0].nombre_beneficiaire || "0");
                          setLoading(false); setUpToDate(true);}
                          else{
                            setInfoActivite(0);
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
                            />
                          )}
                      </Pressable>

                      <Pressable onPress={() => setModalVisibleMailATous(true)}>
                        {({ pressed }) => (
                          <Icon 
                            name='megaphone' 
                            size={30}
                            color={pressed?'darkslategrey':'black'}
                          />
                        )}
                      </Pressable>

                      <Pressable onPress={() => versListe({navigation}, data)}>
                        {({ pressed }) => (
                          <Icon 
                            name='plus'
                            size={30}
                            color={pressed?'darkslategrey':'black'}
                          />
                        )}
                      </Pressable>

                      <Pressable onPress={() => changeAffichage()}>
                        {({ pressed }) => (
                          <Icon 
                            name={icone}
                            size={30}
                            color={pressed?'darkslategrey':'black'}
                          />
                        )}
                      </Pressable>
                    
                    </View>
                    <View style={[styles.ligne, styles.browser]}/>
                  </View>
                  
                }

              </View>
              

              {/* "header" de la flatlist */}
              {/* <View style={[ styles.item, styles.activite, {paddingLeft: 10}]}>
                <Text style={[styles.info, {fontWeight: "bold"}]}>Liste des Engagés :</Text>
              </View> */}

              {/* Réordonnancement - Sélection */}
              {/* <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 5, flexDirection: "row", justifyContent: "space-between"}}>
                
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

              </View> */}


              {/*Header de la flatlist*/}
              <View style = {[styles.header,{paddingRight: 5}]}>
                <View style={{width:'50%'}}>
                  <Text style = {[styles.headerTitle, {textAlign: "left",  marginLeft: 5}]}>Prénom/Nom</Text>
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

  if(previousValue == 0  && currentValue.length>1){
    return currentValue.replace(/0/g, '');
  }
  else if( currentValue.length === 0 ){
    return '0';
  }
  else {
    return currentValue;
  }
  
};

// On exporte la fonction principale
export default activiteScreen;


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
 */