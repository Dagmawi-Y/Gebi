import {
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import colors from '../../config/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';

const ErrorBox = ({setError, errorMessage}) => {
  const {t} = useTranslation();

  return (
    <Pressable
      onPress={() => {
        setError('');
      }}
      style={{
        position: 'absolute',
        zIndex: 12,
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: '#00000099',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: 200,
          borderRadius: 20,
          aspectRatio: 1,
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <LottieView
          style={{
            height: 80,
            backgroundColor: '#fff',
          }}
          source={require('../../assets/failed.json')}
          speed={1.3}
          autoPlay
          loop={true}
        />
        <Text
          style={{
            fontSize: 18,
            textAlign: 'center',
            color: colors.red,
          }}>
          {t(errorMessage)}
        </Text>
        <TouchableOpacity
          onPress={() => {
            setError('');
          }}
          style={{
            backgroundColor: colors.primary,
            paddingHorizontal: 30,
            paddingVertical: 5,
            marginTop: 20,
            borderRadius: 10,
          }}>
          <Icon name="arrow-back" color={colors.white} size={20} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
};

export default ErrorBox;

const styles = StyleSheet.create({});
