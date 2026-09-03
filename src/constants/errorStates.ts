
export type ErrorStateType = 'offline' | 'server' | 'forbidden' | 'notFound' | 'generic';

export type ErrorStateConfig = {
  title: string;
  subtitle: string;
  icon: string; 
};

export const ERROR_STATES: Record<ErrorStateType, ErrorStateConfig> = {
  offline: {
    title: 'No Internet Connection',
    subtitle: 'Check your network settings and try again.',
    icon: 'wifi-outline',
  },
  server: {
    title: 'Something Went Wrong',
    subtitle: "Our servers are having issues. We're on it.",
    icon: 'server-outline',
  },
  forbidden: {
    title: 'Access Denied',
    subtitle: "You don't have permission to view this.",
    icon: 'lock-closed-outline',
  },
  notFound: {
    title: 'Not Found',
    subtitle: "We couldn't find what you're looking for.",
    icon: 'search-outline',
  },
  generic: {
    title: 'Unexpected Error',
    subtitle: 'Please try again in a moment.',
    icon: 'alert-circle-outline',
  },
};