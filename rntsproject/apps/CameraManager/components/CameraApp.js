'use strict';
import React, { useState, useEffect } from 'react';
import * as RNFS from 'react-native-fs';

import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';

function CameraApp({userId}){ // extends PureComponent {

  // constructor(props){
  //   super(props);
  //   this.picId = 'myfirstpic'
  // }
  console.log("userId in CameraApp", userId);
  const pictureId = 'myfirstpic'
  const [camera, setCamera] = useState();
  const [takeInterval, setTakeInterval] = useState();

  const [triggerSnap, setTriggerSnap] = useState({
    enable: false,
    issuer: null,
  });

  
  useEffect(() => {
    const subscriber = firestore()
      .collection('triggersnap')
      .doc(pictureId)
      .onSnapshot(documentSnapshot => {
        documentSnapshot.data() && console.log('triggersnap onSnapshot - data.id ', documentSnapshot.data());
        setTriggerSnap(documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return subscriber;
  }, [camera]);
  
  
  const push = (docId, imageBase64) => {
    const query = firestore()
          .collection('pic')
          .doc(docId);
    console.log("Push docId: ", docId);
    let qPromise = query.update({
        timestamp: firestore.FieldValue.serverTimestamp(),
        blob: firestore.Blob.fromBase64String(imageBase64),
      })
      .then(() => {
        console.log('Pic has been successfully pushed');
      })
      .catch((error) => {
        console.log('Pic has not been pushed. Raised error: ', error);
      });
  }
  
  const pushTrigger = (docId, action, issuer) => {
    const query = firestore()
          .collection('triggersnap')
          .doc(docId);
    console.log("Push triggersnap docId: ", docId);
    console.log("Push triggersnap issuer: ", issuer);
    let qPromise = query.update({
        timestamp: firestore.FieldValue.serverTimestamp(),
        enable: action,
        issuer: issuer
      })
      .then(() => {
        console.log('triggersnap has been successfully pushed');
      })
      .catch((error) => {
        console.log('triggersnap has not been pushed. Raised error: ', error);
      });
  }

  const takePicture = async () => {
    if (camera) {
      const options = { quality: 0.5, base64: true };
      // const { uri } = await this.camera.takePictureAsync(options);
      const data = await camera.takePictureAsync(options);

      console.log("Pic: uri = " + data.uri);
      // const imageBase64 = await this.getBase64(uri);
      console.log('Pic: ready to async push imageBase64');
      push(pictureId, data.base64);
    }
  };
  
  const takeIntervalPicture = async () => {
    setTakeInterval(setInterval(takePicture, 10000));
  };

  const clearTakeIntervalPicture = () => {
    clearInterval(takeInterval)
    setTakeInterval(null);
  };
    
    
  if(triggerSnap.enable && (userId !== triggerSnap.issuer)){
    takePicture();
    pushTrigger(pictureId, false, userId);
  }
  // render() {
  return (
    <View style={styles.container}>
      <RNCamera
        ref={ref => {
          setCamera(ref);
        }}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.off}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        androidRecordAudioPermissionOptions={{
          title: 'Permission to use audio recording',
          message: 'We need your permission to use your audio',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        onGoogleVisionBarcodesDetected={({ barcodes }) => {
          console.log(barcodes);
        }}
      />
      <View style={{ flex: 0, flexDirection: 'row', justifyContent: 'center' }}>
        <TouchableOpacity onPress={takePicture} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> SNAP </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={takeIntervalPicture} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> ITER </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearTakeIntervalPicture} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> STOPITER </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
  // }

  // getBase64 = async (imageUri) => {
  //   const filepath = imageUri.split('//')[1];
  //   const imageBase64 = await RNFS.readFile(filepath, 'base64');
  //   return `data:image/jpeg;base64,${imageBase64}`;
  // }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default CameraApp;
