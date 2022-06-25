import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import colors from '../../config/colors';
import AppTabNavigator from '../AppNavigators/AppTabNavigator/AppTabNavigator';
import Icon from 'react-native-vector-icons/EvilIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';

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
        headerRightContainerStyle: {paddingRight: 20},
        headerRight: () => (
          <TouchableOpacity activeOpacity={0.5}>
            <Icon name="search" color={colors.white} size={28} />
          </TouchableOpacity>
        ),
        headerTitleStyle: {
          fontSize: 30,
        },
      }}>
      <Drawer.Screen name="Gebi" component={AppTabNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

export default AppDrawerNavigator;
