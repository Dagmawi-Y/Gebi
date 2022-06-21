import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../../config/colors';

const Loading = ({size}) => {
  return (
    <View style={{flex: 0.7, alignItems: 'center'}}>
      <LottieView
        style={{height: size}}
        source={require('../../assets/loading.json')}
        autoPlay
        loop={true}
      />

      {/* <Text style={{fontSize:18, marginTop:20, color:colors.primary, fontFamily:'monospace'}}>Sending SMS...</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({});

export default Loading;
