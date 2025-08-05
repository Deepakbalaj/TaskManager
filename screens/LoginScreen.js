// screens/LoginScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  useColorScheme,
  Image,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ setLoggedIn, setUserEmail }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID_HERE',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      setLoggedIn(true);
      setUserEmail('google_user@example.com');
    }
  }, [response]);

  const handleLogin = () => {
    if (email === 'demo@example.com' && password === 'password123') {
      setLoggedIn(true);
      setUserEmail(email);
    } else {
      setMessage('❌ Invalid email or password');
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDark && styles.containerDark]}>
      <Image
        source={require('../assets/login_illustration.png')}
        style={styles.image}
        resizeMode="contain"
      />

      <Text style={[styles.title, isDark && styles.textLight]}>🔐 Welcome Back</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor={isDark ? '#ccc' : '#888'}
        style={[styles.input, isDark && styles.inputDark]}
      />

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor={isDark ? '#ccc' : '#888'}
        style={[styles.input, isDark && styles.inputDark]}
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.googleButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Image
          source={require('../assets/google-icon.png')}
          style={styles.googleIcon}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </TouchableOpacity>

      {message !== '' && (
        <Text style={[styles.message, isDark && styles.textLight]}>{message}</Text>
      )}

      <Text style={[styles.hint, isDark && styles.textLight]}>
        (Hint: demo@example.com / password123)
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#a38bebff',
    fontSize: 16,
    color: '#000',
    shadowColor: '#ccc',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  inputDark: {
    backgroundColor: '#1e1e1e',
    borderColor: '#444',
    color: '#fff',
  },
  loginButton: {
    backgroundColor: '#5a626bff',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#bbdcffff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
    marginTop: 10,
  },
  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
  },
  googleText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
  hint: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 13,
    color: '#888',
  },
  textLight: {
    color: '#fff',
  },
  image: {
    width: '100%',
    height: 180,
    marginBottom: 10,
  },
});