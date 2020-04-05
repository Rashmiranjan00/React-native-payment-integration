import React from 'react';
import {Text, View, Button, Modal, StyleSheet, Alert} from 'react-native';
import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import PaytmScreen from './PaytmScreen';
import PaypalScreen from './PaypalScreen';

class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      taxationAmount: 0,
    };
    this.Paytm = this.Paytm.bind(this);
    this.Paypal = this.Paypal.bind(this);
  }

  Paytm = () => {
    console.log('paytm');
    var orderId = new Date().getTime() / 1000;
    var customerId = `${'rpradhan909@gmail.com'}_${'team'}`;
    var taxationAmount = this.state.taxationAmount;
    var mobile = `7809597596`;
    var email = `rpradhan909@gmail.com`;
    var checkSum = ``;
    // var mercUnqRef = ``;
    this.setState({modalVisible: false});
    this.props.navigation.navigate('Paytm', {
      taxationAmount,
      customerId,
      orderId,
      mobile,
      email,
      checkSum,
      // mercUnqRef,
    });
  };

  Paypal = () => {
    console.log('Paypal');
    var orderId = new Date().getTime() / 1000;
    var customerId = `${'rpradhan909@gmail.com'}_${'team'}`;
    var taxationAmount = this.state.taxationAmount;
    var mobile = `7809597596`;
    var email = `rpradhan909@gmail.com`;
    var checkSum = ``;
    var mercUnqRef = ``;
    this.setState({modalVisible: false});
    this.props.navigation.navigate('Paypal', {
      taxationAmount,
      customerId,
      orderId,
      mobile,
      email,
      checkSum,
      mercUnqRef,
    });
  };

  render() {
    return (
      <View style={styles.content}>
        <Button
          title="Pay Now"
          onPress={() => this.setState({modalVisible: true})}
        />

        <Modal
          style={styles.modal}
          visible={this.state.modalVisible}
          onRequestClose={() => this.setState({modalVisible: false})}>
          <View>
            <Button title="Paytm" onPress={() => this.Paytm()} />
            <Button title="Paypal" onPress={() => this.Paypal()} />
          </View>
        </Modal>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    Paytm: PaytmScreen,
    Paypal: PaypalScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    margin: 0,
    backgroundColor: 'white',
    height: 100,
    flex: 0,
    bottom: 0,
    position: 'absolute',
    width: '100%',
    flexDirection: 'row',
  },
});

export default createAppContainer(AppNavigator);
