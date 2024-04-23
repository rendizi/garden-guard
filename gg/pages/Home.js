import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { faWater, faBroom, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Image } from 'react-native';
function HomeScreen() {
  const [waterPlantsChecked, setWaterPlantsChecked] = useState(false);
  const [cleaningChecked, setCleaningChecked] = useState(false);
  const [diseaseCheckChecked, setDiseaseCheckChecked] = useState(false);
  const [waterStreak, setWaterStreak] = useState(0);
  const [cleaningStreak, setCleaningStreak] = useState(0);
  const [diseaseCheckStreak, setDiseaseCheckStreak] = useState(0);
  const [randomTip, setRandomTip] = useState('');
  const [showTip, setShowTip] = useState(true);
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [isWateringDay, setIsWateringDay] = useState(false);
  const [plantCount, setPlantCount] = useState(0);

  useEffect(() => {
    retrieveStreaksFromStorage();
    setRandomTip(getRandomTip());
    retrieveSelectedDaysFromStorage();
    countPlants();
  }, []);

  useEffect(() => {
    saveStreaksToStorage();
  }, [waterStreak, cleaningStreak, diseaseCheckStreak]);

  useEffect(() => {
    checkIfWateringDay();
  }, [selectedDays]); // Run this effect whenever selectedDays change

  const retrieveStreaksFromStorage = async () => {
    try {
      const waterStreakValue = await AsyncStorage.getItem('waterStreak');
      const cleaningStreakValue = await AsyncStorage.getItem('cleaningStreak');
      const diseaseCheckStreakValue = await AsyncStorage.getItem('diseaseCheckStreak');
      if (waterStreakValue !== null) {
        setWaterStreak(parseInt(waterStreakValue));
      } else {
        setWaterStreak(0);
      }
      if (cleaningStreakValue !== null) {
        setCleaningStreak(parseInt(cleaningStreakValue));
      } else {
        setCleaningStreak(0);
      }
      if (diseaseCheckStreakValue !== null) {
        setDiseaseCheckStreak(parseInt(diseaseCheckStreakValue));
      } else {
        setDiseaseCheckStreak(0);
      }
    } catch (error) {
      console.error('Error retrieving streaks from AsyncStorage:', error);
    }
  };

  const saveStreaksToStorage = async () => {
    try {
      await AsyncStorage.setItem('waterStreak', waterStreak.toString());
      await AsyncStorage.setItem('cleaningStreak', cleaningStreak.toString());
      await AsyncStorage.setItem('diseaseCheckStreak', diseaseCheckStreak.toString());
    } catch (error) {
      console.error('Error saving streaks to AsyncStorage:', error);
    }
  };

  const retrieveSelectedDaysFromStorage = async () => {
    try {
      const storedDays = await AsyncStorage.getItem('selectedDays');
      if (storedDays !== null) {
        setSelectedDays(JSON.parse(storedDays));
      }
    } catch (error) {
      console.error('Error retrieving selected days from AsyncStorage:', error);
    }
  };

  const countPlants = async () => {
    try {
      const storedData = await AsyncStorage.getItem('imageDataList');
      if (storedData !== null) {
        const plantData = JSON.parse(storedData);
        setPlantCount(plantData.length);
      } else {
        setPlantCount(0);
      }
    } catch (error) {
      console.error('Error counting plants:', error);
    }
  };

  const checkIfWateringDay = () => {
    const today = new Date();
    const dayIndex = today.getDay();
    const day = Object.keys(selectedDays)[dayIndex].toLowerCase();
    setIsWateringDay(selectedDays[day]);
  };

  const handleCheck = (setState, state, setStreak) => {
    setState(!state);
    if (!state) {
      setStreak(prevStreak => prevStreak + 1);
    } else {
      setStreak(0);
    }
  };

  const getRandomTip = () => {
    const tips = [
      "Provide plants with regular irrigation according to their water needs.",
      "Place the plants in a place where they get the right amount of light. Some prefer bright light, others - penumbra.",
      "Feed the plants with fertilizers to provide them with the necessary nutrients for growth.",
      "Provide good indoor ventilation so that plants can get enough fresh air.",
      "Periodically remove wilted leaves and flowers to stimulate new growth."
    ];
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  };

  return (
    <View style={styles.container}>
 <Image
      source={require('../assets/logo-removebg-preview.png')} // Assuming your logo image is in the assets folder
      style={styles.logo}
    />      <Text style={[styles.randomTipText, !showTip && { display: 'none' }]}>{randomTip}</Text>
      <Text style={styles.Streak}>Your streaks:</Text>
      <Text style={[styles.StreakInfo, !showTip && { display: 'none' }]}>
        <FontAwesomeIcon icon={faWater} style={styles.Icon} /> Watering: {waterStreak} <br />
        <FontAwesomeIcon icon={faBroom} style={styles.Icon} /> Cleaning: {cleaningStreak} <br />
        <FontAwesomeIcon icon={faMagnifyingGlass} style={styles.Icon} /> Disease Checking: {diseaseCheckStreak}
      </Text>

      <Text style={[styles.wateringDayMessage, isWateringDay ? { color: 'green' } : { color: 'red' }]}>
        {isWateringDay ? "Today is a watering day!" : "Today is not a watering day."}
      </Text>

      <Text style={styles.plantCount}>Number of Plants: {plantCount}</Text>

      <TouchableOpacity onPress={() => handleCheck(setWaterPlantsChecked, waterPlantsChecked, setWaterStreak)} style={styles.checkboxContainer}>
        <View style={styles.checkboxContent}>
          <FontAwesome
            name={waterPlantsChecked ? 'check-square-o' : 'square-o'}
            size={24}
            color={waterPlantsChecked ? '#4CAF50' : '#000'}
          />
          <Text style={styles.checkboxLabel}>Water Plants</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleCheck(setCleaningChecked, cleaningChecked, setCleaningStreak)} style={styles.checkboxContainer}>
        <View style={styles.checkboxContent}>
          <FontAwesome
            name={cleaningChecked ? 'check-square-o' : 'square-o'}
            size={24}
            color={cleaningChecked ? '#4CAF50' : '#000'}
          />
          <Text style={styles.checkboxLabel}>Cleaning</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => handleCheck(setDiseaseCheckChecked, diseaseCheckChecked, setDiseaseCheckStreak)} style={styles.checkboxContainer}>
        <View style={styles.checkboxContent}>
          <FontAwesome
            name={diseaseCheckChecked ? 'check-square-o' : 'square-o'}
            size={24}
            color={diseaseCheckChecked ? '#4CAF50' : '#000'}
          />
          <Text style={styles.checkboxLabel}>Checking for Disease</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: 100,
    height: 100,
    marginBottom: 60,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
    fontFamily: 'Garet',
  },
  checkboxContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 5,
  },
  checkboxContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 13,
    fontFamily: 'Garet',
  },
  streakText: {
    fontSize: 13,
    color: '#4CAF50',
    marginBottom: 5,
    fontFamily: 'Garet',
  },
  tipHeader: {
    fontSize: 20,
    textDecorationLine: 'underline',
    marginTop: 20,
    fontFamily: 'Garet',
  },
  randomTipText: {
    fontSize: 16,
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 60,
    fontFamily: 'Garet',
  },
  StreakInfo: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center', // Center align the text
    marginBottom: 30,
    fontFamily: 'Garet',
  },
  Streak: {
    fontSize: 27,
    marginHorizontal: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Garet',
  },
  wateringDayMessage: {
    fontSize: 18,
    marginTop: 10,
    fontFamily: 'Garet',
  },
  plantCount: {
    fontSize: 16,
    marginTop: 10,
    fontFamily: 'Garet',
  },
});


export default HomeScreen;
