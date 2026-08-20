import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Login from '../LoginScreen';
import Beneficiary from '../Beneficiary';
import Constuctor from './../Constuctor';

const Stack = createNativeStackNavigator();

const MainTabNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Beneficiary" component={Beneficiary} />
      <Stack.Screen name="Contr" component={Constuctor} />
    </Stack.Navigator>
  );
};
export default MainTabNavigator;