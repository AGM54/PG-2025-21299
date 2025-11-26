import React, { useState } from 'react';
import { logger } from '../../utils/logger';
import { TouchableOpacity, Text, Alert, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { sendEmailVerification, User } from 'firebase/auth';
import { auth } from '../../../firebase.config';

interface ResendVerificationButtonProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  user?: User | null;
}

const ResendVerificationButton: React.FC<ResendVerificationButtonProps> = ({ 
  style, 
  textStyle, 
  user 
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [cooldown, setCooldown] = useState<number>(0);

  const handleResendVerification = async (): Promise<void> => {
    const currentUser = user || auth.currentUser;
    
    if (!currentUser) {
      Alert.alert('Error', 'No hay usuario autenticado.');
      return;
    }

    if (currentUser.emailVerified) {
      Alert.alert('Info', 'Tu email ya está verificado.');
      return;
    }

    if (cooldown > 0) {
      Alert.alert('Espera', `Debes esperar ${cooldown} segundos antes de reenviar.`);
      return;
    }

    setIsLoading(true);

    try {
      await sendEmailVerification(currentUser, {
        url: 'https://cnee-educa.firebaseapp.com',
        handleCodeInApp: true,
      });

      Alert.alert(
        'Email Enviado', 
        `Se ha enviado un nuevo email de verificación a ${currentUser.email}. Revisa tu bandeja de entrada y spam.`
      );

      // Cooldown de 60 segundos
      setCooldown(60);
      const interval = setInterval(() => {
        setCooldown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

    } catch (error) {
      logger.error('Error reenviando verificación:', error);
      Alert.alert('Error', 'No se pudo reenviar el email de verificación.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[style, (isLoading || cooldown > 0) && { opacity: 0.7 }]} 
      onPress={handleResendVerification}
      disabled={isLoading || cooldown > 0}
    >
      {isLoading ? (
        <ActivityIndicator color={textStyle?.color || '#0066cc'} />
      ) : (
        <Text style={textStyle}>
          {cooldown > 0 ? `Reenviar en ${cooldown}s` : 'Reenviar verificación'}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ResendVerificationButton;

