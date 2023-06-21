import React from 'react'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const ExpenseTypes = {
  TYPE1: 'TYPE1',
  TYPE2: 'TYPE2',
  TYPE3: 'Type3',
};

const getIconForExpenseType = (type: string) => {
  switch (type) {
    case ExpenseTypes.TYPE1:
      return (
        <MaterialCommunityIcons
          name={'arrow-up-bold-circle'}
          color={'green'}
          size={20}
        />
      );
      break;
    case ExpenseTypes.TYPE2:
      return <MaterialCommunityIcons name={'cart'} color={'red'} size={20} />;
      break;
    case ExpenseTypes.TYPE3:
      return <MaterialCommunityIcons name={'format-list-bulleted'} color={'gold'} size={20} />;
      break;
    default:
      return null;
      break;
  }
};
export {ExpenseTypes,getIconForExpenseType};
