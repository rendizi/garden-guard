import React, { useState, useEffect } from 'react';
import { View, Button, Alert, Text, CheckBox } from 'react-native';
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MoreScreen = () => {
  const [plantData, setPlantData] = useState([]);
  const [selectedDays, setSelectedDays] = useState({
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
  });
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
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

    loadPlantData();
  }, []);

  const scheduleWatering = () => {
    const updatedMarkedDates = {};
    Object.keys(selectedDays).forEach(day => {
      if (selectedDays[day]) {
        let currentDate = new Date();
        while (currentDate.getDay() !== getDayIndex(day)) {
          currentDate.setDate(currentDate.getDate() + 1);
        }
        while (currentDate <= new Date('2025-12-31')) {
          updatedMarkedDates[currentDate.toISOString().slice(0, 10)] = { selected: true, marked: true, dotColor: 'green' };
          currentDate.setDate(currentDate.getDate() + 7);
        }
      }
    });
    setMarkedDates(updatedMarkedDates);
    Alert.alert('Watering Scheduled', 'Watering schedule updated.');
  };

  const handleDayPress = (day) => {
    // Not implemented since the user is not directly selecting days on the calendar.
  };

  const getDayIndex = (day) => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    return days.indexOf(day.toLowerCase());
  };

  const toggleCheckbox = (day) => {
    setSelectedDays(prevState => ({
      ...prevState,
      [day]: !prevState[day],
    }));
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Calendar component */}
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
      />
      {/* Checkboxes container */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 20 }}>
        <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
          <Text>Watering Days:</Text>
          {Object.keys(selectedDays).map(day => (
            <View key={day} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <CheckBox
                value={selectedDays[day]}
                onValueChange={() => toggleCheckbox(day)}
                style={{marginBottom: 5}}
              />
              <Text style={{marginBottom: 5}}>{day.charAt(0).toUpperCase() + day.slice(1)}</Text>
            </View>
          ))}
        </View>
      </View>
      <Button title="Schedule Watering" onPress={scheduleWatering} />
    </View>
  );
};

export default MoreScreen;
