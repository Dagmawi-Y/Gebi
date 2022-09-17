import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Icon1 from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon2 from 'react-native-vector-icons/Foundation';
import Icon3 from 'react-native-vector-icons/MaterialIcons';
import colors from '../config/colors';

const ICON_SIZE = 20;
const ICON_COLOR = colors.primary;

const SalesIcon = ({color = ICON_COLOR, size = ICON_SIZE}) => {
  return <Icon3 name="point-of-sale" color={color} size={size} />;
};
const HomeIcon = ({color = ICON_COLOR, size = ICON_SIZE}) => {
  return <Icon3 name="home" color={color} size={size} />;
};

const ExpensesIcon = ({color = ICON_COLOR, size = ICON_SIZE}) => {
  return <Icon1 name="clipboard-arrow-up-outline" color={color} size={size} />;
};
const InventoryIcon = ({color = ICON_COLOR, size = ICON_SIZE}) => {
  return <Icon1 name="warehouse" color={color} size={size} />;
};

const PlannerIcon = ({color = ICON_COLOR, size = ICON_SIZE}) => {
  return <Icon2 name="clipboard-pencil" color={color} size={size} />;
};

const styles = StyleSheet.create({});

export {InventoryIcon, SalesIcon, ExpensesIcon, PlannerIcon, HomeIcon};
