import React, {useEffect, useContext, useState} from 'react';
import {View, StatusBar} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import auth from '@react-native-firebase/auth';

import {StateContext} from '../global/context';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import IntroNavigator from './IntroNavigator';
import routes from './routes';
import LanguageSelector from '../screens/Intro/LanguageSelector';
import Loading from '../components/lotties/Loading';
import colors from '../config/colors';

const Stack = createStackNavigator();

const RouteApp = () => {
  const {curlang, introDone, user, setUser, initializing, setInitializing} =
    useContext(StateContext);

  if (initializing)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          backgroundColor: colors.white,
        }}>
        <Loading size={150} />
      </View>
    );

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!user ? (
          <AuthNavigator />
          ) : (
            <Stack.Navigator
            screenOptions={{headerShown: false}}
            initialRouteName={
              curlang && introDone ? routes.appNav : routes.introNav
            }>
            <Stack.Group>
              <Stack.Screen name={routes.introNav} component={IntroNavigator} />
              <Stack.Screen
                name={routes.appNav}
                children={() => <AppNavigator />}
              />
            </Stack.Group>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RouteApp;
