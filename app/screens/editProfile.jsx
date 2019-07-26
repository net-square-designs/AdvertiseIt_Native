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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import jwtDecode from 'jwt-decode';
import ImagePicker from 'react-native-image-crop-picker';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// Assets
import backLogo from '../assets/goback.png';

// Actions
import { EditUserProfile, CloudinaryImageUpload } from '../actions/index';

// Components
import { Loading } from '../components';

class EditProfile extends React.Component {
  state = {
    firstName: '',
    lastName: '',
    location: '',
    phone: '',
    storeName: '',
    bankAccountName: '',
    accountNumber: '',
    bankName: '',
    website: '',
    bio: '',
    firstNameError: '',
    lastNameError: '',
    imageError: '',
    locationError: '',
    bioError: '',
    phoneError: '',
    storeNameError: '',
    bankAccountNameError: '',
    accountNumberError: '',
    bankNameError: '',
    imageUploadSource: 'https://cdn150.picsart.com/upscale-245339439045212.png?r1024x1024',
    showLoading: false,
  }

  static getDerivedStateFromProps(props, state) {
    if ((props.userProfile) ? props.userProfile.hasOwnProperty('firstName') && (props.userProfile.firstName !== state.firstName) : '') {
      return {
        ...state,
        firstName: props.userProfile.firstName,
        imageUploadSource: props.userProfile.image,
        lastName: props.userProfile.lastName,
        location: props.userProfile.location,
        phone: props.userProfile.phone,
        storeName: props.userProfile.storeName,
        bankAccountName: props.userProfile.bank.accountName,
        accountNumber: props.userProfile.bank.accountNumber,
        bankName: props.userProfile.bank.name,
        website: props.userProfile.website,
        bio: props.userProfile.bio,
      };
    }
    if (props.editedProfile && props.editedProfile.status === 'SUCCESS') {
      Alert.alert('Hooray! Your profile has been updated successfully');
      Actions.HomeFeed();
    }
    return null;
  }

  handleCloudinaryImageUpload = (image) => {
    const { CloudinaryImageUpload } = this.props;
    const form = new FormData();

    form.append('upload_preset', 'kls6oowk');
    form.append('file', {uri: image.path, type: 'image/*', name: 'uploadimage.png'});

    CloudinaryImageUpload(form);
  }

