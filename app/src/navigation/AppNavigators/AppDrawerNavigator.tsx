import React, {useContext, useEffect} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../../screens/Settings/SettingsScreen';
import colors from '../../config/colors';
import AppTabNavigator from '../AppNavigators/AppTabNavigator/AppTabNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import routes from '../routes';
import IntroNavigator from '../NewUserNavigator/IntroNavigators/IntroNavigator';
import {StateContext} from '../../global/context';
import NewUserNavigator from '../NewUserNavigator/NewUserNavigator';
import {View, Text, StatusBar} from 'react-native';
import {useRoute} from '@react-navigation/native';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';

import {useNavigation} from '@react-navigation/native';

const Drawer = createDrawerNavigator();

function getHeaderTitle(route) {
  // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  // In our case, it's "Feed" as that's the first screen inside the navigator
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Feed';

  switch (routeName) {
    case 'Feed':
      return 'News feed';
    case 'Profile':
      return 'My profile';
    case 'Account':
      return 'My account';
  }
}

function AppDrawerNavigator() {
  const {isNewUser, isReady} = useContext(StateContext);
  const {user, initializing} = useContext(StateContext);

  const navigation = useNavigation();
  const route = useRoute();

  if (!isReady || initializing) return null;

  return (
    <>
      <Drawer.Navigator
        drawerContent={props => (
          <CustomDrawer navigation={navigation} route={route} />
        )}
        screenOptions={({route}) => ({
          swipeEdgeWidth: 150,
          headerShown: true,
          headerTintColor: colors.white,
          headerTitle: getFocusedRouteNameFromRoute(route),
          headerStyle: {
            backgroundColor: colors.primary,
            borderBottomColor: colors.primary,
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
          },

          headerRightContainerStyle: {paddingRight: 20},
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.5}>
              <Icon name="bell" color={colors.white} size={25} />
            </TouchableOpacity>
          ),
        })}>
        <Drawer.Screen name={routes.appNav} component={AppTabNavigator} />
        <Drawer.Screen name="Settings" component={SettingsScreen} />
      </Drawer.Navigator>
    </>
  );
}

export default AppDrawerNavigator;
