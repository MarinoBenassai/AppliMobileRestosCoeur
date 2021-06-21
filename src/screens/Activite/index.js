import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert} from 'react-native';

import {userContext} from '../../contexts/userContext';

// Fonction Principale
function activiteScreen({route}) {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');
  
  // On charge l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // On récupère les informations données en paramètres
  const { IDActivite, IDSite, IDJour } = route.params;


  // On va chercher les données
  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_PRE_EQU/P_IDBENEVOLE=' + userID + '/P_IDACTIVITE=' + IDActivite + '/P_IDSITE=' + IDSite + '/P_JOUR=' + IDJour)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos Activité : chargées")})
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
    <View style={[styles.item, styles[item.split(/\t/)[5]] ]}>

      {/* Conteneur 1ere colonne */}
      <View style={{ justifyContent:"space-evenly", flexDirection: "column",}}>
        <Text>{item.split(/\t/)[4]}</Text>
        <Text>{item.split(/\t/)[3]}</Text>
      </View>
      

      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <View style={{ flexDirection: "column", flexDirection: "column",}}>

        {/* Statut */}
        <Text style={{ color: (item.split(/\t/)[6] == "Absent") ? 'black' : 
          ((item.split(/\t/)[6] == "Présent") ? "green" : "red") }}>
            {item.split(/\t/)[6]}
        </Text>

        {/* Commentaire */}
        <Pressable onPressOut={() => chargerCommentaire(item.split(/\t/)[7])}>
          <Text>Commentaire</Text>
        </Pressable>
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
        ListHeaderComponent={
          <>
            <View style={{marginVertical: 16,}}>
              <View style={[styles.item, {justifyContent:"flex-start",}]}>
                <Text style={[styles.info, {fontWeight: "bold",}]}>Activité : </Text>
                <Text style={styles.info}>{IDActivite} + {ligne[0].split("\t")[1]}</Text>
              </View>
              <View style={[styles.item, {justifyContent:"flex-start",}]}>
                <Text style={[styles.info, {fontWeight: "bold",}]}>Site : </Text>
                <Text style={styles.info}>{IDSite} + {ligne[0].split("\t")[2]}</Text>
              </View>
              <View style={[styles.item, {justifyContent:"flex-start",}]}>
                <Text style={[styles.info, {fontWeight: "bold",}]}>Jour : </Text>
                <Text style={styles.info}>{IDJour.split(/\t/)[0].split(" ")[0].split("-")[2]}/
                                          {IDJour.split(/\t/)[0].split(" ")[0].split("-")[1]}/
                                          {IDJour.split(/\t/)[0].split(" ")[0].split("-")[0]}</Text>
              </View>
            </View>
            <View>
              <Text style={[styles.item, styles.info, {fontWeight: "bold"}]}>Engagé : </Text>
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


// Fonction de changement de statut
const chargerCommentaire = (commentaire) => {
  Alert.alert(
    "Commenaire d'Absence",
    "Penser à mettre les droits + bloqué si pas absent\n Com :" + commentaire,
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
});

// On exporte la fonction principale
export default activiteScreen;
