import { useState, useCallback, useMemo } from 'react';
import Toast from 'react-native-toast-message';

import { useLoginEmployeeMutation } from '../../../api/rtk/auth.api';
import { validateMobileNumber, validatePassword } from '../../../utils/loginValidators';
import { FieldName, FieldErrors, FormState, LoginStatus } from '../auth.type';
import { ErrorStateType } from '../../../constants/errorStates';
import { mapErrorToType, ReduxApiError } from '../../../api/ErrorHandler';
import { useAuth } from '../../../hooks/useAuth'; 

export function useLoginForm() {
  const { login: persistAuth } = useAuth()
  const [loginMutation, { isLoading, error, reset }] = useLoginEmployeeMutation();

  const [formState, setFormState] = useState<FormState>({
    values: { username: '', password: '' },
    errors: {},
    showPassword: false,
  });

  const errorType = useMemo<ErrorStateType | null>(() => {
    if (!error) return null;
    return mapErrorToType(error as ReduxApiError);
  }, [error]);

  const updateField = useCallback(
    (field: FieldName, value: string) => {
      if (error) reset();

      setFormState((prev) => ({
        ...prev,
        values: { ...prev.values, [field]: value },
        errors: prev.errors[field] ? { ...prev.errors, [field]: undefined } : prev.errors,
      }));
    },
    [error, reset]
  );

  const togglePasswordVisibility = useCallback(() => {
    setFormState((prev) => ({ ...prev, showPassword: !prev.showPassword }));
  }, []);

  const submitForm = useCallback(async () => {
    if (error) reset();

    const nextErrors: FieldErrors = {
      username: validateMobileNumber(formState.values.username),
      password: validatePassword(formState.values.password),
    };

    if (nextErrors.username || nextErrors.password) {
      setFormState((prev) => ({ ...prev, errors: nextErrors }));
      return;
    }

    try {
      
      const loginDetails = await loginMutation(formState.values).unwrap();

      switch (loginDetails?.status as LoginStatus) {
        case 1: {
          Toast.show({
            type: 'success',
            text1: 'Success!',
            text2: 'Login successful.',
            position: 'top',
            topOffset: 50,
          });
          if (loginDetails) {
            await persistAuth(loginDetails);
          }
          break;
        }

        case 2:
          Toast.show({
            type: 'error',
            text1: 'Already Logged In',
            text2: 'You are already logged in.',
            position: 'top',
            topOffset: 50,
          });
          break;

        case 5:
          Toast.show({
            type: 'error',
            text1: 'Permission Denied',
            text2: 'You do not have permission to login.',
            position: 'top',
            topOffset: 50,
          });
          break;

        default:
          Toast.show({
            type: 'error',
            text1: 'Unexpected Response',
            text2: 'Please try again later.',
            position: 'top',
            topOffset: 50,
          });
          break;
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Connection Error',
        text2: 'Failed to connect to the server.',
        position: 'top',
        topOffset: 50,
      });
    }
  }, [formState.values, loginMutation, error, reset, persistAuth]);

  return {
    formState,
    isLoading,
    error,
    errorType,
    updateField,
    togglePasswordVisibility,
    submitForm,
  };
}