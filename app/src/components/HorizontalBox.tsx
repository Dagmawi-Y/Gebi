import {Text, View, StyleSheet} from 'react-native';
import React from 'react';
import colors from '../config/colors';

export const HorizontalBox = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.textBold}>
        {title}
        {':'}
      </Text>
      <Text style={{fontSize: 15, color: colors.faded_dark}}>{value}</Text>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    backgroundColor: colors.white,
    marginHorizontal: 5,
    borderWidth: 0.4,
    borderColor: '#00000040',
    shadowColor: '#00000010',
    elevation: 10,
  },
  textBold: {
    color: colors.black,
    fontWeight: '700',
    fontSize: 15,
    paddingHorizontal: 10,
  },
});
