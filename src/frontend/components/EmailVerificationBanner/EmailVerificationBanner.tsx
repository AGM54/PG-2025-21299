import React, { useState, useEffect } from 'react';
import { logger } from '../../utils/logger';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { moderateScale as ms, msFont } from '../../utils/responsive';
import { Ionicons } from '@expo/vector-icons';
import { User, reload } from 'firebase/auth';
import { auth } from '../../firebase.config';
import ResendVerificationButton from '../Buttons/ResendVerificationButton/ResendVerificationButton';

interface EmailVerificationBannerProps {
  user: User | null;
}

const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({ user }) => {
  const [isVerified, setIsVerified] = useState<boolean>(user?.emailVerified || false);
  const [isCheckingVerification, setIsCheckingVerification] = useState<boolean>(false);

  useEffect(() => {
    setIsVerified(user?.emailVerified || false);
  }, [user?.emailVerified]);

  const checkVerificationStatus = async (): Promise<void> => {
    if (!user) return;

    setIsCheckingVerification(true);
    try {
      await reload(user);
      setIsVerified(user.emailVerified);
      if (user.emailVerified) {
        // Opcionalmente, mostrar un mensaje de éxito
      }
    } catch (error) {
      logger.error('Error verificando estado:', error);
    } finally {
      setIsCheckingVerification(false);
    }
  };

  if (!user || isVerified) {
    return null;
  }

  return (
    <View style={styles.banner}>
      <View style={styles.content}>
        <Ionicons name="mail-outline" size={20} color="#ff9500" />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Email no verificado</Text>
          <Text style={styles.subtitle}>
            Verifica tu email para acceso completo
          </Text>
        </View>
      </View>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          onPress={checkVerificationStatus}
          style={styles.checkButton}
          disabled={isCheckingVerification}
        >
          <Text style={styles.checkButtonText}>
            {isCheckingVerification ? 'Verificando...' : 'Ya verifiqué'}
          </Text>
        </TouchableOpacity>
        
        <ResendVerificationButton
          user={user}
          style={styles.resendButton}
          textStyle={styles.resendButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1,
    borderRadius: 8,
    padding: ms(12),
    margin: ms(16),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: ms(8),
  },
  textContainer: {
    flex: 1,
    marginLeft: ms(8),
  },
  title: {
    fontSize: msFont(14),
    fontWeight: '600',
    color: '#856404',
  },
  subtitle: {
    fontSize: msFont(12),
    color: '#856404',
    marginTop: ms(2),
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: ms(8),
  },
  checkButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: 4,
    flex: 1,
  },
  checkButtonText: {
    color: '#fff',
    fontSize: msFont(12),
    fontWeight: '500',
    textAlign: 'center',
  },
  resendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: ms(12),
    paddingVertical: ms(6),
    borderRadius: 4,
    flex: 1,
  },
  resendButtonText: {
    color: '#fff',
    fontSize: msFont(12),
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default EmailVerificationBanner;

