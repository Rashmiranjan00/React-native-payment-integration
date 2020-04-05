import React, {Component} from 'react';
import {WebView} from 'react-native-webview';

export default class PaymentGatewayTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayWebView: true,
    };
  }
  render() {
    return (
      <WebView
        source={{
          uri: `http://172.21.0.1:5000/createCheckSum?OrderID=${this.props.navigation.state.params.orderId}&CustomerID=${this.props.navigation.state.params.customerId}&TaxationAmount=${this.props.navigation.state.params.taxationAmount}`,
        }}
        onNavigationStateChange={navigationState => {
          if (navigationState.title == 'true') {
            this.props.navigation.navigate('PaymentResponse', {
              paymentStatus: navigationState.title,
            });
          }
        }}
      />
    );
  }
}

