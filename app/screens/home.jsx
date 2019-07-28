// Packages
import React, { createRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Switch,
  TouchableWithoutFeedback,
  TouchableHighlight,
  StyleSheet,
  Linking,
  Image
} from 'react-native';
import Config from "react-native-config";
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import jwtDecode from 'jwt-decode';
import SafariView from 'react-native-safari-view';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

// Actions
import { SocialAuth, SwitchRoleToCustomerMerchant, UserProfile } from '../actions/index';

// Images
import logo from '../assets/logo_small.png';
import logoFull from '../assets/logo.png';
import cartLogo from '../assets/cart.png';
import homeLogo from '../assets/home_active.png';
import homepageLogo from '../assets/homepage.png';
import promotionLogo from '../assets/promotion.png';
import settingLogo from '../assets/setting.png';
import notificationLogo from '../assets/notification.png';
import messageLogo from '../assets/messages.png';
import bookmarkLogo from '../assets/bookmark.png';
import searchLogo from '../assets/explore_inactive.png';
import productLogo from '../assets/add_product.png';
import activitiesLogo from '../assets/activities_inactive.png';
import profileLogo from '../assets/profile_inactive.png';

class Home extends React.Component {
  state = {
    switchStatus: false,
    trueStatus: true,
    falseStatus: false,
    roleText1: 'Switch back to Customer or Merchant mode',
    roleText2: 'Switch to Influencer or Promoter mode',
    user: null
  }

  componentDidMount() {
    // Fetch user's profile and populate inputs
    let username;

    const { facebookToken, signupToken, loginToken, UserProfile } = this.props;
        
    if (facebookToken){
      username = jwtDecode(facebookToken).username;
    } else if (signupToken) {
      username = jwtDecode(signupToken).username
    } else if (loginToken) {
      username = jwtDecode(loginToken).username
    }

    UserProfile(username);

    // Add event listener to handle OAuthLogin:// URLs
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    this.setState({
      // Decode the user string and parse it into JSON
      user: JSON.parse(decodeURI(user_string))
    });

    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
  };

  handleFacebook = () => {
    if (Platform.OS === 'ios') {
      SafariView.show({
        url: `${Config.BASE_URL_PROD}/api/v1/auth/facebook`,
        fromBottom: true,
      });
    } else {
      Linking.openURL(`${Config.BASE_URL_PROD}/api/v1/auth/facebook`);
    }
  }

  switchToCustomer = () => {
    const { facebookToken } = this.props;
    const { SwitchRoleToCustomerMerchant } = this.props;
    SwitchRoleToCustomerMerchant(jwtDecode(facebookToken).username, 'customer-merchant', facebookToken);
  }

  handleSwitchRole = async (data) => {
    await this.setState({
      trueStatus: !this.state.trueStatus
    });
    await this.setState({
      falseStatus: !this.state.falseStatus
    });

    if (data === true) {
      await this.setState({
        switchStatus: true
      });

      const { SocialAuth, loginToken, signupToken } = this.props;
      if (this.state.switchStatus === true && this.state.user) {
        SocialAuth(this.state.user.emails[0].value, this.state.user.emails[0].value, 'influencer');
      } else if (this.state.switchStatus === true && loginToken) {
        SocialAuth(jwtDecode(loginToken).email, jwtDecode(loginToken).username, 'influencer');
      } else if (this.state.switchStatus === true && signupToken) {
        SocialAuth(jwtDecode(signupToken).email, jwtDecode(signupToken).username, 'influencer');
      }
      this.setState({
        roleText1: 'Switch back to Customer or Merchant mode'
      });
      await this.handleFacebook();
    } else {
      this.setState({
        roleText1: 'Switch to Influencer or Promoter mode'
      });
      this.switchToCustomer();
    }
  }

  openSideDrawer = () => {
    this.refs['DRAWER_REF'].openDrawer();
  }

