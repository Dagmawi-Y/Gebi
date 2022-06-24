import React, {useEffect, useContext, useState} from 'react';
import {Button, Text, View} from 'react-native';



const SettingsScreen=({ navigation })=> {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Settings Screen</Text>
      <Button onPress={() => navigation.goBack()} title="Go to Home" />
    </View>
  );
}



export default SettingsScreen