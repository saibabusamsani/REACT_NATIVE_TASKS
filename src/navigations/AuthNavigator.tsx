import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types/navigation';
import { Text } from 'react-native';
import LoginScreen from '../features/auth/screens/LoginScreen';


const Stack = createNativeStackNavigator<AuthStackParamList>();



const SignupScreen =()=><Text>Sign up Screen</Text>
const ForgotPasswordScreen =()=><Text>Sign up Screen</Text>

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}