import React, {useContext, useEffect} from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';

import routes from './../../../routes';
import colors from '../../../../config/colors';
import AddNewCategory from '../../../../screens/Inventory/AddNewCategory';
import Categories from '../../../../screens/Inventory/Categories';
import {StateContext} from '../../../../global/context';
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../../CustomHeader';

const Stack = createStackNavigator();

const CategoryNav = ({navigation}) => {
  const {setHeaderVisible, setHeaderTitle, setHeaderBack, setOnBack} =
    useContext(StateContext);
  const {t} = useTranslation();

  useEffect(() => {
    setHeaderVisible(false);
    setHeaderBack(true);
    setHeaderTitle(t('Categories'));

    return () => {};
  }, []);

  return (
    <>
      {/* <CustomHeader /> */}
      <Stack.Navigator
        initialRouteName={routes.inventoryHome}
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
        <Stack.Screen name={t(routes.categories)} component={Categories} />
        <Stack.Screen name={t(routes.addNewCategory)} component={AddNewCategory} />
      </Stack.Navigator>
    </>
  );
};

export default CategoryNav;
