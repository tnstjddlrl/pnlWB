
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
  BackHandler
} from 'react-native';

import { WebView } from 'react-native-webview';

import RNExitApp from 'react-native-exit-app';

var rnw

const App = () => {

  const [canBack, setCanBack] = useState(false)


  useEffect(() => {
    const backAction = () => {
      if (canBack === true) {
        rnw.goBack();
        return true;
      } else {
        Alert.alert('앱을 종료하시겠습니까?', '', [
          {
            text: "No",
            onPress: () => console.log("Cancel Pressed")
          },
          { text: "Yes", onPress: () => RNExitApp.exitApp() }
        ])
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
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
      onNavigationStateChange={(navState) => { setCanBack(navState.canGoBack); console.log(navState.canGoBack) }}
    />
  )
}



export default App;
