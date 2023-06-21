import React, {useEffect, useState} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useRoute} from '@react-navigation/native';
import routes from '../../routes';

import SalesScreen from '../../../screens/sales/SalesScreen';
import NewSale from '../../../screens/sales/NewSale';
import CustomMenu from '../../../components/misc/CustomMenu';
import SaleDetails from '../../../screens/sales/SaleDetails';
import AddItem from '../../../screens/sales/AddItem';

const Stack = createStackNavigator();

const SalesNavigator = ({navigation}) => {
  const [isHeaderShown, setIsHeaderShown] = useState(true);

  const route = useRoute();

  return (
    <>
      {/* {isHeaderShown && <CustomMenu navigation={navigation} />} */}
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
        {/* <Stack.Screen name={routes.newSale} component={NewSale} />
        <Stack.Screen name={routes.addItem} component={AddItem} /> */}
        {/* <Stack.Screen name={routes.saleDetails} component={SaleDetails} /> */}
      </Stack.Navigator>
    </>
  );
};

export default SalesNavigator;
