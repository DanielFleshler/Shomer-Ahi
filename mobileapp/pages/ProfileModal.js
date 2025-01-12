import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, I18nManager } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout
I18nManager.forceRTL(true);

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
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Ionicons name="close-outline" size={28} color="#3498DB" />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>פרופיל</Text>
                    </View>
                    
                    <View style={styles.profileHeader}>
                        <Ionicons name="person-circle-outline" size={100} color="#3498DB" />
                        <Text style={styles.profileName}>{userData.firstName} {userData.lastName}</Text>
                    </View>
                    
                    <View style={styles.profileInfo}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>טלפון</Text>
                            <Text style={styles.infoValue}>{userData.phoneNumber}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>אימייל</Text>
                            <Text style={styles.infoValue}>{userData.email}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>מספר רישיון נשק</Text>
                            <Text style={styles.infoValue}>{userData.licenseNumber}</Text>
                        </View>
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
        backgroundColor: '#F7F9FC',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: '60%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2C3E50',
    },
    closeButton: {
        padding: 5,
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
        color: '#2C3E50',
    },
    profileInfo: {
        marginTop: 20,
    },
    infoItem: {
        marginBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        paddingBottom: 8,
    },
    infoLabel: {
        fontSize: 14,
        color: '#7F8C8D',
        marginBottom: 4,
        textAlign: 'right',
    },
    infoValue: {
        fontSize: 16,
        color: '#2C3E50',
        textAlign: 'right',
    },
});

export default ProfileModal;