  render() {
    const { facebookStatus, signUpStatus, loginStatus,
      facebookToken, signupToken, loginToken, userProfile
    } = this.props;

    const drawerView = (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        {/* Header */}
        <View
          style={{
            flex: 0.9, flexDirection: 'row', marginLeft: wp('2%'), marginTop: hp('2%'),
             backgroundColor: 'white'
          }}
        >
          <Image source={{ uri: (userProfile && userProfile.user) ? (userProfile.user.hasOwnProperty('firstName') ? userProfile.user.image : 'https://cdn150.picsart.com/upscale-245339439045212.png?r1024x1024') : 'https://cdn150.picsart.com/upscale-245339439045212.png?r1024x1024' }}
            style={{ width: 60, height: 60, borderRadius: 100 }} />
          <View style={{ marginTop: hp('1%'), marginLeft: wp('2%')}}>
            <Text style={{fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet'}}>{
              (userProfile && userProfile.user) ? userProfile.user.hasOwnProperty('firstName') ? `${userProfile.user.firstName} ${userProfile.user.lastName}`:
              (facebookToken) ? jwtDecode(facebookToken).username :
                (signupToken) ? jwtDecode(signupToken).username :
                  (loginToken) ? jwtDecode(loginToken).username :
                    'Please Login' : ''
            }</Text>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white'}}>
              <Image style={{ height: 15, width: 15 }} source={logo} /> 
              <Text style={{fontWeight: 'bold', color: 'violet'}}>
              {
                (facebookToken) ? jwtDecode(facebookToken).role :
                (signupToken) ? jwtDecode(signupToken).role :
                  (loginToken) ? jwtDecode(loginToken).role :  'Please Login'
              }
              </Text>
            </View>
          </View>
        </View>

        {/* Edit Profile */}
        <View style={{ flex: 0.3 }}>
          <TouchableWithoutFeedback  underlayColor='blue'  onPress={() => Actions.UserProfile()}>
            <Text style={{ fontWeight: 'bold',
            color: 'violet',
            width: wp('23%'),
            marginLeft: wp('2%'),
            padding: hp('0.5%'),
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderBottomWidth: 1,
            borderBottomLeftRadius: 2,
            borderBottomRightRadius: 2,
            borderTopRightRadius: 2,
            borderTopLeftRadius: 2,
            borderColor: 'violet'
            }}>
              Edit Profile
            </Text>
          </TouchableWithoutFeedback>
        </View>

        {/* Body */}
        <View style={{flex: 5, justifyContent: 'space-around'}}>
            <TouchableHighlight onPress={() => console.log('editing profile')}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={homepageLogo} /> 
                <View>
                  <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet'}}>My Homepage</Text>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => console.log('editing profile')}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={promotionLogo} /> 
                <View>
                  <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet'}}>Promotions</Text>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => console.log('editing profile')}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={settingLogo} /> 
                <View>
                  <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet'}}>Settings</Text>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => console.log('editing profile')}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={notificationLogo} /> 
                <View>
                  <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet'}}>Notifications</Text>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => console.log('editing profile')}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={messageLogo} /> 
                <View>
                  <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet'}}>Messages</Text>
                </View>
              </View>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => console.log('editing profile')}>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
                <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={bookmarkLogo} /> 
                <View>
                  <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet'}}>Bookmarks</Text>
                </View>
              </View>
            </TouchableHighlight>
        </View>

        {/* Footer */}
        <View style={{ flex: 1.1 }}>
          <LinearGradient colors={['rgb(136,78,162)', 'rgb(222,78,100)']} style={styles.linearGradient}>
            <Text style={{ color: 'white', fontSize: hp('3rem'), fontWeight: 'bold', fontFamily: 'Arial', }}>{
              (facebookToken) ? (jwtDecode(facebookToken).role === 'influencer' ? this.state.roleText1 : 'Switch to Influencer or Promoter mode') :
                (signupToken) ? (jwtDecode(signupToken).role === 'customer-merchant' ? 'Switch to Influencer or Promoter mode' : this.state.roleText1) :
                  (loginToken) ? (jwtDecode(loginToken).role === 'customer-merchant' ? 'Switch to Influencer or Promoter mode' : this.state.roleText1) :
                    'Switch to Influencer or Promoter mode'
            }</Text>
            <Switch
              onValueChange={(data) => this.handleSwitchRole(data)}
              value={
                facebookToken ? (jwtDecode(facebookToken).role === 'influencer' ? this.state.trueStatus : this.state.falseStatus) :
                  signupToken ? (jwtDecode(signupToken).role === 'customer-merchant' ? this.state.falseStatus : this.state.trueStatus) :
                    loginToken && jwtDecode(loginToken).role === 'customer-merchant' ? this.state.falseStatus : this.state.trueStatus
              }
              thumbColor={'yellow'}
            />
          </LinearGradient>
        </View>
      </View>
    );

    return (
      <DrawerLayout
        drawerWidth={wp('90%')}
        drawerPosition={DrawerLayout.positions.Left}
        renderNavigationView={() => drawerView}
        ref={'DRAWER_REF'}
      >
        <View style={{ flex: 1, height: '100%', backgroundColor: '#7d7d7d'}}>
          {/* Header */}
          <View style={{ paddingTop: hp('2%'), flex: 0.8, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#002233' }}>
            <TouchableWithoutFeedback onPress={() => this.openSideDrawer()}>
              <Text style={{
              color: 'white',
              marginLeft: wp('2%'),
              fontSize: 30
              }}>
                &#9776;
              </Text>
            </TouchableWithoutFeedback>
            <Image style={{ marginTop: hp('1%') }} source={logoFull} />
            <Image style={{ height: 25, width: 21, marginTop: hp('1%') }} source={cartLogo} />
          </View>
          
          {/* Body */}
          <View style={{ flex: 6, backgroundColor: '#4d4f50' }}>
            {loginStatus === 'START_LOADING' ? <View style={{ marginTop: hp('30%') }}><ActivityIndicator size={70} animating={true} color={'white'} /></View> :
            facebookStatus === 'FACEBOOK_START_LOADING' ? <View style={{ marginTop: hp('30%') }}><ActivityIndicator size={70} animating={true} color={'white'} /></View> :
            signUpStatus === 'START_LOADING' ? <View style={{ marginTop: hp('30%') }}><ActivityIndicator size={70} animating={true} color={'white'} /></View> :
              <View>
                <Text style={{ color: 'white', fontSize: 10 }}>{facebookToken && `Hello Welcome to the home feed ${jwtDecode(facebookToken).username} Work in progress ...`}</Text>
                <Text style={{ color: 'white', fontSize: 10 }}>{signupToken && `Hello Welcome to the home feed ${jwtDecode(signupToken).username} Work in progress ...`}</Text>
                <Text style={{ color: 'white', fontSize: 10 }}>{loginToken && `Hello Welcome to the home feed ${jwtDecode(loginToken).username} Work in progress ...`}</Text>
              </View>
            }
          </View>

          {/* Footer */}
          <View
            style={{
              flex: 0.5,
              flexDirection: 'row',
              justifyContent: 'space-around',
              backgroundColor: '#002233',
              paddingTop: hp('2%')
            }}
          >
            <TouchableWithoutFeedback onPress={() => console.log('home')}>
              <Image style={{ height: 25, width: 21 }} source={homeLogo} /> 
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
        </View>
      </DrawerLayout>
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

export default connect(mapStateToProps, { SocialAuth, SwitchRoleToCustomerMerchant, UserProfile })(Home);
