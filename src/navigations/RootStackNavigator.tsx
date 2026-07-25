import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import BottomTabNavigator from './BottomTabNavigator';
import EmployeeDetailScreen from '../screens/Employees/EmployeeDetailScreen';
import SplashScreen from '../screens/SplashScreen';



const Stack = createNativeStackNavigator<RootStackParamList>();

const RootStackNavigator: React.FC = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      contentStyle: { backgroundColor: '#111E38' },
      animation: 'fade',
    }}
  >
    <Stack.Screen name="SplashScreen" component={SplashScreen} />
    <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
    <Stack.Screen name="EmployeeDetail" component={EmployeeDetailScreen} />
  </Stack.Navigator>
);

export default RootStackNavigator;