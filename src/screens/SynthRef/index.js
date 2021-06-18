import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

import userContext from '../../contexts/userContext';

const referentScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  const userID = React.useContext(userContext)

  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_SYN_REF/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log(texte)})
      .catch((error) => {
        (setData(-1));
      });
  }, []);

  const ligne = data.split(/\n/);
  ligne.shift(); //enlève le premier élement (et le retourne)
  ligne.pop();   //enlève le dernier élement (et le retourne)

  const renderItem = ({ item }) => (
    <View>
 
      <Pressable onPressOut={flog} >
      {({ pressed }) => (
        <Text style={styles.item} style={[{
          color: pressed ? 'white' : 'black',
          backgroundColor: '#f9c2ff',
          padding: 20,
          marginVertical: 8,
          marginHorizontal: 16,
         }, styles.btnText]}>
          {item.split(/\t/)[2]}{"\t\t\t"}
          {item.split(/\t/)[1]}{"\t\t\t"}
          {item.split(/\t/)[0].split(" ")[0].split("-")[2]}/
          {item.split(/\t/)[0].split(" ")[0].split("-")[1]}/
          {item.split(/\t/)[0].split(" ")[0].split("-")[0]}{"\t\t\t"} 
          {item.split(/\t/)[3]}
        </Text>)}
      </Pressable>
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
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
}); 

const flog = () => {
  console.log("oui");
}

export default referentScreen;
