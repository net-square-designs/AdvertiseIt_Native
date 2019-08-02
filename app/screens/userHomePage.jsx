// Packages
import React, { createRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

// Actions
import { SocialAuth, SwitchRoleToCustomerMerchant, UserProfile } from '../actions/index';

// Components
import { UserHomePageProductCard, Footer } from '../components';

// Images
import nikeLogo from '../assets/nike2.png';
import defaultPersonPhoto from '../assets/default_person_photo.png';
import logo from '../assets/logo_small.png';

class UserHomePage extends React.Component {
  state = {
    user: null
  }

  componentDidMount() {
    // Fetch user's profile and populate inputs
    let username;

    const { facebookToken, signupToken, loginToken, UserProfile } = this.props;

    if (facebookToken) {
      username = jwtDecode(facebookToken).username;
    } else if (signupToken) {
      username = jwtDecode(signupToken).username
    } else if (loginToken) {
      username = jwtDecode(loginToken).username
    }

    UserProfile(username);
  }

  openSideDrawer = () => {
    this.refs['DRAWER_REF'].openDrawer();
  }

  addToCart = (productId) => {
    console.log('Added to cart');
  }

  viewProductDetails = (productId) => {
    console.log('Viewing product details');
  }

  render() {
    const { facebookStatus, signUpStatus, loginStatus,
      facebookToken, signupToken, loginToken, userProfile
    } = this.props;

    return (
        <View style={{ flex: 1, height: '100%', backgroundColor: '#7d7d7d' }}>
          {/* Header */}
          <View
          style={{
            flex: 0.7, flexDirection: 'row', marginLeft: wp('2%'), marginTop: hp('2%'),
            backgroundColor: 'white'
          }}
        >
          {/* Header */}
          {/* <Image source={{ uri: (userProfile && userProfile.user) ? (userProfile.user.hasOwnProperty('firstName') ? userProfile.user.image : 'https://cdn150.picsart.com/upscale-245339439045212.png?r1024x1024') : 'https://cdn150.picsart.com/upscale-245339439045212.png?r1024x1024' }}
            style={{ width: 60, height: 60, borderRadius: 100 }} /> */}
          <View><Image source={(userProfile && userProfile.user) ? (userProfile.user.hasOwnProperty('firstName') ? { uri: userProfile.user.image } : defaultPersonPhoto) : defaultPersonPhoto}
            style={{ width: 60, height: 60, borderRadius: 100 }} /></View>
          <View style={{ marginTop: hp('1%'), marginLeft: wp('2%') }}>
            <Text style={{ fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>{
              (userProfile && userProfile.user) ? userProfile.user.hasOwnProperty('firstName') ? `${userProfile.user.firstName} ${userProfile.user.lastName}` :
                (facebookToken) ? jwtDecode(facebookToken).username :
                  (signupToken) ? jwtDecode(signupToken).username :
                    (loginToken) ? jwtDecode(loginToken).username :
                      <TouchableWithoutFeedback underlayColor='white' onPress={() => Actions.LogUserIn()}><Text>Please Login</Text></TouchableWithoutFeedback> : ''
            }</Text>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white' }}>
              <Image style={{ height: 15, width: 15 }} source={logo} />
              <Text style={{ fontWeight: 'bold', color: 'violet' }}>
                {
                  (facebookToken) ? jwtDecode(facebookToken).role :
                    (signupToken) ? jwtDecode(signupToken).role :
                      (loginToken) ? jwtDecode(loginToken).role : <TouchableWithoutFeedback underlayColor='white' onPress={() => Actions.LogUserIn()}><Text>Please Login</Text></TouchableWithoutFeedback>
                }
              </Text>
            </View>
          </View>
        </View>

          {/* Body */}
          <View style={{ flex: 6, backgroundColor: '#4d4f50' }}>
            {loginStatus === 'START_LOADING' ? <View style={{ marginTop: hp('30%') }}><ActivityIndicator size={70} animating={true} color={'white'} /></View> :
              facebookStatus === 'FACEBOOK_START_LOADING' ? <View style={{ marginTop: hp('30%') }}><ActivityIndicator size={70} animating={true} color={'white'} /></View> :
                signUpStatus === 'START_LOADING' ? <View style={{ marginTop: hp('30%') }}><ActivityIndicator size={70} animating={true} color={'white'} /></View> :
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <UserHomePageProductCard
                        productPhoto={nikeLogo}
                        viewProductDetails={this.viewProductDetails}
                      />
                      <UserHomePageProductCard
                        productPhoto={nikeLogo}
                        viewProductDetails={this.viewProductDetails}
                      />
                      <UserHomePageProductCard
                        productPhoto={nikeLogo}
                        viewProductDetails={this.viewProductDetails}
                      />
                    </ScrollView>
                  </View>
            }
          </View>

          {/* Footer */}
          <Footer />
        </View>
    );
  }
};

const styles = StyleSheet.create({
  linearGradient: {
    paddingLeft: wp('3%'),
    paddingRight: wp('11%'),
    fontFamily: 'Arial',
    paddingTop: hp('1%'),
    paddingBottom: hp('15%'),
    height: hp('2vh'),
    width: wp('100%')
  },
  break: {
    marginTop: '7%'
  }
});

const mapStateToProps = state => ({
  loginStatus: state.logIn.status,
  loginToken: state.logIn.token,
  signUpStatus: state.signUp.status,
  signupToken: state.signUp.token,
  facebookToken: state.facebook.facebookToken,
  facebookStatus: state.facebook.facebookStatus,
  switchRoleCustomerMerchantMessage: state.switchRoleCustomerMerchant.token,
  switchRoleCustomerMerchantStatus: state.switchRoleCustomerMerchant.status,
  userProfile: state.userProfile
});

export default connect(mapStateToProps, { SocialAuth, SwitchRoleToCustomerMerchant, UserProfile })(UserHomePage);
