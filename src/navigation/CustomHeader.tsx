import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React, {useContext} from 'react';
import colors from '../config/colors';
import {StateContext} from '../global/context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomHeader = () => {
  const {headerTitle, headerBack, onBack, test} = useContext(StateContext);
  return (
    <View
      style={{
        height: 50,
        width: '100%',
        backgroundColor: colors.primary,
        alignItems: 'center',
        paddingHorizontal: 20,
        flexDirection: 'row',
      }}>
      <TouchableOpacity onPress={test}>
        <Icon
          name={headerBack ? 'arrow-left' : 'menu'}
          size={25}
          color={colors.white}
        />
      </TouchableOpacity>

      <View>
        <Text
          style={{
            color: colors.white,
            fontSize: 25,
            fontWeight: '800',
            marginLeft: 10,
          }}>
          {headerTitle}
        </Text>
      </View>
      <View></View>
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({});
