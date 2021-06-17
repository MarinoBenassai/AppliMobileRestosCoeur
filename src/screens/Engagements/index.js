import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable} from 'react-native';

const engagementScreen = () => {

  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState('');

  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_PRE_BEN/P_IDBENEVOLE=1005')
      .then((response) => response.text())
      .then((texte) =>  {setData(texte); console.log(texte)})
      .catch((error) => {
        (setData(-1));
      });
  }, []);

  return(
    <Text>{data}</Text>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
    input: {
    height: 40,
	width : 200,
    margin: 12,
    borderWidth: 1,
  },
    logo: {
    width: 200,
    height: 200,
  },
});


export default engagementScreen;

