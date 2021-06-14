
import React, { useRef, useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  BackHandler,
  ActivityIndicator
} from 'react-native';

import { WebView } from 'react-native-webview';

import RNExitApp from 'react-native-exit-app';

var rnw
var cbc = false;

const App = () => {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hwbp",
      function () {
        console.log('뭐지: ' + cbc)
        if (cbc && rnw) {
          rnw.goBack();
          return true;
        } else if (cbc == false) {
          Alert.alert('앱을 종료하시겠습니까?', '', [
            {
              text: "No",
              onPress: () => console.log("Cancel Pressed")
            },
            { text: "Yes", onPress: () => RNExitApp.exitApp() }
          ])
          return true;
        }
      }
    );
    return () => backHandler.remove();
  }, []);

  return (
    <WebView
      ref={wb => { rnw = wb }}
      onMessage={event => {
        console.log(event.nativeEvent.data);
        Alert.alert(event.nativeEvent.data);
        rnw.postMessage('app')
      }}
      onLoadEnd={() => {
        rnw.postMessage('hello')
      }}
      source={{ uri: 'https://pluslink.kr/' }}
      style={{ width: '100%', height: '100%' }}
      onNavigationStateChange={(navState) => { cbc = navState.canGoBack; console.log(cbc) }}
      renderLoading={() => (
        <View style={{ flex: 1, alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    />
  )
}



export default App;
