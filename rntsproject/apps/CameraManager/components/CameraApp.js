'use strict';
import React, { PureComponent } from 'react';
import * as RNFS from 'react-native-fs';

import { AppRegistry, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import firestore from '@react-native-firebase/firestore';

class CameraApp extends PureComponent {  

  constructor(props){
    super(props);
    this.picId = 'myfirstpic'
  }
      
  push = async (data) => {
    firestore()
      .collection('pic')
      .doc(this.picId)
      .set({
        id: this.picId,
        timestamp: firestore.FieldValue.serverTimestamp(),
        dataBase64: data,
      })
      .then(() => {
        console.log('Click pic data added!');
      });
  }
  
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
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
          <TouchableOpacity onPress={this.takePicture.bind(this)} style={styles.capture}>
            <Text style={{ fontSize: 14 }}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  getBase64 = async (imageUri) => {
    const filepath = imageUri.split('//')[1];
    const imageUriBase64 = await RNFS.readFile(filepath, 'base64');
    return `data:image/jpeg;base64,${imageUriBase64}`;
  }
  
  takePicture = async () => {
    if (this.camera) {
      const options = { quality: 0.5, base64: true };
      // const data = await this.camera.takePictureAsync(options);
      const { uri } = await this.camera.takePictureAsync(options);

      // console.log("Pic: data.uri = " + data.uri);
      console.log("Pic: data.uri = " + uri);
      console.log("Pic: data is ready to push");
      // this.setState({ photoUri: uri });//show image to user now
      this.props.handleSetPhotoUri(uri);
      // const base64 = await this.getBase64(data.uri);
      const base64 = await this.getBase64(uri);
      console.log('base64: ', base64);
      // this.props.actions.sendImageToServer(base64);
      await this.push(base64);
      console.log("Pic: data has been pushed");
    }
  };
  

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
// AppRegistry.registerComponent('CameraApp', () => ExampleApp);