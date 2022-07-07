import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import routes from '../../routes';

import SalesScreen from '../../../screens/sales/SalesScreen';
import NewSale from '../../../screens/sales/NewSale';
import CustomMenu from '../../../components/misc/CustomMenu';
import SaleDetails from '../../../screens/sales/SaleDetails';

const Stack = createStackNavigator();

const SalesNavigator = ({navigation}) => {
  return (
    <>
      <CustomMenu navigation={navigation} />
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
        <Stack.Screen name={routes.sales} component={SalesScreen} />
        <Stack.Screen name={routes.newSale} component={NewSale} />
        <Stack.Screen name={routes.saleDetails} component={SaleDetails} />
      </Stack.Navigator>
    </>
  );
};

export default SalesNavigator;
