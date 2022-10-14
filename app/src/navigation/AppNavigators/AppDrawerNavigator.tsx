import React, {useContext, useEffect, useState} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';
import SettingsNavigator from './SettingsNavigator';
import colors from '../../config/colors';
import AppTabNavigator from '../AppNavigators/AppTabNavigator/AppTabNavigator';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TouchableOpacity} from 'react-native-gesture-handler';
import routes from '../routes';
import {useRoute} from '@react-navigation/native';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';

import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';

import {useNavigation} from '@react-navigation/native';
import Categories from '../../screens/Inventory/Categories';
import HomeScreen from '../../screens/HomeScreen/HomeScreen';
import NewSale from '../../screens/sales/NewSale';
import AddItem from '../../screens/sales/AddItem';
import SaleDetails from '../../screens/sales/SaleDetails';
import {View} from 'react-native';
import AddNewExpense from '../../screens/Expenses/AddNewExpense';
import ItemDetails from '../../screens/Inventory/ItemDetails';
import AddNewItem from '../../screens/Inventory/AddNewItem';
import CategoryNav from './AppTabNavigator/InventoryNavigation/CategoriesNav';
import Edit from '../../screens/Inventory/Edit';
import AddEmployee from '../../screens/Settings/SubSettings/AddEmployee';
const Drawer = createDrawerNavigator();

function headerBackKey(navigation) {
  return (
    <TouchableOpacity
      style={{marginLeft: 15}}
      activeOpacity={0.5}
      onPress={() => navigation.goBack()}>
      <Icon name="arrow-left" color={colors.white} size={25} />
    </TouchableOpacity>
  );
}

function AppDrawerNavigator({}) {
  const {t} = useTranslation();
  const navigation = useNavigation();

  const {initializing} = useContext(StateContext);

  const route = useRoute();

  if (initializing) {
    return null;
  }

  return (
    <>
      <Drawer.Navigator
        drawerContent={props => (
          <CustomDrawer navigation={navigation} route={route} />
        )}
        screenOptions={({route}) => ({
          swipeEdgeWidth: 150,
          headerShown: true,
          headerTintColor: colors.white,
          headerTitle: t(`${getFocusedRouteNameFromRoute(route) || 'Gebi'}`),
          headerStyle: {
            backgroundColor: colors.primary,
            borderBottomColor: colors.primary,
            elevation: 0,
          },
          headerTitleStyle: {
            fontSize: 30,
            fontWeight: 'bold',
          },

          headerRightContainerStyle: {paddingRight: 20},
          headerRight: () => (
            <TouchableOpacity activeOpacity={0.5}>
              <Icon name="bell" color={colors.white} size={25} />
            </TouchableOpacity>
          ),
        })}>
        {/* <Drawer.Screen name={routes.homeScreen} component={HomeScreen} /> */}
        <Drawer.Screen name={routes.Gebi} component={AppTabNavigator} />

        {/* Sales subscreens */}
        <Drawer.Screen
          name={routes.saleDetails}
          component={SaleDetails}
          options={{
            headerTitle: t(routes.saleDetails),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        <Drawer.Screen
          name={routes.newSale}
          component={NewSale}
          options={{
            headerTitle: t(routes.newSale),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        <Drawer.Screen
          name={routes.addItem}
          component={AddItem}
          options={{
            headerTitle: t(routes.addItem),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        {/* Sales subscreens END */}

        {/* Expenses subscreens */}
        <Drawer.Screen
          name={routes.addNewExpense}
          component={AddNewExpense}
          options={{
            headerTitle: t(routes.addNewExpense),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        {/* Expenses subscreens END */}

        {/* Inventory subscreens */}
        <Drawer.Screen
          name={routes.itemDetails}
          component={ItemDetails}
          options={{
            headerTitle: t(routes.itemDetails),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        <Drawer.Screen
          name={routes.addNewItem}
          component={AddNewItem}
          options={{
            headerTitle: t(routes.addNewItem),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        <Drawer.Screen
          name={routes.EditItem}
          component={Edit}
          options={{
            headerTitle: t(routes.EditItem),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        <Drawer.Screen
          name={routes.categoryNav}
          component={CategoryNav}
          options={{
            headerTitle: t('categoryNav'),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        {/* Inventory subscreens END */}

        <Drawer.Screen
          name={routes.settingsNav}
          options={{
            headerTitle: t('Settings'),
            headerShown: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.goBack();
                }}>
                <Icon
                  name="arrow-left"
                  size={25}
                  color={colors.white}
                  style={{marginLeft: 10}}
                />
              </TouchableOpacity>
            ),
          }}
          component={SettingsNavigator}
        />
      </Drawer.Navigator>
    </>
  );
}

export default AppDrawerNavigator;
