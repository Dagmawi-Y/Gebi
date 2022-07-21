import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Pressable, StatusBar} from 'react-native';
import {StateContextProvider} from './global/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {createStackNavigator} from '@react-navigation/stack';

import {NavigationContainer} from '@react-navigation/native';

import EntryApp from './navigation/EntryApp';

import SplashScreen from 'react-native-splash-screen';
import IntroNavigator from './navigation/NewUserNavigator/IntroNavigators/IntroNavigator';
import LottieView from 'lottie-react-native';
import colors from './config/colors';

const Stack = createStackNavigator();

const App = () => {
  const [lang, setLang] = useState('');
  const [intro, setIntro] = useState(false);
  const [ready, setReady] = useState(false);

  const initialize = async () => {
    try {
      await AsyncStorage.getItem('lang').then(l => {
        setLang(l!);
      });
      await AsyncStorage.getItem('introDone').then(l => {
        setIntro(Boolean(l!));
      });
      setReady(true);
    } catch (error) {
      console.log(error);
    }
  };
  const reset = async () => {
    try {
      await AsyncStorage.removeItem('lang').then(l => {});
      await AsyncStorage.removeItem('introDone').then(l => {});
      setReady(false);
    } catch (error) {
      console.log(error);
    }
  };
  const setData = async () => {
    try {
      await AsyncStorage.setItem('lang', 'Amharic').then(l => {});
      await AsyncStorage.setItem('introDone', 'true').then(l => {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setTimeout(() => SplashScreen.hide(), 1500);
    initialize();
    // reset();
  }, []);

  if (!ready) {
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
          source={require('./assets/loading.json')}
          speed={1.3}
          autoPlay
          loop={true}
        />
      </View>
    );
  }

  return (
    <StateContextProvider>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={lang && intro ? 'app' : 'intro'}
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="intro" component={IntroNavigator} />
          <Stack.Screen name="app" component={EntryApp} />
        </Stack.Navigator>
      </NavigationContainer>
    </StateContextProvider>
  );
};

export default App;
