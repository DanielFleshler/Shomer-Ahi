import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert,Image, ScrollView, I18nManager } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { registerUser } from "../firebase/firebaseFunctions";
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout
I18nManager.forceRTL(true);

function RegisterForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        licenseNumber: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        phoneNumber: "",
        licenseNumber: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation();

    const validators = {
        email: (value) => {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!value) return "שדה האימייל הוא חובה";
            if (!emailRegex.test(value)) return "כתובת האימייל אינה תקינה";
            return "";
        },
        password: (value) => {
            if (!value) return "שדה הסיסמה הוא חובה";
            if (value.length < 6) return "הסיסמה חייבת להכיל לפחות 6 תווים";
            return "";
        },
        confirmPassword: (value) => {
            if (!value) return "אנא אמת את הסיסמה";
            if (value !== formData.password) return "הסיסמאות אינן תואמות";
            return "";
        },
        firstName: (value) => {
            if (!value) return "שדה שם פרטי הוא חובה";
            if (value.length < 2) return "שם פרטי חייב להכיל לפחות 2 תווים";
            return "";
        },
        lastName: (value) => {
            if (!value) return "שדה שם משפחה הוא חובה";
            if (value.length < 2) return "שם משפחה חייב להכיל לפחות 2 תווים";
            return "";
        },
        phoneNumber: (value) => {
            const phoneRegex = /^05\d{8}$/;
            if (!value) return "שדה מספר טלפון הוא חובה";
            if (!phoneRegex.test(value)) return "מספר טלפון לא תקין";
            return "";
        },
        licenseNumber: (value) => {
            if (!value) return "שדה מספר רישיון הוא חובה";
            if (value.length < 7) return "מספר רישיון חייב להכיל 7 ספרות";
            return "";
        }
        
    };

    const handleChange = (name, value) => {
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        
        const error = validators[name](value);
        setErrors(prev => ({ ...prev, [name]: error }));
        
        // Special case for confirm password
        if (name === 'password') {
            const confirmError = validators.confirmPassword(newFormData.confirmPassword);
            setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
        }
    };

    const handleSubmit = async () => {
        const newErrors = {};
        let hasErrors = false;
        
        Object.keys(validators).forEach(field => {
            const error = validators[field](formData[field]);
            newErrors[field] = error;
            if (error) hasErrors = true;
        });
        
        setErrors(newErrors);

        if (hasErrors) {
            Alert.alert("שגיאה", "אנא תקן את השגיאות בטופס");
            return;
        }

        const userData = {
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phoneNumber: formData.phoneNumber,
            licenseNumber: formData.licenseNumber,
            isUserValid: false,
        };

        try {
            const isRegistered = await registerUser(formData.email, formData.password, userData);
            if (isRegistered) {
                Alert.alert("הצלחה", "ההרשמה בוצעה בהצלחה");
                navigation.navigate("Login");
            }
        } catch (error) {
            Alert.alert("שגיאה", "ההרשמה נכשלה. אנא נסה שוב.");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.title}>הרשמה</Text>

                <Image source={require('../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain" />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, errors.firstName && styles.inputError]}
                        placeholder="שם פרטי"
                        value={formData.firstName}
                        onChangeText={(text) => handleChange("firstName", text)}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="person-outline" size={24} color="#999" style={styles.icon} />
                </View>
                {errors.firstName ? <Text style={styles.errorText}>{errors.firstName}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, errors.lastName && styles.inputError]}
                        placeholder="שם משפחה"
                        value={formData.lastName}
                        onChangeText={(text) => handleChange("lastName", text)}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="person-outline" size={24} color="#999" style={styles.icon} />
                </View>
                {errors.lastName ? <Text style={styles.errorText}>{errors.lastName}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, errors.email && styles.inputError]}
                        placeholder="אימייל"
                        value={formData.email}
                        onChangeText={(text) => handleChange("email", text.toLowerCase())}
                        keyboardType="email-address"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                    <Ionicons name="mail-outline" size={24} color="#999" style={styles.icon} />
                </View>
                {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, errors.phoneNumber && styles.inputError]}
                        placeholder="מספר טלפון"
                        value={formData.phoneNumber}
                        onChangeText={(text) => {
                            const numbersOnly = text.replace(/[^0-9]/g, '');
                            handleChange("phoneNumber", numbersOnly);
                        }}
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="call-outline" size={24} color="#999" style={styles.icon} />
                </View>
                {errors.phoneNumber ? <Text style={styles.errorText}>{errors.phoneNumber}</Text> : null}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, errors.licenseNumber && styles.inputError]}
                        placeholder="מספר רישיון"
                        value={formData.licenseNumber}
                        onChangeText={(text) => {
                            const numbersOnly = text.replace(/[^0-9]/g, '');
                            handleChange("licenseNumber", numbersOnly);
                        }}
                        keyboardType="phone-pad"
                        placeholderTextColor="#999"
                        maxLength={7}
                    />
                    <Ionicons name="card-outline" size={24} color="#999" style={styles.icon} />
                </View>
                {errors.licenseNumber ? <Text style={styles.errorText}>{errors.licenseNumber}</Text> : null}

                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#999" />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, errors.password && styles.inputError]}
                        placeholder="סיסמה"
                        value={formData.password}
                        onChangeText={(text) => handleChange("password", text)}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="lock-closed-outline" size={24} color="#999" style={styles.icon} />
                </View>
                {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}

                <View style={styles.inputContainer}>
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                        <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color="#999" />
                    </TouchableOpacity>
                    <TextInput
                        style={[styles.input, errors.confirmPassword && styles.inputError]}
                        placeholder="אימות סיסמה"
                        value={formData.confirmPassword}
                        onChangeText={(text) => handleChange("confirmPassword", text)}
                        secureTextEntry={!showPassword}
                        placeholderTextColor="#999"
                    />
                    <Ionicons name="lock-closed-outline" size={24} color="#999" style={styles.icon} />
                </View>
                {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}

                <TouchableOpacity 
                    style={[
                        styles.submitButton,
                        Object.values(errors).some(error => error) && styles.submitButtonDisabled
                    ]} 
                    onPress={handleSubmit}
                    disabled={Object.values(errors).some(error => error)}
                >
                    <Text style={styles.submitButtonText}>הרשם</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
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
        color: "#333",
        textAlign: "center",
    },
    logo: {
        width: 200,
        height: 100,
        alignSelf: "center",
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
    inputError: {
        borderBottomColor: '#FF3B30',
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: -15,
        marginBottom: 15,
        textAlign: 'right',
    },
    submitButtonDisabled: {
        backgroundColor: '#A5CDE8',
    },
});

export default RegisterForm;