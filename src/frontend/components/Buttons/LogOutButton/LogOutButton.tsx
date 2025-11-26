import React from 'react';
import { logger } from '../../utils/logger';
import { TouchableOpacity, Text, Alert, ViewStyle, TextStyle } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../../firebase.config';

interface LogoutButtonProps {
  style?: ViewStyle;
  textStyle?: TextStyle;
  onLogoutStart?: () => void;
  onLogoutComplete?: () => void;
  onLogoutError?: (error: string) => void;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ 
  style, 
  textStyle,
  onLogoutStart,
  onLogoutComplete,
  onLogoutError 
}) => {
  const handleLogout = (): void => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Cerrar Sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              onLogoutStart?.();
              await signOut(auth);
              onLogoutComplete?.();
              // El AppNavigator detectará automáticamente que el usuario se desconectó
            } catch (error) {
              logger.error('Error al cerrar sesión:', error);
              const errorMessage = 'No se pudo cerrar la sesión.';
              Alert.alert('Error', errorMessage);
              onLogoutError?.(errorMessage);
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity style={style} onPress={handleLogout}>
      <Text style={textStyle}>Cerrar Sesión</Text>
    </TouchableOpacity>
  );
};

export default LogoutButton;

