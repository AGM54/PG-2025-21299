import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { moderateScale as ms, msFont } from '../utils/responsive';

const { width } = Dimensions.get('window');

interface Option {
  label: string;
  correct: boolean;
  image: any;
  isLarger?: boolean;
  feedback?: string;            
}

interface Props {
  question: string;
  options: Option[];
  onNext: () => void;
}

const ImageTriviaCard: React.FC<Props> = ({ question, options, onNext }) => {
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [respuestaCorrecta, setRespuestaCorrecta] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // 🔄 Resetear estados al cambiar de pregunta
  useEffect(() => {
    setFeedbackMsg(null);
    setRespuestaCorrecta(false);
    fadeAnim.setValue(0);
  }, [question]);

  const mostrarFeedback = (mensaje: string) => {
    setFeedbackMsg(mensaje);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(1000),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePress = (opt: Option) => {
    if (respuestaCorrecta) return;

    if (opt.correct) {
      setRespuestaCorrecta(true);
    }

    const msg =
      opt.feedback ??
      (opt.correct ? '¡Correcto! 🎉' : 'Intenta de nuevo 🙁');

    mostrarFeedback(msg);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>

      <View style={styles.optionsContainer}>
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => handlePress(opt)}
            disabled={respuestaCorrecta}
            style={[
              styles.optionBox,
              respuestaCorrecta && opt.correct && {
                borderColor: '#00C853',
                borderWidth: 2,
              },
            ]}
          >
            <Image
              source={opt.image}
              style={[
                styles.optionImage,
                opt.isLarger && styles.largerImage,
              ]}
            />
            <Text style={styles.optionLabel}>{opt.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {feedbackMsg && (
        <Animated.View
          style={[
            styles.feedbackContainer,
            {
              opacity: fadeAnim,
              backgroundColor: respuestaCorrecta
                ? '#00C853'
                : '#FF5252',
            },
          ]}
        >
          <Text style={styles.feedbackText}>{feedbackMsg}</Text>
        </Animated.View>
      )}

      {respuestaCorrecta && (
        <TouchableOpacity style={styles.nextButton} onPress={onNext}>
          <Text style={styles.nextButtonText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageTriviaCard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: ms(16),
    paddingVertical: ms(24),
  },
  question: {
    fontSize: msFont(22),
    fontWeight: 'bold',
    marginBottom: ms(24),
    textAlign: 'center',
    color: '#000',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: ms(16),
    marginBottom: ms(24),
  },
  optionBox: {
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: ms(12),
    width: width * 0.42,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionImage: {
    width: width * 0.3,
    height: width * 0.3,
    resizeMode: 'contain',
  },
  largerImage: {
    width: width * 0.36,
    height: width * 0.36,
  },
  optionLabel: {
    marginTop: ms(10),
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: msFont(16),
  },
  feedbackContainer: {
    marginBottom: ms(20),
    paddingVertical: ms(10),
    paddingHorizontal: ms(24),
    borderRadius: 20,
    alignSelf: 'center',
  },
  feedbackText: {
    color: '#fff',
    fontSize: msFont(18),
    fontWeight: 'bold',
  },
  nextButton: {
    marginTop: ms(10),
    backgroundColor: '#FF7A00',
    paddingHorizontal: ms(30),
    paddingVertical: ms(14),
    borderRadius: 12,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: msFont(17),
    fontWeight: 'bold',
  },
});
