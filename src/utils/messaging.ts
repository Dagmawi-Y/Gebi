import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const sendLowStockNotification = async itemName => {
  try {
    const notificationThreshold = 50; // Set your desired threshold here

    // Fetch the user's FCM token to send the notification
    const fcmToken = await messaging().getToken();

    if (
      parseFloat(itemName.doc.currentCount) < notificationThreshold &&
      fcmToken
    ) {
      const message = {
        notification: {
          title: 'Low Stock Alert',
          body: `The item "${itemName.doc.item_name}" is running low in stock. Please restock.`,
        },
        token: fcmToken,
      };

      // Send the notification
      await messaging().sendMessage(message as any);
      console.log(message.notification.body);
      messaging().onMessageSent(async remoteMessage => {
        console.log(remoteMessage);
      });
    }
  } catch (error) {
    console.log('Error sending notification:', error);
  }
};

export {
  NotificationListener,
  requestUserPermission,
  getFCMToken,
  sendLowStockNotification,
};
