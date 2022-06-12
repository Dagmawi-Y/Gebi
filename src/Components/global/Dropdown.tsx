import {View, Text, ViewStyle} from 'react-native';
import React, {useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {useTheme} from '@rneui/themed';
type Props = {
  value: string | null;
  setValue: any;
  label: string;
  dropdownItems: {label: string; value: string}[];
  containerStyle?: ViewStyle;
};
const Dropdown = ({
  value,
  setValue,
  dropdownItems,
  label,
  containerStyle = {},
}: Props) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [items, setItems] = useState(dropdownItems);
  const {theme} = useTheme();
  return (
    <View style={{marginHorizontal: 10, marginBottom: 25, ...containerStyle}}>
      <Text
        style={{
          fontSize: 16,
          marginBottom: 5,
          fontWeight: 'bold',
          color: theme.colors.grey3,
        }}>
        {label}
      </Text>
      <DropDownPicker
        style={{
          borderRadius: 5,
          borderWidth: 1,
          borderColor: '#77869E',
        }}
        setOpen={setDropdownOpen}
        listMode="SCROLLVIEW"
        open={dropdownOpen}
        value={value}
        items={items}
        setValue={setValue}
        setItems={setItems}
      />
    </View>
  );
};

export default Dropdown;
