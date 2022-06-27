import {StackActions} from '@react-navigation/native';
import React, {useContext, useEffect} from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import {SafeAreaView} from 'react-native-safe-area-context';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import routes from '../../navigation/routes';
import {StateContext} from '../../global/context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slides = [
  {
    key: 1,
    title: 'Manage Sales',
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Iaculis quam et, tempor purus. Nullam quis ligula semper, euismod nibh ut, dictum purus. Suspendisse potenti. Interdum et malesuada fames ac ante ipsum primis in faucibus. Donec molestie quis orci in gravida',
    image: require(`../../assets/intro/intro1.png`),
    backgroundColor: '#59b2ab',
  },
  {
    key: 2,
    title: 'Inventory Management',
    text: 'Quisque blandit fringilla molestie. Donec laoreet massa arcu, in hendrerit dui viverra venenatis. Nunc bibendum mauris ligula, sed sollicitudin elit faucibus et. In tincidunt elit at nibh vehicula, finibus pretium augue eleifend. Nunc posuere ante vitae lorem cursus posuere.',
    image: require(`../../assets/intro/intro2.png`),
    backgroundColor: '#febe29',
  },
  {
    key: 3,
    title: 'Data Analysis and Reports',
    text: 'Praesent venenatis nisl quis felis elementum volutpat. Etiam id magna vel libero semper faucibus non vel elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
    image: require(`../../assets/intro/intro3.png`),
    backgroundColor: '#22bcb5',
  },
];

export default function Intro({navigation}: any) {
  const {setIntroDone} = useContext(StateContext);

  const _onDone = async () => {
    await AsyncStorage.setItem('introDone', 'true');
    setIntroDone(Boolean(true));
    navigation.navigate(routes.appNav);
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
  const renderText = (text: string, arrow: string, rowType: string) => {
    return (
      <View
        style={[
          {width: 90, alignItems: 'center'},
          rowType == 'row' ? styles.row : styles.rowReverse,
        ]}>
        <Text
          style={{
            fontSize: 18,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            color: colors.black,
            flex: 1,
          }}>
          {text}
        </Text>
        <Icon name={`arrow-${arrow}`} color="black" size={22} />
      </View>
    );
  };
  useEffect(() => {}, []);
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      <AppIntroSlider
        renderPrevButton={() => renderText('ተመለስ', 'left', 'row-reverse')}
        renderNextButton={() => renderText('ቀጥል', 'right', 'row')}
        renderSkipButton={() => renderText('ዝለል', 'right', 'row')}
        renderDoneButton={() => renderText('ዝግጁ', 'right', 'row')}
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
