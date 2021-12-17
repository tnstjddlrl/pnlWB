import React, { useRef, useEffect, useState } from 'react';
import {
  Alert,
  View,
  BackHandler,
  ActivityIndicator,
  Linking,
  SafeAreaView
} from 'react-native';

import { WebView } from 'react-native-webview';

import RNExitApp from 'react-native-exit-app';

import VersionCheck from 'react-native-version-check';

import { requestMultiple, PERMISSIONS, RESULTS, request } from 'react-native-permissions';

var rnw
var cbc = false;

const App = () => {

  async function addPermission() {
    requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]).then((statuses) => {
      console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
      console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
      console.log('PHOTO_LIBRARY_ADD_ONLY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]);

      if (statuses[PERMISSIONS.IOS.CAMERA] !== 'granted' || statuses[PERMISSIONS.IOS.PHOTO_LIBRARY] !== 'granted' || statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY] !== 'granted') {
        Alert.alert('권한 문제', '설정에서 권한을 허용해주세요!', [
          { text: "OK", onPress: () => openSettings() }
        ])
      }
    });
  }

  useEffect(() => {

    if (Platform.OS === 'ios') {
      addPermission()
    }

    if (Platform.OS === 'android') {
      requestMultiple([PERMISSIONS.ANDROID.CAMERA]).then((statuses) => {
        console.log('Camera', statuses[PERMISSIONS.ANDROID.CAMERA]);
      });
    }

  }, [])


  useEffect(() => {
    console.log(VersionCheck.getPackageName());        // com.reactnative.app
    console.log(VersionCheck.getCurrentBuildNumber()); // 10
    console.log(VersionCheck.getCurrentVersion());

    VersionCheck.needUpdate()
      .then(async res => {
        console.log(res.isNeeded);  // true
        if (res.isNeeded) {
          Linking.openURL(res.storeUrl);  // open store if update is needed.
        } else {
          console.log('최신버전!')
        }
      });
  }, [])

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

  const onShouldStartLoadWithRequest = (event) => {
    if (
      event.url.startsWith('http://') ||
      event.url.startsWith('https://') ||
      event.url.startsWith('about:blank')
    ) {
      return true;
    }
    if (Platform.OS === 'android') {
      const SendIntentAndroid = require('react-native-send-intent');
      SendIntentAndroid.openChromeIntent(event.url)
        .then(isOpened => {
          if (!isOpened) { alert('앱 실행이 실패했습니다'); }
        })
        .catch(err => {
          console.log(err);
        });

      return false;

    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
        style={{ flex: 1 }}
        userAgent='Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.50 Mobile Safari/537.36'
        onNavigationStateChange={(navState) => { cbc = navState.canGoBack; rnw.postMessage('app'); console.log('전송!') }}
        onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
      />
    </SafeAreaView>
  )
}

export default App;