import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ExpensesScreen from '../../../screens/Expenses/Expenses';
import PlanerScreen from '../../../screens/Planner/PlannerScreen';

import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import routes from './../../routes';
import InventoryNavigator from './InventoryNavigator';
import colors from '../../../config/colors';
import SalesNavigator from './SalesNavigator';

const Tab = createBottomTabNavigator();

const AppTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        headerTintColor: colors.white,

        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.primary,
          elevation: 0,
        },
      }}>
      <Tab.Screen
        name={routes.salesNav}
        component={SalesNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="warehouse" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name={routes.inventoryNav}
        component={InventoryNavigator}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="warehouse" color={color} size={size} />
          ),
        }}
      />

      <Tab.Screen
        name={routes.expenses}
        component={ExpensesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcon name="trending-up" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name={routes.plan}
        component={PlanerScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <Icon name="pencil" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AppTabNavigator;
