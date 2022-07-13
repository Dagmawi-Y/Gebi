import React, {useState} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../../config/colors';

const DropDown = () => {
  const [menuVisible, setMenuvisible] = useState(false);

  return (
    <View>
      <View style={{backgroundColor: colors.white, width: '100%'}}>
        <TouchableOpacity
          style={{
            justifyContent: 'flex-end',
            marginLeft: 'auto',
          }}
          onPress={() => setMenuvisible(!menuVisible)}>
          <Icon
            name={!menuVisible ? 'sharealt' : 'close'}
            size={25}
            color={colors.primary}
            style={{margin: 5, marginLeft: 'auto'}}
          />
        </TouchableOpacity>
      </View>
      {menuVisible ? (
        <View
          style={{
            backgroundColor: 'white',
            elevation: 10,
            position: 'absolute',
            right: 30,
            zIndex: 1000,
            top: 30,
            width: 100,
            justifyContent: 'space-around',
            paddingHorizontal: 10,
            height: 100,
            borderRadius: 15,
            borderTopRightRadius: 0,
            alignItems: 'flex-start',
            borderWidth: 0.6,
            borderColor: '#00000040',
          }}>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => print()}>
            <Icon name={'pdffile1'} size={30} color={colors.primary} />
            <Text style={{marginLeft: 5, fontSize: 20, color: colors.black}}>
              PDF
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              flexDirection: 'row',
            }}
            onPress={() => capture()}>
            <Icon name={'picture'} size={30} color={colors.primary} />
            <Text style={{marginLeft: 5, fontSize: 20, color: colors.black}}>
              Photo
            </Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
};

export default DropDown;

const styles = StyleSheet.create({});
