import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {StackActions} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import routes from '../../navigation/routes';

const LanguageSelector = ({navigation}) => {
  SystemNavigationBar.lightNavigationBar(false);

  const [curlang, setCurlang] = useState('');

  const setLang = async (ln: string) => {
    await AsyncStorage.setItem('lang', ln.toString());
    setCurlang(ln.toString());
  };

  useEffect(() => {}, []);
  const languageClicked = (ln: String) => {
    setLang(ln.toString());
    console.log('Languge selected');
    navigation.navigate(routes.intro)
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
        <Text style={{color: 'white', fontSize: 25, marginBottom: 20}}>
          ለመጀመር ቋንቋ ይምረጡ {curlang}
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
            <Text style={styles.buttonText}>አማርኛ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.button}
            onPress={() => languageClicked('en')}>
            <Text style={styles.buttonText}>English</Text>
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
    fontSize: 20,
  },
});

export default LanguageSelector;
LanguageSelector.routeName = 'LanguageSelector';
