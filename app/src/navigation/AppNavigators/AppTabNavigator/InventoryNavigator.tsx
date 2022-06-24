import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import {StatusBar} from 'react-native';
import routes from './../../routes';
import InventoryScreen from '../../../screens/Inventory/InventoryScreen';
import ItemDetails from '../../../screens/Inventory/ItemDetails';

const Stack = createStackNavigator();

const InventoryNavigator = () => {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={'#EEF1F2'} />

      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          transitionSpec: {
            open: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
            close: {
              animation: 'spring',
              config: {
                stiffness: 1000,
                damping: 500,
                mass: 3,
                overshootClamping: true,
                restDisplacementThreshold: 0.01,
                restSpeedThreshold: 0.01,
              },
            },
          },
        }}>
        <Stack.Screen name={routes.inventory} component={InventoryScreen} />
        <Stack.Screen name={routes.itemDetails} component={ItemDetails} />
      </Stack.Navigator>
    </>
  );
};

export default InventoryNavigator;
