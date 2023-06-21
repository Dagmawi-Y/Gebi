import React, {useEffect, useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';
import routes from '../../routes';

import Expenses from '../../../screens/Expenses/Expenses';
import Settings from '../../../screens/Settings';
import SelectLanguage from '../../../screens/Settings/SubSettings/SelectLanguage';
import AddEmployee from '../../../screens/Settings/SubSettings/AddEmployee';
import {useTranslation} from 'react-i18next';
import colors from '../../../config/colors';
import EditProfile from '../../../screens/Settings/SubSettings/EditProfile';
import EditEmployee from '../../../screens/Settings/SubSettings/EditEmployee';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';



const Stack = createStackNavigator();

const SettingsNavigator = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitle: `${t('Settings')}`,
        headerTintColor: colors.white,
        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.primary,
          elevation: 0,
        },
        headerTitleStyle: {
          fontSize: 30,
          fontWeight: 'bold',
        },
        
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
          close: {
            animation: 'spring',
            config: {
              stiffness: 1000,
              damping: 500,
              mass: 3,
              overshootClamping: true,
              restDisplacementThreshold: 0.01,
              restSpeedThreshold: 0.01,
            },
          },
        },
      }}>
      <Stack.Screen name={routes.settings} component={Settings} />
      <Stack.Screen
        options={{
          headerTitle: `${t('Add_New_Employee')}`,
        }}
        name={routes.addEmployee}
        component={AddEmployee}
      />
      <Stack.Screen
        options={{
          headerTitle: `${t('Edit_Profile')}`,
        }}
        name={routes.editProfile}
        component={EditProfile}
      />
      <Stack.Screen
        options={{
          headerTitle: `${t('Edit_Employee')}`,
        }}
        name={routes.editEmployee}
        component={EditEmployee}
      />
    </Stack.Navigator>
  );
};

export default SettingsNavigator;
