import React from 'react';
import { useState, useEffect, useRef } from 'react';
import {ActivityIndicator, StyleSheet, Button, Text, View, Image, TextInput} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Octicons';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import IdScreen from './src/screens/Identification';
import compteScreen from './src/screens/Compte';
import contactScreen from './src/screens/Contacts';
import engagementScreen from './src/screens/Engagements';
import referentScreen from './src/screens/SynthRef';
import activiteScreen from './src/screens/Activite';
import oublieScreen from './src/screens/MdpOublie';
import informationScreen from './src/screens/Informations';

import listeUtilisateurScreen from './src/screens/ListeUtilisateur';
import {checkFetch} from './src/components/checkFetch';
import {userContext} from './src/contexts/userContext';

import constantes from './src/constantes';

import {registerForPushNotificationsAsync} from "./src/components/registerForPushNotificationsAsync.js";

import { ToastProvider } from 'react-native-toast-notifications'

const engagementStack = createStackNavigator();
const synthRefStack = createStackNavigator();
const compteStack = createStackNavigator();
const contactStack = createStackNavigator();
const identificationStack = createStackNavigator();
const informationStack = createStackNavigator();

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
  const [estReferent, setReferent] = React.useState(true);


  //Bulle d'info
  const [X,setX] = React.useState(0);
  const [Y,setY] = React.useState(0);
  const [bulleVisible, setBulleVisible] = React.useState(false);
  const [messageBulle, setMessageBulle] = React.useState("");
  
  function afficherInfoBulle (pageX, pageY, message){
	setBulleVisible(true);
	setX(pageX);
	setY(pageY);
	setMessageBulle(message);
  }
  
  function cacherInfoBulle (){
	setBulleVisible(false);
  }

  const styles = StyleSheet.create({
  bulle: {
    position: 'absolute',
    left: X,
    right: 0,
    top: Y,
    bottom: 0,
	width: 30,
	height: 30,
    backgroundColor: '#FFFFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  });

  // Notification
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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
  
  useEffect(() => {
	  autoConnect()
	  .catch((error) => handleError(error));
  }, []);
  
  async function sendAPI(apCode,sqlCode,params) {
	  let body = new FormData();
	  body.append('params',JSON.stringify(params));
	  if (apCode === 'APP') {
	    body.append('token',token);
	  }
	  const response = await fetch('http://' + constantes.BDD + '/' + apCode + '/' + sqlCode + '/', {
	    method: 'POST',
	    body: body});
	  return checkFetch(response,apCode);
  }
  
  async function autoConnect() {
	  
	  if (Device.brand){
		const device = await Device.getDeviceTypeAsync();
		await SplashScreen.preventAutoHideAsync();
		const token = await SecureStore.getItemAsync('token');
		const id = await SecureStore.getItemAsync('id');
		if (token !== null && id !== null){
			setToken(token);
			setUserID(id);
			const tokennotif = await registerForPushNotificationsAsync(device);
			sendAPI('APP', 'AP_UPD_NOTIF', {'P_IDBENEVOLE':id, 'P_TOKENNOTIF':tokennotif})
			.catch((error) => handleError (error));
		}
		await SplashScreen.hideAsync();
	  }
	  
  }
  
  function changeID(ID) {
    setUserID(ID);
  }
  
  function changeToken(token) {
    setToken(token);
  }
  
  async function logout() {
	const device = await Device.getDeviceTypeAsync();
	const tokennotif = await registerForPushNotificationsAsync(device);
	
	sendAPI('APP','AP_LOGOUT',{'P_TOKEN':token,'P_TOKENNOTIF':tokennotif})
	.then((data) => {
		setUserID("");
		setToken("");
		if (Device.brand){
			SecureStore.deleteItemAsync('id');
			SecureStore.deleteItemAsync('token');
		}
	})
	.catch((error) => handleError(error));
  }
  
  function handleError (erreur) {
	  if (erreur === "Invalid token"){
		alert("Votre session a expiré, veuillez vous reconnecter");
		setUserID("");
		setToken("");
		if (Device.brand){
			SecureStore.deleteItemAsync('id');
			SecureStore.deleteItemAsync('token');
		}
		logout();
	  }
	  else {
		alert(erreur);
	  }
  }
  
  return (
	<ToastProvider>
		<userContext.Provider value = {{
		userID: userID,
		token: token,
		logoutUser: logout,
		changeID: changeID,
		changeToken: changeToken,
		handleError: handleError,
		sendAPI: sendAPI,
		setReferent: setReferent,
		afficherInfoBulle: afficherInfoBulle,
		cacherInfoBulle: cacherInfoBulle
		}}>
			<NavigationContainer>
				<Drawer.Navigator screenOptions = {{swipeEnabled : false}}>
					{userID === "" ? (
						<Drawer.Screen name="Identification" component = {identification}/>		
					) : (
						<>
						<Drawer.Screen name="Engagements" component={engagement} options={{ title: "Mes engagements" }} />
						{estReferent && <Drawer.Screen name="SynthRef" component={referent} options={{ title: "Ma synthèse référent" }} />}
						<Drawer.Screen name="Compte" component={compte} options={{ title: "Mon compte" }} />
						<Drawer.Screen name="Contacts" component={contact} options={{ title: "Mes contacts" }} />
						<Drawer.Screen name="Informations" component={information} options={{ title: "Mes informations" }} />
						</>
					)}
				</Drawer.Navigator>
			</NavigationContainer>
			({bulleVisible &&
			<View pointerEvents="none" style={styles.bulle}>
			<Text>{messageBulle}</Text>
			</View>})
		</userContext.Provider>
	</ToastProvider>
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
  const nav = navigation;
  return (
    <engagementStack.Navigator screenOptions = {screenOptionsBase}>
	  <engagementStack.Screen name="Engagements" component={engagementScreen} options={screenOptionsFirstPage(nav, "Mes engagements")}/>
	  <engagementStack.Screen name="Activite" component={activiteScreen} options={{ title: "Détails" }} />
      <engagementStack.Screen name="ListeUtilisateur" component={listeUtilisateurScreen} options={{title: "Ajout d’un bénévole"}}/>
    </engagementStack.Navigator>
  );
}

function referent({navigation}) {
  const nav = navigation;
  return (
    <synthRefStack.Navigator screenOptions= {screenOptionsBase}>
	  <synthRefStack.Screen name="SynthRef" component={referentScreen} options={screenOptionsFirstPage(nav, "Ma synthèse référent") } />
	  <engagementStack.Screen name="Activite" component={activiteScreen} options={{ title: "Détails" }} />
    </synthRefStack.Navigator>
  );
}

function compte({navigation}) {
  const nav = navigation;
  return (
    <compteStack.Navigator screenOptions={screenOptionsBase}>
	  <compteStack.Screen name="Compte" component={compteScreen} options={screenOptionsFirstPage(nav,"Mon compte")} />
    </compteStack.Navigator>
  );
}

function contact({navigation}) {
  const nav = navigation;
  return (
    <contactStack.Navigator screenOptions={screenOptionsBase}>
	  <contactStack.Screen name="Contacts" component={contactScreen} options={screenOptionsFirstPage(nav, "Mes contacts")}/>
    </contactStack.Navigator>
  );
}

function information({navigation}) {
	const nav = navigation;
	return (
	  <informationStack.Navigator screenOptions={screenOptionsBase}>
		<informationStack.Screen name="Informations" component={informationScreen} options={screenOptionsFirstPage(nav, "Mes Informations")}/>
	  </informationStack.Navigator>
	);
  }

