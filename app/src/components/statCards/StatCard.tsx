import {StyleSheet, TextStyle, View, ViewStyle} from 'react-native';
import React, {CSSProperties} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {Text} from '@rneui/themed';
import colors from '../../config/colors';
type Props = {
  containerStyle?: ViewStyle;
  label: string;
  value: string;
  labelStyle?: TextStyle;
  trend?: 'positive' | 'negative';
};

export default function StatCard({
  containerStyle,
  label,
  value,
  trend = 'positive',
  labelStyle = {},
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
          //   flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 10,
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: positive
              ? 'rgba(27, 199, 115,0.3)'
              : 'rgba(242, 71, 80,0.3)',
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={positive ? 'long-arrow-up' : 'long-arrow-down'}
            size={30}
            color={positive ? '#1BC773' : 'rgb(242, 71, 80)'}
          />
        </View>
      </View>
      <View
        style={{
          height: '100%',
          flex: 2,
          paddingVertical: 2,
          alignItems: 'flex-start',
          justifyContent: 'space-evenly',
          paddingLeft: 5,
          minWidth: 80,
        }}>
        <Text
          h4
          h4Style={[
            {fontSize: 16, color: '#77869E', ...labelStyle},
            {color: trend == 'positive' ? colors.green : colors.red},
          ]}>
          {label}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 18,
            color: trend == 'positive' ? colors.green : colors.red,
          }}>
          {value} {`ብር`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
