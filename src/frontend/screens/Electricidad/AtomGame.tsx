import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Vibration,
} from 'react-native';
import { Audio } from 'expo-av';
import styles from './atomGameStyles';

const { width, height } = Dimensions.get('window');

const parts = [
  { label: 'Protón', target: 'proton', number: '1' },
  { label: 'Neutrón', target: 'neutron', number: '2' },
  { label: 'Electrón', target: 'electron', number: '3' },
];

export default function AtomGame({ onComplete }: { onComplete: () => void }) {
  const [selectedNumber, setSelectedNumber] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ [key: string]: boolean }>({});
  const [completed, setCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const allPlaced = parts.every((part) => placed[part.label]);
    if (allPlaced && !completed) {
      setCompleted(true);
      playSuccessSound();
    }
  }, [placed]);

  const playSuccessSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/success.mp3')
    );
    await sound.playAsync();
  };

  const playErrorSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/error.mp3')
    );
    await sound.playAsync();
  };

  const handleDropClick = (target: string) => {
    const selectedPart = parts.find((part) => part.number === selectedNumber);
    if (selectedPart && selectedPart.target === target) {
      setPlaced((prev) => ({ ...prev, [selectedPart.label]: true }));
      setSelectedNumber(null);
    } else if (selectedPart) {
      Vibration.vibrate(200);
      playErrorSound();
      setErrorMessage('¡Esa no es la parte correcta!');
      setTimeout(() => setErrorMessage(null), 1500);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧩 Juego interactivo</Text>
      <Text style={styles.subtitle}>Selecciona un número y toca la parte correcta del átomo</Text>

      <View style={styles.horizontalOptions}>
        {parts.map((part) =>
          !placed[part.label] ? (
            <TouchableOpacity
              key={part.label}
              style={[
                styles.atom,
                selectedNumber === part.number && { backgroundColor: '#FFD54F' },
              ]}
              onPress={() => setSelectedNumber(part.number)}
            >
              <Text style={styles.atomText}>
                {part.number}. {part.label}
              </Text>
            </TouchableOpacity>
          ) : null
        )}
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/atomico.png')}
          style={styles.atomImage}
          resizeMode="contain"
        />

        {/* Zonas clicables */}
        {parts.map((part) => {
          const isPlaced = placed[part.label];
          const position = {
            proton: { top: height * 0.33, left: width * 0.26 },
            neutron: { top: height * 0.27, left: width * 0.35 },
            electron: { top: height * 0.36, left: width * 0.53 },
          }[part.target];

          return (
            <TouchableOpacity
              key={part.target}
              onPress={() => handleDropClick(part.target)}
              style={[
                {
                  position: 'absolute',
                  width: 30,
                  height: 30,
                  borderRadius: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: isPlaced ? '#00C853' : 'rgba(255,255,255,0.25)',
                },
                position,
              ]}
            >
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
                {part.number}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Mensaje de error */}
        {errorMessage && (
          <Text
            style={{
              position: 'absolute',
              bottom: height * 0.02,
              backgroundColor: 'rgba(255,0,0,0.8)',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              color: 'white',
              fontWeight: 'bold',
              fontSize: 16,
            }}
          >
            {errorMessage}
          </Text>
        )}
      </View>

      {completed && (
        <TouchableOpacity style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>¡Continuar!</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

