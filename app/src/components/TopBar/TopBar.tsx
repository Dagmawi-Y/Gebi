import {View, StyleSheet, Text} from 'react-native';
import React from 'react';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import {TouchableOpacity} from 'react-native-gesture-handler';
export default function SalesScreen({children, title, action, actionValue}) {
  return (
    <View style={styles.topBar}>
      <View style={{marginVertical: 0, marginHorizontal: 10}}>
        {/* <View style={styles.topBarContainer}>
          <Text style={{color: 'white', fontSize: 25, flex: 8}}>{title}</Text>
          <TouchableOpacity
            style={{
              alignSelf: 'flex-end',
              width: 50,
              height: 40,
              alignItems: 'flex-end',
              justifyContent: 'center',
            }}
            onPress={() => {
              action(!actionValue);
            }}>
            <Icon name="search1" size={20} color={colors.white} />
          </TouchableOpacity>
        </View> */}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    backgroundColor: colors.primary,
    // borderBottomEndRadius: 30,
    paddingVertical: 5,
  },
  topBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 10,
  },
});
