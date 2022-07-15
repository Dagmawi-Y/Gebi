import React, {Component} from 'react';
import {Text, StyleSheet, View, Pressable} from 'react-native';
import LottieView from 'lottie-react-native';
import colors from '../../config/colors';

const ErrorBox = ({msg, onPress, type, overlay = true}) => {
  const bg = overlay
    ? {backgroundColor: '#00000090'}
    : {backgroundColor: '#000000000'};

  return (
    <Pressable style={[styles.container, bg]} onPress={() => onPress()}>
      <View style={styles.errorBox}>
        <LottieView
          style={styles.lottieStyle}
          source={
            type === 'warn'
              ? require(`../../assets/warn.json`)
              : type == 'loading'
              ? require(`../../assets/loading.json`)
              : require(`../../assets/loading.json`)
          }
          speed={1.3}
          autoPlay
          loop={type == 'loading' ? true : false}
        />
        <Text style={styles.errorMsg}>{msg}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    alignSelf: 'center',
    zIndex: 1,
  },

  errorBox: {
    width: '60%',
    maxWidth: 400,
    height: 180,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottieStyle: {
    height: 80,
    backgroundColor: '#fff',
  },
  errorMsg: {
    color: colors.black,
    fontSize: 20,
  },
});

export default ErrorBox;
