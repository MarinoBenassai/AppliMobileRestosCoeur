import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert} from 'react-native';
import {Linking} from 'react-native';

const contactScreen = () => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_CONTACT/P_IDBENEVOLE=1005')
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
    // Conteneur Principal
    <View style={styles.item}>
      {/* Conteneur 1ere colonne */}
      <View style={{ flexDirection: "column"}}>
        <Text>{item.split(/\t/)[0]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[2]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[1]}{"\t\t\t"}</Text>
      </View>
      {/* Conteneur 2eme colonne */}
      <View style={{ flexDirection: "column"}}>
        <Text>{item.split(/\t/)[3]}{"\t\t\t"}</Text>
        <Text>{item.split(/\t/)[4]}{"\t\t\t"}</Text>
      </View>
      {/* Conteneur 3eme colonne */}
      <View style={{ flexDirection: "column"}}> 
      <Pressable title="AlertContact" onPress={() => Linking.openURL(`sms:${item.split(/\t/)[6]}`)} >
        <Text>message</Text>
      </Pressable>
      <Pressable title="AlertContact" onPress={() => createContactAlert(item.split(/\t/)[7], item.split(/\t/)[6])} >
        <Text>contacter</Text>
      </Pressable>
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




const createContactAlert = (mail, phone) =>{
    Alert.alert(
      "Contact information",
      "\nmail : " + mail + "\n\n" + "tel : " + phone,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    flexDirection: "row",
    backgroundColor: '#00ffff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
}); 



export default contactScreen;
