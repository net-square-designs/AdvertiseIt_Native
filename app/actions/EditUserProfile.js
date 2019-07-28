import Axios from 'axios';
import Config from "react-native-config";
import { ACTIONS } from './actionTypes';

const EditUserProfile = (userDetails, username, token) => async (dispatch) => {
 try {
    dispatch({
      type: ACTIONS.START_LOADING
    });
    Axios.defaults.headers.common['authorization'] = token;
    const response = await Axios.post(`${Config.BASE_URL_PROD}/api/v1/profile/${username}`, userDetails);

    if (response.status === 201 || response.status === 200) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.EDIT_USER_PROFILE_SUCCESS,
        payload: response.data.data.profile
      });
    }
  } catch(error) {
    console.log('error', error)
    console.log('error response', error.response)
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
          type: ACTIONS.EDIT_USER_PROFILE_ERROR,
          payload: 'An error occured while editing your profile, please try again',
      });
      dispatch({
        type: ACTIONS.RESET_STATUS
      });
    }
}

export default EditUserProfile;
