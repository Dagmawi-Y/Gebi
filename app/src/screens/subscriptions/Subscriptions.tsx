import {Alert, StyleSheet, Text, Touchable, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import colors from '../../config/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import MedaPayModal, {checkBillStat} from 'react-native-meda-pay';
import {StateContext} from '../../global/context';
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXJjaGFudElkIjoiNjJlNGU3MTdmNGRmOGEwNmFkYjUzZDc3Iiwicm9sZSI6Im1lcmNoYW50Iiwic3ViIjoiNjJlNGU3MTdmNGRmOGEwNmFkYjUzZDc3IiwiaWF0IjoxNjU5MTY4NTYyfQ.-PSUZd8YX6PHsw2sn54Em31iK4jcWclc-TakokBaglI';
const sandBoxToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhdG9tZWRhQDM2MGdyb3VuZC5jb20iLCJuYW1lIjoiTWVkYSBWb3VjaGVyIiwicGhvbmUiOiIrMjUxOTEzMDA4NTk1IiwiaXNzIjoiIiwiaWF0IjoxNTk4OTY0NTQwLCJleHAiOjIwMzA1MDA1NDB9.p-QGfkmRtUlGTQhthS5PW1Ora6E4E-i5VMLjzAo96mY';

const Subscriptions = () => {
  const [isMedaPayModal, setIsMedaPayModal] = useState(false);
  const {user, userInfo} = useContext(StateContext);
  const [plan, setPlan] = useState('Monthly');
  const [paymentData, setPaymentData] = useState<any>({
    Authorization: token,
    isSandBox: false,
    merchantName: 'example merchant',
    data: {
      purchaseDetails: {
        orderId: userInfo[0].doc.companyId,
        description: plan,
        amount: 1,
        customerName: `Gebi_${userInfo[0].doc.companyId}`,
        customerPhoneNumber: userInfo[0].doc.phone.split('+')[1],
      },
      redirectUrls: {
        returnUrl: 'NaN',
        cancelUrl: 'NaN',
        callbackUrl: 'https://jobbb.me/gebi/',
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
      merchantName: 'example merchant',
      data: {
        purchaseDetails: {
          orderId: userInfo[0].doc.companyId,
          description: plan,
          amount: 1,
          customerName: `Gebi_${userInfo[0].doc.companyId}`,
          customerPhoneNumber: userInfo[0].doc.phone.split('+')[1],
        },
        redirectUrls: {
          returnUrl: 'NaN',
          cancelUrl: 'NaN',
          callbackUrl: 'https://jobbb.me/gebi/',
        },
        metaData: {
          'any Data': 'any Val',
        },
      },
    });
  }, [plan]);

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Subscriptions</Text>
      <View>
        <PriceCard
          plan={plan}
          setPlan={setPlan}
          duration={'Monthly'}
          price={10}
          currency={'Birr'}
          color={colors.dark_grey}
        />
        <PriceCard
          plan={plan}
          setPlan={setPlan}
          duration={'Yearly'}
          price={80}
          currency={'Birr'}
          color={colors.primary}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {
            if (!plan) {
              return Alert.alert('Please choose a plan', '', [
                {text: 'Ok', onPress: () => {}},
              ]);
            }
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
          <Text style={{color: colors.white}}>Proceed to payment</Text>
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
};

const PriceCard = ({
  duration,
  price,
  currency,
  plan,
  color,
  setPlan,
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
        <Text style={CardStyles.cardHeaderText}>{duration}</Text>
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={CardStyles.cardPrice}>
          {price}
          {currency}
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
    borderRadius: 10,
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
