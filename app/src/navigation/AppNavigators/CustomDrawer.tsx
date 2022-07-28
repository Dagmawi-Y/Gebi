import React, {useContext, useEffect, useState} from 'react';
import {Alert, Image, StyleSheet} from 'react-native';

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

const CustomDrawer = ({route, navigation}) => {
  const {t} = useTranslation();
  const [active, setActive] = useState(routes.salesNav);
  const {user} = useContext(StateContext);
  const [userData, setUserData]: Array<any> = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserInfo = async () => {
    try {
      setLoading(true);
      firestore()
        .collection('users')
        .where('userId', '==', user.uid)
        .onSnapshot(querySnapshot => {
          let result: Array<any> = [];
          querySnapshot.forEach(documentSnapshot => {
            result.push({
              id: documentSnapshot.id,
              doc: documentSnapshot.data(),
            });
          });

          setUserData(result);
          setLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  if (loading) return null;

  return (
    <View
      style={{
        paddingVertical: 25,
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
        {/* <Image
          source={require('../../assets/images/avatar.jpg')}
          style={{width: 150, height: 150, borderRadius: 180}}
        /> */}

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
            {userData[0].doc.orgName.substring(0, 1)}
          </Text>
        </View>
        <View style={{marginVertical: 15, alignItems: 'center'}}>
          <Text style={{fontSize: 25, color: colors.white}}>
            {userData[0].doc.orgName}
          </Text>
          <Text style={{fontSize: 15, color: colors.white, fontWeight: '300'}}>
            {userData[0].doc.name}
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
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.salesNav}
          title={'Sales'}
          icon="point-of-sale"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.expensesNav}
          title={'Expense'}
          icon="point-of-sale"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.inventoryNav}
          title={'Items'}
          icon="home-work"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.plan}
          title={'Plan'}
          icon="clipboard-pencil"
          iconType="2"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.categories}
          title={'Categories'}
          rootRoute={true}
          icon="clipboard-pencil"
          iconType="2"
        />
        {/* <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.plan}
          title={'Calculator'}
          icon="point-of-sale"
        /> */}
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.settingsNav}
          title={'Settings'}
          rootRoute={true}
          icon="settings"
        />
      </View>
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
          marginTop: 30,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Text
          style={{
            fontSize: 23,
            fontWeight: '300',
            marginRight: 10,
            color: colors.white,
          }}>
          {t('Logout')}{' '}
        </Text>
        <Icon name="logout" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
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
          navigation.navigate(routes.categoryNav, {
            screen: route,
          });
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
          fontSize: 18,
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
