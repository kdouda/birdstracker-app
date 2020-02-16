import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Theme from "../../constants/Theme.js";

export default class Map extends React.Component {
  render () {
      return (
        <View style={styles.container}>
            <View>
                <Text>Map</Text>
            </View>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.default.background,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  buttonPad: {
    padding: 2,
  },
  loginWrapper: {
    alignSelf: 'stretch',
    margin: 10
  }
});
