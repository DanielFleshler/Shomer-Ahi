import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../firebase/firebaseFunctions";

function RegisterForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licensePhoto, setLicensePhoto] = useState(null);

    const navigator = useNavigation();

    const handleLogin = () => {
        navigator.navigate("Login");
    };

    const handleSubmit = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
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
            navigator.navigate("Login");
        } else {
            Alert.alert("Error", "Registration failed.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>הרשמה</Text>

            <TextInput
                style={styles.input}
                placeholder="אימייל"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="סיסמה"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="אימות סיסמה"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="שם פרטי"
                value={firstName}
                onChangeText={setFirstName}
            />
            <TextInput
                style={styles.input}
                placeholder="שם משפחה"
                value={lastName}
                onChangeText={setLastName}
            />
            <TextInput
                style={styles.input}
                placeholder="מספר טלפון"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="מספר רישיון"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
            />
            <TouchableOpacity style={styles.fileButton}>
                <Text style={styles.fileButtonText}>העלה תמונת רישיון</Text>
            </TouchableOpacity>

            <Button title="הרשם" onPress={handleSubmit} />

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink} onPress={handleLogin}>?כבר יש לך חשבון התחבר</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    fileButton: {
        backgroundColor: "#007bff",
        padding: 10,
        alignItems: "center",
        borderRadius: 5,
        marginBottom: 10,
    },
    fileButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    loginLink: {
        marginTop: 20,
        textAlign: "center",
        color: "#007bff",
        textDecorationLine: "underline",
    },
});

export default RegisterForm;
