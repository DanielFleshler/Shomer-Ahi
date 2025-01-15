import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet,Image, ScrollView, I18nManager } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { UserContext } from './UserContext';
import { loginUser } from "../firebase/firebaseFunctions";

// Force RTL layout
I18nManager.forceRTL(true);

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setUserData } = useContext(UserContext);
  const navigation = useNavigation();
  
  const handleLogin = () => {
    if (email === '' || password === '') {
      Alert.alert('שגיאה', 'אנא מלא את כל השדות.');
      return;
    }

    loginUser(email, password).then((result) => {
      if (result.success) {
        Alert.alert('הצלחה', 'התחברת בהצלחה.');
        setUserData(result.userData);
        console.log("LoginPage userData:", result.userData);
        navigation.navigate('Home');
      } else {
        switch (result.error) {
          case 'INVALID_USER':
            Alert.alert(
              'משתמש לא מאושר',
              'המשתמש שלך עדיין לא אושר על ידי המערכת. אנא המתן לאישור.'
            );
            break;
          case 'AUTH_FAILED':
            Alert.alert(
              'שגיאת התחברות',
              'אימייל או סיסמה לא נכונים.'
            );
            break;
          default:
            Alert.alert(
              'שגיאה',
              'אירעה שגיאה בהתחברות. אנא נסה שוב.'
            );
        }
      }
    }).catch((error) => {
      console.error('Login error:', error);
      Alert.alert(
        'שגיאה',
        'אירעה שגיאה בהתחברות. אנא נסה שוב מאוחר יותר.'
      );
    });
};

  const handleRegister = () => {
    navigation.navigate('Register');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>שומר אחי</Text>

        <Image source={require('../assets/logo.png')}
        style={styles.logo}
        resizeMode="contain" />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="אימייל"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor="#999"
          />
          <Ionicons name="mail-outline" size={24} color="#999" style={styles.icon} />
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#999" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="סיסמה"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#999"
          />
          <Ionicons name="lock-closed-outline" size={24} color="#999" style={styles.icon} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleLogin}>
          <Text style={styles.submitButtonText}>התחבר</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleRegister}>
          <Text style={styles.registerLink}>אין לך חשבון? הירשם כאן</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#F7F9FC",
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
    textAlign: "center",
  },
  logo: {
    width: 250,
    height: 200,
    alignSelf: "center",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  icon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  submitButton: {
    backgroundColor: "#3498DB",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  registerLink: {
    textAlign: 'center',
    color: "#3498DB",
    fontSize: 16,
    marginTop: 10,
  },
});

export default LoginPage;

