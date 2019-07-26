import { ACTIONS } from './actionTypes';
import Axios from 'axios';

const apiUrl = 'https://api.cloudinary.com/v1_1/pato/upload';

const CloudinaryImageUpload = (form) => async (dispatch) => {
  dispatch({
    type: ACTIONS.START_LOADING
  });
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      mode: 'cors',
      body: form,
    });

    const response = await res.json();
    
    dispatch({
      type: ACTIONS.STOP_LOADING
    });

    dispatch({
      type: ACTIONS.CLOUDINARY_IMAGE_UPLOAD_SUCCESS,
      payload: response.secure_url
    });
  }
  catch (error) {
    dispatch({
      type: ACTIONS.STOP_LOADING
    });
    dispatch({
      type: ACTIONS.CLOUDINARY_IMAGE_UPLOAD_ERROR,
      payload: 'Failed to upload image'
    });
  }
}

export default CloudinaryImageUpload;
