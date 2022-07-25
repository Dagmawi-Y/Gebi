import React, { Component } from 'react';
import {Text, View, StyleSheet, TouchableHighlight} from 'react-native';
import colors from '../../config/colors';

const Button = ({title, onPress, btnStyle}) => {
  return btnStyle.toString() === 'outlined' ? (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.buttonStyle, styles.buttonOulined]}>
      <Text style={styles.buttonOutlinedTitle}>{title}</Text>
    </TouchableHighlight>
  ) : (
    <TouchableHighlight
      onPress={onPress}
      style={[styles.buttonStyle, styles.buttonNormal]}>
      <Text style={styles.buttonNormalTitle}>{title}</Text>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    width: '100%',
    height: 50,
    color: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },
  buttonOulined: {
    backgroundColor: colors.white,
    borderWidth: 1,
    color: colors.black,
    borderColor: colors.primary,
  },
  buttonOutlinedTitle: {
    fontSize: 18,
    color: colors.black,
  },
  buttonNormal: {backgroundColor: colors.primary},
  buttonNormalTitle: {
    fontSize: 18,
    color: colors.white,
  },
});

export default Button;
