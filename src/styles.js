import { StyleSheet, Button, Text, View, Image, TextInput, StatusBar} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
    justifyContent: "center",
  },
  // chaque item de la flatlist
  item: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    justifyContent:"space-between",
    flexDirection: "row",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 50,
  },
  header: {    
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
    justifyContent:"space-between",
    flexDirection: "row",
    marginVertical: 8,
    marginHorizontal: 16,
	  paddingLeft: 20,
	  paddingRight: 20,
  },
  headerTitle: {
	  textAlign: "center",
	  fontWeight: 'bold',
	  fontSize: 15
  },
  info: {
    fontSize: 15,
  },
  activite: {
    alignContent: "center",
    padding: 0,
    //paddingLeft: 10
  },

  // Couleur dynamique
  BENEVOLE: {
    backgroundColor: "#d0d9d2", //"lightgrey", //'#c8e7df',
  },
  REFERENT: {
    backgroundColor: "#f7a823"    //"#e92682", //"#E2017A", //'#f7d4e8',
  },
  GENERAL: {
    backgroundColor: '#b2f772',
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#F5FCFF88',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    justifyContent: "space-evenly",
    height: "40%",
    minHeight: 300,
    width: "80%",
    maxWidth: 400,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
},
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },  
  title: {
    fontWeight: "bold",
    fontSize: 15,
    marginVertical: 5,
    marginHorizontal: 20,
  },
  data: {
    marginVertical: 5,
    marginHorizontal: 16,
  },
  input: {
    paddingLeft: 7,
    marginVertical: 5,
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
    browser: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  // chaque colonne d'un item de la flatlist
  colomn: { 
    flexDirection: "column", 
    marginVertical: 8, 
    justifyContent:"space-evenly",
  },

  buttonAlertModal: {
    padding: 10,
    elevation: 2,
	  alignSelf: "center"
  },
  modalContactView: {
    //width: "80%",
    maxWidth: 400,
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
	  paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
	  alignSelf: "center",
    elevation: 5,
  },
  modalContactView2: {
    borderRadius: 20,
	  paddingBottom: 20,
    alignItems: "center",
	  alignSelf: "center",
  },
  modalContactTitle: {
    textAlign: "center",
	  fontSize: 20,
    fontWeight: "bold",
	  marginBottom: 20,
  },
  modalContactContentView: {
    alignItems: "flex-start",
  },
  modalContactButtonView: {
    alignItems: "flex-start",
	  flexDirection: "row",
  },
  buttonContactLeft: {
	  flex: 3,
    padding: 10,
    elevation: 2,
	  alignSelf: "flex-start"
  },
  buttonContactMid: {
    alignItems: "flex-start",
	  flex: 1,
    padding: 10,
    elevation: 2,
	  alignSelf: "flex-end"
  },
  buttonContactRight: {
    alignItems: "flex-start",
	  flex: 1,
    padding: 10,
    elevation: 2,
	  alignSelf: "flex-end"
  },
  textStyle: {
    color: "black",
    fontWeight: "bold",
    textAlign: "center"
  },
  idInput: {
    height: 40,
	  width : 200,
    marginBottom: 15,
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
	
  },
  idTexte : {
    marginTop : 15,
    textAlign: 'center',
    color : '#656565'
  },
  logo: {
    width: 200,
    height: 200,
  },
  conteneur: {
    backgroundColor: '#00ffff',
    padding: 10,
    marginVertical: 8,
  },
  statusIcon: {
    paddingRight: 10,
    paddingLeft: 10
  },
  
});




export default styles;