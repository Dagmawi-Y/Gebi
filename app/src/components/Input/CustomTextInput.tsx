import { Text, SafeAreaView, StyleSheet } from 'react-native'
import React, { Component } from 'react'
import colors from '../../config/colors'


const TextInput = (value, onChange)=>  {

    return (
        <TextInput
            style={styles.confirmInput}
            onChangeText={(code: any) => onChange(code)}
            value={value}
            placeholder="useless placeholder"
            keyboardType="numeric"
          />
    )

}


const styles = StyleSheet.create({
    confirmInput: {
        color: colors.black,
        height: 50,
        margin: 12,
        borderWidth: 1,
        padding: 10,
      },
})
export default TextInput