import { ACTIONS } from '../actions/actionTypes';

const initialState = {
	facebookToken: '',
	facebookStatus: '',
	facebookError: ''
};
export default (state = initialState, action) => {
	switch (action.type) {
    case ACTIONS.FACEBOOK_START_LOADING:
			return (state = Object.assign({
				status: 'FACEBOOK_START_LOADING'
      }));

    case ACTIONS.FACEBOOK_STOP_LOADING:
      return (state = Object.assign({
        status: 'FACEBOOK_STOP_LOADING'
      }));

      case ACTIONS.FACEBOOK_RESET_STATUS:
        return (state = Object.assign({
          facebookStatus: '',
          facebookToken: '',
          facebookError: ''
        }));

		case ACTIONS.USER_SOCIAL_AUTH_SUCCESS:
			return (state = Object.assign({
				facebookToken: action.payload,
				facebookStatus: 'FACEBOOK_SUCCESS'
			}));

		case ACTIONS.USER_SOCIAL_AUTH_ERROR:
			return (state = Object.assign({
				facebookStatus: 'FACEBOOK_ERROR',
				facebookError: action.payload
			}));

		default:
		  return state;
	}
};
