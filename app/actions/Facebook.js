import Axios from 'axios';
import Config from "react-native-config";
import { ACTIONS } from './actionTypes';

const SocialAuth = (email, username) => async (dispatch) => {
 try {
    dispatch({
      type: ACTIONS.FACEBOOK_START_LOADING
    });
    const response = await Axios.post(`${Config.BASE_URL_PROD}/api/v1/auth/social`, {
      email,
      username
    });

    if (response.status === 201 || response.status === 200) {
      dispatch({
        type: ACTIONS.FACEBOOK_STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_SOCIAL_AUTH_SUCCESS,
        payload: response.data.data.token
      });
    }
  } catch(error) {
      dispatch({
        type: ACTIONS.FACEBOOK_STOP_LOADING
      });
      dispatch({
          type: ACTIONS.USER_SOCIAL_AUTH_ERROR,
          payload: 'An error occured while authenticating you, please try again',
      });
      dispatch({
        type: ACTIONS.FACEBOOK_RESET_STATUS
      });
  }
}

export default SocialAuth;