  handleUploadImage = () => {
    this.setState({
      imageError: ''
    });
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      includeBase64: true
    }).then(image => {
      this.setState({
        imageUploadSource: image.path
      });
      this.handleCloudinaryImageUpload(image);
    }).catch((error) => {
      console.log('User cancelled image upload')
    });
  }

  handleFirstName = (text) => {
    this.setState({
      firstName: text,
    });
  }

  handleLastName = (text) => {
    this.setState({
      lastName: text,
    });
  }

  handleLocation = (text) => {
    this.setState({
      location: text,
    });
  }

  handlePhone = (text) => {
    this.setState({
      phone: text,
    });
  }

  handleStoreName = (text) => {
    this.setState({
      storeName: text,
    });
  }

  handleBankAccountName = (text) => {
    this.setState({
      bankAccountName: text,
    });
  }

  handleAccountNumber = (text) => {
    this.setState({
      accountNumber: text,
    });
  }

  handleBankName = (text) => {
    this.setState({
      bankName: text,
    });
  }

  handleWebsite = (text) => {
    this.setState({
      website: text,
    });
  }

  handleBio = (text) => {
    this.setState({
      bio: text,
    });
  }

  handleEditProfile = () => {
    const {
      firstName,
      lastName,
      location,
      phone,
      storeName,
      bankAccountName,
      accountNumber,
      bankName,
      website,
      bio
    } = this.state;
    const { EditUserProfile } = this.props;
    
    if (!firstName) {
      this.setState({
        firstNameError: 'First Name must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: 0, animated: true });
    } else if (!lastName) {
      this.setState({
        lastNameError: 'Last Name must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: 0, animated: true });
    } else if (!location) {
      this.setState({
        locationError: 'Location must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('15%'), animated: true });
    } else if (!phone) {
      this.setState({
        phoneError: 'Phone must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('15%'), animated: true });
    } else if (!(/^[+]{1}[0-9]{9,}$/.test(phone))) {
      this.setState({
        phoneError: 'Phone number not valid, phone number should follow format +xxxxxxxxxxxxx and contain at least 9 digits',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('19%'), animated: true });
    } else if (!storeName) {
      this.setState({
        storeNameError: 'Store Name must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('30%'), animated: true });
    } else if (!bankAccountName) {
      this.setState({
        bankAccountNameError: 'Bank Account Name must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('85%'), animated: true });
    } else if (!accountNumber) {
      this.setState({
        accountNumberError: 'Account Number must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('85%'), animated: true });
    } else if (!Number(accountNumber)) {
      this.setState({
        accountNumberError: 'Account Number must be numbers',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('85%'), animated: true });
    } else if (!bankName) {
      this.setState({
        bankNameError: 'Bank Name must be filled',
      });
      this.refs['SCROLL_REF'].scrollTo({ x: 0, y: hp('85%'), animated: true });
    } else if (!bio) {
      this.setState({
        bioError: 'Bio must be filled',
      });
    } else {
      const { cloudinary, facebookToken, signupToken, loginToken, userProfile } = this.props;
      const image = cloudinary && cloudinary.imgurl ? cloudinary.imgurl : userProfile && userProfile.image ? userProfile.image : '';
      if (!image) {
        this.setState({
          imageError: 'Please upload an image'
        });
        this.refs['SCROLL_REF'].scrollTo({ x: 0, y: 0, animated: true });
      } else {
        const bank = {
          name: bankName,
          accountNumber,
          accountName: bankAccountName,
        };
        const userData = {
          firstName,
          lastName,
          image,
          location,
          phone,
          website,
          storeName,
          bank,
          bio
        };
  
        let username;
        let token;
        
        if (facebookToken){
          username = jwtDecode(facebookToken).username;
          token = facebookToken
        } else if (signupToken) {
          username = jwtDecode(signupToken).username;
          token = signupToken;
        } else if (loginToken) {
          username = jwtDecode(loginToken).username;
          token = loginToken;
        }
        EditUserProfile(userData, username, token);
        this.setState({
          showLoading: true
        });
      }
    }
  }

  render() {
    const { status, editedProfile } = this.props;
    const { showLoading } = this.state;
    const {
      firstNameError,
      lastNameError,
      bioError,
      imageError,
      locationError,
      storeNameError,
      phoneError,
      bankAccountNameError,
      accountNumberError,
      bankNameError,
      imageUploadSource
    } = this.state;

    if (showLoading) {
      return <Loading />
    }

      return (
          <React.Fragment> 
            <ScrollView showsVerticalScrollIndicator={false} ref={'SCROLL_REF'}>
              <LinearGradient colors={['rgb(136,78,162)', 'rgb(222,78,100)']} style={styles.linearGradient}>
                {/* Back icon */}
                <TouchableWithoutFeedback onPress={() => Actions.pop()} underlayColor='#323539'>
                  <Image source={backLogo} />
                </TouchableWithoutFeedback>
                <View style={styles.break}></View>

                {/* Edit Profile text */}
                <Text style={{ textAlign: 'center', fontSize: hp('4%'), color: 'white', fontWeight: 'bold'}}>Edit Profile</Text>

                <View style={styles.break}></View>

                {/* Image upload */}
                <TouchableWithoutFeedback onPress={() => this.handleUploadImage()} underlayColor='#323539'>
                    <Image source={{ uri: imageUploadSource }}
                      style={{ marginLeft: wp('23%'), width: 130, height: 130, borderRadius: 100 }} />
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => this.handleUploadImage()} underlayColor='#323539'>
                  <Text style={{ position: 'relative', top: hp('-12%'), left: wp('27%'), color: '#323539', fontWeight: 'bold' }}>UPLOAD IMAGE</Text>
                </TouchableWithoutFeedback>
                <Text style={{color: '#ffffff', textAlign: 'center'}}>{imageError}</Text>

                {/* First Name */}
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handleFirstName(text)}
                  value={this.state.firstName}
                  placeholder='First Name'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      firstNameError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{firstNameError}</Text>
                {/* Last Name */}
                <View style={styles.break}></View>
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handleLastName(text)}
                  value={this.state.lastName}
                  placeholder='Last Name'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      lastNameError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{lastNameError}</Text>

                <View style={styles.break}></View>
                {/* Location */}
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handleLocation(text)}
                  value={this.state.location}
                  placeholder='Location'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      locationError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{locationError}</Text>

                <View style={styles.break}></View>
                {/* Phone */}
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handlePhone(text)}
                  value={this.state.phone}
                  placeholder='Phone'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      phoneError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{phoneError}</Text>

                <View style={styles.break}></View>
                {/* Store name */}
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handleStoreName(text)}
                  value={this.state.storeName}
                  placeholder='Store Name'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      storeNameError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{storeNameError}</Text>

                <View style={styles.break}></View>
                {/* Website */}
                <TextInput
                  style={styles.input}
                  onChangeText={text => this.handleWebsite(text)}
                  value={this.state.website}
                  placeholder='Website'
                  placeholderTextColor='#ffffff'
                />

                <View style={styles.break}></View>
                <View style={{ borderRadius: 4, backgroundColor: 'gray', padding: hp('4%')}}>
                {/* Bank */}
                  <TextInput
                    style={styles.input}
                    onChangeText={text => this.handleBankName(text)}
                    value={this.state.bankName}
                    placeholder='Bank Name'
                    placeholderTextColor='#ffffff'
                    onChange={() => {
                      this.setState({
                        bankNameError: ''
                      });
                    }}
                  />
                  <Text style={{color: '#ffffff'}}>{bankNameError}</Text>

                  <TextInput
                    style={styles.input}
                    onChangeText={text => this.handleAccountNumber(text)}
                    value={this.state.accountNumber}
                    placeholder='Bank Account Number'
                    placeholderTextColor='#ffffff'
                    onChange={() => {
                      this.setState({
                        accountNumberError: ''
                      });
                    }}
                  />
                  <Text style={{color: '#ffffff'}}>{accountNumberError}</Text>

                  <TextInput
                    style={styles.input}
                    onChangeText={text => this.handleBankAccountName(text)}
                    value={this.state.bankAccountName}
                    placeholder='Bank Account Name'
                    placeholderTextColor='#ffffff'
                    onChange={() => {
                      this.setState({
                        bankAccountNameError: ''
                      });
                    }}
                  />
                  <Text style={{color: '#ffffff'}}>{bankAccountNameError}</Text>

                </View>

                <View style={styles.break}></View>
                {/* Bio */}
                <TextInput
                  style={styles.textarea}
                  onChangeText={text => this.handleBio(text)}
                  value={this.state.bio}
                  multiline = {true}
                  placeholder='Bio'
                  placeholderTextColor='#ffffff'
                  onChange={() => {
                    this.setState({
                      bioError: ''
                    });
                  }}
                />
                <Text style={{color: '#ffffff'}}>{bioError}</Text>
                
                {/* Edit profile submit button */}
                <TouchableHighlight style={styles.editProfile} onPress={this.handleEditProfile} underlayColor='#4d4f60'>
                  {status === 'START_LOADING' ? <View style={{ paddingTop: hp('20%'), paddingRight: wp('20%') }}><ActivityIndicator animating={true} size="large" color="#00ffff" /></View> : <Text style={styles.editProfileButtonText}>Edit Profile</Text>}
                </TouchableHighlight>

              </LinearGradient>
            </ScrollView>
          </React.Fragment>
      );
  }
}

const styles = StyleSheet.create({
  editProfile: {
    backgroundColor: '#4d4f50',
    height: hp('8%'),
    paddingLeft: wp('8%'),
    borderRadius: 9,
  },
  editProfileButtonText: {
    color: '#ffffff',
    position: 'relative',
    top: hp('1.5%'),
    left: wp('24%'),
    fontSize: 18,
    fontFamily: 'Arial',
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
  linearGradient: {
    paddingLeft: wp('8%'),
    paddingRight: wp('8%'),
    fontFamily: 'Arial',
    paddingTop: hp('5%'),
    paddingBottom: hp('20%')
  },
  break: {
    marginTop: '7%'
  }
});

EditProfile.propTypes = {
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
  facebookToken: state.facebook.facebookToken,
  cloudinary: state.cloudinary,
  editedProfile: state.editedUserProfile,
  userProfile: state.userProfile.user
});

export default connect(mapStateToProps, { EditUserProfile, CloudinaryImageUpload })(EditProfile);
