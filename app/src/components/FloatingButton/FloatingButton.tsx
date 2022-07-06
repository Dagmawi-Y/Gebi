import {Pressable, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../../config/colors';

// interface props {
//   action: React.Dispatch<React.SetStateAction<boolean>>;
//   value: boolean;
// }

const FloatingButton = ({action, value}) => {
  return (
    <TouchableOpacity
      onPress={() => action(!value)}
      style={{
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: 55,
        height: 55,
        borderRadius: 55,
        zIndex: 10,
      }}>
      <Icon name="plus" size={25} color={colors.white} />
    </TouchableOpacity>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({});
