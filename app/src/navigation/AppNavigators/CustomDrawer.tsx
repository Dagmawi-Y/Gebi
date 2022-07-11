import React, {useState} from 'react';
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
import routes from '../routes';

const CustomDrawer = ({route, navigation}) => {
  const [active, setActive] = useState(routes.salesNav);

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
        <Image
          source={require('../../assets/images/avatar.jpg')}
          style={{width: 150, height: 150, borderRadius: 180}}
        />
        <View style={{marginVertical: 15}}>
          <Text style={{fontSize: 30, color: colors.white}}>Eldix.</Text>
          <Text style={{fontSize: 18, color: colors.white, fontWeight: '300'}}>
            Lorem Ipsum
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
          title={'ሽያጭ'}
          icon="point-of-sale"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.expensesNav}
          title={'ወጪ'}
          icon="point-of-sale"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.inventoryNav}
          title={'እቃዎች'}
          icon="home-work"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.plan}
          title={'እቅድ'}
          icon="clipboard-pencil"
          iconType="2"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.plan}
          title={'ትርፍ እና ትርፍ ማስያ'}
          icon="point-of-sale"
        />
        <DrawerButton
          active={active}
          setActive={setActive}
          navigation={navigation}
          route={routes.plan}
          title={'ቅንብር'}
          icon="settings"
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          Alert.alert(`እርግጠኛ ነዎት?`, ``, [
            {
              text: 'አዎ',
              onPress: () => {
                auth().signOut();
              },
              style: 'default',
            },
            {
              text: 'ተመለስ',
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
            fontSize: 25,
            fontWeight: '300',
            marginRight: 10,
            color: colors.white,
          }}>
          Logout{' '}
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
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => {
        setActive(route);
        navigation.navigate(routes.appNav, {screen: route});
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
          fontSize: 20,
          fontWeight: '300',
          marginLeft: 10,
          color: colors.white,
        }}>
        {title}
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
