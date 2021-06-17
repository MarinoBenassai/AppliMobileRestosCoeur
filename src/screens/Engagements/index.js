import React from 'react';
import { StyleSheet, Button, Text, View, Image, TextInput} from 'react-native';

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


export default function engagementScreen() {
	return (
	  <View style={styles.container}>
	    <Text>Ceci est l'écran des engagements</Text>
	  </View>
	);	
}

