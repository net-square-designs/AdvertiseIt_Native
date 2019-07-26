// Packages
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Image,
  Alert,
  ScrollView,
  Linking,
  Platform
} from 'react-native';
import Config from "react-native-config";
import LinearGradient from 'react-native-linear-gradient';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import SafariView from 'react-native-safari-view';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Assets
import logo from '../assets/logo.png';
import eye from '../assets/eye.png';
import facebookLogo from '../assets/facebook.png';

//Actions
import { LoginAUser, SocialAuth, ResetStatus } from '../actions/index';

// Components
import { Loading } from '../components';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    emailError: '',
    passwordError: '',
    showLoading: false,
    passwordVisibility: true
  }

  static async getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.status === 'SUCCESS') {
      Actions.HomeFeed();
    } else if (nextProps.status === 'UNAUTHORIZED' || nextProps.status === 'ERROR' || nextProps.status === 'NOTFOUND') {
      Alert.alert(nextProps.error);
    }
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

    // Check if user already exists, if not sign him up, else log him in
    const { SocialAuth } = this.props;
    SocialAuth(this.state.user.emails[0].value, this.state.user.emails[0].value);
    this.setState({
      showLoading: true
    });
    setTimeout(() => {
      Actions.HomeFeed();
    }, 7000);
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

  handleEmail = (text) => {
    this.setState({
      email: text,
    });
  }

  handlePassword = (text) => {
    this.setState({
      password: text,
    });
  }

  handlePasswordVisibility = () => {
    const { passwordVisibility } = this.state;
    this.setState({
      passwordVisibility: !passwordVisibility,
    });
  }

  handleLogin = () => {
    const { email, password } = this.state;
    const { LoginAUser } = this.props;
    const userData = {
      email,
      password,
    }
    if (!email) {
      this.setState({
        emailError: 'Username or Email must be filled',
      });
    } else if (!password) {
      this.setState({
        passwordError: 'Password must be filled',
      });
    } else {
      LoginAUser(userData);
    }
  }

  render() {
    const { status, router } = this.props;
    const { emailError, passwordError, passwordVisibility, showLoading } = this.state;

    if (showLoading) {
      return <Loading />
    }

      return (
          <React.Fragment>
            <ScrollView showsVerticalScrollIndicator={false}>
              <LinearGradient colors={['rgb(136,78,162)', 'rgb(222,78,100)']} style={styles.linearGradient}>
                <Image style={styles.image} source={logo} />

                <View style={styles.break}></View>
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handleEmail(text)}
                  value={this.state.email}
                  placeholder='Username or Email'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      emailError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{emailError}</Text>

                <TextInput
                    style={{ fontSize: 18, color: 'white', width: wp('75%'), height: hp('8%'),
                    fontFamily: 'Arial', backgroundColor: '#323539', paddingLeft: wp('5%'), borderTopLeftRadius : 9, borderBottomLeftRadius : 9 }}
                    onChangeText={text => this.handlePassword(text)}
                    value={this.state.password}
                    placeholder='Password'
                    placeholderTextColor='#ffffff'
                    secureTextEntry={passwordVisibility}
                    onChange={() => {
                      this.setState({
                        passwordError: ''
                      });
                    }}
                    />
                  <View style={{ height: hp('8%'), width: wp('10%'), marginTop: hp('-8%'), marginLeft: wp('74%'), backgroundColor: '#323539', borderTopRightRadius : 9, borderBottomRightRadius : 9, zIndex: 1 }}>
                    <TouchableWithoutFeedback onPress={this.handlePasswordVisibility} underlayColor='#323539'>
                      <Text style={{
                        height: hp('10%'),
                        width: wp('60%'),
                        position: 'relative',
                        top: hp('2%')}}>
                          <Image  style={{width: wp('8%'), height: hp('2%')}}source={eye} />
                        </Text>
                    </TouchableWithoutFeedback>
                  </View>
                <Text style={{color: '#ffffff'}}>{passwordError}</Text>

                <TouchableHighlight style={styles.login} onPress={this.handleLogin} underlayColor='#4d4f60'>
                  {status === 'START_LOADING' ? <View style={{paddingTop: 10, paddingRight: '20%'}}><ActivityIndicator animating={true} size="large" color="#00ffff" /></View> : <Text style={styles.loginButtonText}>Login</Text>}
                </TouchableHighlight>

                <View style={styles.break}></View>
                <Text style={styles.text}>Forgot Password? <Text style={{fontWeight: 'bold'}}>Get Help Signing In</Text></Text>

                <Text style={styles.text}>New to AdvertiseIt? <Text
                  onPress={() => Actions.SignUserUp()}
                  style={{fontWeight: 'bold'}}
                  >
                    Sign Up
                  </Text>
                </Text>
                
                <View style={styles.break}></View>
                <TouchableHighlight style={styles.facebook} onPress={this.handleFacebook} underlayColor='#ffffda'>
                  <View style={styles.facebookButton}>
                    <Image
                      style={{ height: hp('6%'), width: wp('10%'), marginRight: wp('2%')}}
                      source={facebookLogo}
                    />
                    <Text style={styles.facebookButtonText}>Login with Facebook</Text>
                  </View>
                </TouchableHighlight>
              </LinearGradient>
            </ScrollView>
          </React.Fragment>
      );
  }
}

