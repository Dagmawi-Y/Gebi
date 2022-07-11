import React, {useContext, useEffect} from 'react';
import {StatusBar, View} from 'react-native';

import {StateContext} from '../global/context';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import AppDrawerNavigator from './AppNavigators/AppDrawerNavigator';
import AuthNavigator from './AuthNavigators/AuthNavigator';

import Loading from '../components/lotties/Loading';
import colors from '../config/colors';
import firestore from '@react-native-firebase/firestore';
import NewUserNavigator from './NewUserNavigator/NewUserNavigator';
import LottieView from 'lottie-react-native';

const EntryApp = () => {
  const {user, initializing} = useContext(StateContext);
  const {isNewUser} = useContext(StateContext);
  const {isReady, setIsNewUser} = useContext(StateContext);

  if (initializing && !isReady) {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 12,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LottieView
          style={{
            height: 100,
          }}
          source={require('../assets/loading.json')}
          speed={1.3}
          autoPlay
          loop={true}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      {!user || isNewUser ? <AuthNavigator /> : <AppDrawerNavigator />}
    </SafeAreaProvider>
  );
};

export default EntryApp;

//
//
//
//
//                                                       README
// Main Router is the main entry Navigation container where Auth is checked and from there navigators re rendered accordingly
// AppDrawerNavigator is a DRAWER Navigator, it nest both AppNavigator (TabNavigator) and Intro Navigator (Stack Navigator)
//
//                                                       Navigation Map
//
//                                                      Main Router
//                                                           |
//              AuthNavigator--------------------------------|------------- AppDrawerNavigtor
//        -----------|-------------                                                 |
//       |           |            |                                                 |
//  Register      Login   IntroNavigator(Stack)                                     |
//                                                       AppTabNavigator(Tab)  -----|---- OtherScreens...(settings...)
//                                                                  |
//                                                      Sales Screen|
//                                                  Inventory Screen|
//                                                   Expenses Screen|
//                                                   Planning Screen|
//
// =*= We can only nest TabNavigator in DrawerNavigator, but not vise versa. :(
