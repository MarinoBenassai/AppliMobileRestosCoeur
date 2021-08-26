import React, { useEffect, useState } from 'react';
import {Text, View} from 'react-native';
import {Linking, ImageBackground} from 'react-native';
import {Pressable, Modal} from 'react-native';

import { useToast } from "react-native-toast-notifications";
import {normalizeInputPhone} from './normalizeInputPhone';
import {userContext} from '../contexts/userContext';

import styles from '../styles';
import * as Clipboard from 'expo-clipboard';
import * as Device from 'expo-device';

import logoVide from '../../assets/logovide.png';



const ModalContact = (props) => {

  
  // On récupère la fonction pour gérer le modal d'Email
  const fctModalMail = React.useContext(userContext).fctModalMail;

  const idDestinataire = props.idDestinataire;
	
  const [toClipboard, setToClipboard] = useState("");

  // Toast
  const toast = useToast();
	  
	  
  useEffect(() => {
	if (toClipboard != "") {
	  Clipboard.setString(toClipboard);
	}
	setToClipboard("");
  }, [toClipboard]);


  // Affiche le toast
  const toastComponent = (texte) => {
        
    toast.show(texte, {
        type: "normal",
        position: "bottom",
        duration: 2000,
        offset: 30,
        animationType: "zoom-in",
      });
  };
	
	return(
	<Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onRequestClose={() => {
        props.setVisible(!props.visible);
      }}
    >
      <View style={styles.centeredView}>
          <ImageBackground source={logoVide} resizeMode="cover" style={styles.modalContactView} imageStyle={styles.modalContactView2}>
		        <Text style={styles.modalContactTitle}>Informations de contact</Text>
            <View>
              <Text style={styles.modalText} textAlign="center" onPress={() => {setToClipboard(props.mail); Device.brand ? toastComponent('Copié dans le presse-papier') : alert('Copié dans le presse-papier');}}>{props.mail}</Text>
              <Text style={styles.modalText} textAlign="center" onPress={() => {setToClipboard(props.phone);Device.brand ? toastComponent('Copié dans le presse-papier') : alert('Copié dans le presse-papier');}}>{normalizeInputPhone(props.phone)}</Text>
            </View>
            <View style={styles.modalContactButtonView}>
              <Pressable
                style={styles.buttonContactLeft}
                onPress={() => {props.setVisible(!props.visible); console.info("OK  Contact Pressed");}}
              >
                {({ pressed }) => (
                  <View>
                    <Text style={{color:pressed?"lightgrey":"black", fontWeight: "bold"}}>OK</Text>
                  </View>
                )}
              </Pressable>
              {Device.brand && <Pressable
                style={[styles.buttonContactMid, {marginRight: 10}]}
                onPress={() => {props.setVisible(!props.visible); Linking.openURL(`sms:${props.phone}`);}}
              >
                {({ pressed }) => (
                  <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", fontWeight: "bold"}]}>SMS</Text>
                )}
              </Pressable>}
              <Pressable
                style={[styles.buttonContactRight]}
                onPress={() => {props.setVisible(!props.visible); fctModalMail([idDestinataire]);}}
              >
                {({ pressed }) => (
                  <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black", fontWeight: "bold"}]}>MAIL</Text>
                )}
              </Pressable>
            </View>
          </ImageBackground>
        </View>
    </Modal>	
);}

export default ModalContact;