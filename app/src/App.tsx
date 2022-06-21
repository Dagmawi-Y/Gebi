import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
// import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';

import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';

import auth from '@react-native-firebase/auth';

import LanguageSelector from './screens/LanguageSelector/LanguageSelector';

const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    // SplashScreen.hide();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;

  return (
    <SafeAreaProvider>
      <LanguageSelector />
      {/* <NavigationContainer>

        {!user ? <AuthNavigator /> : <AppNavigator />}
      </NavigationContainer> */}
    </SafeAreaProvider>
  );
};

export default App;
