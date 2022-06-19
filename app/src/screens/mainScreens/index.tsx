import {View, Text, StatusBar} from 'react-native';
import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import placeholder from './placeholder';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../config/colors';
import Sales from './Sales';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import Expenses from './Expenses';
import Items from './Items';
import Plans from './Plans';
import auth from '@react-native-firebase/auth';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  useEffect(() => {
    SystemNavigationBar.lightNavigationBar(false);
    SystemNavigationBar.setNavigationColor('white');
    // SystemNavigationBar.stickyImmersive();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={'dark-content'}
        translucent
        backgroundColor={colors.light}
      />
      <Tab.Navigator initialRouteName="Sales">
        <Tab.Screen
          name="Sales"
          component={Sales}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontWeight: 'bold',
            },
            tabBarLabel: 'ሽያጭ',
            tabBarIcon: ({focused, color, size}) => {
              const icon = focused ? 'bell' : 'home';
              return (
                <MaterialCommunityIcons
                  name={'bank'}
                  color={color}
                  size={size}
                />
              );
            },
            tabBarActiveTintColor: colors.primary,
          }}
        />
        <Tab.Screen
          name="Expenses"
          component={Expenses}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontWeight: 'bold',
            },

            tabBarLabel: 'ወጪ',
            tabBarIcon: ({focused, color, size}) => {
              // const icon=focused?"bell":"home";
              return (
                <MaterialCommunityIcons
                  name={'chart-line'}
                  color={color}
                  size={size}
                />
              );
            },
            tabBarActiveTintColor: colors.primary,
          }}
        />
        <Tab.Screen
          name="Items"
          component={Items}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontWeight: 'bold',
            },

            tabBarLabel: 'እቃዎች',
            tabBarIcon: ({focused, color, size}) => {
              // const icon=focused?"bell":"home";
              return (
                <MaterialCommunityIcons
                  name={'cart-outline'}
                  color={color}
                  size={size}
                />
              );
            },
            tabBarActiveTintColor: colors.primary,
          }}
        />
        <Tab.Screen
          name="Plans"
          component={Plans}
          options={{
            headerShown: false,
            tabBarLabelStyle: {
              fontWeight: 'bold',
            },

            tabBarLabel: 'እቅድ',
            tabBarIcon: ({focused, color, size}) => {
              // const icon=focused?"bell":"home";
              return (
                <MaterialCommunityIcons
                  name={'clipboard-list-outline'}
                  color={color}
                  size={size}
                />
              );
            },
            tabBarActiveTintColor: colors.primary,
          }}
        />
      </Tab.Navigator>
    </>
  );
};
Tabs.routeName = 'TabBarRoute';

export default Tabs;
