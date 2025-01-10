import React, { useState,useContext } from 'react';
import {UserContext} from './UserContext';
import { View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {loginUser}  from "../firebase/firebaseFunctions";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUserData } = useContext(UserContext);
  const navigator = useNavigation();
  
  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('Error', 'Please fill in all fields.');
    } else {
      return loginUser(email, password).then((userData) => {
        if (userData) {
          Alert.alert('Success', 'You have successfully logged in.');
          setUserData(userData);
          console.log("LoginPage userData:", userData);
          navigator.navigate('Home');
        } else {
          Alert.alert('Error', 'Invalid email or password.');
        }
    });
    }
  };
  const handleRegister = () => {
    navigator.navigate('Register');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shomer Ahi</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.footerText}>
        Don't have an account? <Text style={styles.footerLink} onPress={handleRegister}>Sign up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footerText: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
  },
  footerLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginPage;
