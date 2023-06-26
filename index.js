/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";
import './i18n.config';

PushNotification.configure({
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
      },
      requestPermissions: Platform.OS === 'ios'
});
messaging().setBackgroundMessageHandler(async remoteMessage =>{
    console.log("Message handled in the background!",remoteMessage)
})

AppRegistry.registerComponent(appName, () => App);
