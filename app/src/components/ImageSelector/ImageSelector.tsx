import {Text, View, TouchableOpacity, Image} from 'react-native';
import React, {Component, useState} from 'react';
import Icon from 'react-native-vector-icons/EvilIcons';
import colors from '../../config/colors';
import ImagePicker from 'react-native-image-crop-picker';

const ImageSelector = ({photo, setPhoto}) => {
  //   const [photo, setPhoto] = useState('');

  const pickImage = type => {
    type == 'image'
      ? ImagePicker.openPicker({})
          .then(image => {
            setPhoto(image.path);
          })
          .catch(err => console.log(err))
      : ImagePicker.openCamera({useFrontCamera: false})
          .then(image => {
            setPhoto(image.path);
          })
          .catch(err => console.log(err));
  };

  return (
    <View
      style={{
        // marginBottom: 10,
        // backgroundColor: 'red',
        height: 150,
        width: '80%',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {photo ? (
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <View>
            <Image
              source={{
                uri: photo,
              }}
              style={{
                width: 145,
                borderRadius: 10,
                aspectRatio: 1,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setPhoto('')}
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                zIndex: 10,
                backgroundColor: colors.red,
                borderRadius: 30,
                height: 30,
                width: 30,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon name="close" size={25} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity onPress={() => pickImage('image')}>
              <Icon
                name="image"
                size={50}
                color={colors.black}
                style={{marginBottom: 15}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage('camera')}>
              <Icon name="camera" size={50} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
              flexDirection: 'row',
            }}>
            <TouchableOpacity onPress={() => pickImage('image')}>
              <Icon
                name="image"
                size={65}
                color={colors.black}
                style={{marginRight: 15}}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => pickImage('camera')}>
              <Icon name="camera" size={65} color={colors.black} />
            </TouchableOpacity>
          </View>

          <Text style={{color: colors.black, fontSize: 18}}>ፎቶ ማያያዣ</Text>
        </View>
      )}
    </View>
  );
};

export default ImageSelector;
