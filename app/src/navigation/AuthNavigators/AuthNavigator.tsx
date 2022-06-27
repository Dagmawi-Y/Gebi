import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../../screens/AuthScreens/LoginScreen';
import RegisterScreen from '../../screens/AuthScreens/Registration/PhoneInputScreen';
import {StatusBar} from 'react-native';
import routes from '../routes';
import IntroNavigator from '../IntroNavigators/IntroNavigator';
import {StateContext} from '../../global/context';
import RegisterationNavigtor from './RegisterNavigator/RegisterNavigator';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const {curlang, introDone} = useContext(StateContext);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={'#EEF1F2'} />

      <Stack.Navigator
        screenOptions={{headerShown: false}}
        // initialRouteName={
        //   curlang && introDone ? routes.appNav : routes.introNav
        // }
      >
        <Stack.Screen name="Register" component={RegisterationNavigtor} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name={routes.introNav} component={IntroNavigator} />
      </Stack.Navigator>
    </>
  );
};
export default AuthNavigator;
