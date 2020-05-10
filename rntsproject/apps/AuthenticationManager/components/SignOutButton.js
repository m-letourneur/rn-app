import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import auth from '@react-native-firebase/auth';

function onSignOutButtonPress(){
  return auth()
    .signOut()
    .then(() => console.log('User signed out!'));
}

export default function SignOutButton() {
  
  const styles = StyleSheet.create({
    container: {
      //todo
    }
  });
  
  return (
    <View styles={styles.container}>
    <Button
      title="Sign-Out"
      onPress={() => onSignOutButtonPress().then(() => console.log('Signed out!'))}
    />
    </View>
  );
}

