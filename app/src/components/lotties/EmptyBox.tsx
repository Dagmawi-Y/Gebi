import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../../config/colors';

const Loading = ({message}) => {
  return (
    <View style={{flex: 0.8, marginTop: 20, alignItems: 'center'}}>
      <LottieView
        style={{height: 150}}
        source={require('../../assets/empty.json')}
        autoPlay
        loop={false}
      />
      <Text
        style={{
          fontSize: 18,
          color: colors.primary,
          fontFamily: 'monospace',
        }}>
        {message}
      </Text>
    </View>
  );
};

export default Loading
const styles = StyleSheet.create({});
