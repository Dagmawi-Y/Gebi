import React, { useState, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const CustomProgressBar = ({ progress, width, height }) => {
  const [animation, setAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: progress,
      duration: 1000, // Adjust the duration as needed
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const progressStyles = {
    width: animation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0%', '100%'],
    }),
    height,
  };

  return (
    <View style={styles.container}>
      <View style={[styles.progressBar, { width, height }]}>
        <Animated.View style={[progressStyles, styles.progress]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    backgroundColor: '#E0E0E0', // Default color of progress bar
    borderRadius: 5,
    overflow: 'hidden',
  },
  progress: {
    backgroundColor: '#00C853', // Color of the progress
  },
});

export default CustomProgressBar;
