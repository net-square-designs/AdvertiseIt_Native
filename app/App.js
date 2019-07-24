import React, {Fragment} from 'react';
import { Provider } from 'react-redux';
import { BackHandler } from 'react-native';
import { Scene, Router, Actions, Stack } from 'react-native-router-flux';
import store from './store';
import { ACTIONS } from './actions/actionTypes';
import Login from '../app/screens/login';
import Signup from '../app/screens/signup';
import Home from '../app/screens/home';

const LogUserIn = () => {
  return (
    <Provider store={store}>
      <Login />
    </Provider>
  );
};

const SignUserUp = () => {
  return (
    <Provider store={store}>
      <Signup />
    </Provider>
  );
};

const HomeFeed = () => {
  return (
    <Provider store={store}>
      <Home />
   </Provider>
  );
};

const App = () => (
    <Router backAndroidHandler={() => {
      if (Actions.currentScene === 'HomeFeed' || Actions.currentScene === 'SignUserUp') {
        store.dispatch([{
          type: ACTIONS.RESET_STATUS
        }, {
          type: ACTIONS.FACEBOOK_RESET_STATUS
        }]);
        return BackHandler.exitApp();
      }
    }}>
      <Stack key="root" hideNavBar>
        {/* <Scene key="HomeFeed" component={HomeFeed} /> */}
        <Scene key="LogUserIn" component={LogUserIn}  />
        <Scene key="SignUserUp" component={SignUserUp} />
        <Scene key="HomeFeed" component={HomeFeed} />
      </Stack>
    </Router>
);

export default App;
