import { createStore, applyMiddleware, combineReducers } from 'redux';
import { reduxBatch }  from '@manaflair/redux-batch';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
  LoginReducer,
  SignupReducer,
  FacebookReducer,
  SwitchRoleToCustomerMerchantReducer,
  CloudinaryImageUploadReducer,
  EditUserProfileReducer,
  UserProfileReducer
} from './reducers/index';


const rootReducer = combineReducers({
  logIn: LoginReducer,
  signUp: SignupReducer,
  facebook: FacebookReducer,
  switchRoleCustomerMerchant: SwitchRoleToCustomerMerchantReducer,
  cloudinary: CloudinaryImageUploadReducer,
  editedUserProfile: EditUserProfileReducer,
  userProfile: UserProfileReducer
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk), reduxBatch));

export default store;