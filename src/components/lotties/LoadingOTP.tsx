import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../../config/colors';

export default class Loading extends Component {
  render() {
    return (
      <View style={{flex: 1, justifyContent:"center", alignItems:'center'}}>
        <LottieView
          style={{height: 300}}
          source={require('../../assets/loading_OTP.json')}
          autoPlay
          loop
            />
            <Text style={{fontSize:18, marginTop:20, color:colors.primary, fontFamily:'monospace'}}>Sending SMS...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({});
