import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../config/colors';

type Props = {
  containerStyle?: ViewStyle;
  label: string;
  value: string;
  trend?: 'positive' | 'negative';
};

export default function StatCardFullWidth({
  containerStyle,
  label,
  value,
  trend = 'positive',
}: Props) {
  const positive = trend == 'positive';
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: 60,
        borderRadius: 10,
        flexDirection: 'row',
        // flex:1,
        ...{...(containerStyle ?? ({} as any))},
      }}>
      <View
        style={{
          height: '100%',
          width: '30%',
          marginRight: 20,
          paddingLeft: 10,
          //   flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
        <View
          style={{
            // padding: 10,
            // margin: 5,
            width: 50,
            height: 50,
            backgroundColor: positive
              ? 'hsla(151, 65%, 45%, 0.3)'
              : 'rgba(242, 71, 80,0.3)',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={positive ? 'long-arrow-up' : 'long-arrow-down'}
            size={25}
            color="green"
          />
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-evenly',
          // paddingLeft: '0%',
        }}>
        <Text
          h4
          h4Style={[
            {fontSize: 16, color: '#77869E'},
            {color: trend == 'positive' ? colors.green : colors.red},
          ]}>
          {label}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            color: trend == 'positive' ? colors.green : colors.red,
          }}>
          {value} {`ብር`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
