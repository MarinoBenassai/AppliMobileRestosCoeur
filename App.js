import React from 'react';
import { useState, useEffect, useRef} from 'react';
import { useWindowDimensions } from 'react-native';
import {ActivityIndicator, StyleSheet, Button, Text, View, Image, TextInput, PixelRatio} from 'react-native';
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
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;

  //Bulle d'info
  const fSize = 12;
  const [X,setX] = React.useState(0);
  const [Y,setY] = React.useState(0);
  const [bulleVisible, setBulleVisible] = React.useState(false);
  const [messageBulle, setMessageBulle] = React.useState("");
  const [horizPos,setHorizPos] = React.useState('left');
  const [vertPos,setVertPos] = React.useState('up');
  
  function afficherInfoBulle (pageX, pageY, message){
	console.log(windowWidth,windowHeight,pageX, pageY, PixelRatio.get());//, getPixelSizeForLayoutSize(windowWidth), getPixelSizeForLayoutSize(windowHeight));
	getCoordFromText(message, pageX, pageY);
	setBulleVisible(true);
  }
  
  function cacherInfoBulle (){
	setBulleVisible(false);
  }

  function getCoordFromText(comment, X, Y) {
	setY(Y);
    setX(X);
	//On calcule les dimensions maximum de la bulle d'aide
	var horizSpace = 0;
	var vertSpace = 0;

	if (X > windowWidth/2){
		//Il y a plus d'espace à gauche
		setHorizPos('left');
		horizSpace = X;
	}
	else {
		//Il y a plus d'espace à droite
		setHorizPos('right');
		horizSpace = windowWidth - X;
	}
	
	if (Y > windowHeight/2){
		//Il y a plus d'espace vers le haut
		setVertPos('up');
		vertSpace = Y;
	}
	else {
		//Il y a plus d'espace vers le bas
		setVertPos('down');
		vertSpace = windowHeight - Y;
	}

	var formattedComment = [];
	const maxNbLines = Math.floor(vertSpace/(fSize * PixelRatio.get()));
	const maxLength = Math.floor(horizSpace/(fSize * PixelRatio.get()));
	var currentLength = 0;
	var nbLines = 0;
	
	const lines = comment.split("\n");
	for (let i = 0; i<lines.length; i++) {
		nbLines += 1;
		const words = lines[i].split(" ");
		for (let j = 0; j<words.length; j++){
			if ((currentLength + words[j].length) <	maxLength) {
				currentLength += words[j].length
				formattedComment.push(words[j]);
			}
			else {
				if ((nbLines + 1) >maxNbLines){
					formattedComment.push("...")
					setMessageBulle(" " + formattedComment.join(" ").trim());
					return;
				}
				else {
					nbLines += 1;
					currentLength = 0;
					formattedComment.push(words[j] + "\n");
				}
			}
		}
		if ((nbLines + 1) > maxNbLines){
			formattedComment.push("...")
			setMessageBulle(" " + formattedComment.join(" ").trim());
			return;
		}
		else {
			nbLines += 1;
			currentLength = 0;
			formattedComment[formattedComment.length - 1] += "\n";
		}
	}	
	setMessageBulle(" " + formattedComment.join(" ").trim());
  }

  const styles = StyleSheet.create({
  bulle: {
    backgroundColor: '#FFFFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
	padding: 5,
	borderColor: 'black',
	borderWidth: 1,
  },
  bullePlacer: {
    position: 'fixed',
	width: horizPos === 'left' ? X : 'auto',
    left: horizPos === 'left' ? 0 : X,
	height: vertPos === 'up' ? Y : 'auto',
    top: vertPos === 'up' ? 0 : Y,
    backgroundColor: 'transparent',
	flexDirection: 'row',
	justifyContent: horizPos === 'left' ? 'flex-end' : 'flex-start',
	alignItems: vertPos === 'up' ? 'flex-end' : 'flex-start'
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
			{(bulleVisible &&
			<View pointerEvents="none" style={styles.bullePlacer}>
				<View pointerEvents="none" style={styles.bulle}>
					<Text style = {{fontSize: fSize}}>{messageBulle}</Text>
				</View>
			</View>)}
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
	  <synthRefStack.Screen name="Activite" component={activiteScreen} options={{ title: "Détails" }} />
	  <synthRefStack.Screen name="ListeUtilisateur" component={listeUtilisateurScreen} options={{title: "Ajout d’un bénévole"}}/>
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

