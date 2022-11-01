import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import routes from '../../navigation/routes';
import {StateContext} from '../../global/context';
import {useTranslation} from 'react-i18next';

const LanguageSelector = ({navigation}) => {
  const {t, i18n} = useTranslation();
  SystemNavigationBar.lightNavigationBar(false);
  const {introDone, curlang, setCurlang} = useContext(StateContext);

  const languageClicked = async (ln: string) => {
    try {
      i18n.changeLanguage(ln);
      await AsyncStorage.setItem('lang', ln.toString()).catch(err => {
        console.log(err);
      });

      setCurlang(ln);
      navigation.navigate(routes.intro);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          resizeMethod="resize"
          style={{maxWidth: 100, height: 100}}
          source={require('../../assets/logo-white-notext.png')}
        />
        <Text style={styles.logoTextStyle}>ገቢ</Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text style={{color: 'white', fontSize: 23, marginBottom: 20}}>
          {t('Choose_Language_To_Start')}
        </Text>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginVertical: 25,
          }}>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.button, styles.shadowProp]}
            onPress={() => languageClicked('am')}>
            <Text style={styles.buttonText}>{t('Amharic')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={() => languageClicked('en')}>
            <Text style={styles.buttonText}>{t('English')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    padding: 20,
    backgroundColor: colors.primary,
  },
  logoTextStyle: {
    fontSize: 72,
    color: 'white',
  },
  logo: {
    height: 200,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: colors.white,
    bottom: 20,
    marginBottom: 20,
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: 20,
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: colors.black,
    fontSize: 15,
  },
});

export default LanguageSelector;
LanguageSelector.routeName = 'LanguageSelector';
