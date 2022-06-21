import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Button, Image, Input, Text} from '@rneui/themed';
import colors from '../../config/colors';
// import DatePickerCustom from '../global/DatePicker';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
interface Props {
  toggleModal: Function;
}
const AddNew = ({toggleModal}: Props) => {
  const [date, setDate] = useState<any>(null);
  const [image, setImage] = useState<null | string>(null);
  return (
    <View style={{flex: 1, padding: 5}}>
      <View
        style={{
          //   height: '70%',
          backgroundColor: colors.BODY_BACKGROUND_LIGHT,
          borderRadius: 10,
          padding: 10,
        }}>
        <Text
          style={{
            fontSize: 20,
            marginBottom: 5,
            fontWeight: 'bold',
            alignSelf: 'center',
          }}>
          {'እቃ ማስገቢያ ፎርም'}
        </Text>
        {/* <DatePickerCustom
          label="ቀን"
          value={date}
          setValue={setDate}
          containerStyle={{height: 85, marginBottom: 0}}
        /> */}
        <Input
          label={`አከፋፋይ ስም`}
          containerStyle={{height: 85}}
          labelStyle={{marginBottom: 2}}
          shake={() => {
            console.log('The hell dis');
          }}
        />
        <Input
          label={`የእቃ ስም`}
          containerStyle={{height: 85}}
          labelStyle={{marginBottom: 2}}
          shake={() => {
            console.log('The hell dis');
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <Input
            label={`ብዛት`}
            containerStyle={{height: 85, flex: 1}}
            labelStyle={{marginBottom: 2}}
            keyboardType="numeric"
            shake={() => {
              console.log('The hell dis');
            }}
          />
          <Input
            label={`መለኪያ`}
            containerStyle={{height: 85, flex: 1}}
            labelStyle={{marginBottom: 2}}
            shake={() => {
              console.log('The hell dis');
            }}
          />
          <Input
            label={`ያንዱ ዋጋ`}
            containerStyle={{height: 85, flex: 1}}
            labelStyle={{marginBottom: 2}}
            keyboardType="numeric"
            shake={() => {
              console.log('The hell dis');
            }}
          />
        </View>
        {image != null ? (
          <Image
            source={{uri: image ?? ''}}
            style={{width: 100, height: 100}}
          />
        ) : null}
        {/* <Button
          title={'የእቃ ፎቶ ማያያዣ'}
          containerStyle={{
            width: '100%',
            marginVertical: 15,
            borderRadius: 10,
          }}
          buttonStyle={{
            paddingVertical: 10,
            backgroundColor: 'black',
          }}
          // titleStyle={{fontWeight: 'bold', color: 'black'}}
          onPress={async () => {
            const result = await launchImageLibrary({
              mediaType: 'photo',
            });
            if (result.didCancel) {
              return console.warn('Canceled');
            }
            if (result.errorMessage) {
              return console.warn(result.errorMessage);
            }
            const source = result.assets![0].uri;
            setImage(source);
          }}
        /> */}
      </View>
      <Button
        title={'ጨምር'}
        containerStyle={{
          width: '100%',
          marginVertical: 15,
          borderRadius: 10,
        }}
        buttonStyle={{
          paddingVertical: 10,
        }}
        // titleStyle={{fontWeight: 'bold', color: 'black'}}
        onPress={() => toggleModal()}
      />
    </View>
  );
};

export default AddNew;

const styles = StyleSheet.create({});