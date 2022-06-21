import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Intro from '../screens/Intro/Intro';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';

// import routes from './routes';

const logout = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [lang, setLang] = useState('');

  useEffect(() => {
    // clearLang();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Intro"
        component={Intro}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="warehouse" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
