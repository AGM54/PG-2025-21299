import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Detectar si es tablet
const isTablet = width >= 768;

// Función para escalar fuentes de manera responsiva
const scale = (size: number) => {
  if (isTablet) {
    return size * 0.7;
  }
  return size;
};

const scaleSpace = (size: number) => {
  if (isTablet) {
    return size * 0.8;
  }
  return size;
};

interface ErrorModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  type?: 'error' | 'warning' | 'info';
}

export default function ErrorModal({
  visible,
  title,
  message,
  onClose,
  type = 'error',
}: ErrorModalProps) {
  // Colores según el tipo de error
  const colors = {
    error: {
      gradient: ['#7f1d1d', '#991b1b', '#b91c1c'] as const,
      border: '#ef4444',
      icon: '⚠️',
      defaultTitle: 'Error',
    },
    warning: {
      gradient: ['#78350f', '#92400e', '#b45309'] as const,
      border: '#f59e0b',
      icon: '⚠️',
      defaultTitle: 'Advertencia',
    },
    info: {
      gradient: ['#1e3a8a', '#1e40af', '#2563eb'] as const,
      border: '#3b82f6',
      icon: 'ℹ️',
      defaultTitle: 'Información',
    },
  };

  const config = colors[type];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: scaleSpace(width * 0.06),
        }}
      >
        <LinearGradient
          colors={config.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            width: width * 0.9,
            maxWidth: 500,
            borderRadius: scaleSpace(20),
            borderWidth: 2,
            borderColor: config.border,
            padding: scaleSpace(width * 0.06),
            ...Platform.select({
              ios: {
                shadowColor: config.border,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              },
              android: {
                elevation: 8,
              },
            }),
          }}
        >
          {/* Icono */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: scaleSpace(height * 0.015),
            }}
          >
            <View
              style={{
                width: scale(60),
                height: scale(60),
                borderRadius: scale(30),
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Text style={{ fontSize: scale(30) }}>{config.icon}</Text>
            </View>
          </View>

          {/* Título */}
          <Text
            style={{
              fontSize: scale(width * 0.055),
              fontWeight: '800',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: scaleSpace(height * 0.012),
              fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif',
            }}
          >
            {title || config.defaultTitle}
          </Text>

          {/* Mensaje */}
          <Text
            style={{
              fontSize: scale(width * 0.04),
              color: 'rgba(255, 255, 255, 0.95)',
              textAlign: 'center',
              lineHeight: scale(width * 0.055),
              marginBottom: scaleSpace(height * 0.025),
            }}
          >
            {message}
          </Text>

          {/* Botón */}
          <TouchableOpacity
            onPress={onClose}
            style={{
              width: '100%',
              overflow: 'hidden',
              borderRadius: scaleSpace(16),
            }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.15)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                paddingVertical: scaleSpace(height * 0.018),
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: scaleSpace(16),
              }}
            >
              <Text
                style={{
                  fontSize: scale(width * 0.045),
                  fontWeight: '700',
                  color: '#FFFFFF',
                }}
              >
                Entendido
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </Modal>
  );
}

