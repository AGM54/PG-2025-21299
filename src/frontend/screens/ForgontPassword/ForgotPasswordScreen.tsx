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
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { sendPasswordResetEmail, AuthError } from 'firebase/auth';
import { auth } from '../../firebase.config';
import { logger } from '../../utils/logger';
import { RootStackParamList } from '../../types/types';
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './ForgotPasswordScreenStyles';

const { width, height } = Dimensions.get('window');

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorModal, setErrorModal] = useState({ visible: false, message: '', type: 'error' as 'error' | 'info' });

  const validateEmail = (): { valid: boolean; message?: string } => {
    if (!email.trim()) {
      return { valid: false, message: 'Por favor, ingresa tu email para continuar.' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, message: 'Por favor, ingresa un email válido (ejemplo@correo.com).' };
    }

    return { valid: true };
  };

  const getErrorMessage = (error: AuthError): string => {
    switch (error.code) {
      case 'auth/user-not-found':
        return 'No existe una cuenta con este email.';
      case 'auth/invalid-email':
        return 'El formato del email no es válido.';
      case 'auth/network-request-failed':
        return 'Error de conexión. Verifica tu internet.';
      case 'auth/too-many-requests':
        return 'Demasiados intentos. Intenta más tarde.';
      default:
        return 'Ocurrió un error. Intenta nuevamente.';
    }
  };

  const handleResetPassword = async (): Promise<void> => {
    const validation = validateEmail();
    if (!validation.valid) {
      setErrorModal({
        visible: true,
        message: validation.message || 'Error en el formulario',
        type: 'error',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Use the correct authDomain from Firebase config
      await sendPasswordResetEmail(auth, email.trim().toLowerCase(), {
        url: 'https://cneeenergia.firebaseapp.com',
        handleCodeInApp: false,
      });

      setErrorModal({
        visible: true,
        message: `Se ha enviado un enlace para restablecer tu contraseña a ${email}. Revisa tu bandeja de entrada y la carpeta de spam.`,
        type: 'info',
      });

    } catch (error) {
      logger.silent('Error enviando email de recuperación:', error); // Silenciar en consola
      const errorMessage = getErrorMessage(error as AuthError);
      setErrorModal({
        visible: true,
        message: errorMessage,
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#2a3f6f', '#1f2d55']}
      style={styles.safeArea}
    >
      <SafeAreaView style={styles.safeAreaContent}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Header con botón de regreso */}
          <View style={styles.header}>
            <TouchableOpacity 
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={width * 0.07} color="#fff" />
            </TouchableOpacity>
            <Image source={require('../../assets/icon.png')} style={styles.logo} />
          </View>

          <Text style={styles.title}>Recuperar Contraseña</Text>
          <Text style={styles.subtitle}>
            Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
          </Text>

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={width * 0.06} color="#58CCF7" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#aaa"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity 
            style={[styles.resetButton, isLoading && { opacity: 0.7 }]} 
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.resetButtonText}>Enviar Email</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={[styles.backToLoginText, isLoading && { opacity: 0.5 }]}>
              Volver al inicio de sesión
            </Text>
          </TouchableOpacity>
        </ScrollView>

        <ErrorModal
          visible={errorModal.visible}
          title={errorModal.type === 'info' ? 'Email Enviado' : 'Error'}
          message={errorModal.message}
          onClose={() => {
            setErrorModal({ visible: false, message: '', type: 'error' });
            if (errorModal.type === 'info') {
              navigation.goBack();
            }
          }}
          type={errorModal.type}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};



export default ForgotPasswordScreen;


