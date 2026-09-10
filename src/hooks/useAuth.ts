import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';

import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser } from '../store/Authslice';
import { STORAGE_KEYS } from '../constants/storageKeys';
import { User } from '../types/auth.type';

const MIN_SPLASH_TIME = 2000; 

export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.authentication);

  useEffect(() => {
    let isMounted = true;

    const bootstrapAsync = async () => {
    
      RNBootSplash.hide({ fade: false }).catch(() => {});

      const minTimerPromise = new Promise<void>((resolve) =>
        setTimeout(resolve, MIN_SPLASH_TIME)
      );
      const fetchUserDataPromise = AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      try {
    
        const [userJson] = await Promise.all([fetchUserDataPromise, minTimerPromise]);

        if (!isMounted) return;

        if (userJson) {
          const userData: User = JSON.parse(userJson);
          dispatch(setUser(userData));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('[Auth] Bootstrap failed:', error);
        if (isMounted) dispatch(clearUser());
      }
    };

    bootstrapAsync();

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      dispatch(setUser(userData));
    } catch (error) {
      console.error('[Auth] Login persistence failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      dispatch(clearUser());
    } catch (error) {
      console.error('[Auth] Logout failed:', error);
      throw error;
    }
  };

  return {
    user,
    isLoggedIn, // null initially -> triggers <SplashScreen /> display
    isLoading,
    login,
    logout,
  };
}