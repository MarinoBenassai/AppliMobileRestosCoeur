import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert} from 'react-native';
import {Linking} from 'react-native';

import userContext from '../../contexts/userContext';

// Fonction Principale
const contactScreen = () => {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // on va chercher les informations sur la BDD
  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_CONTACT/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos Contact Référent : chargées")})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // On traite ces informations
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={styles.item}>

      {/* Conteneur 1ere colonne : info personne */}
      <View style={styles.colomn}>
        <Text>{item.split(/\t/)[3]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[4]}{"\t\t\t"}</Text>
      </View>

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={styles.colomn}>
        <Text>{item.split(/\t/)[0]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[2]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[1]}{"\t\t\t"}</Text>
      </View>

      {/* Conteneur 3eme colonne : contacter */}
      <View style={styles.colomn}> 
        <Pressable title="AlertContact" onPress={() => createContactAlert(item.split(/\t/)[7], item.split(/\t/)[6])} >
          <Text>contacter</Text>
        </Pressable>
        <Pressable title="EnvoieSMSContact" onPress={() => Linking.openURL(`sms:${item.split(/\t/)[6]}`)} >
          <Text>message</Text>
        </Pressable>
      </View>
    </View>
  );

  // on retourne la flatliste
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={ligne}
          renderItem={renderItem}
          keyExtractor={item => item}
        />
      )}
    </SafeAreaView>
  );

}


// Fonction d'affichage pop-up des informations de contact
const createContactAlert = (mail, phone) =>{
    Alert.alert(
      "Contact information",
      "\nmail : " + mail + "\n\n" + "tel : " + phone,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
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
}); 


// On exporte la fonction principale
export default contactScreen;
