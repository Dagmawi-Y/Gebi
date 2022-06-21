import {Platform} from 'react-native';

import colors from './colors';

export default {
  colors,
  text: {
    color: colors.dark,
    fontSize: 18,
    fontFamily: Platform.OS === 'android' ? 'Roboto' : 'Avenir',
  },
  buttonRadius: 10,
  buttonWhite: {
    backgroundColor: colors.white,
    bottom: 20,
    marginBottom: 20,
    height: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
    borderRadius: gstyles.buttonRadius,
  },
};
