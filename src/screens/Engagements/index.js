import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

import userContext from '../../contexts/userContext';

// Fonction Principale
function engagementScreen({navigation}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');
  
  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // Focntion de chargement de l'activité
  function versActivite({navigation}) {
  	navigation.navigate('Activite', {
  	  IDActivite: '3', IDSite: '2', IDJour: '2021-06-14'
  	});
  }

  // On va chercher les données
  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_PRE_BEN/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log(texte)})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // On traite les données
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.split(/\t/)[3]]]}>

      {/* Conteneur 1ere colonne */}
      <Pressable onPress={() => versActivite({navigation})} >
      {({ pressed }) => (
        <View style={{flexDirection: "column",}}>
          <Text style={{color: pressed ? 'white' : 'black',}}>{item.split(/\t/)[2]}</Text>
          <Text style={{color: pressed ? 'white' : 'black',}}>{item.split(/\t/)[1]}</Text> 
          <Text style={{color: pressed ? 'white' : 'black',}}>
            {item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[0]}
          </Text>
          <Text style={{color: pressed ? 'white' : 'black',}}>Participants : {item.split(/\t/)[6]}</Text>
        </View> )}
      </Pressable>

      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <View style={{ flexDirection: "column"}}>
        <Pressable onPressOut={() => changerStatut(item.split(/\t/)[4])}>
          <Text style={{ color: (item.split(/\t/)[4] == "Absent") ? 'black' : ((item.split(/\t/)[4] == "Present") ? "green" : "red") }}>{item.split(/\t/)[4]}</Text>
        </Pressable>
        
        <Text>{item.split(/\t/)[5]}</Text>
      </View>
    </View>
  );

  // On retourne la flatliste
  return (
    <>
    <SafeAreaView style={styles.container}>
    {isLoading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#00ff00" />
      </View>) : (
      <FlatList
        data={ligne}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
      )}
    </SafeAreaView>
	</>
  );
}


// Fonction de changement de statut
const changerStatut = (statut) => {
  console.log("changerStatut" + statut);
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
});


// On exporte la fonction principale
export default engagementScreen;

