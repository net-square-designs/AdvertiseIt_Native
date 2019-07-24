import Axios from 'axios';
import Config from "react-native-config";
import { ACTIONS } from './actionTypes';

const SwitchRoleToCustomerMerchant = (username, role, token) => async (dispatch) => {
 try {
    dispatch({
      type: ACTIONS.START_LOADING
    });
    Axios.defaults.headers.common['authorization'] = token;
    const response = await Axios.put(`${Config.BASE_URL_PROD}/api/v1/roles/${username}`, {
      role
    });

    if (response.status === 200) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
        type: ACTIONS.USER_SWITCH_ROLE_SUCCESS,
        payload: response.data.data.message
      });
    }
  } catch(error) {
      dispatch({
        type: ACTIONS.STOP_LOADING
      });
      dispatch({
          type: ACTIONS.USER_SWITCH_ROLE_ERROR,
          payload: 'An error occured while switching your role, please try again',
      });
      dispatch({
        type: ACTIONS.RESET_STATUS
      });
  }
}

export default SwitchRoleToCustomerMerchant;
