import { ACTIONS } from './actionTypes';

const ResetStatus = () => async (dispatch) => {
  dispatch({
    type: ACTIONS.RESET_STATUS
  });
  dispatch({
    type: ACTIONS.FACEBOOK_RESET_STATUS
  });
}

export default ResetStatus;
