import {TouchableOpacity, View} from 'react-native';
import React from 'react';
import {Text} from '@rneui/base';
interface Props {
  data: {label: string; value: string};
  onPress: Function;
  disabled?: boolean;
  selected?: boolean;
}
const RadioButton = ({data, onPress, disabled=false, selected = false}: Props) => {
  return (
    <TouchableOpacity onPress={() => onPress(data.value)} disabled={disabled}>
      <View style={{alignItems: 'center', flexDirection: 'row'}}>
        <View
          style={{
            width: 20,
            height: 20,
            borderWidth: 2,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              padding: 6,
              borderRadius: 10,
              backgroundColor: selected ? 'black' : 'transparent',
            }}></View>
        </View>
        <Text style={{marginHorizontal: 5, fontWeight: 'bold'}}>
          {data.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
