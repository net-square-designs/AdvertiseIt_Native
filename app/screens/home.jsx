// Packages
import React from 'react';
import {
  View,
  Text,
  ActivityIndicator
} from 'react-native';
import { connect } from 'react-redux';
import jwtDecode from 'jwt-decode';

class Home extends React.Component {

  render() {
    const { facebookStatus, signUpstatus, loginStatus,
      facebookToken, signupToken, loginToken
    } = this.props;
    return (
      <View style={{ flex: 1, height: '100%', backgroundColor: 'plum'}}>
        {/* <Text>{facebookStatus && facebookStatus === 'FACEBOOK_START_LOADING' && <ActivityIndicator size={400} animating={true} color={'white'} /> }</Text>
        <Text>{signUpstatus && signUpstatus === 'START_LOADING' && <ActivityIndicator size={500} animating={true} color={'white'} /> }</Text> */}
        {loginStatus === 'START_LOADING' ? <ActivityIndicator size={200} animating={true} color={'white'} /> :
          <View>
            <Text style={{ color: 'white', fontSize: 50 }}>{facebookToken && `Hello Welcome to the home feed ${jwtDecode(facebookToken).username} Work in progress ...`}</Text>
            <Text style={{ color: 'white', fontSize: 50 }}>{signupToken && `Hello Welcome to the home feed ${jwtDecode(signupToken).username} Work in progress ...`}</Text>
            <Text style={{ color: 'white', fontSize: 50 }}>{loginToken && `Hello Welcome to the home feed ${jwtDecode(loginToken).username} Work in progress ...`}</Text>
            <ActivityIndicator size={200} animating={true} color={'white'} />
          </View>
        }
      </View>
    );
  }
};

const mapStateToProps = state => ({
  loginStatus: state.logIn.status,
  loginToken: state.logIn.token,
  signUpstatus: state.signUp.status,
  signupToken: state.signUp.token,
  facebookToken: state.facebook.facebookToken,
  facebookStatus: state.facebook.facebookStatus
});

export default connect(mapStateToProps, null)(Home);
