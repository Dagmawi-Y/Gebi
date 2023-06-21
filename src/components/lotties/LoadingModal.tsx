import React, {Component} from 'react';
import {Text, StyleSheet, View, Modal} from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../../config/colors';

const LoadingModal = ({ shouldShow, setShouldShow}) => {
  return (
    <Modal         visible={shouldShow}
    animationType="slide"
    transparent={false}
    onRequestClose={setShouldShow}>
    <View style={{flex: 0.7, alignItems: 'center'}}>
      <LottieView
        source={require('../../assets/loading.json')}
        autoPlay
        loop={true}
      />

      {/* <Text style={{fontSize:18, marginTop:20, color:colors.primary, fontFamily:'monospace'}}>Sending SMS...</Text> */}
    </View>
    </Modal>
  );
};

const styles = StyleSheet.create({});

export default LoadingModal;
