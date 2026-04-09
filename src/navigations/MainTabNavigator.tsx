import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/Home/HomeScreen';
import { MainTabParamList } from '../types/navigation';
import { Text } from 'react-native';



const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Tab1" component={()=><Text>Tab1</Text>} />
      <Tab.Screen name="Tab2" component={()=><Text>Tab2</Text>} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;