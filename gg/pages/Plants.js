import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faLeaf} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

const PlantsScreen = () => {
    const [plantData, setPlantData] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);

    useEffect(() => {
        loadPlantData();
    }, []);

    const loadPlantData = async () => {
        try {
            const storedData = await AsyncStorage.getItem('imageDataList');
            if (storedData !== null) {
                setPlantData(JSON.parse(storedData));
            }
        } catch (error) {
            console.error('Error loading plant data:', error);
        }
    };

    const deletePlantData = async (index) => {
        try {
            const updatedPlantData = [...plantData];
            updatedPlantData.splice(index, 1);
            setPlantData(updatedPlantData);
            await AsyncStorage.setItem('imageDataList', JSON.stringify(updatedPlantData));
            setSelectedPlant(null); // Close the modal after deletion
        } catch (error) {
            console.error('Error deleting plant data:', error);
        }
    };

    const openModal = (index) => {
        setSelectedPlant(plantData[index]);
    };

    const closeModal = () => {
        setSelectedPlant(null);
    };

    return (
        <View style={{ flex: 1 }}> 
        <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
                <Text style={styles.title}>Your Plants</Text>
                <View style={{ marginBottom: 20 }}> 
                    <FontAwesomeIcon icon={faLeaf} style={[styles.Icon, { fontSize: 60, alignSelf:'center'}]} /> {/* Adjusted styles */}
                </View>
                <ScrollView contentContainerStyle={styles.imageContainer}>
                    {plantData.map((item, index) => (
                        <TouchableOpacity key={index} onPress={() => openModal(index)}>
                            <Image source={{ uri: item.uri }} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
                <Modal visible={selectedPlant !== null} transparent animationType="fade">
                    <TouchableWithoutFeedback onPress={closeModal}>
                        <View style={styles.modalBackground}>
                            <TouchableWithoutFeedback>
                                <View style={styles.modalContent}>
                                    <Image source={{ uri: selectedPlant?.uri }} style={styles.modalImage} />
                                    <Text style={styles.description}>{selectedPlant?.description}</Text>
                                    <TouchableOpacity onPress={() => deletePlantData(plantData.indexOf(selectedPlant))} style={styles.deleteButton}>
                                        <Text style={styles.deleteButtonText}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        </ScrollView>
    </View>
    

    
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 5,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalImage: {
        width: 200,
        height: 200,
        marginBottom: 10,
        borderRadius: 5,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    deleteButton: {
        backgroundColor: 'red',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default PlantsScreen;
