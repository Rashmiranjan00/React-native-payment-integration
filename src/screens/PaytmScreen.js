import React from 'react';

import {Text, Button, TouchableOpacity, Modal} from 'react-native';
import {WebView} from 'react-native-webview';
import Paytm from 'react-native-paytm';
// import PaytmPayment from './../apis/PaytmPayment';

// Data received from PayTM
const paytmConfig = {
  MID: 'RUOeWD80231238526522',
  WEBSITE: 'WEBSTAGING',
  CHANNEL_ID: 'WAP',
  INDUSTRY_TYPE_ID: 'Retail',
  CALLBACK_URL: 'https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=',
};

class PaytmScreen extends React.Component {
  constructor(props) {
    super(props);

    this.runTransaction = this.runTransaction.bind(this);
  }

  componentWillMount() {
    Paytm.addListener(Paytm.Events.PAYTM_RESPONSE, this._handlePaytmResponse);
  }

  componentWillUnmount() {
    Paytm.removeListener(
      Paytm.Events.PAYTM_RESPONSE,
      this._handlePaytmResponse,
    );
  }

  _handlePaytmResponse = resp => {
    const {STATUS, status, response} = resp;

    this.setState({processing: false, payment_text: ''});
    console.log(JSON.stringify(resp));
  };

  runTransaction(
    taxationAmount,
    customerId,
    orderId,
    mobile,
    email,
    checkSum,
    // mercUnqRef,
  ) {
    const callbackUrl = `${paytmConfig.CALLBACK_URL}${orderId}`;
    const details = {
      mode: 'Staging', // 'Staging' or 'Production'
      MID: paytmConfig.MID,
      INDUSTRY_TYPE_ID: paytmConfig.INDUSTRY_TYPE_ID,
      WEBSITE: paytmConfig.WEBSITE,
      CHANNEL_ID: paytmConfig.CHANNEL_ID,
      TXN_AMOUNT: `${taxationAmount}`, // String
      ORDER_ID: orderId.toString(), // String
      EMAIL: email, // String
      MOBILE_NO: mobile, // String
      CUST_ID: customerId, // String
      CHECKSUMHASH: checkSum, //From your server using PayTM Checksum Utility
      CALLBACK_URL: callbackUrl,
      //   MERC_UNQ_REF: mercUnqRef, // optional
    };

    Paytm.startPayment(details);
  }

  render() {
    const {params} = this.props.navigation.state;
    console.log(params);
    const {
      taxationAmount,
      customerId,
      orderId,
      mobile,
      email,
      checkSum,
      mercUnqRef,
    } = params;
    return (
      <Button
        title="Pay"
        onPress={() =>
          this.runTransaction(
            taxationAmount,
            customerId,
            orderId,
            mobile,
            email,
            checkSum,
          )
        }
      />
    );
  }
}

export default PaytmScreen;
