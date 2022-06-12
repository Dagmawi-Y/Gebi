import {View, Text, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import colors from '../constants/colors';
import Logo from '../../assets/images/logo.svg';
import {SvgXml} from 'react-native-svg';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {StackActions} from '@react-navigation/native';
import {SCREENS} from '../constants/screens';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Splash({navigation}: any) {
  useEffect(() => {
    SystemNavigationBar.lightNavigationBar(false);
    SystemNavigationBar.setNavigationColor(colors.APP_PRIMARY);
    SystemNavigationBar.fullScreen();
  }, []);
  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(StackActions.replace(SCREENS.ChooseLanguage));
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.APP_PRIMARY}]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.APP_PRIMARY}
      />
      <SvgXml width="200" height="200" xml={Logo} />
      <Text style={styles.logoTextStyle}>ገቢ</Text>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    padding: 50,
    backgroundColor: colors.APP_PRIMARY,
    justifyContent: 'center',
  },
  logoTextStyle: {
    fontSize: 72,
    color: 'white',
  },
  logo: {
    height: 200,
    resizeMode: 'contain',
  },
});

Splash.routeName = 'Splash';
