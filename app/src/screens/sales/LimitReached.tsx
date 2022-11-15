import React from 'react';
import {View, TouchableOpacity, Pressable} from 'react-native';
import {Text} from '@rneui/themed';
import colors from '../../config/colors';
import {useTranslation} from 'react-i18next';
import routes from '../../navigation/routes';

export const FreeLimitReached = ({setModalVisible, navigation}) => {
  const {t} = useTranslation();
  return (
    <Pressable
      onPress={() => setModalVisible(false)}
      style={{
        flex: 1,
        backgroundColor: colors.transBlack,
        position: 'absolute',
        zIndex: 100,
        width: '100%',
        height: '100%',
        paddingHorizontal: 20,
        justifyContent: 'center',
      }}>
      <View
        style={{
          backgroundColor: colors.white,
          padding: 15,
          borderRadius: 10,
          minHeight: 200,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
          {t('Max_Reached')}
        </Text>
        <Text>{t('Subcribe_To_Continue')}</Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
            navigation.navigate(routes.subscriptions);
          }}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <Text style={{color: colors.white}}>{t('Subscribe')}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export const ExpiredModal = ({setModalVisible, navigation}) => {
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={() => setModalVisible(false)}
      style={{
        flex: 1,
        backgroundColor: colors.transBlack,
        position: 'absolute',
        zIndex: 100,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          backgroundColor: colors.white,
          padding: 15,
          borderRadius: 10,
          minHeight: 200,
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <Text style={{textAlign: 'center', fontSize: 20, fontWeight: 'bold'}}>
          {t('Expired')}
        </Text>
        <Text>{t('Renew_Subscription')}.</Text>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(false);
            navigation.navigate(routes.subscriptions);
          }}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 10,
          }}>
          <Text style={{color: colors.white}}>{t('Renew')}</Text>
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};
