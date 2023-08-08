const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendLowStockNotification = functions.firestore
  .document('inventory/{documentId}')
  .onUpdate(async (change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();
    console.log(newValue);
    const fcmToken = await newValue.fcmToken;
    // Check if the 'name' field has changed
    if (newValue.currentCount < 10) {
      // Get the FCM token from the user's document (replace 'fcmToken' with the actual field name

      if (fcmToken) {
        const message = {
          notification: {
            title: 'Low on stock.',
            body: `${newValue.item_name} is low on stock`,
          },
          token: fcmToken,
        };
        try {
          // Send the notification using FCM
          await admin
            .messaging()
            .send(message)
            .then(response => {
              console.log('Notification sent successfully:', response);
            });
          // catch if there are any errors
        } catch (error) {
          console.error('Error sending notification:', error);
        }
        // check if there is no token provided for the notification
      } else {
        console.log('FCM token not found for user. Cannot send notification.');
      }
      //   the current count of the item is not less than 10, do nothing
    } else {
      console.log('Current Count is greater than 10. No notification sent.');
    }
    return null; // Return null to indicate success (not needed, but won't return a warning)
  });

exports.checkLowStock = functions.pubsub
  .schedule('every 2 hours')
  .onRun(async context => {
    const inventoryRef = admin.firestore().collection('inventory');
    const querySnapshot = await inventoryRef
      .where('currentCount', '<', 10)
      .get();

    querySnapshot.forEach(doc => {
      const item = doc.data();
      console.log(item);
      const fcmToken = item.fcmToken;

      if (fcmToken) {
        const message = {
          notification: {
            title: 'Low on stock.',
            body: `${item.item_name} is low on stock`,
          },
          token: fcmToken,
        };

        admin
          .messaging()
          .send(message)
          .then(() => {
            console.log('Notification sent successfully.');
          })
          .catch(error => {
            console.error('Error sending notification:', error);
          });
      } else {
        console.log('FCM token not found for user. Cannot send notification.');
      }
    });
  });
