import { memo, useCallback } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppTheme, useTheme, useThemedStyles } from '../../theme';
import { useGetEmployeesQuery } from '../../api/rtk/employees.api';
import { Employee } from '../../types/employee.type';
import ErrorState from '../../components/ErrorState';
import { AppText } from '../../components/AppText';
import { getErrorType } from '../../api/ErrorHandler';

const HomeScreen = () => {
  const { colors } = useTheme();
  const styles = useThemedStyles(createStyles);
  const { data = [], isLoading, isFetching, error, refetch } = useGetEmployeesQuery({ patientId: 'sai' });

  const renderItem = useCallback(({ item }: { item: Employee }) => <EmployeeCard item={item} />, []);

  if (error) return <ErrorState type={getErrorType(error)} onRetry={refetch} retryLoading={isFetching} />;
  if (isLoading) return <ActivityIndicator size="large" color={colors.primary} />;

  return (
    <SafeAreaView style={styles.container}>
      <FlatList data={data} keyExtractor={(item) => item.employeeId} renderItem={renderItem} />
    </SafeAreaView>
  );
};

export default HomeScreen;

const EmployeeCard = memo(({ item: employee }: { item: Employee }) => (
  <View><AppText>{employee.employeeId}</AppText></View>
));

const createStyles = ({}: AppTheme) => StyleSheet.create({ container: { flex: 1 } });