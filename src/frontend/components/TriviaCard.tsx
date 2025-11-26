import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { moderateScale as ms, msFont } from '../utils/responsive';

const { width, height } = Dimensions.get('window');

type Option = {
  label: string;
  correct: boolean;
};

type Props = {
  question: string;
  options: Option[];
  image?: any;
  onNext?: () => void;
  explanation?: string;
  isLast?: boolean; // ✅ Nueva prop para saber si es la última
};

export default function TriviaCard({
  question,
  options,
  image,
  onNext,
  explanation,
  isLast = false, // valor por defecto
}: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswered, setCorrectAnswered] = useState(false);

  useEffect(() => {
    setSelected(null);
    setCorrectAnswered(false);
  }, [question]);

  const handleSelect = (index: number) => {
    if (correctAnswered) return;
    const isCorrect = options[index].correct;
    setSelected(index);
    if (isCorrect) {
      setCorrectAnswered(true);
    }
  };

  return (
    <View style={styles.card}>
      {image && (
        <Image
          source={image}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Text style={styles.question}>{question}</Text>

      {options.map((opt, i) => {
        const isSelected = selected === i;
        const isCorrect = opt.correct;
        const showFeedback = isSelected;

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              showFeedback && {
                backgroundColor: isCorrect ? '#C8E6C9' : '#FFCDD2',
                borderColor: isCorrect ? '#00C853' : '#D32F2F',
              },
            ]}
            onPress={() => handleSelect(i)}
          >
            <Text style={styles.optionText}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}

      {correctAnswered && explanation && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>✅ Correcto</Text>
          <Text style={styles.explanationText}>{explanation}</Text>
        </View>
      )}

      {correctAnswered && (
        <TouchableOpacity
          style={[
            styles.nextButton,
            isLast && { backgroundColor: '#FF7A00' },
          ]}
          onPress={onNext}
        >
          <Text style={styles.nextButtonText}>
            {isLast ? 'Finalizar lección' : 'Continuar'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: ms(20),
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 4,
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
    alignItems: 'center',
  },
  image: {
    width: width * 0.4,
    height: height * 0.18,
    marginBottom: ms(20),
  },
  question: {
    fontSize: msFont(18),
    fontWeight: 'bold',
    marginBottom: ms(16),
    color: '#003366',
    textAlign: 'center',
  },
  option: {
    width: '100%',
    paddingVertical: ms(12),
    paddingHorizontal: ms(16),
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FF7A00',
    marginBottom: ms(10),
  },
  optionText: {
    fontSize: msFont(16),
    color: '#003366',
    textAlign: 'center',
  },
  explanationBox: {
    backgroundColor: '#d4edda',
    borderRadius: 8,
    padding: ms(12),
    marginTop: ms(16),
    width: '100%',
  },
  explanationTitle: {
    fontWeight: 'bold',
    color: '#155724',
    fontSize: msFont(16),
    marginBottom: ms(4),
    textAlign: 'center',
  },
  explanationText: {
    color: '#155724',
    fontSize: msFont(15),
    textAlign: 'center',
  },
  nextButton: {
    marginTop: ms(16),
    backgroundColor: '#00C853',
    paddingVertical: ms(12),
    paddingHorizontal: ms(24),
    borderRadius: 8,
  },
  nextButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: msFont(16),
  },
});

