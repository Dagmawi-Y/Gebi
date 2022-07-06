import React, {useContext, useEffect} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import colors from '../../config/colors';
import AppTabNavigator from '../AppNavigators/AppTabNavigator/AppTabNavigator';
import Icon from 'react-native-vector-icons/EvilIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import routes from '../routes';
import IntroNavigator from '../NewUserNavigator/IntroNavigators/IntroNavigator';
import {StateContext} from '../../global/context';
import NewUserNavigator from '../NewUserNavigator/NewUserNavigator';
import {View, Text} from 'react-native';
import {useRoute} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

function AppDrawerNavigator() {
  const {isNewUser, isReady} = useContext(StateContext);
  const {user, initializing} = useContext(StateContext);

  if (!isReady || initializing) return null;



  return (
    <>
      <Drawer.Navigator
        // initialRouteName={isNewUser ? routes.intro : routes.appNav}
        screenOptions={{
          headerShown: false,
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
        {/* <Drawer.Screen
          name={routes.register}
          options={{
            headerShown: false,
            swipeEnabled: false,
            drawerItemStyle: {height: 0},
          }}
          component={NewUserNavigator}
        /> */}

        <Drawer.Screen name={routes.appNav} component={AppTabNavigator} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </>
  );
}

export default AppDrawerNavigator;
