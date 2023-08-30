import React, {useContext, useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import PlanerScreen from '../../../screens/Planner/PlannerScreen';
import {useTranslation} from 'react-i18next';

import routes from './../../routes';
import colors from '../../../config/colors';

import {
  InventoryIcon,
  SalesIcon,
  ExpensesIcon,
  PlannerIcon,
  HomeIcon,
} from '../../../components/Icons';
import SalesScreen from '../../../screens/sales/SalesScreen';
import Expenses from '../../../screens/Expenses/Expenses';
import InventoryScreen from '../../../screens/Inventory/InventoryScreen';
import HomeScreen from '../../../screens/HomeScreen/HomeScreen';
import {StateContext} from '../../../global/context';
import {View, Text} from 'react-native';
import LottieView from 'lottie-react-native';
import {
  TourGuideProvider, // Main provider
  TourGuideZone, // Main wrapper of highlight component
  TourGuideZoneByPosition, // Component to use mask on overlay (ie, position absolute)
  useTourGuideController, // hook to start, etc.
  TourGuideContext,
} from 'rn-tourguide';

const Tab = createBottomTabNavigator();

const AppTabNavigator = ({navigation}) => {
  const {t} = useTranslation();
  const {userInfo, isAdmin, setIsAdmin} = useContext(StateContext);
  const [loading, setLoading] = useState<boolean>(true);

  const {
    sales,
    setSales,
    expense,
    setExpense,
    plan,
    setPlan,
    inventory,
    setInventory,
  } = useContext(StateContext);

  const {
    canStart, // a boolean indicate if you can start tour guide
    start, // a function to start the tourguide
    stop, // a function  to stopping it
    eventEmitter, // an object for listening some events
    tourKey,
  } = useTourGuideController('tour');

  const setPrivileges = () => {
    const roles = userInfo[0]?.doc?.roles;

    roles.map(i => {
      switch (i) {
        case 'admin':
          setIsAdmin(true);
          break;
        case 'sales':
          setSales(true);
          break;
        case 'expense':
          setExpense(true);
          break;
        case 'plan':
          setPlan(true);
          break;
        case 'inventory':
          setInventory(true);
          break;
        default:
          break;
      }
    });
    setLoading(false);
  };

  useEffect(() => {
    if (userInfo.length) {
      setPrivileges();
    }
  }, []);

  if (loading || !userInfo) {
    return (
      <View
        style={{
          flex: 1,
          zIndex: 12,
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LottieView
          style={{
            height: 100,
          }}
          source={require('../../../assets/loading.json')}
          speed={1.3}
          autoPlay
          loop={true}
        />
      </View>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerTintColor: colors.white,
        tabBarLabelStyle: {fontSize: 14},
        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.primary,
          elevation: 0,
        },
      }}>
      <Tab.Screen
        name={t(routes.homeScreen)}
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <HomeIcon color={color} size={size + 8} />
          ),
          tabBarLabel: t('Home'),
          headerTitle: t('Home'),
        }}
      />
      {sales || isAdmin ? (
        <Tab.Screen
          name={t(routes.salesNav)}
          component={SalesScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <SalesIcon color={color} size={size} />
            ),
            tabBarLabel: t('Sales'),
            headerTitle: t('Sales'),
          }}
        />
      ) : null}
      {expense || isAdmin ? (
        <Tab.Screen
          name={t(routes.expensesNav)}
          component={Expenses}
          options={{
            tabBarIcon: ({color, size}) => (
              <ExpensesIcon color={color} size={size} />
            ),
            tabBarLabel: t('Expense'),
            headerTitle: t('Expense'),
          }}
        />
      ) : null}

      {inventory || isAdmin ? (
        <Tab.Screen
          name={t(routes.inventoryHome)}
          component={InventoryScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <InventoryIcon color={color} size={size} />
            ),
            tabBarLabel: t('Inventory'),
            headerTitle: t('Inventory'),
          }}
        />
      ) : null}
      {plan || isAdmin ? (
        <Tab.Screen
          name={t(routes.plan)}
          component={PlanerScreen}
          options={{
            tabBarIcon: ({color, size}) => (
              <PlannerIcon color={color} size={size} />
            ),
            tabBarLabel: t('Plan'),
            headerTitle: t('Plan'),
          }}
        />
      ) : null}
    </Tab.Navigator>
  );
};

export default AppTabNavigator;

const SalesTab = () => {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        unmountOnBlur: true,
        headerShown: false,
        headerTintColor: colors.white,
        tabBarLabelStyle: {fontSize: 14},
        headerStyle: {
          backgroundColor: colors.primary,
          borderBottomColor: colors.primary,
          elevation: 0,
        },
      }}>
      <Tab.Screen
        name={t(routes.homeScreen)}
        component={HomeScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <HomeIcon color={color} size={size + 8} />
          ),
          tabBarLabel: t('Home'),
          headerTitle: t('Home'),
        }}
      />

      <Tab.Screen
        name={t(routes.salesNav)}
        component={SalesScreen}
        options={{
          tabBarIcon: ({color, size}) => (
            <SalesIcon color={color} size={size} />
          ),
          tabBarLabel: t('Sales'),
          headerTitle: t('Sales'),
        }}
      />
    </Tab.Navigator>
  );
};
