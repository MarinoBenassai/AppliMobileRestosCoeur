import React from 'react';
import { useState, useEffect, useRef} from 'react';
import { Modal, useWindowDimensions } from 'react-native';
import {StyleSheet, Text, View, PixelRatio, ImageBackground, Pressable, ScrollView, TextInput, ActivityIndicator} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Octicons';
import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';

import IdScreen from './src/screens/Identification';
import compteScreen from './src/screens/Compte';
import contactScreen from './src/screens/Contacts';
import engagementScreen from './src/screens/Engagements';
import referentScreen from './src/screens/SynthRef';
import responsableScreen from './src/screens/SynthResp';
import activiteScreen from './src/screens/Activite';
import oublieScreen from './src/screens/MdpOublie';
import informationScreen from './src/screens/Informations';
import styles from './src/styles';

import listeUtilisateurScreen from './src/screens/ListeUtilisateur';
import {userContext} from './src/contexts/userContext';
import {sendAPI} from './src/components/sendAPI';

import constantes from './src/constantes';

import { ToastProvider } from 'react-native-toast-notifications'

import logoVide from './assets/logovide.png';


const engagementStack = createStackNavigator();
const synthRefStack = createStackNavigator();
const synthRespStack = createStackNavigator();
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
	
  const [userID,setUserID] = React.useState(null);
  const [token, setToken] = React.useState(null);
  const [estReferent, setReferent] = React.useState(true);
  const [estResponsable, setResponsable] = React.useState(true);
  const windowWidth = useWindowDimensions().width;
  const windowHeight = useWindowDimensions().height;
  const [ready,setReady] = React.useState(false);
  //Bulle d'info
  const fSize = 12;
  const [X,setX] = React.useState(0);
  const [Y,setY] = React.useState(0);
  const [bulleVisible, setBulleVisible] = React.useState(false);
  const [messageBulle, setMessageBulle] = React.useState("");
  const [horizPos,setHorizPos] = React.useState('left');
  const [vertPos,setVertPos] = React.useState('up');
  
  function afficherInfoBulle (pageX, pageY, message){
	//console.log(windowWidth,windowHeight,pageX, pageY, PixelRatio.get());//, getPixelSizeForLayoutSize(windowWidth), getPixelSizeForLayoutSize(windowHeight));
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

  const stylesBulle = StyleSheet.create({
  bulle: {
    backgroundColor: '#FFFFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
	padding: 5,
	borderColor: 'black',
	borderWidth: 1,
  },
  bullePlacer: {
    position: Device.brand?'absolute':'fixed',
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
	  async function splash() {
		console.log("Show",await SplashScreen.preventAutoHideAsync());
	  }
	  splash().
	  then(() => autoConnect())
	  .catch((error) => handleError(error));
  }, []);
  
  useEffect(() => {
	  if (userID !== null && token !== null){
		  setReady(true);
	  }
  }, [userID, token]);
  
  useEffect(() => {
	  async function hide() {
		await SplashScreen.hideAsync();
		if (userID !== "" && token !== "" && userID !== null && token !== null){
		  const device = await Device.getDeviceTypeAsync();
		  const tokennotif = await registerForPushNotificationsAsync(device);
		  if (tokennotif != "-1") {
		    sendAPI('APP', 'AP_UPD_NOTIF', {'P_IDBENEVOLE':userID, 'P_TOKENNOTIF':tokennotif},token)
		    .catch((error) => handleError (error));
		  }
	    }
	  }
	  if (ready){
		  hide()
		  .catch((error) => handleError(error));
	  }
  }, [ready]);
  
  async function autoConnect() {
	  
	  if (Device.brand){
		const token = await SecureStore.getItemAsync('token');
		const id = await SecureStore.getItemAsync('id');
		if (token !== null && id !== null){
			setToken(token);
			setUserID(id);
		}
		else {
			setUserID("");
			setToken("");
		}
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
	
	sendAPI('APP','AP_LOGOUT',{'P_TOKEN':token,'P_TOKENNOTIF':tokennotif}, token)
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


  // modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTexteTitre, setModalTexteTitre] = useState("");
  const [modalTexte, setModalTexte] = useState("");

  const fctModalApp = (titre, texte) => {
	  setModalTexteTitre(titre);
	  setModalTexte(texte);
	  setModalVisible(true);
  }

  //Loading
  const [isLoading, setLoading] = useState(false);

  //Email
  const refMailTxt = useRef(null);
  const [modalVisibleMail, setModalVisibleMail] = useState(false);
  const [mailTxt, setMailTxt] = useState("");
  const [mailSujet, setMailSujet] = useState("");
  const [listeDestinataire, setListeDestinataire] = useState([]);

  const fctMailTxt = () => {
    if(mailTxt != ""){
      setLoading(true);
      setModalVisibleMail(!modalVisibleMail);
      sendAPI('AUT', 'AP_SEND_MAIL', {'P_TOKEN':token, 'P_IDDESTINATAIRE':listeDestinataire, 'P_SUJET':mailSujet, 'P_MESSAGE':mailTxt},token) //TODO
      .then((json) =>  {setLoading(false); fctModalApp("Succés", "Le mail à bien été envoyé"); console.info("Mail à tous envoyé"); setMailTxt(""); setMailSujet("");})
      .catch((error) => {setLoading(false); setMailTxt(""); setMailSujet(""); handleError (error)});
    }
  }

  const fctModalMail = ( liste ) => {
	  setListeDestinataire(liste)
	  setModalVisibleMail(true);
  }

  // Error
  function handleError (erreur) {
	  if (erreur === "Invalid token"){
		fctModalApp("Attention", "Votre session a expiré, veuillez vous reconnecter");
		setUserID("");
		setToken("");
		if (Device.brand){
			SecureStore.deleteItemAsync('id');
			SecureStore.deleteItemAsync('token');
		}
		logout();
	  }
	  else {
		fctModalApp("Attention", erreur);
		
	  }
  }


  const registerForPushNotificationsAsync = async function (device) {
	let token = "-1";
	if (Device.isDevice) {
		if (!Device.brand){//if(device != "1" && device != "2"){
			return token;
		}
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}

		// Notification non autorisée
		if (finalStatus !== 'granted') {
			fctModalApp("Erreur", "Impossible de récupérer le token de notifications");
			return token;
		}

		token = (await Notifications.getExpoPushTokenAsync()).data;
		console.log(token);

	} else {
		fctModalApp("Attention", "Pas de notifications sur simulateur");
	}
  
	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}
  
	return token;
}
  

  
  return (
	<ToastProvider>
		{isLoading &&
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
	  	}
		<userContext.Provider value = {{
		userID: userID,
		token: token,
		logoutUser: logout,
		changeID: changeID,
		changeToken: changeToken,
		handleError: handleError,
		setReferent: setReferent,
		setResponsable: setResponsable,
		afficherInfoBulle: afficherInfoBulle,
		cacherInfoBulle: cacherInfoBulle,
		fctModalApp: fctModalApp,
		fctModalMail: fctModalMail,
		registerForPushNotificationsAsync: registerForPushNotificationsAsync
		}}>

			
			<NavigationContainer>
				<Drawer.Navigator screenOptions = {{swipeEnabled : false}}>
					{userID === "" || userID === null ? (
						<Drawer.Screen name="Identification" component = {identification}/>		
					) : (
						<>
						<Drawer.Screen name="Engagements" component={engagement} options={{ title: "Mes engagements" }} />
						{estReferent && <Drawer.Screen name="SynthRef" component={referent} options={{ title: "Ma synthèse référent" }} />}
						{estResponsable && <Drawer.Screen name="SynthResp" component={responsable} options={{ title: "Ma synthèse responsable" }} />}
						<Drawer.Screen name="Compte" component={compte} options={{ title: "Mon compte" }} />
						<Drawer.Screen name="Contacts" component={contact} options={{ title: "Mes contacts" }} />
						<Drawer.Screen name="Informations" component={information} options={{ title: "Mes informations" }} />
						</>
					)}
				</Drawer.Navigator>
			</NavigationContainer>
			{(bulleVisible &&
			<View pointerEvents="none" style={stylesBulle.bullePlacer}>
				<View pointerEvents="none" style={stylesBulle.bulle}>
					<Text style = {{fontSize: fSize}}>{messageBulle}</Text>
				</View>
			</View>)}

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisible}
				onRequestClose={() => setModalVisible(false)}
				>
				<View style={styles.centeredView}>
					<ImageBackground source={logoVide} resizeMode="cover" style={styles.modalContactView} imageStyle={styles.modalContactView2}>
						<Text style={styles.modalContactTitle}>{modalTexteTitre}</Text>
						<View style={styles.modalContactContentView}>
							<Text style={styles.modalText}>{modalTexte}</Text>
						</View>

						<View style={styles.modalContactButtonView}>
							<Pressable
								style={styles.buttonAlertModal}
								onPress={() => {setModalVisible(false);console.info("OK  App Pressed");}}
							>
								{({ pressed }) => (
									<View >
									<Text style={{color:pressed?"lightgrey":"black", fontWeight: "bold"}}>OK</Text>
									</View>
								)}
							</Pressable>
						</View>
					</ImageBackground>
				</View>
    		</Modal>

			<Modal
				animationType="slide"
				transparent={true}
				visible={modalVisibleMail}
				onRequestClose={() => {setModalVisibleMail(false); setMailTxt(""); setMailSujet("");}}
			>
				<ScrollView >
					<View style={styles.centeredView}>
						<ImageBackground source={logoVide} resizeMode="cover" style={[styles.modalContactView, {width: 600, maxWidth: "95%"}]} imageStyle={styles.modalContactView2}>
							<Text style={styles.modalContactTitle}>Email :</Text>
							<TextInput
							value={mailSujet}
							style={[styles.input, {borderWidth: 1, width:"100%"}]}
							onChangeText={setMailSujet}
							placeholder="Sujet"
							autoCompleteType="off"
							maxLength={1000}
							onSubmitEditing={() => refMailTxt.current.focus()}
							/>
							<TextInput
							ref={refMailTxt}
							multiline
							numberOfLines={10}
							value={mailTxt}
							style={[styles.input, {borderWidth: 1, width:"100%"}]}
							onChangeText={setMailTxt}
							placeholder="votre mail"
							autoCompleteType="off"
							maxLength={1000000}
							/>
						
							<View style={styles.modalContactButtonView}>
								<Pressable
									style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-end"}}
									// écrire et envoyer le commentaire
									onPress={() => fctMailTxt()}
								>
									{({ pressed }) => (
									<Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", textAlign: "center", fontWeight: "bold"}]}>Envoyer</Text>
									)}
								</Pressable>

								<Pressable
									style={{alignItems: "center", padding: 10, elevation: 2, alignSelf: "flex-start"}}
									onPress={() => {setModalVisibleMail(!modalVisibleMail);
													setMailTxt(""); setMailSujet("")}}
								>
									{({ pressed }) => (
									<Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", textAlign: "center", fontWeight: "bold"}]}>Annuler</Text>
									)}
								</Pressable>
							</View>
						</ImageBackground>
					</View>
				</ScrollView>
			</Modal>

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

const screenOptionsBase = {headerRight: () => (boutonLogOut()), headerStyle: {backgroundColor: '#e92682'}, headerRightContainerStyle: {paddingRight: 20},};
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

function responsable({navigation}) {
	const nav = navigation;
	return (
	  <synthRespStack.Navigator screenOptions= {screenOptionsBase}>
		<synthRespStack.Screen name="SynthResp" component={responsableScreen} options={screenOptionsFirstPage(nav, "Ma synthèse responsable") } />
		<synthRespStack.Screen name="Activite" component={activiteScreen} options={{ title: "Détails" }} />
		<synthRespStack.Screen name="ListeUtilisateur" component={listeUtilisateurScreen} options={{title: "Ajout d’un bénévole"}}/>
	  </synthRespStack.Navigator>
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

