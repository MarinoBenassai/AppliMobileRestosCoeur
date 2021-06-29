import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
function referentScreen({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // On importe l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  // Fonction de sélection de l'activité
  function versActivite({navigation}, item) {
  	navigation.navigate('Activite', {
  	  IDActivite: item.split(/\t/)[4], IDSite: item.split(/\t/)[5], IDJour: item.split(/\t/)[0].split(" ")[0], NomActivite: item.split(/\t/)[1], NomSite: item.split(/\t/)[2], idRole: '2'
  	});
  }

  // On récupère les données
  useEffect(() => {
    fetch('http://' + constantes.BDD + '/Axoptim.php/REQ/AP_LST_SYN_REF/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log("Infos Synthèse Réferent : chargées")})
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
      <Pressable onPress={() => versActivite({navigation}, item)} >
      {({ pressed }) => (
        <View style={[styles.item, styles.REFERENT, {color: pressed ? 'white' : 'black',},]}>
		  <View style = {{width: '25%'}}>
            <Text>{item.split(/\t/)[2]}</Text>
		  </View>
		  <View style = {{width: '25%'}}>
            <Text>{item.split(/\t/)[1]}</Text>
		  </View>
          {/* date */}
		  <View style = {{width: '25%'}}>
            <Text>{item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
              {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
              {item.split(/\t/)[0].split(" ")[0].split("-")[0]}</Text>
		  </View>
		  <View style = {{width: '25%'}}>
            <Text>{item.split(/\t/)[3]}/x</Text>
		  </View>
        </View>)}
      </Pressable>
    </View>
  );

  // On retourne la flatliste
  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>) : (
        <View>
          <Synthese ligne={ligne} loading={isLoading} renderItem={renderItem}/>
        </View>
      )}
    </SafeAreaView>
  );

}


// Div Synthese
function Synthese(props) {
  const ligne = props.ligne;
  const isLoading = props.loading;
  const renderItem = props.renderItem;
  if (ligne.length != 0){
    return  <View>
              <FlatList
                data={ligne}
                renderItem={renderItem}
                keyExtractor={item => item}
              />
            </View>;
      
  }
  else{
    return <View>
              <Text style={styles.item}>
                Il semblerait que vous ne soyez référent d'aucune activité pour le moment.
              </Text>
            </View>;

  }
}

// On exporte la fonction principale
export default referentScreen;
