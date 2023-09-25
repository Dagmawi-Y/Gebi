import {StyleSheet, TextStyle, View, ViewStyle, Text} from 'react-native';
import React, {CSSProperties} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';
import formatNumber from '../../utils/formatNumber';
type Props = {
  containerStyle?: ViewStyle;
  label: string;
  value: string;
  labelStyle?: TextStyle;
  trend?: 'positive' | 'negative'|'none';
};

export default function StatCard({
  containerStyle,
  label,
  value,
  trend = 'positive',
  labelStyle = {},
}: Props) {
  const {t} = useTranslation();

  const positive = trend == 'positive';
  const negative= trend=='negative';
  return (
    <View
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 5,
        paddingVertical: 5,
        borderRadius: 8,
        marginHorizontal: 5,
        flexGrow: 1,
        height: 60,
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
            backgroundColor: positive ? colors.green :negative? colors.red:'',
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon
            name={positive ? 'long-arrow-up' : negative ?'long-arrow-down':''}
            size={15}
            color={colors.white}
          />
        </View>
        <Text
          style={{
            color: trend == 'positive' ? colors.green :trend == 'negative'? colors.red:colors.black,
            marginLeft: 5,
            fontSize: 15,
            fontWeight: '500',
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
            fontWeight: '500',
            fontSize: 15,
            textAlign: 'center',
            color: trend == 'positive' ? colors.green :trend == 'negative'? colors.red:colors.green,
          }}>
          {formatNumber(value)} {`${t('Birr')}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
