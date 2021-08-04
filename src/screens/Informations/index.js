import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Modal, TextInput} from 'react-native';
import {Linking} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

import {checkFetch} from '../../components/checkFetch';
import {userContext} from '../../contexts/userContext';
import ModalContact from '../../components/modalContact';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
function informationScreen({navigation}) {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [visibleData, setVisibleData] = useState("");
  const [data, setData] = useState([]);
  const [dataEngagement, setDataEngagement] = useState([]);

  const [upToDate, setUpToDate] = useState(false);
  
  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;
  
  //Paramètres des fetch
  var params = {}

  // on va chercher les informations sur la BDD
  useEffect(() => {
    let body = new FormData();
    params = {'P_IDBENEVOLE':userID};
    body.append('params',JSON.stringify(params));
    body.append('token',token);
    fetch('http://' + constantes.BDD + '/APP/AP_LST_INFO/' , {
      method: 'POST',
      body: body})
        .then((response) => checkFetch(response))
        .then((json) =>  {setData(json); console.info("Infos Informations : chargées"); setLoading(false)})
        .catch((error) => {setLoading(false); handleError (error)});
  }, []);


  // on met à jour la liste visible initiale
  useEffect(() => {
    //if(upToDate){
        setVisibleData( traiter(data) );
    //}
  }, [data, dataEngagement]);

  

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={[{justifyContent: "center"}, styles.item, (item.idrole==2)?styles.REFERENT:(item.idrole==0)?styles.GENERAL:styles.BENEVOLE]}>
        <Pressable onPress={() => handleClick(item.lien)}>
            <Text>{item.commentaire}</Text>
        </Pressable>
    </View>
  );


  // On filtre les informations
  const traiter = () => {
      var liste2 = [];
      for(var i=0; i<data.length; i++){
        const liste3 = dataEngagement.filter( (l) => ( (l.idrole == data[i].idrole || data[i].idrole == "0") && (l.idactivite == data[i].idactivite || data[i].idactivite == "0") ) );
        if(liste3.length > 0){
            liste2.push(data[i]);
        }
    }


      return liste2;
    }


  const handleClick = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };


  // on retourne la flatliste
  return (
    <>
    <SafeAreaView style={styles.container}>
      {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#00ff00" />
          </View>) : (
      <>

        <View style={{flex: 1, alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20}}>
            <FlatList
                data={visibleData}
                renderItem={renderItem}
                keyExtractor={(item, index) => (index.toString())}
                //ListHeaderComponent={}
            />
        </View>

      </>
      )}
    </SafeAreaView>
	</>
  );

}

// On exporte la fonction principale
export default informationScreen;

