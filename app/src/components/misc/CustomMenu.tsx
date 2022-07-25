import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import {useRoute} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import {useEffect} from 'react';

const CustomMenu = ({navigation}) => {
  const route = useRoute();

  return (
    <View
      style={{
        backgroundColor: colors.primary,
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: 'center',
      }}>
      <Pressable onPress={() => navigation.openDrawer()}>
        <Icon name="menu" color={colors.white} size={30}></Icon>
      </Pressable>
      <Text
        style={{
          color: colors.white,
          fontSize: 23,
          marginHorizontal: 20,
          fontWeight: 'bold',
        }}>
        {route.name}
      </Text>
    </View>
  );
};

export default CustomMenu;

const styles = StyleSheet.create({});
