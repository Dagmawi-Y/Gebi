const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendLowStockNotification = functions.pubsub
  .schedule('0 */2 * * *')
  .onRun(async context => {
    const functions = require('firebase-functions');
    const admin = require('firebase-admin');
    admin.initializeApp();

    exports.sendLowStockNotification = functions.firestore
      .document('inventory/{documentId}')
      .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        console.log(newValue);

        // Check if the 'name' field has changed
        if (newValue.currentCount < 10) {
          // Get the FCM token from the user's document (replace 'fcmToken' with the actual field name)
          const fcmToken = await newValue.fcmToken;

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
              admin
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
            console.log(
              'FCM token not found for user. Cannot send notification.',
            );
          }
          //   the current count of the item is not less than 10, do nothing
        } else {
          console.log(
            'Current Count is greater than 10. No notification sent.',
          );
        }

        return null; // Return null to indicate success (not needed, but won't return a warning)
      });
  });
