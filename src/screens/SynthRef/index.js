import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

import {checkFetch} from '../../components/checkFetch';
import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';
import {modeAffichage} from '../../components/modeAffichage';

// Fonction Principale
function referentScreen({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // On importe l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token

  // Mode d'affichage
  const [header, setHeader] = useState({
                                        "nomsite": "",
                                        "nomactivite": "",
                                        "jourpresence": "\u25B2",
                                        "nombre_present": "",
                                      });
  const [visibleData, setVisibleData] = useState('');
  const [ancienMode, setAncienMode] = useState("jourpresence");
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;

  //Paramètres des fetch
  var params = {}

  // Fonction de sélection de l'activité
  function versActivite({navigation}, item) {
  	navigation.navigate('Activite', {
  	  IDActivite: item.idactivite, IDSite: item.idsite, IDJour: item.jourpresence.split(" ")[0], NomActivite: item.nomactivite, NomSite: item.nomsite, idRole: '2'
  	});
  }

  // On va chercher les données
  useEffect(() => {
    // Lors du focus de la page
    const unsubscribe = navigation.addListener('focus', () => {
	  setLoading(true);
      let body = new FormData();
	  params = {'P_IDBENEVOLE':userID};
	  body.append('params',JSON.stringify(params));
	  body.append('token',token);
    fetch('http://' + constantes.BDD + '/APP/AP_LST_SYN_REF/', {
    	method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setData(json); console.info("Infos Synthèse Référent : chargées")})
        .catch((error) => handleError (error))
        .finally(() => setLoading(false));
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
    
  }, [navigation]);

  // Lors d'un changement
  useEffect(() => {
    let body = new FormData();
	  params = {'P_IDBENEVOLE':userID};
	  body.append('params',JSON.stringify(params));
	  body.append('token',token);
    fetch('http://' + constantes.BDD + '/APP/AP_LST_SYN_REF/', {
    	method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setData(json); console.info("Infos Synthèse Référent : chargées")})
        .catch((error) => handleError (error))
        .finally(() => setLoading(false));
  }, []);

  // on met à jour la liste visible initiale
  useEffect(() => {
    setVisibleData(data);
  }, [data]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
      
    <View style={[styles.item, styles.REFERENT, {paddingVertical: 10}]}>
      <Pressable onPress={() => versActivite({navigation}, item)} style={{marginVertical: 5, alignSelf: "center", width: "100%", maxWidth: 600, padding: 0, justifyContent: "space-between",}}>
      {({ pressed }) => (
        <View style={{flexDirection: "row"}}>

          {/* Conteneur 1ere colonne : site */}
          <View style={[styles.colomn, {width:'25%'}]}>
            <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.nomsite}</Text>
          </View>

          {/* Conteneur 2eme colonne : activite */}
          <View style={[styles.colomn, {width:'25%'}]}>
            <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.nomactivite}</Text>
          </View>

          {/* Conteneur 3eme colonne : date */}
          <View style={[styles.colomn, {width:'35%'}]}>
          <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>
            {item.jourpresence.split(" ")[0].split("-")[2]}/
            {item.jourpresence.split(" ")[0].split("-")[1]}/
            {item.jourpresence.split(" ")[0].split("-")[0]}</Text>
          </View>

          {/* Conteneur 4eme colonne : nb Présent */}
          <View style={[styles.colomn, {width:'15%'}]}>
            <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.nombre_present}/{item.Tous_sites}</Text>
          </View>

        </View>
      )}

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
        
          <View style={{flex: 1}}>
          
            <Synthese />
          
        
        </View>
      )}
    </SafeAreaView>
  );

  // Div Synthese //TODO: à débuger
  function Synthese(props) {

    if (visibleData.length != 0){
      return  <View style={{flex: 1}}>
          <>
            {/*Header de la liste*/}
            <View style = {styles.header}>
            <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setAncienMode, ancienMode, "nomsite", header, setHeader)}>
                <Text style = {styles.headerTitle}>Site {header[0]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setAncienMode, ancienMode, "nomactivite", header, setHeader)}>
                <Text style = {styles.headerTitle}>Activité {header[1]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setAncienMode, ancienMode, "jourpresence", header, setHeader)}>
                <Text style = {styles.headerTitle}>Date {header[2]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setAncienMode, ancienMode, "nombre_present", header, setHeader)}>
                <Text style = {styles.headerTitle}>Site{header[3]} /Global</Text>
              </Pressable>

            </View>

            <FlatList
              data={visibleData}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </>
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

}




// On exporte la fonction principale
export default referentScreen;
