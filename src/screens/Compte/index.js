import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, View, Button} from 'react-native';
import {SafeAreaView, StyleSheet, StatusBar, Pressable, TextInput, Alert} from 'react-native';

import userContext from '../../contexts/userContext';

const compteScreen = () => {
  const [isLoading, setLoading] = useState(true);

  const [dataEngagementDefaut, setDataEngagementDefaut] = useState('');
  const [dataPerso, setDataPerso] = useState('');

  const [phone, setPhone] = useState('');
  const [mail, setMail] = useState('');
  const [oldP, setOldP] = useState('');
  const [newP, setNewP] = useState('');
  const [verifP, setVerifP] = useState('');
  
  const userID = React.useContext(userContext)

  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_LST_ENG_BEN/P_IDBENEVOLE=' + userID)
      .then((response) => response.text())
      .then((texte) =>  {setDataEngagementDefaut(texte); console.log(texte)})
      .catch((error) => {
        (setData(-1));
      });
  }, []);

  useEffect(() => {
    fetch('http://51.38.186.216/Axoptim.php/REQ/AP_MON_COMPTE/P_IDBENEVOLE=1005')
      .then((response) => response.text())
      .then((texte) =>  {setDataPerso(texte); console.log(texte)})
      .catch((error) => { (setData(-1)) } )
      .finally(() => setLoading(false));;
  }, []);

  const ligneEngagementDefaut = dataEngagementDefaut.split(/\n/);
  ligneEngagementDefaut.shift(); //enlève le premier élement (et le retourne)
  ligneEngagementDefaut.pop();   //enlève le dernier élement (et le retourne)

  const lignePerso = dataPerso.split(/\n/);

  const renderItem = ({ item }) => (
    <View>
 
      <Text style={styles.liste}>
        <Text style={styles.item}>
          {item.split(/\t/)[0]}{"\t\t\t"}
          {item.split(/\t/)[1]}{"\t\t\t"}
          {item.split(/\t/)[2]}{"\t\t\t"}
          {item.split(/\t/)[3]}{"\t\t\t"} 
          {item.split(/\t/)[4]}
        </Text>
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {isLoading ? (<Text>loading</Text>) : (
        //View Principal, post chargement
        <View style={{flex: 1,}}>

          {/* La vue des infos profil (au dessus des activités) se trouve dans le header de la flatlist */}

          {/* View des Activités */}
          <View>
            
            <FlatList
              data={ligneEngagementDefaut}
              ListHeaderComponent={
                <>
                  {/* View du Profil (info, contact, MdP) */}
                  <View>
                    {/* View des information de profil */}
                    <View>
                      <Text style={styles.title}>Profil de :</Text>
                      <Text style={styles.data}>Nom : {lignePerso[1].split("\t")[0]}</Text>
                      <Text style={styles.data}>Prenom : {lignePerso[1].split("\t")[1]}</Text>
                      <View style={styles.ligne}/>
                    </View>

                    {/* View des informations de contact */}
                    <View>
                      <Text style={styles.title}>Modification des coordonnées :</Text>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Téléphone : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder={lignePerso[1].split("\t")[3]}
                          autoCorrect={false}
                          textContentType='telephoneNumber'
                          keyboardType='phone-pad'
                          onChangeText={text => setPhone(text)}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Email : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder={lignePerso[1].split("\t")[2]}
                          autoCorrect={false}
                          textContentType='emailAddress'
                          keyboardType='email-address'
                          onChangeText={text => setMail(text)}
                        />
                      </View>
                      <Button
                        onPress={() => changeContact(phone, mail)}
                        title="Valider Coordonnées"
                        color="#841584"
                        accessibilityLabel="Valider vos nouvelles informations de contact"
                      />
                      <View style={styles.ligne}/>
                    </View>

                    {/* View des MdP */}
                    <View>
                      <Text style={styles.title}>Modification du mot de passe :</Text>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Ancien mot de passe : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='password'
                          onChangeText={text => setOldP(text)}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Nouveau mot de passe : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='newPassword'
                          onChangeText={text => setNewP(text)}
                        />
                      </View>
                      <View style={{ flexDirection: "row"}}>
                        <Text style={styles.data}>Confirmation mot de passe : </Text>
                        <TextInput
                          style={styles.input}
                          placeholder="******"
                          autoCorrect={false}
                          secureTextEntry={true}
                          textContentType='newPassword'
                          onChangeText={text => setVerifP(text)}
                        />
                      </View>
                      <Button
                        onPress={() => changeMdP(oldP, newP, verifP)}
                        title="Valider Mot de Passe"
                        color="#841584"
                        accessibilityLabel="Valider votre nouveau mot de passe"
                      />
                      <View style={styles.ligne}/>
                    </View>
                    <Text style={styles.title}>Mes Activités</Text>
                  </View>
                </>
              }
              renderItem={renderItem}
              keyExtractor={item => item}
            />
          </View>
        </View>
      )}
    </SafeAreaView>
  );

}


const changeContact = (phone, mail) => {
  Alert.alert(
    "New Contact information",
    "\nmail : " + mail + "\n\n" + "tel : " + phone + "\n(Menu Tmp)",
    [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]

  );
}

const changeMdP = (oldP, newP, verifP) => {
  Alert.alert(
    "New MdP",
    "\n" + oldP + newP + verifP + "\n(Menu Tmp)",
    [
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ]
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    marginVertical: 16,
    marginHorizontal: 20,
  },
  data: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  input: {
    marginVertical: 4,
    marginHorizontal: -10,
  },
  field: {
    marginVertical: 4,
    marginHorizontal: 16,
  },
  ligne: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    marginVertical: 20,
  },
  liste: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
   }
}); 

const flog = () => {
  console.log("oui");
}

export default compteScreen;
