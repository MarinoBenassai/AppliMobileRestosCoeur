import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Button, Text, View, Image, TextInput} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Octicons';
import Constants from 'expo-constants';

import * as Notifications from 'expo-notifications';

import IdScreen from './src/screens/Identification';
import compteScreen from './src/screens/Compte';
import contactScreen from './src/screens/Contacts';
import engagementScreen from './src/screens/Engagements';
import referentScreen from './src/screens/SynthRef';
import activiteScreen from './src/screens/Activite';
import oublieScreen from './src/screens/MdpOublie';
import listeUtilisateurScreen from './src/screens/ListeUtilisateur';

import {userContext} from './src/contexts/userContext';

import constantes from './src/constantes';

const engagementStack = createStackNavigator();
const synthRefStack = createStackNavigator();
const compteStack = createStackNavigator();
const contactsStack = createStackNavigator();
const identificationStack = createStackNavigator();

const Drawer = createDrawerNavigator();

// handler de notification
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [userID,setUserID] = React.useState("");
  const [token, setToken] = React.useState("");

  // Notification
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
//ExponentPushToken[vTpWliDgX7_KFLUO69inj7]
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  function changeID(ID) {
    setUserID(ID);
  }
  
  function changeToken(token) {
    setToken(token);
  }
  
  function logout() {
	fetch('http://' + constantes.BDD + '/Axoptim.php/AUT/AP_LOGOUT/P_TOKEN=' + token)
	  .then((response) => {
		if (response.ok) {
			return response.json();
		}
		else {
			throw new Error('Une erreur est survenue.');
		}
	  })
	  .then((json) => {
		  setUserID("");
		  setToken("");
		  alert("Déconnexion réussie.");
	  })
	  .catch((error) => alert("Une erreur est survenue"))
	  .finally(() => console.log("finally"));
  }
  
  function handleError (erreur) {
	  if (erreur === "Bad Token"){
		//TODO message de deconnexion
		setUserID("");
		setToken("");
	  }
	  else {
		alert(erreur);
		console.log(erreur);
	  }
  }
  return (
    <userContext.Provider value = {{
      userID: userID,
	  token: token,
      logoutUser: logout,
	  changeID: changeID,
	  changeToken: changeToken,
	  handleError: handleError
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

const screenOptionsBase = {headerRight: () => (boutonLogOut()), headerStyle: {backgroundColor: '#41b495',}, headerRightContainerStyle: {paddingRight: 20},};
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

 
