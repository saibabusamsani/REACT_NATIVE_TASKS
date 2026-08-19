import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigations/AppNavigator';
import {initDatabase} from "./src/database/index"

const App = () => {

  useEffect(()=>{
    const init = async ()=>{
       await initDatabase();
    }
    init();
  },[])
  return (
    <NavigationContainer>
      <AppNavigator />
    </NavigationContainer>
  );
};

export default App;