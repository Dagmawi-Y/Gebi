import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {StateContext} from '../../global/context';

import AppDrawerNavigator from './AppDrawerNavigator';
import routes from './../routes';
import IntroNavigator from '../IntroNavigators/IntroNavigator';

const Stack = createStackNavigator();

const AppMainNavigtor = () => {
  const {curlang, introDone} = useContext(StateContext);
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={curlang && introDone ? routes.appNav : routes.introNav}>
      <Stack.Group>
        <Stack.Screen name={routes.introNav} component={IntroNavigator} />
        <Stack.Screen
          name={routes.appNav}
          children={() => <AppDrawerNavigator />}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
};

export default AppMainNavigtor;
