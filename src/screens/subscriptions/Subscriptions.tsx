import {Alert, StyleSheet, Text, Touchable, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MedaPayModal, {checkBillStat} from 'react-native-meda-pay';
import {StateContext} from '../../global/context';
import firestore from '@react-native-firebase/firestore';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {subscriptionAlert} from '../../utils/messagingUtil';

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoiNjM5YzYwY2YwOTAwNzExZGQwMjcxODg0Iiwicm9sZSI6Im1lcmNoYW50Iiwic3ViIjoiNjM5YzYwY2YwOTAwNzExZGQwMjcxODg0IiwiaWF0IjoxNjcxMTkyODA2fQ.whAr3Z3dtOs37X8_fTowEvLPEWIjq5k60SbGfKC4AuM';
const sandBoxToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdG9tZWRhQDM2MGdyb3VuZC5jb20iLCJuYW1lIjoiTWVkYSBWb3VjaGVyIiwicGhvbmUiOiIrMjUxOTEzMDA4NTk1IiwiaXNzIjoiIiwiaWF0IjoxNTk4OTY0NTQwLCJleHAiOjIwMzA1MDA1NDB9.p-QGfkmRtUlGTQhthS5PW1Ora6E4E-i5VMLjzAo96mY';

const Subscriptions = ({navigation}) => {
  const [isMedaPayModal, setIsMedaPayModal] = useState(false);
  const {user, userInfo, setSubscriptionPlan} = useContext(StateContext);
  const [plan, setPlan] = useState('Monthly');

  const {t} = useTranslation();

  async function writeSubscription(data) {
    firestore()
      .collection('subscriptions')
      .add(data)
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  async function updateUsers(orderId) {
    try {
      firestore()
        .collection('users')
        .onSnapshot(querySnapshot => {
          querySnapshot.forEach(async sn => {
            firestore().collection('users').doc(sn.id).update({isFree: false});
          });
        });
      navigation.goBack();
    } catch (e) {
      console.error('Error updating users: ', e);
      return null;
    }
  }

  const getUserPlan = async () => {
    try {
      if (userInfo.length > 0) {
        firestore()
          .collection('subscriptions')
          .where('owner', '==', userInfo[0]?.doc?.companyId)
          .onSnapshot(qsn => {
            let result: Array<any> = [];
            qsn.forEach(sn => {
              console.log(sn.id);
              result.push(sn.data());
            });
            const latestPlan = result.filter(p => {
              return Date.parse(p.endDate) - Date.now() > 0;
            });
            if (latestPlan.length) {
              setSubscriptionPlan(latestPlan);
              navigation.goBack();
            }
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const simulatePayment = () => {
    const data = {
      endDate: dayjs().add(1, 'month').toISOString(),
      owner: userInfo[0]?.doc?.companyId,
      startDate: dayjs().toISOString(),
      subscription: plan,
    };
    writeSubscription(data);
    getUserPlan();
    updateUsers(userInfo[0]?.doc?.companyId);
  };

  const [paymentData, setPaymentData] = useState<any>({
    Authorization: token,
    isSandBox: false,
    merchantName: 'Gebi',
    data: {
      purchaseDetails: {
        orderId: userInfo[0]?.doc?.companyId,
        description: plan,
        amount: 100,
        customerName: `Gebi_${userInfo[0]?.doc?.companyId}`,
        customerPhoneNumber: userInfo[0]?.doc?.phone.split('+')[1],
      },
      redirectUrls: {
        returnUrl: 'NaN',
        cancelUrl: 'NaN',
        callbackUrl: 'https://jobbbs.me/gebi/pay',
      },
      metaData: {
        'any Data': 'any Val',
      },
    },
  });

  useEffect(() => {
    setPaymentData({
      Authorization: token,
      isSandBox: false,
      merchantName: 'Gebi',
      data: {
        purchaseDetails: {
          orderId: userInfo[0]?.doc?.companyId,
          description: plan,
          amount: 100,
          customerName: `Gebi_${userInfo[0]?.doc?.name}`,
          customerPhoneNumber: userInfo[0]?.doc?.phone.split('+')[1],
        },
        redirectUrls: {
          returnUrl: 'NaN',
          cancelUrl: 'NaN',
          callbackUrl: 'https://jobbbs.me/gebi/pay',
        },
        metaData: {
          'any Data': 'any Val',
        },
      },
    });
  }, [plan]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>{t('Subscription')}</Text>
      <View>
        <PriceCard
          plan={plan}
          setPlan={setPlan}
          duration={'Monthly'}
          price={100}
          currency={'Birr'}
          color={colors.primary}
          t={t}
        />
        {/* <PriceCard
          t={t}
          plan={plan}
          setPlan={setPlan}
          duration={'Yearly'}
          price={80}
          currency={'Birr'}
          color={colors.primary}
        /> */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (!plan) {
              return Alert.alert('Please choose a plan', '', [
                {text: 'Ok', onPress: () => {}},
              ]);
            }
            // simulatePayment();
            setIsMedaPayModal(true);
          }}
          style={{
            backgroundColor: colors.primary,
            padding: 10,
            maxWidth: '50%',
            borderRadius: 5,
            alignSelf: 'center',
            marginTop: 30,
          }}>
          <Text style={{color: colors.white}}>{t('Pay')}</Text>
        </TouchableOpacity>
      </View>

      <MedaPayModal
        config={paymentData}
        isVisible={isMedaPayModal}
        isWithRefNumber={false}
        onShow={() => {
          console.log('meda pay modal shown');
        }}
        onClose={() => {
          //!where you should check payment bill stat and close the medapay modal
          setIsMedaPayModal(false);
          console.log('payment modal closed');
        }}
        onPaymentCompleted={() => {
          console.log('Payment completed');
          setIsMedaPayModal(false);
        }}
        onCancel={() => {
          //!close the medapay modal
          setIsMedaPayModal(false);
          console.log('payment modal canceled');
        }}
        onReferenceNumber={refNumber => {
          console.log('Reference number generated: ', refNumber);
        }}
        onBillCreationError={error => {
          console.log('Bill creation Error', error);
          setIsMedaPayModal(false);
        }}
        onPaymentError={error => {
          setIsMedaPayModal(false);
          console.log('Payment Error', error);
        }}
        onPaymentMethodSelected={selectedPaymentMethod => {
          console.log(selectedPaymentMethod);
          console.log(paymentData);
        }}
      />
    </View>
  );
};

export default Subscriptions;

type CardDataTypes = {
  duration: string;
  plan: string;
  price: number;
  currency: string;
  color: string;
  setPlan: any;
  t: any;
};

const PriceCard = ({
  duration,
  price,
  currency,
  plan,
  color,
  setPlan,
  t,
}: CardDataTypes) => {
  return (
    <TouchableOpacity
      onPress={() => {
        setPlan(duration);
      }}
      activeOpacity={0.6}
      style={[
        CardStyles.card,
        plan == duration
          ? {
              shadowColor: colors.primary,
              borderColor: colors.primary,
              borderWidth: 2,
            }
          : {},
      ]}>
      <View style={[CardStyles.cardheader, {backgroundColor: color}]}>
        <Text style={CardStyles.cardHeaderText}>{t(duration)}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={CardStyles.cardPrice}>
          {price}
          {t(currency)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  headerText: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});
const CardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    width: '80%',
    alignSelf: 'center',
    borderRadius: 15,
    paddingBottom: 10,
    marginVertical: 20,
    elevation: 20,
  },
  cardheader: {
    borderTopEndRadius: 10,
    borderTopStartRadius: 10,
    paddingHorizontal: 20,
  },
  cardHeaderText: {
    color: colors.white,
    fontSize: 25,
    fontWeight: 'bold',
  },
  cardPrice: {
    marginLeft: 20,
    backgroundColor: 'white',
    color: colors.black,
    fontSize: 50,
    fontWeight: 'bold',
  },
});
