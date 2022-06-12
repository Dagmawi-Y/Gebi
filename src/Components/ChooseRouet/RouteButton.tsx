import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from '@rneui/themed';

const RouteButton = ({onPress, title}: {onPress: Function; title: string}) => {
  return (
    <Button
      title={title}
      titleStyle={{fontWeight: 'bold', fontSize: 18}}
      buttonStyle={{
        // borderWidth: 5,
        borderColor: 'transparent',
        borderRadius: 15,
        paddingVertical: 10,
        justifyContent: 'space-between',
        paddingRight: 15,
      }}
      containerStyle={{
        marginVertical: 5,
      }}
      icon={{
        name: 'rightcircle',
        type: 'antdesign',
        size: 35,
        color: 'rgba(255,255,255,0.5)',
      }}
      iconRight
      onPress={() => onPress()}
    />
  );
};

export default RouteButton;

const styles = StyleSheet.create({});
