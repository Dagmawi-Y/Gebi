import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert, AppRegistry} from 'react-native';
import {useTranslation} from 'react-i18next';
import {t} from 'i18next';
import notifee, {
  IntervalTrigger,
  TriggerType,
  TimeUnit,
  AndroidColor,
} from '@notifee/react-native';
import Items from '../screens/Inventory/InventoryScreen';

AppRegistry.registerComponent('items', () => Items);
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

async function sendLowStockNotification(item: {id?: string; doc: any}) {
  // Get the timestamp of the last run
  const lastRunTimestampString: any = await AsyncStorage.getItem(
    'lastRunTimestamp',
  );
  const lastRunTimestamp = parseInt(lastRunTimestampString, 10) || 0;

  // Check if the last run was more than 10 minutes ago
  if (Date.now() - lastRunTimestamp > 600000) {
    // The last run was more than 10 minutes ago, so run the function
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'local',
      name: 'Local Channel',
      lights: true,
      lightColor: AndroidColor.BLUE,
    });
    // Display a notification
    await notifee.displayNotification({
      title: 'Low Stock Alert',
      body: `${item.doc.item_name} is running low in stock. Please restock.`,
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

    // Update the timestamp of the last run
    await AsyncStorage.setItem('lastRunTimestamp', JSON.stringify(Date.now()));
  } else {
    // The last run was less than 10 minutes ago, so do nothing
    console.log(
      'Not sending notification because the last run was less than 10 minutes ago.',
    );
  }
}

async function triggerLowInStock(item: {id?: string; doc: any}) {
  const trigger: IntervalTrigger = {
    type: TriggerType.INTERVAL,
    interval: 15,
    timeUnit: TimeUnit.MINUTES,
  };

  // Create a trigger notification
  await notifee.createTriggerNotification(
    {
      title: 'Item in stock is low',
      body: `${item.doc.item_name} is running low in stock. Please restock.`,
      android: {
        channelId: 'lowStockTrigger',
      },
    },
    trigger,
  );
  console.log(trigger.interval, trigger.timeUnit);
}

const subscriptionAlert = async (daysUntilExpiry: any) => {
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
  requestUserPermission,
  getFCMToken,
  sendLowStockNotification,
  triggerLowInStock,
};
