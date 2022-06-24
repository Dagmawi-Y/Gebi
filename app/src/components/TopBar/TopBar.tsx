import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '../../config/colors';

export default function SalesScreen({children, title}) {
  return (
    <View style={styles.topBar}>
      <View style={{marginVertical: 0, marginHorizontal: 10}}>
        <View style={styles.topBarContainer}>
          <Text style={{color: 'white', fontSize: 25, flex: 8}}>{title}</Text>
        </View>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: colors.primary,
    borderBottomEndRadius: 30,
    paddingVertical: 5,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
});
