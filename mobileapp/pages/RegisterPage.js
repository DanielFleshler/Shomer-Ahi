import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView, I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../firebase/firebaseFunctions";
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout
I18nManager.forceRTL(true);

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licensePhoto, setLicensePhoto] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const navigation = useNavigation();

    const handleLogin = () => {
        navigation.navigate("Login");
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Alert.alert("שגיאה", "הסיסמאות אינן תואמות.");
            return;
        }

        const userData = {
            email,
            firstName,
            lastName,
            phoneNumber,
            licenseNumber,
            licensePhoto,
            isUserValid: false,
        };

        const isRegistered = await registerUser(email, password, userData);
        if (isRegistered) {
            navigation.navigate("Login");
        } else {
            Alert.alert("שגיאה", "ההרשמה נכשלה.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>הרשמה</Text>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="שם פרטי"
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="person-outline" size={24} color="#999" style={styles.icon} />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="שם משפחה"
                        value={lastName}
                        onChangeText={setLastName}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="person-outline" size={24} color="#999" style={styles.icon} />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="אימייל"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="mail-outline" size={24} color="#999" style={styles.icon} />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="מספר טלפון"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="call-outline" size={24} color="#999" style={styles.icon} />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="מספר רישיון"
                        value={licenseNumber}
                        onChangeText={setLicenseNumber}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="card-outline" size={24} color="#999" style={styles.icon} />
                </View>

                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#999" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="סיסמה"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="lock-closed-outline" size={24} color="#999" style={styles.icon} />
                </View>

                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#999" />
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        placeholder="אימות סיסמה"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="lock-closed-outline" size={24} color="#999" style={styles.icon} />
                </View>

                <TouchableOpacity style={styles.fileButton}>
                    <Text style={styles.fileButtonText}>העלה תמונת רישיון</Text>
                    <Ionicons name="camera-outline" size={24} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>הרשם</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleLogin}>
                    <Text style={styles.loginLink}>כבר יש לך חשבון? התחבר</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

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
    fileButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonIcon: {
        marginLeft: 10,
    },
    fileButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
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
    loginLink: {
        textAlign: 'center',
        color: "#3498DB",
        fontSize: 16,
        marginTop: 10,
    },
});

export default RegisterForm;

