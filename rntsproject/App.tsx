import React, { 
  useCallback,
  useState,
  useEffect
 } from "react";
import { Button, StyleSheet, View, Text } from "react-native";

//Navigation
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Firebase: auth and firestore
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GoogleSignInButton, SignOutButton} from './apps/AuthenticationManager/index'
import ProtectedApp from './apps/ProtectedApp/index'

const HomeScreen = ({navigation}) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function NavigateProtectedAppButton() {
    return (
      <Button
        title="Let's go!"
        onPress={() => navigation.navigate('ProtectedApp', {
          userId: user.uid
        })}
      />
    );
  }
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  const styles = StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: 'center'
    }
  });

  if (initializing) return null;

  if (!user) {
    return (
      <View style={styles.center}>
        <Text>Hello dude, please Login</Text>
        <GoogleSignInButton />
      </View>
    );
  }
  return (
    <View style={styles.center}>
      <Text>Welcome aboard {user.displayName}</Text>
      <NavigateProtectedAppButton/>
      <SignOutButton/>
    </View>
  );
}

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }}/>
        <Stack.Screen name="ProtectedApp" component={ProtectedApp} options={{ title: 'Getting Serious' }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
