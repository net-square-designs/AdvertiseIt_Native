import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Image
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// import logo from '../../assets/images/logo.png';
import { LoginAUser } from '../actions/index';

class Login extends React.Component {
  // state = {
  //     email: '',
  //     password: ''
  // }

  // handleFormChange = (e) => {
  //   this.setState({
  //       [e.target.name]: e.target.value,
  //   })
  // }

  // handleLogin = () => {
  //   const { email, password } = this.state;
  //   const userData = {
  //       email,
  //       password,
  //   }
  //   this.props.LoginAUser(userData);
  // }

  render() {
    // const { status, error, token } = this.props;
    //   if (status === 'FAILED' || status === 'ERROR') {
    //     <ActivityIndicator size="large" color="#0000ff" />
    //   }
      return (
          <React.Fragment>
              {/* { status === 'SUCCESS' && window.localStorage.setItem('token', token)}
              { status === 'SUCCESS' && <Redirect to='/homefeed' /> } */}

              <View style={styles.container}>
                <Image source={{uri: '../assets/logo.png'}} />
                <Text>Username or Email</Text>
                <TextInput />
                <Text>Password</Text>
                <TextInput />
              </View>

          </React.Fragment>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

// Login.propTypes = {
//   status: PropTypes.string,
//   error: PropTypes.string,
//   token: PropTypes.string,
// }

// const mapStateToProps = state => ({
//   status: state.login.status,
//   error: state.login.error,
//   token: state.login.token,
// });

// export default connect(mapStateToProps, { LoginAUser })(Login);
export default Login;
