import {
    Alert,
    SafeAreaView,
    ScrollView,
    Text,
    StyleSheet,
    Image,
    View,
    TouchableOpacity,
  } from 'react-native';
  
  import React, {useContext, useEffect, useState} from 'react';
import { TextInput, TouchableHighlight } from 'react-native-gesture-handler';
import colors from '../../config/colors';
import { useTranslation } from 'react-i18next';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
  
  const EditInventoryItem = ({route, navigation}) => {
    const history = route.params;
    const [initialCount, setInitialCount] = useState(history.initialCount);
    const [unit, setUnit] = useState(history.unit);
    const [unit_price, setUnitPrice]  = useState(history.unit_price);
    const [shouldEdit, setShouldEdit] = useState(false);
    const {t} = useTranslation();
    const [headerMessage, setHeaderMessage] = useState("Item Detail");
    useEffect(()=>{
      console.log(history);
    });
    const deleteItem = async () => {
    //   Alert.alert(t('Are_You_Sure?'), ``, [
    //     {
    //       text: t('Yes'),
    //       onPress: async () => {
    //         if (data.picture) {
    //           let pictureRef = storage().refFromURL(data.picture);
    //           pictureRef.delete().catch(err => console.log(err));
    //         }
    //         await firestore().collection('inventory').doc(itemId).delete();
    //         const picture = storage().refFromURL(data.picture);
    //         picture
    //           .delete()
    //           .then(res => {})
    //           .catch(err => console.log(err));
    //         deleteStock();
    //         navigation.goBack();
    //       },
    //       style: 'default',
    //     },
    //     {
    //       text: t('Cancel'),
    //       onPress: () => {},
    //       style: 'cancel',
    //     },
    //   ]);
    };


    const CustomTextInput = (value, onChange, setValue, shouldEdit, placeholder)=>  {

      return (
          <TextInput
              style={styles.emailInput}
              onChangeText={(code: any) => setValue(value)}
              value={value}
              placeholder={placeholder}
              keyboardType="numeric"
              placeholderTextColor={colors.black}
              editable={shouldEdit}
              focusable={true}
            />
      )
  
  }

  
  const handleSubmit = () => {
      
  }

  const handleDeleteItem = () =>{
      
  }
    return (
        <View>
            <Text style={{marginTop : 10, fontWeight : 'bold', fontSize : 25, textAlign : 'center', color : 'black'}}>{headerMessage}</Text>
           <Text style={{color : colors.black, fontWeight: 'bold', fontSize : 18, marginLeft : 20}}>
                  {t('Birr')}
            </Text>
           {CustomTextInput(initialCount, handleSubmit, setInitialCount, shouldEdit, "Birr")}
           <Text style={{color : colors.black, fontWeight: 'bold', fontSize : 18, marginLeft : 20}}>
           {"Initial Count"}
            </Text>
           {CustomTextInput(unit, handleSubmit, setUnit, shouldEdit, "Initial Count")}
           <Text style={{color : colors.black, fontWeight: 'bold', fontSize : 18, marginLeft : 20}}>
                  {"Unit"}
            </Text>
           {CustomTextInput(unit_price, handleSubmit, setUnitPrice,shouldEdit, "Unit")}
           <Text style={{color : colors.black, fontWeight: 'bold', fontSize : 18, marginLeft : 20}}>
                  {"Unit Sale Price"}
            </Text>
           {CustomTextInput(unit_price, handleSubmit, setUnitPrice,shouldEdit, "Unit sale price")}
           <Text style={{color : colors.black, fontWeight: 'bold', fontSize : 18, marginLeft : 20}}>
                  {"Unit Price"}
            </Text>
           {CustomTextInput(unit_price, handleSubmit, setUnitPrice,shouldEdit, "Unit Price")}
           <Text style={{color : colors.black, fontWeight: 'bold', fontSize : 18, marginLeft : 20}}>
                  {"Created Date"}
            </Text>
           {CustomTextInput(unit_price, handleSubmit, setUnitPrice,shouldEdit, "Created Date")}
           <TouchableHighlight onPress={handleSubmit} style={styles.button}>
              <Text style={styles.buttonText}>Save</Text>
          </TouchableHighlight>
          <View style={styles.editAndDelteStyle}>
            <TouchableOpacity onPress={() => setShouldEdit(!shouldEdit)}>
            <Icon style={styles.iconsStyle} name={!shouldEdit ? "pencil" : "content-save-outline"} size={25} color={colors.black} />
            </TouchableOpacity>
       
            <TouchableOpacity onPress={() => handleDeleteItem()}>
              <Icon style={styles.iconsStyle} name="delete" size={25} color={colors.black} />
            </TouchableOpacity>
          </View>
        </View>
    );
  };

  const styles = StyleSheet.create({
    emailInput: {
        marginLeft : 20,
        marginTop : 3,
        marginBottom : 10,
        width: 350,
        height: 50,
        borderWidth: 1,
        borderRadius: 15,
        borderColor: 'black',
        paddingLeft : 5,
        color : colors.black
    },
    button: {
        backgroundColor: 'blue',
        borderRadius: 15,
        margin: 20,
        padding: 10,
        alignItems: 'center'
      },
      buttonText: {
        color: 'white'
    },

    editAndDelteStyle :{
      display : 'flex',
      flexDirection : 'row',
      alignItems : 'center',
      justifyContent : 'center'
    },
    iconsStyle : {
      padding : 20
    }
   });


  export default EditInventoryItem;
  