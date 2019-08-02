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
  Image,
  ScrollView,
  BackHandler
} from 'react-native';
import Config from "react-native-config";
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import jwtDecode from 'jwt-decode';
import SafariView from 'react-native-safari-view';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

// Store
import store from '../store';

// Actions
import { SocialAuth, SwitchRoleToCustomerMerchant, UserProfile } from '../actions/index';

// Components
import { HomeFeedCard, Footer } from '../components';

// Images
import logo from '../assets/logo_small.png';
import logoFull from '../assets/logo.png';
import cartLogo from '../assets/cart.png';
import homepageLogo from '../assets/homepage.png';
import promotionLogo from '../assets/promotion.jpeg';
import settingLogo from '../assets/setting.jpeg';
import notificationLogo from '../assets/notification.jpeg';
import messageLogo from '../assets/messages.jpeg';
import bookmarkLogo from '../assets/bookmark.jpeg';
import logoutLogo from '../assets/logout.jpeg';
import nikeLogo from '../assets/nike2.png';
import nikeLogo2 from '../assets/nike.jpg';
import personLogo from '../assets/person.jpg';
import defaultPersonPhoto from '../assets/default_person_photo.png';

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

    if (facebookToken) {
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

  logOut = () => {
    store.dispatch([{
      type: ACTIONS.RESET_STATUS
    }, {
      type: ACTIONS.FACEBOOK_RESET_STATUS
    }]);
    return BackHandler.exitApp();
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

    const drawerView = (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
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

        {/* Edit Profile */}
        <View style={{ flex: 0.1, marginTop: hp('1%') }}>
          <TouchableWithoutFeedback underlayColor='blue' onPress={() => Actions.UserProfile()}>
            <Text style={{
              fontWeight: 'bold',
              color: 'violet',
              width: wp('25%'),
              marginLeft: wp('2%'),
              textAlign: 'center',
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
        <View style={{ flex: 5, justifyContent: 'space-around' }}>
          <TouchableHighlight onPress={() => Actions.UserHomePage()}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={homepageLogo} />
              <View>
                <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>My Homepage</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => console.log('editing profile')}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={promotionLogo} />
              <View>
                <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>Promotions</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => console.log('editing profile')}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={settingLogo} />
              <View>
                <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>Settings</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => console.log('editing profile')}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={notificationLogo} />
              <View>
                <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>Notifications</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => console.log('editing profile')}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={messageLogo} />
              <View>
                <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>Messages</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => console.log('editing profile')}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={bookmarkLogo} />
              <View>
                <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>Bookmarks</Text>
              </View>
            </View>
          </TouchableHighlight>

          <TouchableHighlight onPress={() => this.logOut()}>
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start' }}>
              <Image style={{ marginLeft: wp('2%'), height: 25, width: 25 }} source={logoutLogo} />
              <View>
                <Text style={{ marginLeft: wp('3%'), fontSize: hp('2.5%'), fontWeight: 'bold', color: 'violet' }}>Log Out</Text>
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
        <View style={{ flex: 1, height: '100%', backgroundColor: '#7d7d7d' }}>
          {/* Header */}
          <View style={{ paddingTop: hp('2%'), flex: 0.8, flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#323539' }}>
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
                  <View style={{ flex: 1 }}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <HomeFeedCard
                        productPhoto={nikeLogo}
                        title={'Nike Air Max'}
                        owner={'Patrick'}
                        ownerPhoto={personLogo}
                        views={2200000}
                        likes={1276444}
                        price={250000000}
                        onAddToCart={this.addToCart}
                        viewProductDetails={this.viewProductDetails}
                      />
                      <HomeFeedCard
                        productPhoto={nikeLogo2}
                        title={'Nike Air Max'}
                        owner={'Patrick'}
                        ownerPhoto={personLogo}
                        views={2200000}
                        likes={1276444}
                        price={250000000}
                        onAddToCart={this.addToCart}
                        viewProductDetails={this.viewProductDetails}
                      />
                      <HomeFeedCard
                        productPhoto={nikeLogo}
                        title={'Nike Air Max'}
                        owner={'Patrick'}
                        ownerPhoto={personLogo}
                        views={2200000}
                        likes={1276444}
                        price={250000000}
                        onAddToCart={this.addToCart}
                        viewProductDetails={this.viewProductDetails}
                      />
                      <HomeFeedCard
                        productPhoto={nikeLogo2}
                        title={'Nike Air Max'}
                        owner={'Patrick'}
                        ownerPhoto={personLogo}
                        views={2200000}
                        likes={1276444}
                        price={250000000}
                        onAddToCart={this.addToCart}
                        viewProductDetails={this.viewProductDetails}
                      />
                      <HomeFeedCard
                        productPhoto={nikeLogo}
                        title={'Nike Air Max'}
                        owner={'Patrick'}
                        ownerPhoto={personLogo}
                        views={2200000}
                        likes={1276444}
                        price={250000000}
                        onAddToCart={this.addToCart}
                        viewProductDetails={this.viewProductDetails}
                      />
                    </ScrollView>
                  </View>
            }
          </View>

          {/* Footer */}
          <Footer />
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
