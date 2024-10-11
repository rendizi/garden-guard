import React, { useState } from 'react';
import { View, Text, Image, Button, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';


const genAI = new GoogleGenerativeAI("AIzaSyDMq-5lAY3LIo5yMHnyAuzCoXkQl6nUEpA");

export default function CameraScreen() {
    const [image, setImage] = useState(null);
    const [responseText, setResponseText] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUploadImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        console.log('handleUploadImage called');
        console.log('result:', result);

        if (!result.cancelled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            console.log('URI:', uri);
            setImage(uri);
            setLoading(true);
            const imagePart = await fileToGenerativePart(uri);
            const response = await runModel("What is this plant? Does it have any diseases and if so which? If it is not a plant say so. Write maximum 100 words", imagePart);
            setResponseText(response);
            setLoading(false);

            saveImageData(uri, response);
        }
    };

    const saveImageData = async (uri, description) => {
        try {
            const existingImageData = JSON.parse(await AsyncStorage.getItem('imageDataList')) || [];
            const newImageData = { uri, description };
            const updatedImageDataList = [...existingImageData, newImageData];
            await AsyncStorage.setItem('imageDataList', JSON.stringify(updatedImageDataList));
        } catch (error) {
            console.error('Error saving image data:', error);
        }
    };

    const fileToGenerativePart = async (uri) => {
        const base64EncodedData = await convertFileToBase64(uri);
        return {
            inlineData: { data: base64EncodedData, mimeType: 'image/jpeg' },
        };
    };

    const convertFileToBase64 = async (uri) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result.split(',')[1]);
            };
            reader.onerror = reject;
            if (typeof uri === 'string') {
                fetch(uri)
                    .then(response => response.blob())
                    .then(blob => reader.readAsDataURL(blob))
                    .catch(error => reject(error));
            } else if (uri instanceof File) {
                reader.readAsDataURL(uri);
            } else {
                reject(new Error("Unsupported URI type"));
            }
        });
    };

    const runModel = async (prompt, imagePart) => {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();
        return text;
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Camera Screen</Text>
            <Button 
    title="Upload Image" 
    onPress={handleUploadImage} 
    style={styles.uploadButton} 
    color="green" // Add this line to change the button color to green
/>
            <View style={styles.previewContainer}>
                {image && (
                    <>
                        <Text>{"\n"}</Text>
                        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                    </>
                )}
            </View>
            <View style={styles.responseContainer}>
                {responseText && (
                    <>
                        <Text style={styles.responseTitle}>Response</Text>
                        <Text style={styles.responseText}>{responseText}</Text>
                    </>
                )}
            </View>
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#ffffff" />
                </View>
            )}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    uploadButton: {
        marginBottom: 20,
        
    },
    previewContainer: {
        marginBottom: 20,
    },
    responseContainer: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    responseTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    responseText: {
        fontSize: 14,
    },
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
