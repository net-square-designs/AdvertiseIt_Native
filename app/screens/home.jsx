// Packages
import React, { createRef } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Switch,
  TouchableWithoutFeedback,
  StyleSheet,
  Linking,
} from 'react-native';
import Config from "react-native-config";
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import jwtDecode from 'jwt-decode';
import SafariView from 'react-native-safari-view';
import DrawerLayout from 'react-native-drawer-layout-polyfill';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

//Actions
import { SocialAuth, SwitchRoleToCustomerMerchant } from '../actions/index';



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
      facebookToken, signupToken, loginToken, switchRoleCustomerMerchantMessage
    } = this.props;

    const drawerView = (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <View style={{ position: 'absolute', bottom: 0 }}>
        <LinearGradient colors={['rgb(136,78,162)', 'rgb(222,78,100)']} style={styles.linearGradient}>
            <Text style={{ color: 'white', fontSize: hp('3rem'), fontWeight: 'bold', fontFamily: 'Arial', }}>{
              (facebookToken) ? ( jwtDecode(facebookToken).role === 'influencer' ? this.state.roleText1 : 'Switch to Influencer or Promoter mode' ) :
              (signupToken) ? ( jwtDecode(signupToken).role === 'customer-merchant' ? 'Switch to Influencer or Promoter mode' : this.state.roleText1 ) :
              (loginToken) ? ( jwtDecode(loginToken).role === 'customer-merchant' ? 'Switch to Influencer or Promoter mode' : this.state.roleText1 ) :
              'Switch to Influencer or Promoter mode'
            }</Text>
          <Switch
            onValueChange={(data) => this.handleSwitchRole(data)}
            value={
              facebookToken ? (jwtDecode(facebookToken).role === 'influencer' ? this.state.trueStatus : this.state.falseStatus) :
              signupToken ? (jwtDecode(signupToken).role ==='customer-merchant' ? this.state.falseStatus : this.state.trueStatus) :
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
        <View style={{ flex: 1, height: '100%', backgroundColor: 'plum'}}>
        <TouchableWithoutFeedback onPress={() => this.openSideDrawer()}><Text style={{
          color: 'blue',
          marginLeft: wp('2%'),
          fontSize: 30
          }}>&#9776;</Text></TouchableWithoutFeedback>
        
          {loginStatus === 'START_LOADING' ? <ActivityIndicator size={200} animating={true} color={'white'} /> :
          facebookStatus === 'FACEBOOK_START_LOADING' ? <ActivityIndicator size={200} animating={true} color={'white'} /> :
          signUpStatus === 'START_LOADING' ? <ActivityIndicator size={200} animating={true} color={'white'} /> :
            <View>
              <Text style={{ color: 'white', fontSize: 50 }}>{facebookToken && `Hello Welcome to the home feed ${jwtDecode(facebookToken).username} Work in progress ...`}</Text>
              <Text style={{ color: 'white', fontSize: 50 }}>{signupToken && `Hello Welcome to the home feed ${jwtDecode(signupToken).username} Work in progress ...`}</Text>
              <Text style={{ color: 'white', fontSize: 50 }}>{loginToken && `Hello Welcome to the home feed ${jwtDecode(loginToken).username} Work in progress ...`}</Text>
            </View>
          }
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
  switchRoleCustomerMerchantStatus: state.switchRoleCustomerMerchant.status
});

export default connect(mapStateToProps, { SocialAuth, SwitchRoleToCustomerMerchant })(Home);
