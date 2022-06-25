import React, {useContext} from 'react';
import {View} from 'react-native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';

import {StateContext} from '../global/context';

import AuthNavigator from './AuthNavigators/AuthNavigator';

import Loading from '../components/lotties/Loading';
import colors from '../config/colors';

import AppMainNavigtor from './AppNavigators/AppMainNavigtor';

const EntryApp = () => {
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
        {!user ? <AuthNavigator /> : <AppMainNavigtor />}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default EntryApp;


// 
// 
// ======================================================README==============================================================
// 
// 
// Main Router is the main entry Navigation container where Auth is checked and from there navigators re rendered accordingly
// AppDrawerNavigator is a DRAWER Navigator, it nest both AppNavigator (TabNavigator) and Intro Navigator (Stack Navigator)
//
//                                                       Navigation Map
//
//                                                      Main Router
//                                                           |
//           AuthNavigator-----------------------------------|-------------   AppMainNavigtor
//                   |                                                              |
//                   |                                                              |
//         Register--|--Login                                                       |  
//                                                           IntroNavigator(Stack)--|-- AppDrawerNavigator
//                                                                                              |
//                                                                                              |
//                                                                   AppTabNavigator(Tab)  -----|---- OtherScreens...(settings...)
//                                                                              |
//                                                                  Sales Screen|
//                                                              Inventory Screen|
//                                                               Expenses Screen|
//                                                               Planning Screen|
//            
// =*= We can only nest Tab in Drawer, but not vise versa. :(