import React, { 
  useCallback, 
  useState,
  useEffect
 } from "react";
import { Button, StyleSheet, View, Text } from "react-native";

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {GoogleSignInButton, SignOutButton} from './apps/AuthenticationManager/index'
import ProtectedApp from './apps/ProtectedApp/index'

const AuthWrappedApp = () => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  function RedirectToProtectedAppButton() {
    return (
      <Button
        title="Let's go!"
        onPress={() => ProtectedApp()}
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
      <Text>Welcome aboard {user.email}</Text>
      <RedirectToProtectedAppButton/>
      <SignOutButton/>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <AuthWrappedApp/>
    </NavigationContainer>
  );
}

