import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Linking, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
function listeUtilisateurScreen({route, navigation: { goBack }}) {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // Bénévole à chercher
  const [ajout, setAjout] = useState('');
  const [visibleData, setVisibleData] = useState('');

  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // On récupère les informations données en paramètres
  const { IDActivite, IDSite, IDJour } = route.params;

  // on va chercher les informations sur la BDD
  useEffect(() => {
    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_ALL_BENEVOLE')
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Liste Utilisateurs : chargées")})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // On traite ces informations
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  // on met à jour la liste visible
  useEffect(() => {
    
    setVisibleData( ligne.filter( (nom) => ( nom.toLowerCase().startsWith(ajout.toLowerCase()) ) ) )

    //setVisibleData( ligne.map((nom) => (nom.toLowerCase().includes(ajout.toLowerCase()) ? nom : none)) );
  }, [ajout]);


  //Fonction d'ajout de bénévole
  const ajouterBenevole = (benevole) => {
    console.log("Vous avez ajouter l'id : " + benevole + " " + IDJour + " " + IDActivite + " " + IDSite);
      fetch("http://" + constantes.BDD + "/Axoptim.php/REQ/AP_INS_PRESENCE/P_IDBENEVOLE=" + benevole + "/P_JOURPRESENCE=" + IDJour + "/P_IDACTIVITE=" + IDActivite + "/P_IDSITE=" + IDSite + "/P_IDROLE=1")
        .then((response) => response.text())
        .then((texte) =>  {console.log("changement statut !"); console.log(texte)})
        .then( () => goBack() )
        .catch((error) => console.error(error));
  }
  

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={styles.item}>
      {/* Conteneur 1ere colonne : info personne */}
      <View style={styles.colomn}>
        <Pressable onPress={() => ajouterBenevole(item.split(/\t/)[4])}>
        {({ pressed }) => (
          <View style={{color: pressed ? 'white' : 'black',}}>
            <Text>{item.split(/\t/)[0]}</Text>
            <Text>{item.split(/\t/)[1]}</Text>
          </View>
        )}
        </Pressable>
      </View>

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={styles.colomn}> 
        <Icon 
          name='mail' 
          size={30}
          color='#000'
          onPress={() => createContactAlert(item.split(/\t/)[2], item.split(/\t/)[3])}
        />
      </View>
    </View>
  );

  // on retourne la flatliste
  return (
    <>
    <SafeAreaView style={styles.container}>
    {isLoading ? (
        <View style={styles.loading}>
         <ActivityIndicator size="large" color="green" />
	      </View>) : (
        <FlatList
          data={visibleData}
          renderItem={renderItem}
          keyExtractor={item => item}
          ListHeaderComponent={
            <>
              <View>
                <TextInput
                  style={[, styles.input, styles.item, {backgroundColor: "#ebe0c3"}]}
                  onChangeText={text => setAjout(text)}
                  placeholder="Nom du bénévole à ajouter :"
                />
              </View>
            </>
          }
        />
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
      { text: "OK", onPress: () => console.log("OK  Contact Pressed") },
      { text: "sms", onPress: () => Linking.openURL(`sms:${phone}`) },
      { text: "mail", onPress: () => Linking.openURL(`mailto:${mail}`) }
    ]
  );
}

// On exporte la fonction principale
export default listeUtilisateurScreen;
