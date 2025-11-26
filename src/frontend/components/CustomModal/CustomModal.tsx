import React from 'react';
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

// Array de imágenes de personajes para intercalar
const personImages = [
  require('../../assets/persona/persona7.png'),
  require('../../assets/persona/persona8.png'),
  require('../../assets/persona/persona9.png'),
  require('../../assets/persona/persona10.png'),
  require('../../assets/persona/persona11.png'),
];

// Contador estático para intercalar personajes
let personCounter = 0;

export interface CustomModalProps {
  visible: boolean;
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  buttons?: Array<{
    text: string;
    onPress: () => void;
    style?: 'default' | 'destructive' | 'cancel';
  }>;
  onClose?: () => void;
  icon?: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  message,
  type = 'info',
  buttons = [{ text: 'OK', onPress: () => {} }],
  onClose,
  icon,
}) => {
  const scaleAnim = React.useRef(new Animated.Value(0)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 50,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  // Obtener imagen del personaje (intercalar entre las 5 disponibles)
  const getPersonImage = () => {
    const imageIndex = personCounter % personImages.length;
    personCounter++;
    return personImages[imageIndex];
  };

  const personImage = React.useMemo(() => getPersonImage(), [visible]);

  const getIconForType = () => {
    if (icon) return icon;
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
      default:
        return '💡';
    }
  };

  const getButtonStyle = (buttonType?: 'default' | 'destructive' | 'cancel'): [string, string] => {
    switch (buttonType) {
      case 'destructive':
        return ['#FF3547', '#CC0000'];
      case 'cancel':
        return ['#6C757D', '#495057'];
      case 'default':
      default:
        return ['#8B45FF', '#6B35D6'];
    }
  };

  const handleBackdropPress = () => {
    onClose?.();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        style={styles.backdrop} 
        activeOpacity={1} 
        onPress={handleBackdropPress}
      >
        <Animated.View
          style={[
            styles.container,
            {
              opacity: opacityAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            {/* Fondo azul sólido como en CNEE */}
            <View style={styles.modalContent}>
              {/* Imagen del personaje */}
              <Image
                source={personImage}
                style={styles.personImage}
                resizeMode="contain"
              />

              {/* Título con emoji */}
              <Text style={styles.title}>
                {title} {type === 'success' ? '🎉' : getIconForType()}
              </Text>

              {/* Mensaje */}
              <Text style={styles.message}>{message}</Text>

              {/* Botones */}
              <View style={styles.buttonContainer}>
                {buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      button.onPress();
                      onClose?.();
                    }}
                    style={[styles.button, buttons.length === 1 && styles.singleButton]}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#58CCF7', '#4A9FE7']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.buttonGradient}
                    >
                      <Text style={styles.buttonText}>
                        {button.text}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default CustomModal;

