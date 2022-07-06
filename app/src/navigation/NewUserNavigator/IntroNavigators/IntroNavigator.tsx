import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import {StatusBar} from 'react-native';
import Intro from '../../../screens/Intro/Intro';
import LanguageSelector from '../../../screens/Intro/LanguageSelector';
import routes from './../../routes';
import {StateContext} from '../../../global/context';

const Stack = createStackNavigator();

const IntroNavigator = () => {
  const {curlang} = useContext(StateContext);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={'#EEF1F2'} />
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={routes.langSelect} component={LanguageSelector} />
        <Stack.Screen name={routes.intro} component={Intro} />
      </Stack.Navigator>
    </>
  );
};

export default IntroNavigator;
