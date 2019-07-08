import Axios from 'axios';
import Config from "react-native-config";
import { ACTIONS } from './actionTypes';

const LoginAUser = (userDetails) => async (dispatch) => {
  const email = !(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userDetails.email)) ? '' : userDetails.email;
  const username = !(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userDetails.email)) ? userDetails.email : '';
  try {
    dispatch({
      type: ACTIONS.START_LOADING
    });
    const response = await Axios.post(`${Config.BASE_URL_PROD}/api/v1/auth/login`, {
      email,
      username,
      password: userDetails.password,
    });
  
    if (response.status === 200) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_LOGIN_SUCCESS,
        payload: response.data.data.token
      });
    }
  } catch (error) {
    if (error.response.status === 401) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_LOGIN_UNAUTHORIZED,
        payload: error.response.data.data.message
      });
      dispatch({
        type: ACTIONS.RESET_STATUS
      });
    } else if (error.response.status === 404) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_LOGIN_NOTFOUND,
        payload: error.response.data.data.error
      });
      dispatch({
        type: ACTIONS.RESET_STATUS
      });
    } else {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
          type: ACTIONS.USER_LOGIN_ERROR,
          payload: 'An error occured while logging you in, please try again',
      });
      dispatch({
        type: ACTIONS.RESET_STATUS
      });
    }
  }
}

export default LoginAUser;
