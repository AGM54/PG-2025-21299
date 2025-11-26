import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { logger } from '../../utils/logger';
import { touchLastLogin } from '../../src/lib/firestore';
import { RootStackParamList } from '../../types/types';
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import styles from './styles';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Login'>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  const getErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/invalid-email':
        return 'El formato del email no es válido.';
      case 'auth/user-disabled':
        return 'Esta cuenta ha sido deshabilitada.';
      case 'auth/user-not-found':
        return 'No existe una cuenta con este email.';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta.';
      case 'auth/invalid-credential':
        return 'Email o contraseña incorrectos.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos fallidos. Intenta más tarde.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      default:
        return 'Error al iniciar sesión. Intenta de nuevo.';
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorModal({
        visible: true,
        message: 'Por favor completa todos los campos para continuar.',
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      
      // Actualizar último login y registrar evento en Firestore
      await touchLastLogin(userCredential.user.uid);
      
      // La navegación se manejará automáticamente por el AuthContext
      navigation.navigate('Tabs');
    } catch (error: any) {
      logger.silent('Error al iniciar sesión:', error); // Silenciar en consola
      setErrorModal({
        visible: true,
        message: getErrorMessage(error),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Image source={require('../../assets/icon.png')} style={styles.logo} />

        <Text style={styles.title}>Inicia Sesión</Text>
        <Text style={styles.subtitle}>¡Bienvenido de nuevo!</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPassword')}
          disabled={loading}
        >
          <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>

        <Text style={styles.loginRedirect}>
          ¿No tienes una cuenta?{' '}
          <Text
            onPress={() => !loading && navigation.navigate('Register')}
            style={styles.link}>
            Regístrate
          </Text>
        </Text>

        <TouchableOpacity 
          style={[styles.loginButton, loading && { opacity: 0.6 }]} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <ErrorModal
        visible={errorModal.visible}
        title="Error de autenticación"
        message={errorModal.message}
        onClose={() => setErrorModal({ visible: false, message: '' })}
        type="error"
      />
    </SafeAreaView>
  );
}


