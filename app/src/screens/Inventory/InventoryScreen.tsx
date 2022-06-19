import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../config/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, ListItem, SpeedDial, Text} from '@rneui/themed';

import Modal from 'react-native-modal';
import TopBar from '../../components/TopBar/TopBar';

// import AddNew from './AddNew';
export default function Items({navigation}: any) {
  // let dimensions = Dimensions.get('window');
  // const [isModalVisible, setModalVisible] = useState(false);
  // const toggleModal = () => {
  //   setModalVisible(!isModalVisible);
  // };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <Modal isVisible={isModalVisible} avoidKeyboard> */}
        {/* <AddNew toggleModal={toggleModal} /> */}
        {/* </Modal> */}
        <TopBar
          title={'የእቃ ክፍል'}
          income={''}
          expense={''}
          calc={false}
          totalCost={'234,008 ብር'}
          totalItem={'314'}
        />

        <View style={styles.contentContainer}>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginVertical: 5,
            }}>
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 20,
                color: colors.faded_dark,
              }}>
              ያሉ አቃዎች
            </Text>
            <TouchableOpacity style={styles.buttonwithIcon}>
              <Image
                source={require('./qr_icon.png')}
                style={{width: 20, height: 20}}></Image>
              <Text
                style={{
                  color: colors.black,
                }}>
                Print QR
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView>
            {[
              'ሳቶፓን',
              'ሳቶ ፍሌክሲ',
              'ኤም ስላብ መካከለኛ',
              'የኤም ንጣፍ ትንሽ',
              'ኤም ስላብ መካከለኛ ',
              'እንደገና የማስተካከል ስራ',
              'ሌሎች',
            ].map(e => {
              return (
                <TouchableOpacity
                  style={{marginVertical: 5}}
                  key={e}
                  onPress={
                    () => {}
                    // navigation.navigate(SCREENS.ItemDetails)
                  }>
                  <ListItem bottomDivider containerStyle={{borderRadius: 5}}>
                    <View
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        backgroundColor: 'grey',
                      }}></View>
                    <ListItem.Content>
                      <ListItem.Title style={{fontWeight: 'bold'}}>
                        {e}
                      </ListItem.Title>
                      <ListItem.Subtitle
                        style={{fontSize: 16, color: colors.grey}}>
                        {'300 ብር / አንዱን'}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <View style={{alignItems: 'center'}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontWeight: '900',
                            fontSize: 16,
                          }}>
                          7
                        </Text>
                      </View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: colors.faded_dark,
                        }}>
                        በእጅ ያለ
                      </Text>
                    </View>
                  </ListItem>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  boardContainer: {
    marginHorizontal: 5,
    marginVertical: 20,
    backgroundColor: 'white',
    height: 80,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  boardCol: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonwithIcon: {
    backgroundColor: colors.lightBlue,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    width: '25%',
    padding: 10,
    gap: 2,
  },
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.grey, fontWeight: 'bold', fontSize: 12},
});
