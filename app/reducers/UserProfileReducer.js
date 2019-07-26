import { ACTIONS } from '../actions/actionTypes';

const initialState = {
	user: '',
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
        user: '',
        status: '',
        error: ''
      }));

		case ACTIONS.USER_PROFILE_SUCCESS:
			return (state = Object.assign({
				user: action.payload,
				status: 'SUCCESS'
			}));

		case ACTIONS.USER_PROFILE_ERROR:
			return (state = Object.assign({
				status: 'ERROR',
				error: action.payload
			}));

		default:
		  return state;
	}
};
