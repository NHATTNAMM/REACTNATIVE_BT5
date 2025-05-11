import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../auth/LoginScreen';
import RegisterScreen from '../auth/RegisterScreen';
import ForgotPasswordScreen from '../auth/ForgotPasswordScreen';
import ChangePasswordScreen from '../auth/ChangePasswordScreen';
import TODOListScreen from '../screens/TODOListScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
      <Stack.Screen name="TODOList" component={TODOListScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator; 