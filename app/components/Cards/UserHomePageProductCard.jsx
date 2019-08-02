import React, { createRef } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const UserHomePageProductCard = ({ productPhoto, viewProductDetails }) => (
  <TouchableWithoutFeedback onPress={viewProductDetails}>
    <View style={{
      flex: 1,
      marginTop: hp('2%'),
      marginBottom: hp('2%'), marginLeft: wp('2%'), height: hp('30vh'),
      width: wp('32%'), borderTopLeftRadius: 10, borderTopRightRadius: 10,
      borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#ffffff'
    }}>
      {/* First card view */}
      <View style={{ flex: 3, justifyContent: 'flex-start', backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
        <Image source={productPhoto} style={{ height: hp('33vh'), width: wp('95.1vw'), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />
      </View>
    </View>
  </TouchableWithoutFeedback>
);

export default UserHomePageProductCard;
