import React, { createRef } from 'react';
import {
  View,
  Image,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Actions } from 'react-native-router-flux';

// Assets
import purchaseItemLogo from '../../assets/purchase-item.png';
import viewItemLogo from '../../assets/views.png';
import commentItemLogo from '../../assets/comment.png';
import shareItemLogo from '../../assets/share.png';
import nairaItemLogo from '../../assets/naira.png';
import likeItemLogo from '../../assets/liked.png';

const HomeFeedCard = ({ productPhoto, title, owner, ownerPhoto, views, likes, price, onAddToCart, viewProductDetails }) => (
  <TouchableWithoutFeedback onPress={viewProductDetails}>
    <View style={{
      flex: 1,
      marginTop: hp('2%'),
      marginBottom: hp('2%'), marginLeft: wp('2%'), height: hp('55vh'),
      width: wp('95%'), borderTopLeftRadius: 10, borderTopRightRadius: 10,
      borderBottomLeftRadius: 10, borderBottomRightRadius: 10, backgroundColor: '#002233'
    }}>
      {/* First card view */}
      <View style={{ flex: 3, justifyContent: 'flex-start', backgroundColor: 'white', borderTopLeftRadius: 10, borderTopRightRadius: 10 }}>
        <Image source={productPhoto} style={{ height: hp('33vh'), width: wp('95.1vw'), borderTopLeftRadius: 10, borderTopRightRadius: 10 }} />

        <TouchableWithoutFeedback onPress={onAddToCart}>
          <View style={{ marginLeft: wp('80%'), marginTop: hp('-6%') }}>
            <Image source={purchaseItemLogo} style={{ width: 30, height: 30 }} />
          </View>
        </TouchableWithoutFeedback>
      </View>
      {/* Second card view */}
      <View style={{ flex: 2, backgroundColor: '#323539', borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }}>
        <View style={{ flex: 3, flexDirection: 'row' }}>
          <View style={{ width: wp('50vw') }}>
            <Text style={{ color: 'white', fontSize: 23, fontWeight: 'bold', marginTop: hp('1%'), marginLeft: wp('4%') }}>{title}</Text>
            <Text style={{ color: 'white', marginLeft: wp('4%') }}>by {owner}</Text>
          </View>
          <View style={{ width: wp('50vw'), flex: 1, flexDirection: 'row-reverse' }}>
            <TouchableWithoutFeedback onPress={() => Actions.UserHomePage()}>
              <Image source={ownerPhoto} style={{ borderRadius: 100, height: 40, width: 40, marginTop: hp('2%'), marginRight: hp('4%') }} />
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View style={{ flex: 2, flexDirection: 'row', overflow: 'scroll', justifyContent: 'space-evenly', borderBottomLeftRadius: 10, borderBottomRightRadius: 10, marginTop: hp('2%') }}>
          {/* Views */}
          <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
            <Image source={viewItemLogo} style={{ width: 22, height: 15 }} />
            <Text style={{ color: 'white', overflow: 'scroll', fontSize: 10, marginLeft: wp('1%') }}>{views}</Text>
          </View>

          {/* Likes */}
          <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
            <Image source={likeItemLogo} style={{ width: 18, height: 16 }} />
            <Text style={{ color: 'white', overflow: 'scroll', fontSize: 10, marginLeft: wp('1%') }}>{likes}</Text>
          </View>

          {/* Comment */}
          <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
            <Image source={commentItemLogo} style={{ width: 15, height: 15 }} />
            <Text style={{ color: 'white', overflow: 'scroll', fontSize: 10, marginLeft: wp('1%') }}>Comment</Text>
          </View>

          {/* Share */}
          <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
            <Image source={shareItemLogo} style={{ width: 18, height: 15 }} />
            <Text style={{ color: 'white', overflow: 'scroll', fontSize: 10, marginLeft: wp('1%') }}>Share</Text>
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
            <Image source={nairaItemLogo} style={{ width: 15, height: 15 }} />
            <Text style={{ color: 'white', overflow: 'scroll', fontSize: 10, marginLeft: wp('1%') }}>{price}</Text>
          </View>
        </View>
      </View>
    </View>
  </TouchableWithoutFeedback>
);

export default HomeFeedCard;
