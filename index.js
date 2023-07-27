/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import './i18n.config';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import routes from './src/navigation/routes';
import notifee, {EventType} from '@notifee/react-native';
import Items from './src/screens/Inventory/InventoryScreen.tsx';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

notifee.onBackgroundEvent(async ({type, detail, navigation}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS && pressAction.id === 'low-stock') {
    // Handle the notification click event here
    // You can use a navigation library like React Navigation to navigate to the desired screen
  }
});

AppRegistry.registerComponent(appName, () => App);
