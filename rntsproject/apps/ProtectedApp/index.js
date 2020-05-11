import React, {
  useCallback,
  useState,
  useEffect
 } from "react";
import { Dimensions, Alert, Button, Linking, StyleSheet, View, Text, Image, ImageBackground} from "react-native";

//Navigation
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';

import { CameraApp } from '../CameraManager/index'
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center'
  }
});



function CameraAppHomeScreen({route, navigation}) {
  
  const { userId } = route.params;
  const pictureId = 'myfirstpic';
  const [triggerSnap,setTriggerSnap] = useState({enable: false});
  
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
  }, []);
  
  
  const push = (docId, action, issuer) => {
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
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="See the latest Pic"
        onPress={() => navigation.navigate('PictureViewScreen')}
      />
      <Button
        title="Take another Pic"
        onPress={() => navigation.navigate('CameraScreen')}
      />
      <Button
        title={!triggerSnap.enable ? "Take remote snap" : "Cancel remote snap"}
        onPress={() => {
          push(pictureId, !triggerSnap.enable, userId);
          alert(!triggerSnap.enable ? "You requested to take a remote snap!" : "You cancelled remote snap!")
        }}
      />

    </View>
  );
}

function PictureViewScreen() {

  const win = Dimensions.get('window');
  const ratio = win.width/541; //541 is actual image width

  const styles = StyleSheet.create({
      image: {
        // flex: 1,
        alignSelf: 'stretch',
        width: win.width,
        height: 362 * ratio, //362 is actual height of image
        resizeMode: 'cover'
      },
      container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center'
      }
  });

  const pictureId = 'myfirstpic'

  const [picture, setPicture] = useState();
  const [base64, setBase64] = useState();

  useEffect(() => {
    const subscriber = firestore()
      .collection('pic')
      .doc(pictureId)
      .onSnapshot(documentSnapshot => {
        console.log('Picture data onSnapshot - data.id ', documentSnapshot.data().id);
        setPicture(documentSnapshot.data());
      });

    // Stop listening for updates when no longer required
    return subscriber;
  }, []);

  useEffect(() => {
    if (picture) {
      let blob = firestore.Blob.fromUint8Array(picture['blob'].toUint8Array());
      let base64 = blob.toBase64();
      let prefix = 'data:image/jpeg;base64,';
      base64 = prefix + base64;
      console.log("setBase64(base64);")
      setBase64(base64);
    }
  }, [picture]);

  const timestamp = picture ? picture.timestamp: null;
  const imageBase64 = base64;

  return (
    <View style={styles.container}>
      {
        timestamp
        ? <Text style={{fontSize: 10, color: 'blue', fontWeight: "bold"}}>Taken at: {timestamp.toDate().toString()}</Text>
        : <Text></Text>
      }
      {
        imageBase64
        ? <Image source={{uri: imageBase64, isStatic:true}} style={styles.image} resizeMode={'contain'} />
        : <Text></Text>
      }
    </View>
  );
}

function CameraScreen({route, navigation}) {
  const { userId } = route.params;

  return(
      <CameraApp userId={userId}/>
  );
}

const Stack = createStackNavigator();

function ProtectedApp({route, navigation}) {
  
  const { userId } = route.params;

  //Cloud messaging
  async function requestUserPermission() {
    const settings = await messaging().requestPermission();

    if (settings) {
      console.log('Permission settings:', settings);
    }
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);
  //End Cloud messaging
  
  console.log("userId: ", userId); 
  return (
    <Stack.Navigator initialRouteName="HomeScreen">
      <Stack.Screen name="CameraAppHomeScreen" component={CameraAppHomeScreen} options={{ title: '(sub)Home' }} initialParams={{ userId: userId }}/>
      <Stack.Screen name="PictureViewScreen" component={PictureViewScreen} options={{ title: 'See the latest Pic' }}/>
      <Stack.Screen name="CameraScreen" component={CameraScreen} options={{ title: 'Take another Pic' }} initialParams={{ userId: userId }}/>
    </Stack.Navigator>

  );
}

export default ProtectedApp;
