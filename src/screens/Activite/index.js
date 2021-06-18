import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, Alert} from 'react-native';
import {Linking} from 'react-native';

import userContext from '../../contexts/userContext';

const activiteScreen = ({route}) => {
  const userID = React.useContext(userContext).userID

  const { IDActivite, IDSite, IDJour } = route.params;

  return (
    <Text style = {styles.container}>
		{"Ceci est l'ecran des activites. IDActivite=" + IDActivite + ", IDJour= " + IDJour + ", IDSite=" + IDSite}
    </Text>
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
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    borderBottomLeftRadius: 50,
  },
  title: {
    fontSize: 32,
  },
}); 



export default activiteScreen;
