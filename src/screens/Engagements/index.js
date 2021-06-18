import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

import userContext from '../../contexts/userContext';

const engagementScreen = () => {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  const userID = React.useContext(userContext).userID

  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_PRE_BEN/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log(texte)})
      .catch((error) => { (setData(-1)) } )
      .finally(() => setLoading(false));;
  }, []);

  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  const renderItem = ({ item }) => (
    // Conteneur Principal de chaque item
    <View style={[styles.item, styles[item.split(/\t/)[3]]]}>

      {/* Conteneur 1ere colonne */}
      <Pressable onPressOut={versActivite} >
      {({ pressed }) => (
        <View style={{flexDirection: "column"}}>
          <Text style={{color: pressed ? 'white' : 'black',}}>{item.split(/\t/)[2]}{"\t\t\t"}</Text>
          <Text style={{color: pressed ? 'white' : 'black',}}>{item.split(/\t/)[1]}{"\t\t\t"}</Text> 
          <Text style={{color: pressed ? 'white' : 'black',}}>
            {item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
            {item.split(/\t/)[0].split(" ")[0].split("-")[0]}{"\t\t\t"}
          </Text>
          <Text style={{color: pressed ? 'white' : 'black',}}>Participants : {item.split(/\t/)[6]}{"\t\t\t"}</Text>
        </View> )}
      </Pressable>

      {/* Conteneur 2eme colonne (modifiable : status + commentaire)*/}
      <View style={{ flexDirection: "column"}}>
        <Pressable onPressOut={() => changerStatut(item.split(/\t/)[4])}>
          <Text style={{ color: (item.split(/\t/)[4] == "Absent") ? 'black' : ((item.split(/\t/)[4] == "Present") ? "green" : "red") }}>{item.split(/\t/)[4]}</Text>
        </Pressable>
        
        <Text>{item.split(/\t/)[5]}{"\t\t\t"}</Text>
      </View>
    </View>
  );


  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={ligne}
        renderItem={renderItem}
        keyExtractor={item => item}
      />
    </SafeAreaView>
  );
}






const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: "row",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  BENEVOLE: {
    backgroundColor: '#6fe3d2',
  },
  REFERENT: {
    backgroundColor: '#f9c2ff',
  }
});



const versActivite = (id) => {
  console.log("versACtivité");
}

const changerStatut = (statut) => {
  console.log("changerStatut" + statut);
}

export default engagementScreen;

