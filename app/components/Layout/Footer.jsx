import React from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Images
import homeLogo from '../../assets/home_active.png';
import homeLogoWhite from '../../assets/homepage.png';
import searchLogo from '../../assets/explore_inactive.png';
import productLogo from '../../assets/add_product.png';
import activitiesLogo from '../../assets/activities_inactive.png';
import profileLogo from '../../assets/profile_inactive.png';

// Router
import { Actions } from 'react-native-router-flux';

const Footer = () => (
  <View
    style={{
      flex: 0.5,
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: '#323539',
      paddingTop: hp('2%')
    }}
  >
    <TouchableWithoutFeedback onPress={() => Actions.HomeFeed()}>
      {(Actions.currentScene === 'HomeFeed') ? <Image style={{ height: 25, width: 21 }} source={homeLogo} /> : <Image style={{ height: 25, width: 21 }} source={homeLogoWhite} />}
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => console.log('search')}>
      <Image style={{ height: 25, width: 25 }} source={searchLogo} />
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => console.log('add products')}>
      <Image style={{ height: 25, width: 21 }} source={productLogo} />
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => console.log('activities')}>
      <Image style={{ height: 25, width: 27 }} source={activitiesLogo} />
    </TouchableWithoutFeedback>
    <TouchableWithoutFeedback onPress={() => console.log('editing profile')}>
      <Image style={{ height: 25, width: 21 }} source={profileLogo} />
    </TouchableWithoutFeedback>
  </View>
);

export default Footer;
