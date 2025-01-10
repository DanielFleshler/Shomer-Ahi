import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileModal = ({ visible, onClose, userData }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                        <Ionicons name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    
                    <View style={styles.profileHeader}>
                        <Ionicons name="person-circle" size={80} color="#007AFF" />
                        <Text style={styles.profileName}>{userData.firstName} {userData.lastName}</Text>
                    </View>
                    
                    <View style={styles.profileInfo}>
                        <Text style={styles.infoLabel}>טלפון</Text>
                        <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
                        <Text style={styles.infoLabel}>אימייל</Text>
                        <Text style={styles.infoValue}>{userData.email}</Text>
                        <Text style={styles.infoLabel}>מספר רישיון נשק</Text>
                        <Text style={styles.infoValue}>{userData.licenseNumber}</Text>                      
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: '50%',
    },
    closeButton: {
        alignSelf: 'flex-start',
        padding: 10,
    },
    profileHeader: {
        alignItems: 'center',
        marginVertical: 20,
    },
    profileName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
        textAlign: 'center',
    },
    profileInfo: {
        marginTop: 20,
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
        textAlign: 'right',
    },
    infoValue: {
        fontSize: 16,
        color: '#333',
        marginBottom: 16,
        textAlign: 'right',
    },
});

export default ProfileModal;