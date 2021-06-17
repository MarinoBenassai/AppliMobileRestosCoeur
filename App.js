import React from 'react';
import { StyleSheet, Button, Text, View, Image, TextInput} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import IdScreen from './src/screens/Identification';
import compteScreen from './src/screens/Compte';
import contactScreen from './src/screens/Contacts';
import engagementScreen from './src/screens/Engagements';
import referentScreen from './src/screens/SynthRef';

const engagementStack = createStackNavigator();
const synthRefStack = createStackNavigator();
const compteStack = createStackNavigator();
const contactsStack = createStackNavigator();

const Drawer = createDrawerNavigator();

export default function App() {
  const [userID,setUserID] = React.useState("");
  
  const check_password = () => {
	
    setUserID("1234");
  }
  
  return (
    <NavigationContainer>
      <Drawer.Navigator screenOptions = {{swipeEnabled : false}}>
	  {userID === "" ? (
	    <Drawer.Screen name="Identification">
		  {(props) => (
            <IdScreen onSignIn={check_password} />
          )}
		</Drawer.Screen>
	  ) : (
		<>
		  <Drawer.Screen name="Engagements" component={engagement} options={{ title: "Mes engagements" }} />
		  <Drawer.Screen name="SynthRef" component={referent} options={{ title: "Ma synthèse référent" }} />
		  <Drawer.Screen name="Compte" component={compte} options={{ title: "Mon compte" }} />
		  <Drawer.Screen name="Contacts" component={contact} options={{ title: "Mes contacts" }} />
		</>
	  )}
	  </Drawer.Navigator>
    </NavigationContainer>
  );
}

const boutonMenu = ({nav}) => {
	return (<Button
              onPress={nav.openDrawer}
              title="Menu"
              color="#080"
            />)
}

function engagement({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions={{headerLeft: () => (boutonMenu({nav})),}}>
	  <engagementStack.Screen name="Engagements" component={engagementScreen} options={{title: "Mes engagements"}}/>
    </engagementStack.Navigator>
  );
}

function referent({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions={{headerLeft: () => (boutonMenu({nav})),}}>
	  <synthRefStack.Screen name="SynthRef" component={referentScreen} options={{ title: "Ma synthèse référent" }} />
    </engagementStack.Navigator>
  );
}

function compte({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions={{headerLeft: () => (boutonMenu({nav})),}}>
	  <compteStack.Screen name="Compte" component={compteScreen} options={{ title: "Mon compte" }} />
    </engagementStack.Navigator>
  );
}

function contact({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions={{headerLeft: () => (boutonMenu({nav})),}}>
	  <contactsStack.Screen name="Contacts" component={contactScreen} options={{ title: "Mes contacts" }} />
    </engagementStack.Navigator>
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

 
