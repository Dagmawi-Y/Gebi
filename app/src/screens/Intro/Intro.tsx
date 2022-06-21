import {View, StyleSheet, Text} from 'react-native';
import React, {useEffect} from 'react';
import colors from '../../config/colors';
import {SafeAreaView} from 'react-native-safe-area-context';

const Intro = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Intro</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  statContainer: {
    marginTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});

export default Intro;
