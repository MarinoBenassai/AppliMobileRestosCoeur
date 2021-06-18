import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

import userContext from '../../contexts/userContext';

// Fonction Principale
const referentScreen = ({navigation}) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // On importe l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // Fonction de sélection de l'activité
  function versActivite({navigation}) {
  	navigation.navigate('Activite', {
  	  IDActivite: '3', IDSite: '2', IDJour: '2021-06-14'
  	});
  }

  // On récupère les données
  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_SYN_REF/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log(texte)})
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  // On tarite les données
  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    <View>
      <Pressable onPressOut={() => versActivite({navigation})} >
      {({ pressed }) => (
        <View style={[styles.item, {color: pressed ? 'white' : 'black',},]}>
          <Text>{item.split(/\t/)[2]}</Text>
          <Text>{item.split(/\t/)[1]}</Text>
          {/* date */}
          <Text>{item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[0]}</Text>
          <Text>{item.split(/\t/)[3]}</Text>
        </View>)}
      </Pressable>
    </View>
  );

  // On retourne la flatliste
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



// Style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    justifyContent:"space-around",
    flexDirection: "row",
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
}); 


// On exporte la fonction principale
export default referentScreen;
