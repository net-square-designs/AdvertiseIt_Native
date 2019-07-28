import { ACTIONS } from '../actions/actionTypes';

const initialState = {
	profile: '',
	status: '',
	error: ''
};
export default (state = initialState, action) => {
	switch (action.type) {
    case ACTIONS.START_LOADING:
			return (state = Object.assign({
				status: 'START_LOADING'
      }));

    case ACTIONS.STOP_LOADING:
      return (state = Object.assign({
        status: 'STOP_LOADING'
      }));

    case ACTIONS.RESET_STATUS:
      return (state = Object.assign({
        profile: '',
        status: '',
        error: ''
      }));

		case ACTIONS.EDIT_USER_PROFILE_SUCCESS:
			return (state = Object.assign({
				profile: action.payload,
				status: 'SUCCESS'
			}));

		case ACTIONS.EDIT_USER_PROFILE_ERROR:
			return (state = Object.assign({
				status: 'ERROR',
				error: action.payload
			}));

		default:
		  return state;
	}
};
