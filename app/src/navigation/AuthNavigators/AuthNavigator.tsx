import React, {useContext} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar} from 'react-native';
import routes from '../routes';
import PhoneInputScreen from '../../screens/AuthScreens/Registration/PhoneInputScreen';
import RegisterationNavigtor from '../NewUserNavigator/RegisterNavigator/RegisterNavigator';
import UserInfoInputScreen from '../../screens/AuthScreens/Registration/UserInfoInputScreen';
import {StateContext} from '../../global/context';
import Confirmation from '../../screens/AuthScreens/Registration/Confirmation';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const {user} = useContext(StateContext);

  return (
    <>
      <Stack.Navigator
        initialRouteName={user ? routes.register : routes.otp}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={routes.otp} component={PhoneInputScreen} />
        <Stack.Screen name={routes.confirmation} component={Confirmation} />
        <Stack.Screen
          name={routes.register}
          component={UserInfoInputScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
};
export default AuthNavigator;
