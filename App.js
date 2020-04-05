/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import HomeScreen from './src/screens/HomeScreen';

class App extends React.Component {

  constructor(props) {
    super(props)
  }

  render () {
    return (
      <HomeScreen/>
    )
  }
}

export default App;
