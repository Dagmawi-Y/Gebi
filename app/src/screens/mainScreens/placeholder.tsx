import {View, Text, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import colors from '../../config/colors';

const Placeholder = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* <StatusBar translucent backgroundColor={'orange'} /> */}
      <Text>Page Under Construction</Text>
    </View>
  );
};

export default Placeholder;
