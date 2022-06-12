import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import colors from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, ListItem, SpeedDial, Text} from '@rneui/themed';
import StatCard from '../../Components/TabBar/Sales/StatCard';
import StatCardFullWidth from '../../Components/TabBar/Sales/StatCardFullWidth';
import {SCREENS} from '../../constants/screens';
import AntdIcons from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import {
  ExpenseTypes,
  getIconForExpenseType,
} from '../../constants/expenseTypes';
import AddItemModal from '../../Components/Items/AddItemModal';
export default function Items({navigation}: any) {
  let dimensions = Dimensions.get('window');
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Modal isVisible={isModalVisible} avoidKeyboard>
          <AddItemModal toggleModal={toggleModal} />
        </Modal>
        <View
          style={{
            backgroundColor: colors.APP_PRIMARY,
            height: 0.28 * dimensions.height,
            borderBottomEndRadius: 30,
            paddingHorizontal: 5,
          }}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Text h4 style={{color: 'white'}}>
              የእቃ ክፍል
            </Text>
            <View style={styles.boardContainer}>
              <View style={styles.boardCol}>
                <Text style={styles.boardTopTitle}>314</Text>
                <Text style={styles.boardSubTitle}>ያሉ እቃዎች</Text>
              </View>
              <View style={styles.boardCol}>
                <Text style={styles.boardTopTitle}>159,000 ብር</Text>
                <Text style={styles.boardSubTitle}>አጠቃላይ ዋጋ</Text>
              </View>
            </View>
          </View>
        </View>
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
                color: colors.FADED_BLACK_1,
              }}>
              ያሉ አቃዎች
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Button
                title="አዲስ እቃ"
                icon={{
                  name: 'plus',
                  type: 'font-awesome',
                  size: 15,
                  color: '#0047CC',
                }}
                type="clear"
                titleStyle={{color: '#0047CC', fontSize: 14}}
                containerStyle={{
                  width: 100,
                  marginHorizontal: 10,
                  padding: 0,
                  backgroundColor: 'rgb(223, 231, 245)',
                }}
                onPress={toggleModal}
              />
              <Button
                title="Print QR"
                icon={{
                  name: 'qrcode',
                  type: 'font-awesome',
                  size: 15,
                  color: '#0047CC',
                }}
                type="clear"
                titleStyle={{color: '#0047CC', fontSize: 14}}
                containerStyle={{
                  margin: 0,
                  padding: 0,
                  backgroundColor: 'rgb(223, 231, 245)',
                }}
                onPress={()=>navigation.navigate(SCREENS.QRList)}
              />
            </View>
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
                  onPress={() => navigation.navigate(SCREENS.ItemDetails)}>
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
                        style={{fontSize: 16, color: colors.GREY_1}}>
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
                          color: colors.FADED_BLACK_1,
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
  boardTopTitle: {fontSize: 22, fontWeight: '900'},
  boardSubTitle: {color: colors.GREY_1, fontWeight: 'bold', fontSize: 12},
});
