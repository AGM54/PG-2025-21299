import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Dimensions,
  TouchableOpacity,
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

interface CompletionMessageProps {
  title: string;
  message: string;
  score?: string;
  onContinue: () => void;
  buttonText?: string;
}

export default function CompletionMessage({
  title,
  message,
  score,
  onContinue,
  buttonText = 'Continuar',
}: CompletionMessageProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Obtener imagen del personaje
  const personImage = React.useMemo(() => {
    const imageIndex = personCounter % personImages.length;
    personCounter++;
    return personImages[imageIndex];
  }, []);

  useEffect(() => {
    // Animación de entrada
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.overlay}>
      {/* Fondo oscuro transparente */}
      <View style={styles.backgroundOverlay} />

      <Animated.View
        style={[
          styles.mainContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Recuadro azul sólido con contenido */}
        <View style={styles.contentCard}>
          {/* Imagen del personaje */}
          <Image
            source={personImage}
            style={styles.personImage}
            resizeMode="contain"
          />

          {/* Título */}
          <Text style={styles.title}>{title} 🎉</Text>
          
          {/* Mensaje */}
          <Text style={styles.message}>{message}</Text>
          
          {/* Score opcional */}
          {score && (
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreText}>{score}</Text>
            </View>
          )}

          {/* Botón de continuar grande */}
          <TouchableOpacity 
            style={styles.continueButton} 
            onPress={onContinue}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#58CCF7', '#4A9FE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>{buttonText}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

