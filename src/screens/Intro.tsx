import {StackActions} from '@react-navigation/native';
import React, {useEffect} from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import colors from '../constants/colors';
import {SCREENS} from '../constants/screens';
const slides = [
  {
    key: 1,
    title: 'Manage Sales',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iaculis quam et, tempor purus. Nullam quis ligula semper, euismod nibh ut, dictum purus. Suspendisse potenti. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec molestie quis orci in gravida',
    image: require('../../assets/images/intro/intro1.png'),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Inventory Management',
    text: 'Quisque blandit fringilla molestie. Donec laoreet massa arcu, in hendrerit dui viverra venenatis. Nunc bibendum mauris ligula, sed sollicitudin elit faucibus et. In tincidunt elit at nibh vehicula, finibus pretium augue eleifend. Nunc posuere ante vitae lorem cursus posuere.',
    image: require('../../assets/images/intro/intro2.png'),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Data Analysis and Reports',
    text: 'Praesent venenatis nisl quis felis elementum volutpat. Etiam id magna vel libero semper faucibus non vel elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    image: require('../../assets/images/intro/intro3.png'),
    backgroundColor: '#22bcb5',
  },
];
export default function Intro({navigation}: any) {
  const _onDone = () => {
    navigation.dispatch(StackActions.replace(SCREENS.RegisterPhone));
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
  const renderText = (text: string) => {
    return (
      <Text
        style={{
          fontSize: 18,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 12,
          flex: 1,
        }}>
        {text}
      </Text>
    );
  };
  useEffect(() => {
    SystemNavigationBar.lightNavigationBar(false);
    SystemNavigationBar.setNavigationColor('white');
    SystemNavigationBar.stickyImmersive();
  }, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar translucent backgroundColor="white" />
      <AppIntroSlider
        renderPrevButton={() => renderText('ተመለስ')}
        renderNextButton={() => renderText('ቀጥል')}
        renderSkipButton={() => renderText('ዝለል')}
        renderDoneButton={() => renderText('ቀጥል')}
        activeDotStyle={{
          backgroundColor: 'black',
          marginHorizontal: 4,
          width: 12,
          height: 12,
        }}
        dotStyle={{
          backgroundColor: 'black',
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
    backgroundColor: 'white',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 15,
  },
  text: {
    // color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    fontSize: 16,
    letterSpacing: 1,
    width: '80%',
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
Intro.routeName = 'Intro';