const styles = StyleSheet.create({
  text: {
    color: 'white',
    fontSize: 18,
    fontFamily: 'Arial',
  },
  facebook: {
    backgroundColor: 'white',
    height: hp('8%'),
    paddingLeft: wp('10%'),
    borderRadius: 9,
  },
  login: {
    backgroundColor: '#4d4f50',
    height: hp('8%'),
    paddingLeft: wp('8%'),
    borderRadius: 9,
  },
  loginButtonText: {
    color: '#ffffff',
    position: 'relative',
    top: hp('1.5%'),
    left: wp('26%'),
    fontSize: 18,
    fontFamily: 'Arial',
  },
  facebookButton: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: wp('2%')
  },
  facebookButtonText: {
    color: '#2d72ff',
    fontSize: 18,
    fontFamily: 'Arial',
    marginTop: hp('1%')
  },
  input: {
    backgroundColor: '#323539',
    height: hp('8%'),
    paddingLeft: wp('5%'),
    borderColor: 'blue',
    borderRadius: 9,
    color: 'white',
    fontSize: 18,
    fontFamily: 'Arial',
  },
  passwordImage: {
    height: hp('3%'),
    width: hp('6%'),
    marginTop: hp('-4%'),
    marginLeft: wp('60%'),
  },
  passwordInput: {
    backgroundColor: '#323539',
    height: hp('8%'),
    paddingLeft: wp('5%'),
    borderColor: 'blue',
    borderRadius: 9,
    color: 'white',
  },
  image: {
    marginLeft: wp('7%'),
  },
  linearGradient: {
    paddingLeft: wp('8%'),
    paddingRight: wp('8%'),
    fontFamily: 'Arial',
    paddingTop: hp('18%'),
    paddingBottom: hp('10%'),
    height: hp('100%')
  },
  break: {
    marginTop: '7%'
  }
});

Login.propTypes = {
  status: PropTypes.string,
  error: PropTypes.string,
  token: PropTypes.string,
  facebookStatus: PropTypes.string,
  facebookError: PropTypes.string,
  facebookToken: PropTypes.string
}

const mapStateToProps = state => ({
  status: state.logIn.status,
  error: state.logIn.error,
  token: state.logIn.token,
  facebookStatus: state.facebook.facebookStatus,
  facebookError: state.facebook.facebookError,
  facebookToken: state.facebook.facebookToken
});

export default connect(mapStateToProps, { LoginAUser, SocialAuth, ResetStatus })(Login);
