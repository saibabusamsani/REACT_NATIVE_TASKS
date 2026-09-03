import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { Employee } from '../../types/employee.type';
import { useErrorState } from '../../hooks/useErrorState';
import { employeeService } from '../../api/services/employee.service';
import { isCancelledRequest } from '../../api/ErrorHandler';
import { AppTheme, useTheme, useThemedStyles } from '../../theme';
import ErrorState from '../../components/ErrorState';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppText } from '../../components/AppText';


export const useEmployees = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { errorType, handleError, clearError } = useErrorState();
  const activeController = useRef<AbortController | null>(null);

  const fetchEmployees = async () => {
    activeController.current?.abort();
    const controller = new AbortController();
    activeController.current = controller;

    try {
      clearError();
      setIsLoading(true);
      const result = await employeeService.list({ patientId: 'sai' }, controller.signal);
      setData(result);
    } catch (err) {
      if (isCancelledRequest(err)) return;
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    return () => activeController.current?.abort();
  }, []);

  return { data, errorType, isLoading, fetchEmployees };
};
const HomeScreen = () => {
   const {colors} = useTheme();
   const styles = useThemedStyles(createStyles);
  const {errorType,data,isLoading,fetchEmployees} = useEmployees();


  const renderItem = useCallback(({item}:{item:Employee})=><EmployeeCard item={item}/>,[])

  if(errorType){
     return <ErrorState type={errorType} onRetry={fetchEmployees} retryLoading={isLoading}/>
  };
  if(isLoading){
   return   <ActivityIndicator size={"large"} color={colors.primary}/>
  }

  return (
    <SafeAreaView style={styles.container}>
       <FlatList
         data={data}
         keyExtractor={item=>item.employeeId}
         renderItem={renderItem}
       />
    </SafeAreaView>
  )
}

export default HomeScreen;

const EmployeeCard = memo(({item:employee}:{item:Employee})=>
  <View>
     <AppText>{employee.employeeId}</AppText>
  </View>
);

const createStyles=({}:AppTheme)=>
  StyleSheet.create({
     container:{
      flex:1,
      
     }
  })