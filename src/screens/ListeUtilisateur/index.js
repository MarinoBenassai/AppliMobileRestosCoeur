import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert, Linking, TextInput} from 'react-native';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';

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
        <Pressable title="AlertContact" onPress={() => createContactAlert(item.split(/\t/)[2], item.split(/\t/)[3])} >
          <Text>contacter</Text>
        </Pressable>
        <Pressable title="EnvoieSMSContact" onPress={() => Linking.openURL(`sms:${item.split(/\t/)[3]}`)} >
          <Text>message</Text>
        </Pressable>
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
const createContactAlert = (mail, phone) => {
    Alert.alert(
      "Contact information",
      "\nmail : " + mail + "\n\n" + "tel : " + phone,
      [
        { text: "OK", onPress: () => console.log("OK  Contact Pressed") }
      ]
    );
}




// styles
const styles = StyleSheet.create({
  
  // le conteneur
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },

  conteneur: {
    backgroundColor: '#00ffff',
    padding: 10,
    marginVertical: 8,
  },
  // chaque item de la flatlist
  item: {
    justifyContent:"space-around",
    flexDirection: "row",
    backgroundColor: '#00ffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },

  // chaque colonne d'un item de la flatlist
  colomn: { 
    flexDirection: "column", 
    marginVertical: 8, 
    justifyContent:"space-around",
  },

  // chaque colonne d'un item de la flatlist
  colomn: { 
    flexDirection: "column", 
    marginVertical: 8, 
    justifyContent:"space-around",
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
  input: {
    marginVertical: 4,
    marginHorizontal: -10,
  },
}); 


// On exporte la fonction principale
export default listeUtilisateurScreen;
