import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { logger } from '../../utils/logger';
import { createUserProfile } from '../../src/lib/firestore';
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import styles from './styles';
import { RootStackParamList } from '../../types/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '' });

  const getErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Este email ya está registrado.';
      case 'auth/invalid-email':
        return 'El formato del email no es válido.';
      case 'auth/weak-password':
        return 'La contraseña debe tener al menos 6 caracteres.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      default:
        return 'Error al crear la cuenta. Intenta de nuevo.';
    }
  };

  const validateForm = (): { valid: boolean; message?: string } => {
    if (!name.trim()) {
      return { valid: false, message: 'Por favor ingresa tu nombre completo.' };
    }

    if (!email.trim()) {
      return { valid: false, message: 'Por favor ingresa tu email.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return { valid: false, message: 'Por favor ingresa un email válido (ejemplo@correo.com).' };
    }

    if (!password) {
      return { valid: false, message: 'Por favor crea una contraseña para tu cuenta.' };
    }

    if (password.length < 6) {
      return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres para mayor seguridad.' };
    }

    if (password !== confirm) {
      return { valid: false, message: 'Las contraseñas no coinciden. Verifica que sean iguales.' };
    }

    return { valid: true };
  };

  const handleRegister = async () => {
    const validation = validateForm();
    if (!validation.valid) {
      setErrorModal({
        visible: true,
        message: validation.message || 'Error en el formulario',
      });
      return;
    }

    setLoading(true);
    try {
      // Crear usuario con Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      );

      // Actualizar el perfil con el nombre
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      // Crear perfil en Firestore
      await createUserProfile(
        userCredential.user.uid,
        email.trim().toLowerCase(),
        name.trim()
      );

      // Navegar sin mostrar alert
      navigation.navigate('Tabs');
    } catch (error: any) {
      logger.silent('Error al registrar:', error); // Silenciar en consola
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

        <Text style={styles.title}>Registro</Text>
        <Text style={styles.subtitle}>Ingresa tu nombre, correo y contraseña</Text>

        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Nombre"
            placeholderTextColor="#ccc"
            value={name}
            onChangeText={setName}
            editable={!loading}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña (mínimo 6 caracteres)"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />
        </View>

        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#fff" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Confirmar contraseña"
            placeholderTextColor="#ccc"
            secureTextEntry
            value={confirm}
            onChangeText={setConfirm}
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.registerButton, loading && { opacity: 0.6 }]} 
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.loginRedirect}>
          ¿Ya tienes una cuenta?{' '}
          <Text
            onPress={() => !loading && navigation.navigate('Login')}
            style={styles.link}>
            Iniciar Sesión
          </Text>
        </Text>
      </ScrollView>

      <ErrorModal
        visible={errorModal.visible}
        title="Error en el registro"
        message={errorModal.message}
        onClose={() => setErrorModal({ visible: false, message: '' })}
        type="error"
      />
    </SafeAreaView>
  );
}


