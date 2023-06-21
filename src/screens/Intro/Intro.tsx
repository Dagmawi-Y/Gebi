import {StackActions} from '@react-navigation/native';
import React, {useContext, useEffect, useTransition} from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import {StateContext} from '../../global/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useTranslation} from 'react-i18next';
import i18n from 'i18next';

export default function Intro({navigation}: any) {
  const {t} = useTranslation();
  const {setIntroDone, introDone} = useContext(StateContext);

  const slides =
    i18n.language == 'en'
      ? [
          {
            key: 1,
            title: 'Manage Sales',
            text: 'Produce invoices to share to your customers and keep a clean and organized record all your sales in one place.',
            image: require(`../../assets/intro/intro1.png`),
            backgroundColor: '#59b2ab',
          },
          {
            key: 2,
            title: 'Inventory Management',
            text: 'Keep track of all the items going in and out of your inventory that is update with every transaction.',
            image: require(`../../assets/intro/intro2.png`),
            backgroundColor: '#febe29',
          },
          {
            key: 3,
            title: 'Data Analysis and Reports',
            text: 'Track and record your income, expenses and profit in an organized and easy to manage process.',
            image: require(`../../assets/intro/intro3.png`),
            backgroundColor: '#22bcb5',
          },
        ]
      : [
          {
            key: 1,
            title: 'ሽያጮችን ያስተዳድሩ',
            text: 'ለደንበኞችዎ ለማጋራት ደረሰኞችን ያዘጋጁ እ ሁሉንም ሽያጮችዎን በአንድ ቦታ  የተደራጀ መዝገብ ያስቀምጡ',
            image: require(`../../assets/intro/intro1.png`),
            backgroundColor: '#59b2ab',
          },
          {
            key: 2,
            title: 'የእቃ ክምችቶን ይስተዳድሩ',
            text: 'ከእያንዳንዱ ግብይት ጋር የተዘመኑትን ወደ ውስጥ የሚገቡትን እና የሚወጡትን እቃዎች ሁሉ ይከታተሉ',
            image: require(`../../assets/intro/intro2.png`),
            backgroundColor: '#febe29',
          },
          {
            key: 3,
            title: 'ገቢና ወጪዎን ያስተዳድሩ',
            text: 'ገቢዎን፣ ወጪዎችዎን እና ትርፍዎን በተደራጀ እና ለማስተዳደር ቀላል በሆነ ሂደት ይከታተሉ እና ይመዝግቡ',
            image: require(`../../assets/intro/intro3.png`),
            backgroundColor: '#22bcb5',
          },
        ];

  const _onDone = async () => {
    await AsyncStorage.setItem('introDone', 'true');
    setIntroDone(Boolean(true));
    navigation.replace('app');
  };
  function _renderItem({item}: any) {
    return (
      <View style={[styles.slide]}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  }

  useEffect(() => {
    introDone && navigation.replace('app');
  }, []);

  const renderText = (text: string, arrow: string, rowType: string) => {
    return (
      <View
        style={[
          {maxWidth: 100, width: 100, alignItems: 'center'},
          rowType == 'row' ? styles.row : styles.rowReverse,
        ]}>
        <Text
          style={{
            fontSize: 15,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            color: colors.black,
            flex: 1,
          }}>
          {t(text)}
        </Text>
        <Icon name={`arrow-${arrow}`} color="black" size={22} />
      </View>
    );
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <AppIntroSlider
        renderPrevButton={() => renderText('Prev', 'left', 'row-reverse')}
        renderNextButton={() => renderText('Next', 'right', 'row')}
        renderSkipButton={() => renderText('Skip', 'right', 'row')}
        renderDoneButton={() => renderText('Ready', 'right', 'row')}
        activeDotStyle={{
          backgroundColor: colors.primary,
          marginHorizontal: 4,
          width: 12,
          height: 12,
        }}
        dotStyle={{
          backgroundColor: colors.medium,
          marginHorizontal: 4,
          width: 8,
          height: 8,
        }}
        showPrevButton
        renderItem={_renderItem}
        data={slides}
        onDone={_onDone}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 15,
  },
  title: {
    color: colors.black,
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1,
    width: '80%',
  },
  row: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
});
Intro.routeName = 'Intro';
