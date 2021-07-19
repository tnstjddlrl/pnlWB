import React, { useRef, useEffect, useState } from 'react';
import {
  Alert,
  View,
  BackHandler,
  ActivityIndicator,
  NativeModules
} from 'react-native';

import { WebView } from 'react-native-webview';

import RNExitApp from 'react-native-exit-app';

const { RNCWebView } = NativeModules;

var rnw
var cbc = false;

const App = () => {

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hwbp",
      function () {
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

  function onShouldStartLoadWithRequest(request) {
    const { url, lockIdentifier } = request;


    console.log(url)
    return true;
  }

  return (
    <WebView
      ref={wb => { rnw = wb }}
      onMessage={event => {
        console.log(event.nativeEvent.data);
      }}
      onLoadEnd={() => {
        rnw.postMessage('hello')
      }}
      originWhitelist={['*']}
      source={{ uri: 'https://pluslink.kr/' }}
      style={{ width: '100%', height: '100%' }}
      onNavigationStateChange={(navState) => { cbc = navState.canGoBack; rnw.postMessage('app'); console.log('전송!') }}
      onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}

    />
  )
}

export default App;