import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {useTranslation} from 'react-i18next';
import {t} from 'i18next';
import notifee from '@notifee/react-native';

const messagingTranslation = () => {
  const {t} = useTranslation();
};

async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

async function getFCMToken() {
  let fcmtoken = await AsyncStorage.getItem('fcmtoken');
  console.log(fcmtoken, 'old token');
  if (!fcmtoken) {
    try {
      const fcmtoken = await messaging().getToken();
      if (fcmtoken) {
        console.log(fcmtoken, 'new token');
        await AsyncStorage.setItem('fcmtoken', fcmtoken);
      } else {
      }
    } catch (e) {
      console.log(e, 'error in fetching fcmtoken');
    }
  }
}

const NotificationListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  // Check whether an initial notification is available
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

  messaging().onMessage(async remoteMessage => {
    console.log(
      'Notification caused app to open from foreground state:',
      remoteMessage,
    );
  });
};

// const sendLowStockNotification = async itemName => {
//   try {
//     const notificationThreshold = 10; // Set your desired threshold here

//     // Fetch the user's FCM token to send the notification
//     const fcmToken = await messaging().getToken();

//     if (
//       parseFloat(itemName.doc.currentCount) < notificationThreshold &&
//       fcmToken
//     ) {
//       const message = {
//         notification: {
//           title: t('Low Stock Alert'),
//           body: t(
//             `${itemName.doc.item_name} is running low in stock. Please restock.`,
//           ),
//         },
//         token: fcmToken,
//       };

//       // Send the notification
//       await messaging().sendMessage(message as any);
//       Alert.alert(
//         JSON.stringify(message.notification.title),
//         JSON.stringify(message.notification.body),
//       );
//     }
//   } catch (error) {
//     console.log('Error sending notification:', error);
//   }
// };

async function sendLowStockNotification(item) {
  // Request permissions (required for iOS)
  await notifee.requestPermission();

  // Create a channel (required for Android)
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'Default Channel',
  });

  // Display a notification
  await notifee.displayNotification({
    title: 'Low Stock Alert',
    body: `${item.doc.item_name} is running low in stock. Please restock.`,
    android: {
      channelId,
      smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
      // pressAction is needed if you want the notification to open the app when pressed
      pressAction: {
        id: 'low-stock',
      },
    },
  });
}

const subscriptionAlert = async daysUntilExpiry => {
  try {
    const notificationTitle = 'Subscription Expiry Alert';
    const notificationBody = `Your subscription is expiring in ${daysUntilExpiry} days.`;

    // Fetch the user's FCM token to send the notification
    const fcmToken = await messaging().getToken();

    if (fcmToken) {
      const remoteMessage = {
        notification: {
          title: notificationTitle,
          body: notificationBody,
        },
        token: fcmToken,
      };

      // Send the notification
      await messaging().sendMessage(remoteMessage as any);
      Alert.alert(notificationTitle, notificationBody);
    }
  } catch (error) {
    console.log('Error sending subscription alert:', error);
  }
};

export {
  subscriptionAlert,
  NotificationListener,
  requestUserPermission,
  getFCMToken,
  sendLowStockNotification,
};
