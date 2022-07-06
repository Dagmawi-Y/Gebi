import {Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import {useRoute} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
      <Text style={{color: colors.white, fontSize: 25, marginHorizontal: 20}}>
        {route.name}
      </Text>
    </View>
  );
};

export default CustomMenu;

const styles = StyleSheet.create({});
