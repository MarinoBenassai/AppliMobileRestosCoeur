import React from 'react';
import { StyleSheet, Button, Text, View, Image, TextInput} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Octicons';

import IdScreen from './src/screens/Identification';
import compteScreen from './src/screens/Compte';
import contactScreen from './src/screens/Contacts';
import engagementScreen from './src/screens/Engagements';
import referentScreen from './src/screens/SynthRef';
import activiteScreen from './src/screens/Activite';
import oublieScreen from './src/screens/MdpOublie';
import listeUtilisateurScreen from './src/screens/ListeUtilisateur';

import {userContext} from './src/contexts/userContext';

const engagementStack = createStackNavigator();
const synthRefStack = createStackNavigator();
const compteStack = createStackNavigator();
const contactsStack = createStackNavigator();
const identificationStack = createStackNavigator();

const Drawer = createDrawerNavigator();

export default function App() {
  const [userID,setUserID] = React.useState("");
  
  function changeID(ID) {
    setUserID(ID);
  }
  
  function logout() {
	setUserID("");
  }
  
  return (
    <userContext.Provider value = {{
      userID: userID,
      logoutUser: logout,
	  changeID: changeID,
    }}>
    <NavigationContainer>
      <Drawer.Navigator screenOptions = {{swipeEnabled : false}}>
	  {userID === "" ? (
	      <Drawer.Screen name="Identification" component = {identification}/>		
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
	</userContext.Provider>
  );
}

const boutonMenu = ({nav}) => <Icon 
    name='three-bars' 
    size={30}
    color='#000' 
    onPress={nav.openDrawer}
/>;

const boutonLogOut = () => <Icon 
              onPress={React.useContext(userContext).logoutUser}
			  name='sign-out' 
			  size={30}
			  color='#000'
            />;


function identification() {
  return (
    <identificationStack.Navigator>
	  <identificationStack.Screen name="Identification" component = {IdScreen} options = {{title: "Se connecter"}}/>
	  <identificationStack.Screen name="Oublie" component={oublieScreen} options={{ title: "Mot de passe oublié" }} />
    </identificationStack.Navigator>
  );
}

const screenOptionsBase = {headerRight: () => (boutonLogOut()), headerStyle: {backgroundColor: '#45968c',}, headerRightContainerStyle: {paddingRight: 20},};
function screenOptionsFirstPage (nav, title) {return {title: title, headerLeft: () => (boutonMenu({nav})), headerLeftContainerStyle: {paddingLeft: 20},}}

function engagement({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions = {screenOptionsBase}>
	  <engagementStack.Screen name="Engagements" component={engagementScreen} options={screenOptionsFirstPage(nav, "Mes engagements")}/>
	  <engagementStack.Screen name="Activite" component={activiteScreen} options={{ title: "Détails" }} />
    <engagementStack.Screen name="ListeUtilisateur" component={listeUtilisateurScreen} options={{title: "Liste des utilisateurs"}}/>
    </engagementStack.Navigator>
  );
}

function referent({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions= {screenOptionsBase}>
	  <synthRefStack.Screen name="SynthRef" component={referentScreen} options={screenOptionsFirstPage(nav, "Ma synthèse référent") } />
	  <engagementStack.Screen name="Activite" component={activiteScreen} options={{ title: "Détails" }} />
    </engagementStack.Navigator>
  );
}

function compte({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions={screenOptionsBase}>
	  <compteStack.Screen name="Compte" component={compteScreen} options={screenOptionsFirstPage(nav,"Mon compte")} />
    </engagementStack.Navigator>
  );
}

function contact({navigation}) {
  const nav = navigation
  return (
    <engagementStack.Navigator screenOptions={screenOptionsBase}>
	  <contactsStack.Screen name="Contacts" component={contactScreen} options={screenOptionsFirstPage(nav, "Mes contacts")}/>
    </engagementStack.Navigator>
  );
}

 
