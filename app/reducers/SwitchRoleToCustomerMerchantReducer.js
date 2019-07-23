import { ACTIONS } from '../actions/actionTypes';

const initialState = {
	token: '',
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
        token: '',
        status: '',
        error: ''
      }));

		case ACTIONS.USER_SWITCH_ROLE_SUCCESS :
			return (state = Object.assign({
				token: action.payload,
				status: 'SUCCESS'
			}));

		case ACTIONS.USER_SWITCH_ROLE_ERROR:
			return (state = Object.assign({
				status: 'ERROR',
				error: action.payload
			}));

		default:
		  return state;
	}
};
