import React from 'react';
import { StyleSheet, Button, Text, View, Image, TextInput} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import IdScreen from './src/screens/Identification';
import compteScreen from './src/screens/Compte';
import contactScreen from './src/screens/Contacts';
import engagementScreen from './src/screens/Engagements';
import referentScreen from './src/screens/SynthRef';

const Stack = createStackNavigator();

export default function App() {
  const [userID,setUserID] = React.useState("");
  
  const check_password = () => {
	
    setUserID("1234");
  }
  
  return (
    <NavigationContainer>
      <Stack.Navigator>
	  {userID === "" ? (
	    <Stack.Screen name="Identification">
		  {(props) => (
            <IdScreen onSignIn={check_password} />
          )}
		</Stack.Screen>
	  ) : (
		<>
    <Stack.Screen name="Contacts" component={contactScreen} options={{ title: "Mes Contacts" }} />
	  <Stack.Screen name="Engagements" component={engagementScreen} options={{ title: "Liste des engagements" }} />
		<Stack.Screen name="SynthRef" component={referentScreen} options={{ title: "Synthèse Référent" }} />
		<Stack.Screen name="Compte" component={compteScreen} options={{ title: "Mon Compte" }} />
		

	    </>
	  )}
	  </Stack.Navigator>
    </NavigationContainer>
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

 
