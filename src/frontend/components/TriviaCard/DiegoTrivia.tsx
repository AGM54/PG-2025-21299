import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface DiegoQuestion {
  id: number;
  question: string;
  options: { text: string; correct: boolean }[];
  feedback: { correct: string; incorrect: string };
}

const questions: DiegoQuestion[] = [
  {
    id: 1,
    question: '¿Qué aprendió Diego?',
    options: [
      { text: 'A) Que la CNEE cobra más cuando hay cortes', correct: false },
      { text: 'B) Que la CNEE supervisa y vigila que la distribuidora restaure el servicio rápidamente', correct: true },
      { text: 'C) Que la CNEE genera la electricidad en las casas', correct: false },
    ],
    feedback: {
  correct: 'la CNEE supervisa y regula el servicio; cuando hay cortes, vigila que la distribuidora atienda y restablezca la energía.',
  incorrect: 'Diego aprendió que la CNEE supervisa y vela porque la distribuidora resuelva las fallas. No genera energía ni cobra más por los cortes.'
    }
  }
];

interface Props {
  onComplete: () => void;
  onScored?: (correct: number, total: number) => void;
}

export default function DiegoTrivia({ onComplete, onScored }: Props) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const q = questions[current];
  const isLast = current === questions.length - 1;

  const handleAnswer = (index: number) => {
    setSelected(index);
    setShowFeedback(true);
    if (q.options[index].correct) setScore(prev => prev + 1);
  };

  useEffect(() => {
    if (showFeedback && scrollRef.current) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 250);
    }
  }, [showFeedback]);

  const handleContinue = () => {
    if (isLast) {
      if (onScored) {
        onScored(score, questions.length);
      }
      setShowCongratulations(true);
      return;
    }
    setCurrent(current + 1);
    setSelected(null);
    setShowFeedback(false);
  };

  const handleModalContinue = () => {
    setShowCongratulations(false);
    onComplete();
  };

  const isCorrect = selected !== null && q.options[selected].correct;

  return (
    <>
      <LinearGradient
        colors={['#1f2d55', '#2a3f6f', '#1f2d55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.triviaContainer}
      >
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Pregunta {current + 1} de {questions.length}</Text>
          <Text style={styles.scoreText}>Puntuación: {score}/{questions.length}</Text>
        </View>

        <ScrollView ref={scrollRef} style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          <LinearGradient colors={['#2a3f6f', '#1f2d55', '#1f2d55']} style={styles.questionCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Text style={styles.questionText}>{q.question}</Text>

            <View style={styles.multipleChoiceContainer}>
              {q.options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleAnswer(i)}
                  disabled={showFeedback}
                  style={[styles.multipleChoiceButton, selected === i && (opt.correct ? styles.correctButton : styles.incorrectButton)]}
                >
                  <LinearGradient
                    colors={
                      selected === i && showFeedback
                        ? (opt.correct ? ['#28A745', '#20C751'] : ['#DC3545', '#FF4757'])
                        : (showFeedback && opt.correct
                          ? ['#28A745', '#20C751']
                          : ['#2c2c2c', '#1c1c1c'])
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ flex: 1, justifyContent: 'center', paddingVertical: height * 0.02, paddingHorizontal: width * 0.04, borderRadius: 12 }}
                  >
                    <Text style={[styles.multipleChoiceText, (selected === i || (showFeedback && opt.correct)) && styles.selectedAnswerText]}>{opt.text}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>

            {showFeedback && (
              <LinearGradient
                colors={
                  isCorrect
                    ? ['rgba(40, 167, 69, 0.3)', 'rgba(32, 199, 81, 0.2)']
                    : ['rgba(220, 53, 69, 0.3)', 'rgba(255, 71, 87, 0.2)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.feedbackContainer, isCorrect ? styles.correctFeedback : styles.incorrectFeedback]}
              >
                <Text style={styles.feedbackTitle}>{isCorrect ? 'Es correcto porque' : 'Es incorrecto porque'}</Text>
                <Text style={styles.feedbackText}>{isCorrect ? q.feedback.correct : q.feedback.incorrect}</Text>
              </LinearGradient>
            )}
          </LinearGradient>

          {showFeedback && (
            <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
              <LinearGradient colors={['#58CCF7', '#4A9FE7']} style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 16 }}>
                <Text style={styles.continueButtonText}>{isLast ? 'Finalizar Trivia' : 'Continuar'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </ScrollView>
      </LinearGradient>

      {/* Modal de Felicitaciones */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCongratulations}
        onRequestClose={() => setShowCongratulations(false)}
      >
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#2a3f6f', '#1f2d55']}
            style={styles.congratulationsModal}
          >
            <Image
              source={require('../../assets/persona/persona7.png')}
              style={styles.congratulationsImage}
              resizeMode="contain"
            />
            <Text style={styles.congratulationsTitle}>
              ¡Excelente trabajo!
            </Text>
            <Text style={styles.congratulationsMessage}>
              Diego y tú han aprendido juntos sobre la CNEE. ¡Ahora conoces su importante rol!
            </Text>
            <TouchableOpacity style={styles.continueFromModalButton} onPress={handleModalContinue}>
              <LinearGradient
                colors={['#58CCF7', '#4A9FE7']}
                style={styles.continueFromModalGradient}
              >
                <Text style={styles.continueFromModalText}>Continuar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </>
  );
}

