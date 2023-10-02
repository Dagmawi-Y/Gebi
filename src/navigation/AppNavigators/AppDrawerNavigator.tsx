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
import {View, Text} from 'react-native';
import AddNewExpense from '../../screens/Expenses/AddNewExpense';
import ItemDetails from '../../screens/Inventory/ItemDetails';
import AddNewItem from '../../screens/Inventory/AddNewItem';
import CategoryNav from './AppTabNavigator/InventoryNavigation/CategoriesNav';
import Edit from '../../screens/Inventory/Edit';
import AddEmployee from '../../screens/Settings/SubSettings/AddEmployee';
import Subscriptions from '../../screens/subscriptions/Subscriptions';
import EditInventoryItem from '../../screens/Inventory/EditInventoryItem';
import AddNewCategory from '../../screens/Inventory/AddNewCategory';
import SalesReports from '../../screens/Reports/genralSaleReports';
import HelpIcon from 'react-native-vector-icons/dist/FontAwesome';

import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
  TourGuideContext,
} from 'rn-tourguide';

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
  // Use Hooks to control!
  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
  } = useTourGuideController();

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
              {/* <Icon name="bell" color={colors.white} size={25} /> */}
              {getFocusedRouteNameFromRoute(route) == 'Home' ||
              getFocusedRouteNameFromRoute(route) == 'ገቢ' ? (
                <TouchableOpacity
                  style={{
                    display: 'flex',
                    alignSelf: 'flex-end',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => start()}>
                  <HelpIcon name="info-circle" size={17} color={colors.green} />
                  <Text style={{marginLeft: 5}}>{t('Help')}</Text>
                </TouchableOpacity>
              ) : null}
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
          name={routes.EditInventoryItem}
          component={EditInventoryItem}
          options={{
            headerTitle: t(routes.EditInventoryItem),
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
        <Drawer.Screen
          name={routes.addNewCategory}
          component={AddNewCategory}
          options={{
            headerTitle: t(routes.addNewCategory),
            headerLeft: () => headerBackKey(navigation),
          }}
        />
        <Drawer.Screen
          name={routes.SalesReports}
          component={SalesReports}
          options={{
            headerTitle: t('Sales Report'),
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
        <Drawer.Screen
          name={routes.subscriptions}
          options={{
            headerTitle: t('Subscription'),
            headerShown: true,
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
          component={Subscriptions}
        />
      </Drawer.Navigator>
    </>
  );
}

export default AppDrawerNavigator;
