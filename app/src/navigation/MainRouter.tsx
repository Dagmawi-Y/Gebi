import React, {useContext} from 'react';
import {View} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';

import {StateContext} from '../global/context';

import AuthNavigator from './AuthNavigator';

import Loading from '../components/lotties/Loading';
import colors from '../config/colors';
import AppDrawerNavigator from './AppDrawerNavigator';

const RouteApp = () => {
  const {user, initializing} = useContext(StateContext);

  if (initializing) {
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
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!user ? <AuthNavigator /> : <AppDrawerNavigator />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default RouteApp;

//                                                       README
// Main Router is the main entry Navigation container where Auth is checked and from there navigators re rendered accordingly
// AppDrawerNavigator is a DRAWER Navigator, it nest both AppNavigator (TabNavigator) and Intro Navigator (Stack Navigator)
//
//                                                       Navigation Map
//
//                                            Main Router
//                                                |
//                            AuthNavigator-------|----------AppDrawerNavigtor
//                                 |                                 |
//                       Register--|--Login      AppStackNavigator---|---OtherScreens...(settings...)
//                                                       |
//                                                       |
//                                IntroNavigator(Stack)--|--AppNavigator(Tab)
//                                                                 |
//                                                                 |Sales Screen
//                                                                 |Inventory Screen
//                                                                 |Expenses Screen
//                                                                 |Planning Screen
//
