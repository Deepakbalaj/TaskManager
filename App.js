// App.js
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import TaskScreen from './screens/TaskScreen';
import { useColorScheme, StatusBar } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!loggedIn ? (
          <Stack.Screen name="Login">
            {() => <LoginScreen setLoggedIn={setLoggedIn} setUserEmail={setUserEmail} />}
          </Stack.Screen>
        ) : (
          <Stack.Screen name="Tasks">
            {() => <TaskScreen userEmail={userEmail} onLogout={() => setLoggedIn(false)} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
