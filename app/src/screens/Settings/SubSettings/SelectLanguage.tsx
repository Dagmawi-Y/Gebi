import React, {useEffect, useRef, useState} from 'react';
import {TouchableOpacity, View, Text, StyleSheet, Animated} from 'react-native';
import {useTranslation} from 'react-i18next';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from '../../../config/colors';

const LanguageSelector = () => {
  const {t, i18n} = useTranslation();
  const [dropDownVisible, setDropDownVisible] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;

  const animateOpen = () => {
    Animated.timing(progress, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };
  const animateClose = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const availableLanguages = [
    {name: 'Amharic', code: 'am'},
    {name: 'English', code: 'en'},
  ];

  const changeLang = async (lang: string) => {
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem('lang', lang);
  };

  useEffect(() => {}, []);

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text
        style={{
          color: colors.black,
          fontSize: 20,
          textAlign: 'center',
          fontWeight: 'bold',
          marginVertical: 10,
        }}>
        {t('Current_Language')}:{' '}
        {t(availableLanguages.filter(l => l.code == i18n.language)[0].name)}
      </Text>
      <TouchableOpacity
        onPress={() => {
          if (!dropDownVisible) {
            setDropDownVisible(!dropDownVisible);
            animateOpen();
          } else {
            setDropDownVisible(!dropDownVisible);
            animateClose();
          }
        }}
        activeOpacity={0.6}
        style={{
          backgroundColor: colors.white,
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderWidth: 0.4,
          borderColor: '#00000040',
          shadowColor: '#00000040',
          elevation: 10,
        }}>
        <Text style={{color: colors.black, fontSize: 25}}>{t('Language')}</Text>
        <Icon name="caretdown" color={colors.black} size={20} />
      </TouchableOpacity>

      <Animated.View
        style={{
          backgroundColor: colors.white,
          marginTop: 5,
          padding: 5,
          elevation: 10,
          shadowColor: '#00000080',
          borderRadius: 10,
          opacity: progress,
        }}>
        {availableLanguages.map(lang => {
          return (
            <TouchableOpacity
              onPress={() => {
                changeLang(lang.code);
                if (!dropDownVisible) {
                  setDropDownVisible(!dropDownVisible);
                  animateOpen();
                } else {
                  setDropDownVisible(!dropDownVisible);
                  animateClose();
                }
              }}
              key={lang.code}
              activeOpacity={0.7}>
              <Text
                style={{
                  backgroundColor: colors.primary,
                  marginVertical: 2,
                  padding: 10,
                  borderRadius: 10,
                  color: colors.white,
                  fontSize: 18,
                }}>
                {t(`${lang.name}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default LanguageSelector;
