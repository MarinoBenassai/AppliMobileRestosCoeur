import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

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

  

  return (
    <Text>{data}</Text>
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



export default contactScreen;
