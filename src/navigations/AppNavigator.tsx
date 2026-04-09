import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from "../screens/SpalshScreen"

import MainTabNavigator from './MainTabNavigator';
import AuthNavigator from './AuthNavigator';
import { useAuth } from '../hooks/Useauth';

export default function AppNavigator() {
  const { isLoggedIn } = useAuth();

  if (isLoggedIn === null ) {
    return <SplashScreen/>;
  }

  return isLoggedIn ? <MainTabNavigator /> : <AuthNavigator />


}