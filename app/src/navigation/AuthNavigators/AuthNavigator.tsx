import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import RegisterationNavigtor from './RegisterNavigator/RegisterNavigator';

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor={'#EEF1F2'} />

    <Stack.Navigator>
      <Stack.Screen
        name="Register"
        component={RegisterationNavigtor}
        options={{headerShown: false}}
      />
      {/* <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{headerShown: false}}
      /> */}
    </Stack.Navigator>
  </>
);

export default AuthNavigator;
