import {StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {Text} from '@rneui/themed';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';

type Props = {
  containerStyle?: ViewStyle;
  label: string;
  value: string;
  trend?: 'positive' | 'negative' | 'neutral';
};

export default function StatCardFullWidth({containerStyle, label, value, trend}: Props) {
  const positive = trend == 'positive';
  const {t} = useTranslation();

  const color =
    trend == 'positive'
      ? colors.green
      : trend == 'negative'
      ? colors.red
      : colors.black;

  const icon =
    trend == 'positive'
      ? 'long-arrow-up'
      : trend == 'negative'
      ? 'long-arrow-down'
      : 'minus';
  return (
    <View
      style={{
        backgroundColor: 'white',
        height: 60,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        ...{...(containerStyle ?? ({} as any))},
      }}>
      <View
        style={{
          height: '100%',
          marginRight: 10,
          paddingLeft: 10,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor:
              trend == 'positive'
                ? colors.green
                : trend == 'negative'
                ? colors.red
                : colors.white,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name={icon} size={25} color={colors.white} />
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
          height: '100%',
          justifyContent: 'space-evenly',
        }}>
        <Text
          h4
          h4Style={[
            {fontSize: 16, color: '#77869E'},
            {
              color: color,
            },
          ]}>
          {label}
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 30,
            color: color,
          }}>
          {value} {`${t('Birr')}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
