export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/authentication/validatelogin',
    LOGOUT: '/authentication/logout'
  },

  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile'
  }
} as const;