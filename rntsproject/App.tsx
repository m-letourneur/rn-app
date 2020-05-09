import React, { 
  useCallback, 
  useState,
  useEffect
 } from "react";
import { Alert, Button, Linking, StyleSheet, View, Text } from "react-native";

import firestore from '@react-native-firebase/firestore';


const supportedURL = "https://galerapagos-f5bd9.web.app/";

const OpenURLButton = ({ url, children }) => {
  const handlePress = useCallback(async () => {
    // Checking if the link is supported for links with custom URL scheme.
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      // Opening the link with some app, if the URL scheme is "http" the web link should be opened
      // by some browser in the mobile
      await Linking.openURL(url);
    } else {
      Alert.alert(`Don't know how to open this URL: ${url}`);
    }
  }, [url]);

  return <Button title={children} onPress={handlePress} />;
};

const clickDataId = "clicksub-1";

const IncrCounterButton = ({ children }) => {
  const [counter, setCounter] = useState(0);
  
  const push = async () => {
    firestore()
      .collection('click-data')
      .doc(clickDataId)
      .set({
        id: "clicksub",
        name: 'Ada Lovelace',
        age: 30,
        counter: counter + 1,
      })
      .then(() => {
        console.log('Click data added!');
        setCounter(counter + 1);
      });
  }
  
  const handleClickButton = async () => {
    const s = await push();
  }
  return (
    <View style={styles.center}>
      <Button title={children} onPress={handleClickButton} />
      <Text style={{fontSize: 22, color: 'lightgreen', fontWeight: "bold"}}>Counter: {counter}</Text>
    </View> 
  );
};

function ClickData({ docId }) {
  
  const [clickData, setClickData] = useState({
    id: "clicksub",
    name: 'Ada Lovelace',
    age: 30,
    counter: 1,
  });
  
  useEffect(() => {
    const subscriber = firestore()
      .collection('click-data')
      .doc(docId)
      .onSnapshot(documentSnapshot => {
        console.log('Click data: ', documentSnapshot.data());
        setClickData(documentSnapshot.data())
      });

    // Stop listening for updates when no longer required
    return () => subscriber();
  }, [docId]);
  

  return (
    <View style={styles.center}>
      <Text style={{fontSize: 22, color: 'blue', fontWeight: "bold"}}>Collected data for {docId}: c = {clickData ? clickData.counter : -1}</Text>
    </View> 
  );
  
}

const App = () => {
  return (
    <View style={[styles.center, {flex: 1}]}>
      <OpenURLButton url={supportedURL}>Open THE game</OpenURLButton>
      <IncrCounterButton>Push to Firestore and update counter</IncrCounterButton>
      <ClickData docId={clickDataId}/>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  // container: { flex: 1, justifyContent: "center", alignItems: "center" },
  // container: { flex: 1, justifyContent: "center", alignItems: "center" },
  center: {
    justifyContent: "center",
    alignItems: 'center'
  }
});