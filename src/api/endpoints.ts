export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/authentication/validatelogin/new',
    LOGOUT: '/authentication/logout'
  },

  USERS: {
    LIST: '/users',
    PROFILE: '/users/profile'
  },
  EMPLOYEES :{
    LIST :"/api/v1/admin/patient"
  }
} as const;