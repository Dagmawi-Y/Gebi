import {
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect} from 'react';
import colors from '../../constants/colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, SpeedDial, Text} from '@rneui/themed';
import StatCard from '../../Components/TabBar/Sales/StatCard';
import StatCardFullWidth from '../../Components/TabBar/Sales/StatCardFullWidth';
import {SCREENS} from '../../constants/screens';
export default function Sales({navigation}: any) {
  let dimensions = Dimensions.get('window');
  const [speedDialOpen, setSpeedDialOpen] = React.useState(false);
  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 100,
            backgroundColor: 'purple',
            position: 'absolute',
            bottom: -10,
            zIndex: 10000,
            // left: '50%',
            alignSelf:"center"
          }}></View> */}
        <View
          style={{
            backgroundColor: colors.APP_PRIMARY,
            height: 0.28 * dimensions.height,
            borderBottomEndRadius: 30,
            paddingHorizontal: 5,
            // borderBottomStartRadius:10,
          }}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Text h4 style={{color: 'white'}}>
              ሽያጭ
            </Text>
            <View style={styles.statContainer}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <View style={{flex: 1, marginRight: 2}}>
                  <StatCard label="ገቢ" value="3,155" trend="positive" />
                </View>
                <View style={{flex: 1, marginLeft: 2}}>
                  <StatCard label="ወጪ" value="3,155" trend="negative" />
                </View>

              </View>
              <View style={{marginVertical: 10}}>
                <StatCardFullWidth
                  label="የቀኑ ትርፍ"
                  value="1,574"
                  trend="positive"
                />
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
            <Text style={{fontWeight: 'bold', fontSize: 20}}>Sales</Text>
            <View style={styles.buttonContainer}>
              <Button
                title="አዲስ ሽያጭ"
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
                onPress={() => navigation.navigate(SCREENS.CreateNewSales)}
              />
              <Button
                title="Plan your sales"
                icon={{
                  name: 'calculator',
                  type: 'font-awesome',
                  size: 15,
                  color: '#0047CC',
                }}
                type="clear"
                titleStyle={{color: '#0047CC', fontSize: 14}}
                containerStyle={{
                  width: 150,
                  margin: 0,
                  padding: 0,
                  backgroundColor: 'rgb(223, 231, 245)',
                }}
              />
            </View>
          </View>
          <ScrollView>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(e => {
              return (
                <TouchableOpacity
                  key={e}
                  onPress={() => navigation.navigate(SCREENS.UpdateSales)}>
                  <View
                    style={{
                      flexDirection: 'row',
                      borderRadius: 5,
                      backgroundColor: 'white',
                      marginVertical: 3,
                      //   height:40,
                      justifyContent: 'space-between',
                      paddingVertical: 8,
                      paddingHorizontal: 8,
                    }}>
                    <View>
                      <Text style={{fontWeight: 'bold', fontSize: 18}}>
                        ሲሚንቶ 50 ኪ.ግ
                      </Text>
                      <Text>INV-000001 (ABC Building)</Text>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <View style={{flexDirection: 'row'}}>
                        <Text
                          style={{
                            fontWeight: 'bold',
                            fontSize: 18,
                            color: '#1BC773',
                          }}>
                          750.45 ብር
                        </Text>
                        {e % 2 == 0 ? (
                          <Text
                            style={{
                              fontWeight: 'bold',
                              fontSize: 18,
                              color: 'gold',
                              marginLeft: 5,
                            }}>
                            (ዱቤ)
                          </Text>
                        ) : null}
                      </View>
                      <Text>22 Sep 2021</Text>
                    </View>
                  </View>
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
  // logoTextStyle: {
  //   fontSize: 72,
  //   color: 'white',
  // },
  statContainer: {
    marginTop: 10,
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
});
