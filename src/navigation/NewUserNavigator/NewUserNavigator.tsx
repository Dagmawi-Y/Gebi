import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import routes from '../routes';
import {StateContext} from '../../global/context';
import RegisterationNavigtor from './RegisterNavigator/RegisterNavigator';
import IntroNavigator from './IntroNavigators/IntroNavigator';

const Stack = createStackNavigator();

const NewUserNavigator = () => {
  const {curlang, introDone} = useContext(StateContext);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={'#EEF1F2'} />

      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name={routes.introNav} component={IntroNavigator} />
      </Stack.Navigator>
    </>
  );
};
export default NewUserNavigator;
