import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, TextInput, Dimensions, TouchableWithoutFeedback } from 'react-native';
import data from '../assets/diseases.json'

const DiagnoseScreen = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const deviceWidth = Dimensions.get('window').width;

  // Function to handle opening the modal and setting the selected item
  const handleOpenModal = (item) => {
    setSelectedItem(item);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  // Function to handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    const filteredResults = data.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredData(filteredResults);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          onChangeText={handleSearch}
          value={searchQuery}
        />
        <Text style={styles.heading}>Plant Disease Diagnosis</Text>
        {filteredData.map((item, index) => (
          <TouchableOpacity key={index} style={styles.diseaseContainer} onPress={() => handleOpenModal(item)}>
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
            />
            <Text style={styles.diseaseTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
        {/* Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={selectedItem !== null}
          onRequestClose={handleCloseModal}
        >
          <TouchableWithoutFeedback onPress={handleCloseModal}>
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Image
                  source={{ uri: selectedItem?.imageUrl }}
                  style={[styles.modalImage, { width: deviceWidth - 40 }]}
                />
                <Text style={styles.modalTitle}>{selectedItem?.title}</Text>
                <Text style={styles.modalDescription}>{selectedItem?.description}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%'
  },
  searchInput: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  diseaseContainer: {
    width: '100%',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  diseaseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalImage: {
    height: 200,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
  },
});

export default DiagnoseScreen;
