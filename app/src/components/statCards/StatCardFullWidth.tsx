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

export default function StatCardFullWidth({
  containerStyle,
  label,
  value,
  trend,
}: Props) {
  const positive = trend == 'positive';
  const {t} = useTranslation();

  return (
    <View
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 10,
        marginHorizontal: 5,
        width: '60%',
        alignSelf: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: 19,
            height: 19,
            backgroundColor: positive ? colors.green : colors.red,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={positive ? 'long-arrow-up' : 'long-arrow-down'}
            size={15}
            color={colors.white}
          />
        </View>
        <Text
          style={{
            color: trend == 'positive' ? colors.green : colors.red,
            marginLeft: 5,
            fontSize: 20,
            fontWeight: '600',
          }}>
          {label}
        </Text>
      </View>
      <View
        style={{
          height: '100%',
          flex: 2,
          paddingVertical: 2,
          alignItems: 'center',
          justifyContent: 'space-evenly',
          paddingLeft: 5,
          minWidth: 80,
        }}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            textAlign: 'center',
            color: trend == 'positive' ? colors.green : colors.red,
          }}>
          {value} {`${t('Birr')}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
