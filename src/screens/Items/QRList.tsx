import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Image, ListItem, Text} from '@rneui/themed';
import colors from '../../constants/colors';
import QRCode from 'react-native-qrcode-svg';

const QRList = () => {
  return (
    <SafeAreaView style={[styles.container]}>
      <ScrollView style={{flex: 1}}>
        {[1, 2, 3, 4, 5].map(e => {
          return (
            <TouchableOpacity
              style={{marginVertical: 5}}
              key={e}
              //   onPress={() => navigation.navigate(SCREENS.ItemDetails)}
            >
              <ListItem bottomDivider containerStyle={{borderRadius: 5}}>
                <Image
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 100,
                  }}
                  containerStyle={{backgroundColor: 'white'}}
                  resizeMode="contain"
                  source={require('../../../assets/images/cement.png')}
                />
                <ListItem.Content>
                  <ListItem.Title style={{fontWeight: 'bold'}}>
                    Item name
                  </ListItem.Title>
                  <ListItem.Subtitle
                    style={{fontSize: 16, color: colors.GREY_1}}>
                    {'300 ብር / አንዱን'}
                  </ListItem.Subtitle>
                </ListItem.Content>
                <View style={{alignItems: 'center'}}>
                  <QRCode
                    value="1"
                    size={30}
                    logoBackgroundColor="transparent"
                  />
                </View>
              </ListItem>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default QRList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    marginHorizontal: 10,
  },
});

QRList.routeName = 'QRList';
