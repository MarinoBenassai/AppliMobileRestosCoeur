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
  const [indexActif, setIndexActif] = useState(0); // index du split
  const [indexHeader, setIndexHeader] = useState(2); // index visuel du header actif
  const [header, setHeader] = useState(["", "", "\u25B2", ""]);
  const [visibleData, setVisibleData] = useState('');
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;

  // Fonction de sélection de l'activité
  function versActivite({navigation}, item) {
  	navigation.navigate('Activite', {
  	  IDActivite: item.split(/\t/)[5], IDSite: item.split(/\t/)[6], IDJour: item.split(/\t/)[0].split(" ")[0], NomActivite: item.split(/\t/)[1], NomSite: item.split(/\t/)[2], idRole: '2'
  	});
  }

  // On récupère les données
  useEffect(() => {
    let body = new FormData();
	body.append('token',token);
    fetch('http://' + constantes.BDD + '/APP/AP_LST_SYN_REF/P_IDBENEVOLE=' + userID , {
    	method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
        .then((texte) =>  {setData(texte); console.info("Infos Synthèse Référent : chargées")})
        .catch((error) => handleError (error))
        .finally(() => setLoading(false));
  }, []);

  // on met à jour la liste visible initiale
  useEffect(() => {
    const ligne = data.split(/\n/);
    ligne.shift(); //enlève le premier élement (et le retourne)
    ligne.pop();   //enlève le dernier élement (et le retourne)
    setVisibleData(ligne);
    console.log(ligne);
  }, [data]);

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
      
    <View style={[styles.item, styles.REFERENT, {paddingVertical: 10}]}>
      <Pressable onPress={() => versActivite({navigation}, item)} style={{marginVertical: 5, alignSelf: "center", width: "100%", maxWidth: 600, padding: 0, justifyContent: "space-between",}}>
      {({ pressed }) => (
        <View style={{flexDirection: "row"}}>

          {/* Conteneur 1ere colonne : info personne */}
          <View style={[styles.colomn, {width:'25%'}]}>
            <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.split(/\t/)[2]}</Text>
          </View>

          {/* Conteneur 2eme colonne : info lieu */}
          <View style={[styles.colomn, {width:'25%'}]}>
            <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.split(/\t/)[1]}</Text>
          </View>

          {/* Conteneur 3eme colonne : contacter */}
          <View style={[styles.colomn, {width:'35%'}]}>
          <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[0]}</Text>
          </View>

          {/* Conteneur 4eme colonne : nb Présent */}
          <View style={[styles.colomn, {width:'15%'}]}>
            <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.split(/\t/)[3]}/{item.split(/\t/)[4]}</Text>
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
          <>
            {/*Header de la liste*/}
            <View style = {styles.header}>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => {console.log("clique");modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 2, "SITE", indexHeader, setIndexHeader, 0, header, setHeader)}}>
                <Text style = {styles.headerTitle}>Site {header[0]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 1, "ACTIVITE", indexHeader, setIndexHeader, 1, header, setHeader)}>
                <Text style = {styles.headerTitle}>Activité {header[1]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 0, "DATE", indexHeader, setIndexHeader, 2, header, setHeader)}>
                <Text style = {styles.headerTitle}>Date {header[2]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 3, "PARTICIPANT", indexHeader, setIndexHeader, 3, header, setHeader)}>
                <Text style = {styles.headerTitle}>Local{header[3]} /Global</Text>
              </Pressable>
            </View>

            <FlatList
              data={visibleData}
              renderItem={renderItem}
              keyExtractor={item => item}
            />
          </>
        
        </View>
      )}
    </SafeAreaView>
  );

  // Div Synthese //TODO: à débuger
  function Synthese(props) {
    /* const ligne = props.ligne;
    const isLoading = props.loading;
    const renderItem = props.renderItem;

    const data = props.data;
    const visibleData = props.visibleData;
    const setVisibleData = props.setVisibleData;
    const setIndexActif= props.setIndexActif;
    const indexActif = props.indexActif;
    const indexHeader = props.indexHeader;
    const setIndexHeader = props.setIndexHeader;
    const header = props.header;
    const setHeader = props.setHeader; */

    if (visibleData.length != 0){
      return  <View style={{flex: 1}}>
          <>
            {/*Header de la liste*/}
            <View style = {styles.header}>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => {console.log("clique");modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 2, "SITE", indexHeader, setIndexHeader, 0, header, setHeader)}}>
                <Text style = {styles.headerTitle}>Site {header[0]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 1, "ACTIVITE", indexHeader, setIndexHeader, 1, header, setHeader)}>
                <Text style = {styles.headerTitle}>Activité {header[1]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 0, "DATE", indexHeader, setIndexHeader, 2, header, setHeader)}>
                <Text style = {styles.headerTitle}>Date {header[2]}</Text>
              </Pressable>
              <Pressable style={{width:'25%', justifyContent: 'center'}} onPress={() => modeAffichage(data, visibleData, setVisibleData, setIndexActif, indexActif, 3, "PARTICIPANT", indexHeader, setIndexHeader, 3, header, setHeader)}>
                <Text style = {styles.headerTitle}>Local{header[3]} /Global</Text>
              </Pressable>

            </View>

            <FlatList
              data={visibleData}
              renderItem={renderItem}
              keyExtractor={item => item}
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


{/* <Pressable onPress={() => versActivite({navigation}, item)} style={{marginVertical: 5, alignSelf: "center", width: "100%", maxWidth: 600, padding: 0, justifyContent: "space-between",}} >
      {({ pressed }) => (
        <View style={[styles.item, styles.REFERENT]}>
          <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center", width: '25%'}}>{item.split(/\t/)[2]}</Text>
    
          <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center", width: '25%'}}>{item.split(/\t/)[1]}</Text>

          <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center", width: '35%'}}>{item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[0]}</Text>

          <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center", width: '15%'}}>{item.split(/\t/)[3]}/x</Text>

        </View>
        )}
      </Pressable> */}