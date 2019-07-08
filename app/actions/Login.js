import Axios from 'axios';
import { ACTIONS } from './actionTypes';

const LoginAUser = (userDetails) => async (dispatch) => {
try {
  const user = Axios.post(`${process.env.BASE_URL_PROD}/api/v1/auth/login`, {
    email: userDetails.email && userDetails.email,
    username: userDetails.username && userDetails.username,
    password: userDetails.password,
  });
  console.log(user);
  dispatch({
    type: ACTIONS.USER_LOGIN_SUCCESS,
    payload: response.data.data.token
  });
} catch (error) {
  console.log(error);
    dispatch({
        type: ACTIONS.USER_LOGIN_ERROR,
        payload: 'An error occured while logging you in, please try again',
    });
}

    // .then((response) => {
    //         if (response.data.status === 'fail') {
    //             dispatch({
    //                 type: USER_SIGNIN_FAILED,
    //                 payload: 'Email or password incorrect'
    //             });
    //         }
    //         else if (response.data.status === 'success') {
    //             window.localStorage.setItem('token', response.data.data.token);
    //             window.localStorage.setItem('id', response.data.data.userDetails.id);
    //             window.localStorage.setItem('name', response.data.data.userDetails.name);
    //             window.localStorage.setItem('role', response.data.data.userDetails.role);
    //             window.localStorage.setItem('email', response.data.data.userDetails.email);
    //             dispatch({
    //                 type: USER_SIGNIN_SUCCESS,
    //                 payload: response.data.data.userDetails
    //             });
    //         }
    //     }).catch((error) => {
    //         console.log(error);
    //         dispatch({
    //             type: USER_SIGNIN_ERROR,
    //             payload: 'An error occured while signing you in, please try again',
    //         });
    //     })
}

export default LoginAUser;
