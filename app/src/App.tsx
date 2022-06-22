import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import AppNavigator from './navigation/AppNavigator';
import AuthNavigator from './navigation/AuthNavigator';
import IntroNavigator from './navigation/IntroNavigator';

import auth from '@react-native-firebase/auth';

const Stack = createStackNavigator();
const App = () => {
  const [initializing, setInitializing] = useState(true);
  const [lang, setLang] = useState('');
  const [user, setUser] = useState();

  const getLang = async () => {
    let curlang = await AsyncStorage.getItem('lang').catch(err =>
      console.log(err),
    );

    if (curlang) {
      setLang(curlang!.toString());
      return;
    } else {
      return;
    }
  };

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    getLang();
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {!user ? (
          <AuthNavigator />
        ) : (
          <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Group>
              <Stack.Screen name="Intronav" component={IntroNavigator} />
              <Stack.Screen
                name="appNav"
                children={() => <AppNavigator currentLanguage={lang} />}
              />
            </Stack.Group>
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
