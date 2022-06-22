import React, {useState, useEffect} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';

import SalesScreen from '../screens/sales/SalesScreen';
import ExpensesScreen from '../screens/Expenses/Expenses';
import InventoryScreen from '../screens/Inventory/InventoryScreen';
import PlanerScreen from '../screens/Planner/PlannerScreen';
import NewSaleButton from './NewSaleButton';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import routes from './routes';

const logout = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};

const Tab = createBottomTabNavigator();

const AppNavigator = ({currentLanguage}) => {
  const [lang, setLang] = useState(currentLanguage);


  useEffect(() => {
    // clearLang();
  }, []);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name={routes.inventory}
        component={InventoryScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="warehouse" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        component={SalesScreen}
        name={routes.sales}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="home" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name={routes.newSale}
        component={SalesScreen}
        options={({navigation}) => ({
          tabBarButton: () => <NewSaleButton onPress={logout} />,
        })}
      />

      <Tab.Screen
        name={routes.expenses}
        component={ExpensesScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="trending-up" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={routes.plan}
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
