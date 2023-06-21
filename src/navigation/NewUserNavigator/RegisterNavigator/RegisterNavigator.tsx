import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import PhoneInputScreen from '../../../screens/AuthScreens/Registration/PhoneInputScreen';

import {StatusBar} from 'react-native';
import UserInfoInputScreen from '../../../screens/AuthScreens/Registration/UserInfoInputScreen';
import colors from '../../../config/colors';
import routes from '../../routes';

const Stack = createStackNavigator();

const RegisterationNavigtor = () => (
  <>
    <StatusBar barStyle="light-content" backgroundColor={colors.lightBlue} />

    <Stack.Navigator>
      <Stack.Screen
        name={routes.register}
        component={UserInfoInputScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  </>
);

export default RegisterationNavigtor;
