import React, {useEffect, useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';
import routes from '../../routes';

import Expenses from '../../../screens/Expenses/Expenses';
import Settings from '../../../screens/Settings';
import SelectLanguage from '../../../screens/Settings/SubSettings/SelectLanguage';

const Stack = createStackNavigator();

const SettingsNavigator = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
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
      <Stack.Screen name={routes.settings} component={Settings} />
      <Stack.Screen name={routes.selectLanguage} component={SelectLanguage} />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
