import {Text, View} from 'react-native';
import {Linking} from 'react-native';
import {Pressable, Modal} from 'react-native';
import React, { useEffect, useState } from 'react';
import styles from '../styles';
import * as Clipboard from 'expo-clipboard';
import * as Device from 'expo-device';
import { useToast } from "react-native-toast-notifications";

import {normalizeInputPhone} from './normalizeInputPhone';

const ModalContact = (props) => {
	
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
        <View style={styles.modalContactView}>
		      <Text style={styles.modalContactTitle}>Informations de contact</Text>
		      <View style={styles.modalContactContentView}>
            <Text style={styles.modalText} onPress={() => {setToClipboard(props.mail); Device.brand ? toastComponent('Copié dans le presse-papier') : alert('Copié dans le presse-papier');}}>{"Mail : " + props.mail}</Text>
		        <Text style={styles.modalText} onPress={() => {setToClipboard(props.phone);Device.brand ? toastComponent('Copié dans le presse-papier') : alert('Copié dans le presse-papier');}}>{"Tel : " + normalizeInputPhone(props.phone)}</Text>
		      </View>
          <View style={styles.modalContactButtonView}>
            <Pressable
              style={styles.buttonContactLeft}
              onPress={() => {props.setVisible(!props.visible);console.info("OK  Contact Pressed");}}
            >
              {({ pressed }) => (
                <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black"}]}>OK</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.buttonContactMid}
              onPress={() => {props.setVisible(!props.visible);Linking.openURL(`sms:${props.phone}`);}}
            >
              {({ pressed }) => (
                <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black"}]}>SMS</Text>
              )}
            </Pressable>
            <Pressable
              style={styles.buttonContactRight}
              onPress={() => {props.setVisible(!props.visible);Linking.openURL(`mailto:${props.mail}`);}}
            >
              {({ pressed }) => (
                <Text style={[styles.textContactStyle, {color:pressed?"lightgrey":"black"}]}>MAIL</Text>
              )}
            </Pressable>
		      </View>
        </View>
      </View>
    </Modal>	
);}

export default ModalContact;