import React from 'react';

import {View, Text, WebView, ActivityIndicator} from 'react-native';
import axios from 'axios';

class PaypalScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: null,
      approvalUrl: null,
      paymentId: null,
    };
  }

  componentDidMount() {
    let currency = '100 USD';
    currency.replace(' USD', '');

    const dataDetail = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            total: currency,
            currency: 'THB',
            details: {
              subtotal: currency,
              tax: '0',
              shipping: '0',
              handling_fee: '0',
              shipping_discount: '0',
              insurance: '0',
            },
          },
        },
      ],
      redirect_urls: {
        return_url: 'https://example.com',
        cancel_url: 'https://example.com',
      },
    };

    const auth = {
      username:
        'AfrTBDmH4sRe6mjeddTs2ZJKyIOghZA_ljdJFBCefr5XcbfmmabURcB8OCNykzRCr-hQgPhg6FGHbNeS',
      password:
        'EF2OqiMu1Y30p-YWfq3nvWUVFKkEBuf82MbpbCMf8tCj0JZSgkgbIVF6jZzO2kO6x9npEHdf24ilWXQG',
    };

    axios
      .post(
        'https://api.sandbox.paypal.com/v1/oauth2/token',
        {grant_type: 'client_credentials'},
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Credentials': true,
            // Authorization: 'Bearer A21AAHZfinavymkv5h6fBI74CzCypR29qMwHimUoIiTAAD__SJZl9Ny7we9lWQRte3eeoW18Yb81nq6TALPOSkooVmYn5uyiw',
          },
          auth: auth,
          // method: 'post',
        },
      )
      .then((response) => {
        console.log(response);
        this.setState({
          accessToken: response.data.access_token,
        });

        axios
          .post(
            'https://api.sandbox.paypal.com/v1/payments/payment',
            dataDetail,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.state.accessToken}`,
              },
            },
          )
          .then((response) => {
            const {id, links} = response.data;
            const approvalUrl = links.find(
              (data) => data.rel == 'approval_url',
            );

            this.setState({
              paymentId: id,
              approvalUrl: approvalUrl.href,
            });
          })
          .catch((err) => {
            console.log('2nd req');
            console.log({...err});
          });
      })
      .catch((err) => {
        console.log('1st req');
        console.log({...err});
      });
  }

  _onNavigationStateChange = (webViewState) => {
    if (webViewState.url.includes('https://example.com/')) {
      this.setState({
        approvalUrl: null,
      });

      const {PayerID, paymentId} = webViewState.url;

      axios
        .post(
          `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
          {payer_id: PayerID},
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${this.state.accessToken}`,
            },
          },
        )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log({...err});
        });
    }
  };

  render() {
    const {approvalUrl} = this.state;
    return (
      <View style={{flex: 1}}>
        {approvalUrl ? (
          <WebView
            style={{height: 400, width: 300}}
            source={{uri: approvalUrl}}
            onNavigationStateChange={this._onNavigationStateChange}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={false}
            style={{marginTop: 20}}
          />
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }
}

export default PaypalScreen;

// x-www-form-urlencoded
