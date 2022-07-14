import React, {useEffect, useContext, useState} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import colors from '../../config/colors';
import routes from '../../navigation/routes';

const SettingsScreen = ({navigation}) => {
  const {t} = useTranslation();

  return (
    <View style={{flex: 1, padding: 10}}>
      <Text
        style={{
          color: colors.black,
          fontSize: 25,
          textAlign: 'center',
          marginVertical: 10,
          fontWeight: 'bold',
        }}>
        {t('Settings')}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate(routes.selectLanguage)}
        style={{
          backgroundColor: colors.primary,
          paddingHorizontal: 10,
          paddingVertical: 15,
          borderRadius: 10,
        }}>
        <Text style={{color: colors.white, fontSize: 20}}>
          {t('Select_Language')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SettingsScreen;
