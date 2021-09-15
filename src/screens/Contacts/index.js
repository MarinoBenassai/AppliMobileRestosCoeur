import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View} from 'react-native';
import {SafeAreaView, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/Octicons';

//import RNPickerSelect from 'react-native-picker-select';
//import {traitementSort} from '../../components/pickerActivite';

import {userContext} from '../../contexts/userContext';
import ModalContact from '../../components/modalContact';
import {sendAPI} from '../../components/sendAPI';
import styles from '../../styles';

// Fonction Principale
function contactScreen() {
  // on définit les états : data et loading
  const [isLoading, setLoading] = useState(true);
  const [visibleData, setVisibleData] = useState("");
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [mail, setMail] = useState("");
  const [phone, setPhone] = useState("");

  //const [picker, setPicker] = useState("nom");
  
  //récupération de l'id de l'utilisateur courrant
  const userID = React.useContext(userContext).userID

  //Mails
  const [idDestinataire, setIdDestinataire] =useState();
  
  //Handler des erreurs de serveur
  const handleError = React.useContext(userContext).handleError;
  const token = React.useContext(userContext).token;

  // on va chercher les informations sur la BDD
  useEffect(() => {
	sendAPI('APP', 'AP_LST_CONTACT', {'P_IDBENEVOLE':userID},token)
	.then((json) =>  {setData(json); setLoading(false)})
	.catch((error) => {setLoading(false); handleError (error)});
  }, []);

  // on met à jour la liste visible initiale
  useEffect(() => {
    setVisibleData( data ); //traitementSort("NOM", data, data, 1, 2, 3, 4, 0) ); // ordonne la liste initiale
  }, [data]);


  const fctModal = (item) => {
    setMail(item.email);
    setPhone(item.telephone);
    setIdDestinataire(item.idbenevole);
    setModalVisible(!modalVisible);
  }

  // On crée le renderer pour la flatlist
  const renderItem = ({ item }) => (
    // Conteneur Principal
    <View style={[styles.item, styles.REFERENT, {paddingVertical: 0}]}>

      {/* Conteneur 1ere colonne : info personne */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Text style = {{textAlign: "center", fontSize: 12}}>{item.nom}</Text>
        <Text style = {{textAlign: "center", fontSize: 12}}>{item.prenom}</Text>
      </View>

      {/* Conteneur 2eme colonne : info lieu */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Text style = {{textAlign: "center", fontSize: 12}}>{item.jourdefaut}</Text>
        <Text style = {{textAlign: "center", fontSize: 12}}>{item.nomsite}</Text>
        <Text style = {{textAlign: "center", fontSize: 12}}>{item.nomactivite}</Text>
      </View>

      {/* Conteneur 3eme colonne : contacter */}
      <View style={[styles.colomn, {width:'33%'}]}>
        <Pressable onPress={() => fctModal(item)} testID="iconLettre">
          {({ pressed }) => (
            <Icon 
              style = {{alignSelf: "center"}}
              name='mail' 
              size={30}
              color={pressed?'darkslategrey':'black'}
            />
          )}
        </Pressable>
        
      </View>
    </View>
  );


  // on retourne la flatliste
  return (
    <>
    <SafeAreaView style={styles.container} >
	    <ModalContact visible={modalVisible} setVisible={setModalVisible} mail={mail} phone={phone}idDestinataire={idDestinataire} />
      {isLoading ? (
          <View style={styles.loading}>
          <ActivityIndicator size="large" color="#e92682" />
          </View>) : (
      <>

      {/*Picker*/}
      {/* <View style={{alignSelf: "center", width: "100%", maxWidth: 550, paddingTop: 20}}>
        <RNPickerSelect
          placeholder={{}}
          useNativeAndroidPickerStyle={true}
          onValueChange={(itemValue, itemIndex) =>
            {setPicker(itemValue);
            setVisibleData (traitementSort(itemValue, data, visibleData, 1, 2, 3, 4, 0) );}
        }
          selectedValue={picker}
          items={[
              { label: 'nom', value: 'NOM' },
              { label: 'prénom', value: 'PRENOM' },
              { label: 'jour', value: 'JOUR' },
              { label: 'site', value: 'SITE' },
              { label: 'activité', value: 'ACTIVITE' },
          ]}
          style={pickerSelectStyles}
          InputAccessoryView={() => null}
        />

      </View> */}

      {/*Header de la liste*/}
      <View style = {styles.header}>
        <View style={{width:'33%'}}>
          <Text style = {styles.headerTitle}>Nom/Prénom</Text>
        </View>
        <View style={{width:'33%'}}>
          <Text style = {styles.headerTitle}>Activité et jour</Text>
        </View>
        <View style={{width:'33%'}}>
          <Text style = {styles.headerTitle}>Info contact</Text>
        </View>
      </View>
        <View style={{flex: 1}}>
          <FlatList
            data={visibleData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            testID="flatlist"
          />
        </View>
      </>
      )}
    </SafeAreaView>
	</>
  );

}

// On exporte la fonction principale
export default contactScreen;


// Style
/* const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    margin: 20,
    fontSize: 16,
    width: 200,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
  },

  inputAndroid: {
    margin: 20,
    fontSize: 16,
    width: 200,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
  },
  inputWeb: {
    margin: 20,
    fontSize: 16,
    width: 160,
    height: 40,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 8,
    color: 'black',
  }
});
 */