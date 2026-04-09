import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNBootSplash from 'react-native-bootsplash';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setUser, clearUser } from '../store/Authslice';
import { STORAGE_KEYS } from '../constants';


export function useAuth() {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.authentication);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
        
        if (userJson) {
          const userData = JSON.parse(userJson);
          dispatch(setUser(userData));
        } else {
          dispatch(clearUser());
        }
      } catch (error) {
        console.error('[Auth] Bootstrap failed:', error);
        dispatch(clearUser());
      } finally {
        await RNBootSplash.hide({ fade: true });
      }
    };

    bootstrapAsync();
  }, [dispatch]);

  const login = async (userData: Record<string, any>) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
      dispatch(setUser(userData));
    } catch (error) {
      console.error('[Auth] Login failed:', error);
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
    isLoggedIn,
    isLoading,
    login,
    logout,
  };
}