import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import * as SplashScreen from 'expo-splash-screen';
import { setStatusBarTranslucent } from 'expo-status-bar';
import App from './App';

setStatusBarTranslucent(true);
SplashScreen.preventAutoHideAsync()
  .catch();

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
