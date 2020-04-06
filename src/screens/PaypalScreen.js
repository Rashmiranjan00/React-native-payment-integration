import React from 'react';

import {View, Text, WebView, ActivityIndicator} from 'react-native';
import axios from 'axios';
const qs = require('qs');

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

    const url = 'https://api.sandbox.paypal.com/v1/oauth2/token';

    const auth = {
      username:
        'AWkpSxuUorLMnb6maCLsslwBuAiz6qs-rUB1_qw6mxHNrrEgV2k8lGPJ_FIKv7vtpxUx8K5yA99np24Q',
      password:
        'EFeaR03I0azDvk2sGctztFtPfg_JeXUOWU015fQDMP777iuje0dRiHsqAZXrkGJ9SucEPC4nPMsTrqQY',
    };

    axios
      .post(
        url,
        {grant_type: 'client_credentials'},
        {
          headers: {
            'content-type': 'application/x-www-form-urlencoded',
            'Access-Control-Allow-Credentials': true,
            // 'Authorization': 'Bearer A21AAESzQ1mpY6QhtZeHCy81k_RqXEsAUn_5oYjb1L5tTpmTbj5ulTz4eL4qgHv3KNLGKCh_hYew24GFM33xgJXGwqWeMdJVA'

          },
          auth: auth,
          method: 'post',
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
                'Authorization': `Bearer ${this.state.accessToken}`,
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
// Bearer A21AAHdCHR4n-48O5onwsv3FmiS9tQOUjpT9D_VL6iPj5m9CSBHPyR-R4xCGZafCzsAjfFl6qNuVI25hLEucXJnKDnLL4F6Zw
