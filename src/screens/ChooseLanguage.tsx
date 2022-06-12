import {View, StyleSheet, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {Button, Text} from '@rneui/themed';
import colors from '../constants/colors';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import {SvgXml} from 'react-native-svg';
import Logo from '../../assets/images/logo.svg';
import { SCREENS } from '../constants/screens';
import { StackActions } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function ChooseLanguage({navigation}: any) {
  useEffect(() => {
    SystemNavigationBar.lightNavigationBar(false);
    SystemNavigationBar.setNavigationColor(colors.APP_PRIMARY);
    SystemNavigationBar.fullScreen();
  }, []);
  const languageClicked = () => {
    navigation.dispatch(StackActions.replace(SCREENS.Intro));
  };
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.APP_PRIMARY}]}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.APP_PRIMARY}
      />
      <View
        style={{
          flex: 3,
          alignItems: 'center',
          justifyContent: 'center',
          // backgroundColor: 'red',
        }}>
        <SvgXml width="200" height="200" xml={Logo} />
        <Text style={styles.logoTextStyle}>ገቢ</Text>
      </View>
      <View style={{flex: 2, alignItems: 'center'}}>
        <Text h3 style={{color: 'white'}}>
          ለመጀመር ቋንቋ ይምረጡ
        </Text>
        <View
          style={{
            flex: 1,
            width: '100%',
            alignItems: 'center',
            marginVertical: 25,
          }}>
          <Button
            title={'English'}
            containerStyle={{width: '100%', marginBottom: 10}}
            buttonStyle={{
              backgroundColor: 'white',
              justifyContent: 'flex-start',
            }}
            titleStyle={{fontWeight: 'bold', color: 'black'}}
            onPress={languageClicked}
          />
          <Button
            title={'አማርኛ'}
            containerStyle={{width: '100%', marginBottom: 10}}
            buttonStyle={{
              backgroundColor: 'white',
              justifyContent: 'flex-start',
            }}
            titleStyle={{fontWeight: 'bold', color: 'black'}}
            onPress={languageClicked}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    padding: 20,
    backgroundColor: colors.APP_PRIMARY,
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

ChooseLanguage.routeName = 'ChooseLanguage';
