import { createStore, applyMiddleware, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import {
    SignupReducer,
    LoginReducer,
} from './reducers/index';


const rootReducer = combineReducers({
    signUp: SignupReducer,
    logIn: LoginReducer,
});

const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(thunk)));

export default store;