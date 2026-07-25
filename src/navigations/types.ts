export type BottomTabParamList = {
  Dashboard: undefined;
  Employees: undefined;
};

export type RootStackParamList = {
  SplashScreen:undefined,
  MainTabs: undefined;
  EmployeeDetail: {
    personCode: string;
    fullName: string;
    groupName?: string;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}