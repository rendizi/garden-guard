import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Calendar } from 'react-native-calendars'; 

import HomeScreen from './pages/Home';
import DiagnoseScreen from './pages/Diagnose';
import CameraScreen from './pages/Camera';
import PlantsScreen from './pages/Plants';
import MoreScreen from './pages/More';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        tabBar={({ state, descriptors, navigation }) => (
          <View style={styles.tabBar}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              let iconName;
              switch (label) {
                case 'Home':
                  iconName = 'home-outline';
                  break;
                case 'Diagnose':
                  iconName = 'medkit-outline';
                  break;
                case 'Camera':
                  iconName = 'camera-outline';
                  break;
                case 'My plants':
                  iconName = 'leaf-outline';
                  break;
                case 'Calendar':
                  iconName = 'calendar-outline';
                  break;
                default:
                  iconName = 'help-circle-outline';
                  break;
              }

              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => navigation.navigate(route.name)}
                  style={styles.tabBarButton}
                >
                  <Icon name={iconName} size={24} color="black" />
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Diagnose" component={DiagnoseScreen} />
        <Tab.Screen name="Camera" component={CameraScreen} />
        <Tab.Screen name="My plants" component={PlantsScreen} />
        <Tab.Screen name="Calendar" component={MoreScreen} />
      </Tab.Navigator>

      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#eee',
    height: 75,
  },
  tabBarButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
