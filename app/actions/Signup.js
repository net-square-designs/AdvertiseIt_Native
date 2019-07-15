import Axios from 'axios';
import Config from "react-native-config";
import { ACTIONS } from './actionTypes';

const SignupAUser = (userDetails) => async (dispatch) => {
 try {
    dispatch({
      type: ACTIONS.START_LOADING
    });
    const response = await Axios.post(`${Config.BASE_URL_PROD}/api/v1/auth/signup`, userDetails);

    if (response.status === 201) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_SIGNUP_SUCCESS,
        payload: response.data.data.token
      });
    }
  } catch(error) {
    if (error.response.status === 409) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_SIGNUP_CONFLICT,
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
          type: ACTIONS.USER_SIGNUP_ERROR,
          payload: 'An error occured while signing you up, please try again',
      });
      dispatch({
        type: ACTIONS.RESET_STATUS
      });
    }
  }
}

export default SignupAUser;
