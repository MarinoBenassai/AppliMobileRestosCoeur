import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, Pressable} from 'react-native';
import {Linking} from 'react-native';

import {userContext} from '../../contexts/userContext';
import {sendAPI} from '../../components/sendAPI';
import styles from '../../styles';

// Fonction Principale
function informationScreen({navigation}) {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [visibleData, setVisibleData] = useState("");
  const [data, setData] = useState([]);
  
  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID;
  const token = React.useContext(userContext).token;
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;

  // on va chercher les informations sur la BDD
  useEffect(() => {
    setLoading(true);
    sendAPI('APP', 'AP_LST_INFO', {'P_IDBENEVOLE':userID},token)
      .then((json) =>  {setData(json); setLoading(false)})
      .catch((error) => {setLoading(false); handleError (error)});
  }, []);


  // on met à jour la liste visible initiale
  useEffect(() => {
        setVisibleData( (data) );

  }, [data]);

  

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    
        <Pressable onPress={() => handleClick(item.lien)} style={[{justifyContent: "center"}, styles.item, (item.idrole==2)?styles.REFERENT:(item.idrole==0)?styles.GENERAL:styles.BENEVOLE]}>
          {({ pressed }) => (
            <Text style={{color: pressed?"white":"black"}}>{item.commentaire}</Text>
          )}
        </Pressable>
    
  );



  const handleClick = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        //TODO erreur
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

