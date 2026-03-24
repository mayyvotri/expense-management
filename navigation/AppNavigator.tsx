import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddEditTransactionScreen from '../screens/AddEditTransactionScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';

type RootStackParamList = {
  Home: undefined;
  AddTransaction: { type: 'income' | 'expense' };
  EditTransaction: { id: string };
  TransactionHistory: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Quản lý chi tiêu' }}
      />
      <Stack.Screen
        name="AddTransaction"
        component={AddEditTransactionScreen}
        options={({ route }) => ({
          title: route.params?.type === 'income' ? 'Thêm thu nhập' : 'Thêm chi tiêu',
        })}
      />
      <Stack.Screen
        name="EditTransaction"
        component={AddEditTransactionScreen}
        options={{ title: 'Sửa giao dịch' }}
      />
      <Stack.Screen
        name="TransactionHistory"
        component={TransactionHistoryScreen}
        options={{ title: 'Lịch sử giao dịch' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
