/**
 * @format
 */
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import './i18n.config';
import messaging from '@react-native-firebase/messaging';
import BackgroundFetch from 'react-native-background-fetch';

messaging().setBackgroundMessageHandler(async remoteMessage =>{
    console.log("Message handled in the background!",remoteMessage)
})

const headlessTask = async (event) => {
    if (event.taskId === 'lowStockCheck') {
      // Call your function to check for low stock and send notifications
      await checkLowStockAndSendNotification();
      BackgroundFetch.finish(event.taskId);
    }
  };
  
  // Register the headlessTask
  BackgroundFetch.registerHeadlessTask(headlessTask);

AppRegistry.registerComponent(appName, () => App);
