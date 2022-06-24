import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {StateContext} from '../global/context';

import AppNavigator from './AppNavigator';
import IntroNavigator from './IntroNavigator';
import routes from './routes';

import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsScreen from '../screens/Settings/SettingsScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Drawer.Screen name="Home" component={AppStackNavigator} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}

const AppStackNavigator = () => {
  const {curlang, introDone} = useContext(StateContext);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={curlang && introDone ? routes.appNav : routes.introNav}>
      <Stack.Group>
        <Stack.Screen name={routes.introNav} component={IntroNavigator} />
        <Stack.Screen name={routes.appNav} children={() => <AppNavigator />} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppDrawerNavigator;
