import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import SalesScreen from '../screens/sales/SalesScreen';
import ExpensesScreen from '../screens/Expenses/Expenses';
import InventoryScreen from '../screens/Inventory/InventoryScreen';
import PlanerScreen from '../screens/Planner/PlannerScreen';
import NewSaleButton from './NewSaleButton';

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
  const [lang, setLang] = useState('en');

  useEffect(() => {}, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Inventory"
        component={InventoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="warehouse" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        children={() => <SalesScreen lang={lang} />}
        name="Sales"
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name="NewSale"
        component={SalesScreen}
        options={({navigation}) => ({
          tabBarButton: () => <NewSaleButton onPress={logout} />,
        })}
      />

      <Tab.Screen
        name="Expenses"
        component={ExpensesScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="trending-up" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Plan"
        component={PlanerScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <Icon name="pencil" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
