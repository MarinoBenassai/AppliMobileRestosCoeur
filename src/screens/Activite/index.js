import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Modal, TextInput, useFocusEffect } from 'react-native';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';

// Fonction Principale
function activiteScreen({route, navigation}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // Reload
  const [upToDate, setUpToDate] = useState(false);
  
  // Pour le pop up de commentaire
  const [modalVisible, setModalVisible] = useState(false);

  // Pour le commentaire
  const [comment, setComment] = useState('');
  const [infoComment, setInfoComment] = useState(['', '', '', '']);

  // Commentaire d'activité
  const [commentActivite, setCommentActivite] = useState('');
  
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
      .then((texte) =>  {setData(texte); console.log("Infos Activité : chargées "); setUpToDate(true);})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
    });

    // Update la liste
    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos Activité : chargées "); setUpToDate(true);})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));

    // Update commenatire d'activité
    /*fetch('')
      .then((response) => response.text())
      .then((texte) =>  {setCommentActivite(texte); console.log("Infos Comment d'activité : chargées "); setUpToDate(true);})
      .catch((error) => console.error(error)); */ //TODO trater info après


    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    
  }, [upToDate, navigation]);

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
      <View style={{ flexDirection: "column", flexDirection: "column",}}>

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


  // On retourne la flatliste
  return (
    <>
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

    <SafeAreaView style={styles.container}>
    {isLoading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>) : (
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

            {/* info commentaire d'activité */}
            <View>
              <CommentActivite role={idRole}/>
            </View>

            {/* "header" de la flatlist */}
            <View style={{flexDirection: "row"}}>
              <Text style={[styles.item, styles.info, {fontWeight: "bold"}]}>Engagé : </Text>
              <Pressable onPress={() => versListe({navigation})} 
                         disabled={(idRole=="2") ? false : true}>
              {({ pressed }) => (
                <View style={[styles.item, {color: pressed ? 'white' : 'black',},]}>
                  <Text>Liste</Text>
                </View>)}
              </Pressable>
            </View>
          </>
        }
        renderItem={renderItem}
        keyExtractor={item => item}
      />
      )}
    </SafeAreaView>
	</>
  );
}


// Div commentActivité
function CommentActivite(props) {
  const role = props.role;
  console.log(role);
  if (role=="2"){
    return  <View>
              <View style={[styles.item, {justifyContent:"flex-start",}]}>
                <Text style={[styles.info, {fontWeight: "bold",}]}>Commentaire : </Text>
                <Pressable onPress={() => changerCommentaireActivite()}>
                  <Text style={styles.info}>placeholder...</Text>
                </Pressable>
              </View>
              <View style={[styles.item, {justifyContent:"flex-start",}]}>
                <Text style={[styles.info, {fontWeight: "bold",}]}>Nombre de bénéficiaires : </Text>
                <Pressable onPress={() => changerBeneficiaire()}>
                  <Text style={styles.info}>placeholder...</Text>
                </Pressable>
              </View>
            </View>;
      
  }
  else{
    return <></>;
  }
}

// Fonction de changement du commentaire d'activité
const changerCommentaireActivite = () => {

}

// Fonction e changement du nombre de bénéficiaire
const changerBeneficiaire = () => {
  
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
  info: {
    fontSize: 20,
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
  modalView: {
    margin: 20,
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
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

// On exporte la fonction principale
export default activiteScreen;
