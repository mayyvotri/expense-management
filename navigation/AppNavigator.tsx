import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import HomeScreen from '../screens/HomeScreen';
import AddEditTransactionScreen from '../screens/AddEditTransactionScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import ChangePasswordScreen from '../screens/ChangePasswordScreen';
import AccountSettingsScreen from '../screens/AccountSettingsScreen';

type RootStackParamList = {
  Auth: undefined;
  Home: undefined;
  AddTransaction: { type: 'income' | 'expense' };
  EditTransaction: { id: string };
  TransactionHistory: undefined;
  Profile: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
  AccountSettings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // You could return a loading screen here
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={isAuthenticated ? "Home" : "Auth"}
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
        {!isAuthenticated ? (
          <Stack.Screen
            name="Auth"
            component={AuthNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <>
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
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ title: 'Hồ sơ cá nhân' }}
            />
            <Stack.Screen
              name="EditProfile"
              component={EditProfileScreen}
              options={{ title: 'Chỉnh sửa thông tin' }}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
              options={{ title: 'Đổi mật khẩu' }}
            />
            <Stack.Screen
              name="AccountSettings"
              component={AccountSettingsScreen}
              options={{ title: 'Cài đặt tài khoản' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
