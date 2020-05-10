import React, { 
  useCallback, 
  useState,
  useEffect
 } from "react";
import { Alert, Button, Linking, StyleSheet, View, Text, Image, ImageBackground} from "react-native";

// import CameraApp from './apps/CameraManager/index'
// import firestore from '@react-native-firebase/firestore';

function ProtectedApp() {
  
  return (
    <View>
      <Text>This is it.</Text>
    </View>
  );
  // function ProtectedApp({currentUri}) {

  // const picId = 'myfirstpic'
  // 
  // const [picData, setPicData] = useState();
  // 
  // useEffect(() => {
  //   const subscriber = firestore()
  //     .collection('pic')
  //     .doc(picId)
  //     .onSnapshot(documentSnapshot => {
  //       console.log('Click data: ', documentSnapshot.data());
  //       setPicData(documentSnapshot.data())
  //     });
  // 
  //   // Stop listening for updates when no longer required
  //   return () => subscriber();
  // }, []);
  // 
  // const encodedData = picData ? picData.dataBase64: null;
  // const timestamp = picData ? picData.timestamp: null;
  // return (
  //   <View style={styles.center}>
  //     {
  //       timestamp 
  //       ? <Text style={{fontSize: 10, color: 'blue', fontWeight: "bold"}}>Your last picture take at : {timestamp.toString()}</Text>
  //       : <Text>""</Text>
  //     }
  //     {
  //       currentUri
  //       ? <Image source={{uri: currentUri, isStatic:true}} style={{width: 300, height: 400}} />
  //       : <Text></Text>
  //     }
  //   </View> 
  // );

} 

export default ProtectedApp;