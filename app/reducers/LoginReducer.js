import { ACTIONS } from '../actions/actionTypes';

const initialState = {
	token: '',
	status: '',
	error: ''
};
export default (state = initialState, action) => {
	switch (action.type) {
		case ACTIONS.USER_LOGIN_FAILED:
			return (state = Object.assign({
				status: 'FAILED',
				error: action.payload
			}));

		case ACTIONS.USER_LOGIN_SUCCESS:
			return (state = Object.assign({
				token: action.payload,
				status: 'SUCCESS'
			}));

		case ACTIONS.USER_LOGIN_ERROR:
			return (state = Object.assign({
				status: 'ERROR',
				error: action.payload
			}));

		default:
		  return state;
	}
};
