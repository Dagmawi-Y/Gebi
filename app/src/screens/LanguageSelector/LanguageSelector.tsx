import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  TouchableHighlight,
  Text,
} from 'react-native';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {StackActions} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import colors from '../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageSelector = ({navigation}: any) => {
  SystemNavigationBar.lightNavigationBar(false);

  const setLang = async (ln: string) => {
    console.log(await AsyncStorage.setItem('lang', ln.toString()));
  };

  useEffect(() => {}, []);
  const languageClicked = (ln: String) => {
    setLang(ln.toString());
    console.log('Languge selected');
    // navigation.dispatch(StackActions.replace(SCREENS.Intro));
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
        <Image source={require('../../assets/logo-white-notext.png')} />
        <Text style={styles.logoTextStyle}>ገቢ</Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text style={{color: 'white'}}>ለመጀመር ቋንቋ ይምረጡ</Text>
        <View
          style={{
            flex: 1,
            width: '100%',
            marginVertical: 25,
          }}>
          <TouchableHighlight
            style={[styles.button, styles.shadowProp]}
            onPress={() => languageClicked('am')}>
            <Text style={styles.buttonText}>አማርኛ</Text>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.button}
            onPress={() => languageClicked('en')}>
            <Text style={styles.buttonText}>English</Text>
          </TouchableHighlight>
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
