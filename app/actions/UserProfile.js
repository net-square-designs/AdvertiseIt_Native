import Axios from 'axios';
import Config from "react-native-config";
import { ACTIONS } from './actionTypes';

const UserProfile = (username) => async (dispatch) => {
 try {
    dispatch({
      type: ACTIONS.START_LOADING
    });
    const response = await Axios.get(`${Config.BASE_URL_PROD}/api/v1/profile/${username}`);

    if (response.status === 200 || response.status === 206) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_PROFILE_SUCCESS,
        payload: response.data.data.user
      });
    }
  } catch(error) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
          type: ACTIONS.USER_PROFILE_ERROR,
          payload: 'An error occured while retrieving your profile, please try again',
      });
      dispatch({
        type: ACTIONS.RESET_STATUS
      });
    }
}

export default UserProfile;
