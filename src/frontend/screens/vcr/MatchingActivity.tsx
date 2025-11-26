import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const leftItems = ['Voltaje', 'Corriente', 'Resistencia'];
const rightItems = [
  'La fuerza que impulsa a los electrones a moverse',
  'Cantidad de electrones que pasa por un punto del circuito',
  'Oposición al flujo de corriente eléctrica',
];

const correctPairs: Record<string, string> = {
  Voltaje: rightItems[0],
  Corriente: rightItems[1],
  Resistencia: rightItems[2],
};

const colorMap: Record<string, string> = {
  Voltaje: '#9be7ff',
  Corriente: '#c5e1a5',
  Resistencia: '#ffe082',
};

export default function MatchingActivity({ onNext }: { onNext: () => void }) {
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Ocultar feedback después de 1.5s
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  const handleSelect = (left: string) => {
    if (!matched[left]) {
      setSelectedLeft(left);
    }
  };

  const handleMatch = (right: string) => {
    if (!selectedLeft) return;

    const isCorrect = correctPairs[selectedLeft] === right;

    // Mostrar feedback
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    setFeedback(isCorrect ? '¡Correcto!' : 'Incorrecto');

    if (isCorrect) {
      setMatched((prev) => ({ ...prev, [selectedLeft]: right }));
    }

    // Reset selección para reintentos
    setSelectedLeft(null);
  };

  const isComplete =
    Object.keys(matched).length === leftItems.length &&
    leftItems.every((key) => matched[key] === correctPairs[key]);

  return (
    <View style={styles.container}>
      {/* Columnas */}
      <View style={styles.columns}>
        <View style={styles.column}>
          {leftItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.box,
                { backgroundColor: colorMap[item] },
                selectedLeft === item && styles.selectedBox,
              ]}
              onPress={() => handleSelect(item)}
            >
              <Text style={styles.boxText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.column}>
          {rightItems.map((item) => {
            const matchedLeft = Object.keys(matched).find(
              (key) => matched[key] === item
            );
            const alreadyMatched = !!matchedLeft;

            return (
              <TouchableOpacity
                key={item}
                style={[
                  styles.box,
                  {
                    backgroundColor: alreadyMatched
                      ? colorMap[matchedLeft!]
                      : '#F9F9F9',
                  },
                  { minHeight: 100, justifyContent: 'center' },
                  alreadyMatched && styles.disabledBox,
                ]}
                onPress={() => !alreadyMatched && handleMatch(item)}
                disabled={alreadyMatched}
              >
                <Text style={styles.definitionText}>{item}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Feedback animado */}
      {feedback && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            { opacity: fadeAnim },
          ]}
        >
          <LinearGradient
            colors={
              feedback === '¡Correcto!' 
                ? ['#10b981', '#059669', '#047857']
                : ['#ef4444', '#dc2626', '#b91c1c']
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              borderRadius: 17,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: feedback === '¡Correcto!' ? '#10b981' : '#ef4444',
              borderWidth: 3,
            }}
          >
            <Text style={styles.feedbackText}>
              {feedback === '¡Correcto!' ? '✅ ¡Correcto!' : '❌ Incorrecto'}
            </Text>
          </LinearGradient>
        </Animated.View>
      )}

      {/* Botón Finalizar */}
      {isComplete && (
        <TouchableOpacity style={styles.button} onPress={onNext}>
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#061C64',
  },
  columns: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  column: {
    width: '48%',
  },
  box: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 24,       
    borderColor: '#ccc',
    borderWidth: 1,
  },
  selectedBox: {
    borderColor: '#fff',
    borderWidth: 2,
  },
  disabledBox: {
    opacity: 0.6,
  },
  boxText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  definitionText: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  feedbackContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 12,
  },
  feedbackText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Century Gothic',
  },
  button: {
    backgroundColor: '#f77f00',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    width: width * 0.6,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
