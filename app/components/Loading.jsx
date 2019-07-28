import React, { createRef } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Loading = () => (
  <View style={{flex: 1, backgroundColor: 'white'}}>
    <View style={{ marginTop: hp('40%') }}>
      <ActivityIndicator animating={true} size="large" color="#0000ff" />
    </View>
  </View>
);

export default Loading;
