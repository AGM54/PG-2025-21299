import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  Vibration,
  Animated,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

const { width, height } = Dimensions.get('window');

const items = [
  { id: 'bateria', label: 'Batería', image: require('../../assets/bateriac.png') },
  { id: 'foco', label: 'Receptor', image: require('../../assets/fococ.png') },
  { id: 'interruptor', label: 'Interruptor', image: require('../../assets/inter.png') },
];

const dropSpots = {
  bateria: { top: height * 0.18, left: width * 0.02, label: 'Batería' },
  foco: { top: height * 0.08, left: width * 0.35, label: 'Receptor' },
  interruptor: { top: height * 0.18, left: width * 0.69, label: 'Interruptor' },
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function CircuitClickGame() {
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ [key: string]: boolean }>({});
  const [feedbackColors, setFeedbackColors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');
  const [showButton, setShowButton] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const scaleAnim = useState(new Animated.Value(0.9))[0];
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const allPlaced = items.every((item) => placed[item.id]);
    if (allPlaced) {
      setShowConfetti(true);
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }).start();
      setShowButton(true);
    }
  }, [placed]);

  const handleDrop = (targetId: string) => {
    if (!selected) return;

    if (selected === targetId) {
      setPlaced((prev) => ({ ...prev, [targetId]: true }));
      setFeedbackColors((prev) => ({ ...prev, [targetId]: '#4CAF50' }));
      setSelected(null);
    } else {
      Vibration.vibrate(200);
      setFeedbackColors((prev) => ({ ...prev, [targetId]: '#FF5252' }));
      setError('¡Ubicación incorrecta!');
      setTimeout(() => {
        setFeedbackColors((prev) => ({ ...prev, [targetId]: '#FFFFFF' }));
        setError('');
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/conductor.png')}
        style={styles.background}
        resizeMode="contain"
      />

 

      <Text style={styles.conductorLabel}>Conductor</Text>

      {Object.entries(dropSpots).map(([id, pos]) => (
        <View key={id} style={[styles.dropWrapper, { top: pos.top, left: pos.left }]}>
          <Text style={styles.dropLabel}>{pos.label}</Text>
          <TouchableOpacity
            onPress={() => handleDrop(id)}
            style={[styles.dropZone, {
              backgroundColor: feedbackColors[id] || '#FFFFFF',
            }]}
          >
            {placed[id] && (
              <Image
                source={items.find((i) => i.id === id)?.image!}
                style={styles.icon}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
        </View>
      ))}

      <View style={styles.selectorBar}>
        {items.map((item) =>
          !placed[item.id] ? (
            <TouchableOpacity
              key={item.id}
              style={[styles.selectorButton, selected === item.id && { backgroundColor: '#FFD54F' }]}
              onPress={() => setSelected(item.id)}
            >
              <Image source={item.image} style={styles.selectorIcon} resizeMode="contain" />
            </TouchableOpacity>
          ) : null
        )}
      </View>

      {error !== '' && <Text style={styles.error}>{error}</Text>}

      {showButton && (
        <Animated.View style={{ transform: [{ scale: scaleAnim }], marginTop: height * 0.06 }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Electricidad')}
          >
            <Text style={styles.buttonText}>¡Continuar!</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {showConfetti && <ConfettiCannon count={80} origin={{ x: width / 2, y: 0 }} fadeOut fallSpeed={2500} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00152E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  background: {
    position: 'absolute',
    top: height*0.06,
    width: width,
    height: height * 0.4,
  },
  logo: {
    position: 'absolute',
    top: height * 0.01,
    right: width * 0.05,
    width: width * 0.18,
    height: width * 0.18,
  },
  conductorLabel: {
    position: 'absolute',
    top: height * 0.32,
    color: 'white',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
  dropWrapper: {
    position: 'absolute',
    width: width * 0.2,
    alignItems: 'center',
  },
  dropLabel: {
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    fontSize: width * 0.035,
  },
  dropZone: {
    width: width * 0.18,
    height: width * 0.18,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    padding: 5,
  },
  icon: {
    width: '100%',
    height: '100%',
  },
  selectorBar: {
    position: 'absolute',
    bottom: height * 0.15,
    flexDirection: 'row',
    gap: 15,
  },
  selectorButton: {
    width: width * 0.2,
    height: width * 0.22,
    backgroundColor: '#FFFFFF11',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectorIcon: {
    width: '70%',
    height: '70%',
  },
  error: {
    position: 'absolute',
    bottom: height * 0.08,
    color: '#FF5252',
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: width * 0.15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});

