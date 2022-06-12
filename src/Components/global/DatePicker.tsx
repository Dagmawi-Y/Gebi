import {View, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import {Button, Text, useTheme} from '@rneui/themed';
import DatePicker from 'react-native-date-picker';
import dayjs from 'dayjs';
import {EtDatetime, ETC, BahireHasab, ConvertToEthiopic} from 'abushakir';
type Props = {
  value?: Date;
  setValue: any;
  containerStyle?:ViewStyle
  label:string
};
export default function DatePickerCustom({value, setValue,containerStyle={},label}: Props) {
  const etDate = new EtDatetime(value == null ? Date.now : value.getTime());
  const [open, setOpen] = useState(false);
  const {theme} = useTheme();

  return (
    <View style={{marginHorizontal: 10, marginBottom: 25,...containerStyle}}>
      <Text
        style={{
          fontSize: 16,
          marginBottom: 5,
          fontWeight: 'bold',
          color: theme.colors.grey3,
        }}>
        {label}
      </Text>
      <Button
        buttonStyle={{
          // borderWidth: 5,
          backgroundColor: 'white',
          paddingVertical: 10,
          paddingRight: 15,
          borderWidth: 1,
          borderColor: '#77869E',
          borderRadius: 5,
          justifyContent: 'flex-start',
        }}
        titleStyle={{color: 'black'}}
        title={
          value == null
            ? 'ይምረጡ'
            : false
            ? dayjs(value).format('MMMM D, YYYY')
            : `${etDate.monthGeez} ${etDate.day}, ${etDate.year}`
        } //"ይምረጡ"
        onPress={() => setOpen(true)}
      />
      <DatePicker
        modal
        open={open}
        date={value ?? new Date()}
        onConfirm={date => {
          setOpen(false);
          setValue(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </View>
  );
}
