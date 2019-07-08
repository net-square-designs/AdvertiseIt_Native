// Packages
import React, { createRef } from 'react';
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
import RadioForm from 'react-native-simple-radio-button';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import SafariView from 'react-native-safari-view';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Assets
import logo from '../assets/logo.png';
import eye from '../assets/eye.png';
import facebookLogo from '../assets/facebook.png';

//Actions
import { SignupAUser, SocialAuth } from '../actions/index';

class Signup extends React.Component {
  state = {
    email: '',
    password: '',
    username: '',
    emailError: '',
    passwordError: '',
    usernameError: '',
    productsError: '',
    role: 'customer-merchant',
    passwordVisibility: true,
    user: null,
    userVefiied: false,
    homePage: false
  }

  productsRef = createRef();

  static async getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.status === 'SUCCESS') {
      Actions.HomeFeed();
    } else if (nextProps.status === 'CONFLICT' || nextProps.status === 'ERROR') {
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
    Actions.HomeFeed();
  };

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

  handleUsername = (text) => {
    this.setState({
      username: text,
    });
  }

  handlePasswordVisibility = () => {
    const { passwordVisibility } = this.state;
    this.setState({
      passwordVisibility: !passwordVisibility,
    });
  }

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

  handleSignUp = () => {
    const { email, password, username, role } = this.state;
    const { SignupAUser } = this.props;
    
    if (!email) {
      this.setState({
        emailError: 'Email must be filled',
      });
    } else if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))) {
      this.setState({
        emailError: 'Invalid email',
      });
    } else if (!password) {
      this.setState({
        passwordError: 'Password must be filled',
      });
    } else if (!username) {
      this.setState({
        usernameError: 'Username must be filled',
      });
    } else if (!this.productsRef.current._lastNativeText) {
      this.setState({
        productsError: 'Products of interest to buy or sell or promote/influence must be filled',
      });
    } else {
      const productsofinterest = this.productsRef.current._lastNativeText.includes(',') ? this.productsRef.current._lastNativeText.trim().split(','):
      this.productsRef.current._lastNativeText;
      const userData = {
        email,
        password,
        username,
        role,
        productsofinterest
      };
      if (role === 'influencer') {
        Alert.alert('Plese sign up with Facebook as an Influencer/Promoter');
      } else {
        SignupAUser(userData);
      }
    }
  }

  render() {
    const { status } = this.props;
    const { emailError, passwordError, usernameError, productsError, passwordVisibility, user } = this.state;
    const radioProps = [
      {label: 'Customer/Merchant', value: 'customer-merchant' },
      {label: 'Influencer/Promoter', value: 'influencer' }
    ];

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
                  placeholder='Email'
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
            
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handleUsername(text)}
                  value={this.state.username}
                  placeholder='Username'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      usernameError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{usernameError}</Text>

                <TextInput
                  style={styles.textarea}
                  ref={this.productsRef}
                  multiline = {true}
                  placeholder='Products of Interest to buy, sell or promote/influence, please seperate with commas'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      productsError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{productsError}</Text>
                
                <RadioForm
                  radio_props={radioProps}
                  initial={0}
                  labelColor={'#ffffff'}
                  animation={true}
                  onPress={value => {
                    this.setState({
                      role:value
                    });
                  }}
                />

                <TouchableHighlight style={styles.signup} onPress={this.handleSignUp} underlayColor='#4d4f60'>
                  {status === 'START_LOADING' ? <View style={{ paddingTop: 10, paddingRight: '20%' }}><ActivityIndicator animating={true} size="large" color="#00ffff" /></View> : <Text style={styles.signupButtonText}>Sign Up</Text>}
                </TouchableHighlight>

                <View style={styles.break}></View>
                <Text style={styles.text}>Already have an account? <Text
                  onPress={() => Actions.LogUserIn()}
                  style={{ fontWeight: 'bold' }}
                  >
                    Login
                  </Text>
                </Text>

                <View style={styles.break}></View>
                <TouchableHighlight style={styles.facebook} onPress={this.handleFacebook} underlayColor='#ffffda'>
                  <View style={styles.facebookButton}>
                    <Image
                      style={{ height: hp('6%'), width: wp('10%'), marginRight: wp('2%')}}
                      source={facebookLogo}
                    />
                    <Text style={styles.facebookButtonText}>Sign Up with Facebook</Text>
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
  signup: {
    backgroundColor: '#4d4f50',
    height: hp('8%'),
    paddingLeft: wp('8%'),
    borderRadius: 9,
  },
  signupButtonText: {
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
  textarea: {
    backgroundColor: '#323539',
    height: hp('20%'),
    paddingLeft: wp('5%'),
    borderColor: 'blue',
    borderRadius: 9,
    color: 'white',
    fontSize: 18
  },
  image: {
    marginLeft: wp('7%'),
  },
  passwordImage: {
    height: hp('3%'),
    width: hp('6%'),
    // marginTop: hp('-8%'),
    // // marginLeft: wp('60%'),
    // zIndex: 2,
    // backgroundColor: '#323539'
  },
  linearGradient: {
    paddingLeft: wp('8%'),
    paddingRight: wp('8%'),
    fontFamily: 'Arial',
    paddingTop: hp('5%'),
    paddingBottom: hp('20%'),
    height: hp('115vh')
  },
  break: {
    marginTop: '7%'
  }
});

Signup.propTypes = {
  status: PropTypes.string,
  error: PropTypes.string,
  token: PropTypes.string,
  facebookStatus: PropTypes.string,
  facebookError: PropTypes.string,
  facebookToken: PropTypes.string
}

const mapStateToProps = state => ({
  status: state.signUp.status,
  error: state.signUp.error,
  token: state.signUp.token,
  facebookStatus: state.facebook.facebookStatus,
  facebookError: state.facebook.facebookError,
  facebookToken: state.facebook.facebookToken
});

export default connect(mapStateToProps, { SignupAUser, SocialAuth })(Signup);
