import {createStackNavigator, createAppContainer} from 'react-navigation';
import { Login } from '../containers/index';

const MainNavigator = createStackNavigator({
  Login: {screen: Login},
});

const App2 = createAppContainer(MainNavigator);

export default App2;