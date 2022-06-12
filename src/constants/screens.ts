import ChooseLanguage from '../screens/ChooseLanguage';
import ChooseRoute from '../screens/ChooseRoute';
import Intro from '../screens/Intro';
import ItemDetails from '../screens/Items/ItemDetail';
import QRList from '../screens/Items/QRList';
import RegisterPhone from '../screens/Register/RegisterPhone';
import RegisterSuccess from '../screens/Register/RegisterSuccess';
import RegisterUserInfo from '../screens/Register/RegisterUserInfo';
import CreateNewSales from '../screens/Sales/CreateNewSales';
import UpdateSales from '../screens/Sales/UpdateSales';
import Splash from '../screens/Splash';
import Tabs from '../screens/TabBarScreen';

/**
 * Define screen names as constants here
 */
const SCREENS = {
  Splash: Splash.routeName,
  Intro: Intro.routeName,
  ChooseLanguage: ChooseLanguage.routeName,
  RegisterPhone: RegisterPhone.routeName,
  RegisterUserInfo: RegisterUserInfo.routeName,
  RegisterSuccess: RegisterSuccess.routeName,
  ChooseRoute: ChooseRoute.routeName,
  TabRoute: Tabs.routeName,
  CreateNewSales: CreateNewSales.routeName,
  UpdateSales: UpdateSales.routeName,
  ItemDetails: ItemDetails.routeName,
  QRList: QRList.routeName,
};

export {SCREENS};
