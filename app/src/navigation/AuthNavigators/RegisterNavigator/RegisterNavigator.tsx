import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PhoneInputScreen from '../../../screens/AuthScreens/Registration/PhoneInputScreen';

import {StatusBar} from 'react-native';
import UserInfoInputScreen from '../../../screens/AuthScreens/Registration/UserInfoInputScreen';
import colors from '../../../config/colors';

const Stack = createStackNavigator();

const RegisterationNavigtor = () => (
  <>
    <StatusBar barStyle="dark-content" backgroundColor={colors.lightBlue} />

    <Stack.Navigator>
      <Stack.Screen
        name="PhoneInput"
        component={PhoneInputScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="userInfo"
        component={UserInfoInputScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  </>
);

export default RegisterationNavigtor;
