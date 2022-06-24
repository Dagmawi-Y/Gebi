import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import colors from '../../config/colors';
import AppTabNavigator from '../AppNavigators/AppTabNavigator/AppTabNavigator';

const Drawer = createDrawerNavigator();

function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Gebi"
      screenOptions={{
        headerShown: true,
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.primary,
          elevation: 0,
        },
      }}>
      <Drawer.Screen name="Gebi" component={AppTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default AppDrawerNavigator;
