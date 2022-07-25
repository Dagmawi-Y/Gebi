import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';


import routes from './../../routes';
import InventoryScreen from '../../../screens/Inventory/InventoryScreen';
import ItemDetails from '../../../screens/Inventory/ItemDetails';
import colors from '../../../config/colors';
import Edit from '../../../screens/Inventory/Edit';
import CustomMenu from '../../../components/misc/CustomMenu';
import AddNewCategory from '../../../screens/Inventory/AddNewCategory';
import AddNewItem from '../../../screens/Inventory/AddNewItem';

const Stack = createStackNavigator();

const InventoryNavigator = ({navigation}) => {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
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
          headerTintColor: colors.white,
          headerStyle: {
            backgroundColor: colors.primary,
            borderBottomColor: colors.primary,
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 30,
          },
        }}>
        <Stack.Screen name={routes.inventoryHome} component={InventoryScreen} />
        <Stack.Screen name={routes.addNewCategory} component={AddNewCategory} />
        <Stack.Screen
          name={routes.itemDetails}
          options={{headerShown: false}}
          component={ItemDetails}
        />
        <Stack.Screen
          name={routes.addNewItem}
          options={{headerShown: false}}
          component={AddNewItem}
        />
        <Stack.Screen
          name={routes.EditItem}
          options={{headerShown: true}}
          component={Edit}
        />
      </Stack.Navigator>
    </>
  );
};

export default InventoryNavigator;
