import { ACTIONS } from '../actions/actionTypes';

const initialState = {
  imgurl: null,
  status: '',
  error: '',
}

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
   
    case ACTIONS.CLOUDINARY_IMAGE_UPLOAD_SUCCESS:
      return (state = Object.assign({
        imgurl: action.payload,
        status: 'SUCCESS'
      }));

    case ACTIONS.CLOUDINARY_IMAGE_UPLOAD_ERROR:
      return (state = Object.assign({
        status: 'ERROR',
        error: action.payload
      }));

    default:
      return state;
  }
}
