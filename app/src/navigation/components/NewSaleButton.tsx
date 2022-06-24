import React, {useContext} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StateContext} from '../../global/context';

import colors from '../../config/colors';

function NewListingButton() {
  const {addNewModalVisible, setAdNewModalVisible} = useContext(StateContext);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setAdNewModalVisible(true)}>
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="plus-circle"
          color={colors.white}
          size={40}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderColor: colors.white,
    borderRadius: 40,
    borderWidth: 10,
    bottom: 25,
    height: 80,
    justifyContent: 'center',
    width: 80,
  },
});

export default NewListingButton;
