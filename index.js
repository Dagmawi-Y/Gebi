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
import notifee, {EventType, AndroidColor} from '@notifee/react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import Items from './src/screens/Inventory/InventoryScreen.tsx';

notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;
  if (type === EventType.ACTION_PRESS && pressAction.id === 'low-stock') {
    // Handle the notification click event here
    // You can use a navigation library like React Navigation to navigate to the desired screen
  }
});

// -----------------Notifee Local Notification Handling ----------------

// ------------FCM Notification Handling ---------------------
// Handle notification messages when app is in background
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

crashlytics().crash();

// Handle when the app is opened from the notifications
messaging().onNotificationOpenedApp(remoteMessage => {
  console.log(
    'Notifications caused the app to open from background state.',
    remoteMessage.notification,
  );
});

// Handle notification messages when app is in quit state
messaging()
  .getInitialNotification()
  .then(remoteMessage => {
    if (remoteMessage) {
      console.log(
        'Notification caused app to open from quit state:',
        remoteMessage.notification,
      );
    }
  });

// Handle the notifications when the app is in foreground state
messaging().onMessage(async remoteMessage => {
  console.log('Notification recieved on foreground state....', remoteMessage);
  await notifee.requestPermission();
  const channelId = await notifee.createChannel({
    id: 'firebase',
    name: 'Firebase Channel',
    lights: true,
    lightColor: AndroidColor.BLUE,
  });
  await notifee.displayNotification({
    title: remoteMessage.notification.title,
    body: remoteMessage.notification.body,
    android: {
      timestamp: Date.now(),
      showTimestamp: true,
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'low-stock',
        mainComponent: 'items',
      },
    },
  });
});

// ------------FCM Notification Handling ---------------------




AppRegistry.registerComponent(appName, () => App);
