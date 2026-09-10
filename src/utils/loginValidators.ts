/**
 * Shared validation utilities across the app
 */

export const validateMobileNumber = (mobile: string): string | undefined => {
  if (!mobile.trim()) {
    return 'Mobile number is required';
  }
  if (!/^[6-9]\d{9}$/.test(mobile.trim())) {
    return 'Enter a valid 10-digit mobile number';
  }
  return undefined;
};

export const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters';
  }
  return undefined;
};

export const validateRequired = (value: string, fieldName: string): string | undefined => {
  if (!value || !value.trim()) {
    return `${fieldName} is required`;
  }
  return undefined;
};