import React, {useEffect, useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';
import routes from '../../routes';

import Expenses from '../../../screens/Expenses/Expenses';
import AddNewExpense from '../../../screens/Expenses/AddNewExpense';

const Stack = createStackNavigator();
const Stack2 = createStackNavigator();

const ExpensesNavigator = ({navigation}) => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
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
        <Stack.Screen name={routes.sales} component={Expenses} />
        <Stack.Screen name={routes.addNewExpense} component={AddNewExpense} />
      </Stack.Navigator>
    </>
  );
};

export default ExpensesNavigator;
