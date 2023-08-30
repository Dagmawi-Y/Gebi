import React, {useContext, useEffect, useState} from 'react';
import {Alert, Image, StyleSheet, ScrollView} from 'react-native';

import {View, Text} from 'react-native';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/Foundation';

import {
  getFocusedRouteNameFromRoute,
  useFocusEffect,
} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import routes from '../routes';
import {useTranslation} from 'react-i18next';
import {StateContext} from '../../global/context';
import Loading from '../../components/lotties/Loading';

const CustomDrawer = ({route, navigation}) => {
  const {t} = useTranslation();
  const [active, setActive] = useState(routes.salesNav);

  const {user, userInfo, sales, expense, plan, inventory, isAdmin} =
    useContext(StateContext);

  if (userInfo.length == 0 || !user) return <Loading size={50} />;

  return (
    <ScrollView
      style={{
        backgroundColor: colors.primary,
        flex: 1,
      }}>
      <View
        style={{
          alignItems: 'center',
          width: '90%',
          borderRadius: 10,
          alignSelf: 'center',
          paddingTop: 15,
          paddingBottom: 5,
        }}>
        <View
          style={{
            backgroundColor: 'white',
            width: 150,
            height: 150,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 150,
          }}>
          <Text
            style={{
              fontSize: 100,
              padding: 0,
              color: colors.black,
              fontWeight: 'bold',
            }}>
            {userInfo[0]?.doc?.orgName.substring(0, 1)}
          </Text>
        </View>
        <View style={{marginVertical: 15, alignItems: 'center'}}>
          <Text style={{fontSize: 25, color: colors.white}}>
            {userInfo[0]?.doc?.orgName}
          </Text>
          <Text style={{fontSize: 15, color: colors.white, fontWeight: '300'}}>
            {userInfo[0]?.doc?.name}
          </Text>
        </View>
      </View>
      <View
        style={{
          height: 3,
          width: '92%',
          backgroundColor: colors.transWhite,
          alignSelf: 'center',
          borderRadius: 10,
        }}></View>
      <View
        style={{
          width: '90%',
          borderRadius: 20,
          alignSelf: 'center',
          paddingVertical: 15,
          paddingHorizontal: 10,
          paddingBottom: 25,
          marginTop: 20,
          flex: 1,
        }}>
        {sales || isAdmin ? (
          <DrawerButton
            active={active}
            setActive={setActive}
            navigation={navigation}
            route={routes.salesNav}
            title={'Sales'}
            icon="point-of-sale"
          />
        ) : null}
        {expense || isAdmin ? (
          <DrawerButton
            active={active}
            setActive={setActive}
            navigation={navigation}
            route={routes.expensesNav}
            title={'Expense'}
            icon="point-of-sale"
          />
        ) : null}
        {inventory || isAdmin ? (
          <DrawerButton
            active={active}
            setActive={setActive}
            navigation={navigation}
            route={routes.inventoryHome}
            title={'Items'}
            icon="home-work"
          />
        ) : null}
        {plan || isAdmin ? (
          <DrawerButton
            active={active}
            setActive={setActive}
            navigation={navigation}
            route={routes.plan}
            title={'Plan'}
            icon="clipboard-pencil"
            iconType="2"
          />
        ) : null}

        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.settingsNav}
          title={'Settings'}
          rootRoute={true}
          icon="settings"
        />
         <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.SalesReports}
          title={'Report'}
          rootRoute={true}
          icon="home-work"
        />
        {isAdmin ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate(routes.subscriptions);
            }}
            style={{
              marginTop: 5,
              alignItems: 'center',
              marginLeft: 25,
              flexDirection: 'row',
              paddingVertical: 5,
            }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: '300',
                color: colors.white,
              }}>
              {t('Subscription')}
            </Text>
            <Icon name="arrow-right" size={20} color={colors.white} />
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity
          onPress={() => {
            Alert.alert(t('Are_You_Sure?'), ``, [
              {
                text: t('Yes'),
                onPress: () => {
                  auth().signOut();
                },
                style: 'default',
              },
              {
                text: t('Cancel'),
                onPress: () => {},
                style: 'default',
              },
            ]);
          }}
          style={{
            marginTop: 20,
            // justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 25,
            flexDirection: 'row',
            paddingVertical: 5,
          }}>
          <Text
            style={{
              fontSize: 23,
              fontWeight: '300',
              color: colors.white,
            }}>
            {t('Logout')}{' '}
          </Text>
          <Icon name="logout" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CustomDrawer;

const DrawerButton = ({
  active,
  setActive,
  title,
  navigation,
  route,
  icon,
  iconType = '1',
  rootRoute = false,
}) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        setActive(route);
        if (route == routes.categories) {
          navigation.navigate(routes.categoryNav);
          return;
        }

        if (rootRoute) {
          navigation.navigate(route);
        } else {
          navigation.navigate(routes.Gebi, {screen: t(route)});
        }
      }}
      style={
        active == route
          ? [styles.drawerButton, styles.active]
          : styles.drawerButton
      }>
      <View style={{alignItems: 'center', width: 30}}>
        {iconType == '1' ? (
          <Icon name={icon} color={colors.white} size={25} style={{}} />
        ) : (
          <Icon2 name={icon} color={colors.white} size={25} style={{}} />
        )}
      </View>
      <Text
        style={{
          fontSize: 15,
          fontWeight: '300',
          marginLeft: 10,
          color: colors.white,
        }}>
        {t(title)}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  active: {
    backgroundColor: colors.transWhite,
    borderRadius: 10,
  },
  drawerButton: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    marginVertical: 5,
  },
});
