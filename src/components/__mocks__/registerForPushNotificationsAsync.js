import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Fonction de création/registration du token de notification
export const  registerForPushNotificationsAsync = async function (device) {
	let token = "-1";
	if (Device.isDevice) {
		if (!Device.brand){//if(device != "1" && device != "2"){
			return token;
		}
		token = "ExponentPushToken[999999999]";

	} else {
	  	alert('Must use physical device for Push Notifications');
	}
  
	return token;
}