import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import PlanerScreen from '../../../screens/Planner/PlannerScreen';

import {Image, StatusBar} from 'react-native';

import routes from './../../routes';
import InventoryNavigator from './InventoryNavigator';
import colors from '../../../config/colors';
import SalesNavigator from './SalesNavigator';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons';
import ExpensesNavigator from './ExpensesNavigator';

const Tab = createBottomTabNavigator();

const AppTabNavigator = () => {
  return (
    <>
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
              <Icon name="point-of-sale" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name={routes.expensesNav}
          component={ExpensesNavigator}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon3
                name="clipboard-arrow-up-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />

        <Tab.Screen
          name={routes.inventoryNav}
          component={InventoryNavigator}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon3 name="warehouse" color={color} size={size} />
            ),
          }}
        />

        <Tab.Screen
          name={routes.plan}
          component={PlanerScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <Icon2 name="clipboard-pencil" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default AppTabNavigator;
