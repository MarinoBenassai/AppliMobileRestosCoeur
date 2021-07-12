import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

import {checkFetch} from '../../components/checkFetch';
import {userContext} from '../../contexts/userContext';
import constantes from '../../constantes';
import styles from '../../styles';

// Fonction Principale
function referentScreen({navigation}) {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  // On importe l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID
  const token = React.useContext(userContext).token

  // Fonction de sélection de l'activité
  function versActivite({navigation}, item) {
  	navigation.navigate('Activite', {
  	  IDActivite: item.split(/\t/)[4], IDSite: item.split(/\t/)[5], IDJour: item.split(/\t/)[0].split(" ")[0], NomActivite: item.split(/\t/)[1], NomSite: item.split(/\t/)[2], idRole: '2'
  	});
  }

  // On récupère les données
  useEffect(() => {
    let body = new FormData();
	body.append('token',token);
    fetch('http://' + constantes.BDD + '/Axoptim.php/APP/AP_LST_SYN_REF/P_IDBENEVOLE=' + userID , {
    	method: 'POST',
	    body: body})
        .then((response) => checkFetch(response))
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

         {/*  {/* Conteneur 5eme colonne : nb Présent 
          <View style={[styles.colomn, {width:'8%'}]}>
            <Text style= {{color: pressed ? 'white' : 'black',textAlign: "center"}}>{item.split(/\t/)[4]}/x</Text>
          </View> */}

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
			  <>
		      {/*Header de la liste*/}
			  <View style = {styles.header}>
			    <View style={{width:'25%', justifyContent: 'center'}}>
				    <Text style = {styles.headerTitle}>Site</Text>
			    </View>
			    <View style={{width:'25%', justifyContent: 'center'}}>
				    <Text style = {styles.headerTitle}>Activité</Text>
			    </View>
			    <View style={{width:'35%', justifyContent: 'center'}}>
				    <Text style = {styles.headerTitle}>Date</Text>
			    </View>
				  <View style={{width:'15%', justifyContent: 'center'}}>
				    <Text style = {styles.headerTitle}>Local/ Global</Text>
			    </View>
          {/* <View style={{width:'12%', justifyContent: 'center'}}>
				    <Text style = {styles.headerTitle}>Nb total</Text>
			    </View> */}
			  </View>

        <FlatList
          data={ligne}
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