import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface TriviaQuestion {
  id: number;
  question: string;
  options: {
    text: string;
    correct: boolean;
  }[];
  feedback: {
    correct: string;
    incorrect: string;
  };
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: '¿Quién fija las tarifas eléctricas en Guatemala para los usuarios residenciales?',
    options: [
      { text: 'A) El Congreso', correct: false },
      { text: 'B) La CNEE', correct: true },
      { text: 'C) Las empresas', correct: false }
    ],
    feedback: {
      correct: 'La CNEE define y autoriza los precios de la energía eléctrica para los usuarios residenciales.',
      incorrect: 'La CNEE es la entidad que define y autoriza los precios de energía para los usuarios residenciales; esa es la respuesta correcta.'
    }
  },
  {
    id: 2,
    question: '¿Qué hace la CNEE si una empresa del sector eléctrico comete una falta?',
    options: [
      { text: 'A) La ignora', correct: false },
      { text: 'B) La supervisa y le puede sancionar', correct: true },
      { text: 'C) Le da un premio', correct: false }
    ],
    feedback: {
      correct: 'La CNEE puede supervisar a la empresa, imponer sanciones o medidas correctivas cuando incumple la normativa.',
      incorrect: 'La CNEE supervisa el cumplimiento normativo y puede sancionar a las empresas que incumplen; por eso B es la respuesta correcta.'
    }
  },
  {
    id: 3,
    question: '¿La CNEE genera energía?',
    options: [
      { text: 'A) Sí', correct: false },
      { text: 'B) No, solo regula el sector eléctrico', correct: true },
      { text: 'C) Solo en la capital', correct: false }
    ],
    feedback: {
      correct: 'La CNEE no produce energía: su función principal es regular, supervisar y normar el sector eléctrico.',
      incorrect: 'La CNEE no genera energía; regula el sector y supervisa a las empresas que generan y distribuyen energía.'
    }
  }
];

interface TriviaCardScreen5Props {
  onComplete: () => void;
  onScored?: (correct: number, total: number) => void;
}

export default function TriviaCardScreen5({ onComplete, onScored }: TriviaCardScreen5Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const question = triviaQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === triviaQuestions.length - 1;

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
    setShowFeedback(true);

    if (question.options[optionIndex].correct) {
      setScore(score + 1);
    }
  };

  // Scroll automático cuando aparece el feedback
  useEffect(() => {
    if (showFeedback && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [showFeedback]);

  const handleContinue = () => {
    if (isLastQuestion) {
      // Reportar puntuación
      if (onScored) {
        onScored(score, triviaQuestions.length);
      }
      // Llamar onComplete inmediatamente, sin modal interno
      onComplete();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const isCorrect = selectedAnswer !== null && question.options[selectedAnswer].correct;

  return (
    <>
      <LinearGradient
        colors={['#1f2d55', '#2a3f6f', '#1f2d55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.triviaContainer}
      >
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Pregunta {currentQuestion + 1} de {triviaQuestions.length}
        </Text>
        <Text style={styles.scoreText}>
          Puntuación: {score}/{triviaQuestions.length}
        </Text>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
      >
        <LinearGradient
          colors={['#2a3f6f', '#1f2d55', '#1f2d55']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questionCard}
        >
          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.multipleChoiceContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.multipleChoiceButton,
                  selectedAnswer === index && (
                    option.correct ? styles.correctButton : styles.incorrectButton
                  ),
                  showFeedback && option.correct && styles.correctButton
                ]}
                onPress={() => handleAnswer(index)}
                disabled={showFeedback}
              >
                <LinearGradient
                  colors={
                    selectedAnswer === index && showFeedback
                      ? (option.correct ? ['#28A745', '#20C751'] : ['#DC3545', '#FF4757'])
                      : (showFeedback && option.correct
                        ? ['#28A745', '#20C751']
                        : ['#2c2c2c', '#1c1c1c'])
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ flex: 1, justifyContent: 'center', paddingVertical: height * 0.02, paddingHorizontal: width * 0.04, borderRadius: 12 }}
                >
                  <Text style={[
                    styles.multipleChoiceText,
                    (selectedAnswer === index || (showFeedback && option.correct)) && styles.selectedAnswerText
                  ]}>
                    {option.text}
                  </Text>
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
              style={[
                styles.feedbackContainer,
                isCorrect ? styles.correctFeedback : styles.incorrectFeedback
              ]}
            >
              <Text style={styles.feedbackTitle}>
                {isCorrect ? 'Es correcto porque' : 'Es incorrecto porque'}
              </Text>
              <Text style={styles.feedbackText}>
                {isCorrect ? question.feedback.correct.replace(/^\s*(¡?Correcto!?|Correcto:|Incorrecto:?)/i, '').trim() : question.feedback.incorrect.replace(/^\s*(¡?Correcto!?|Correcto:|Incorrecto:?)/i, '').trim()}
              </Text>
            </LinearGradient>
          )}
        </LinearGradient>

        {showFeedback && (
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={['#58CCF7', '#4A9FE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 16 }}
            >
              <Text style={styles.continueButtonText}>
                {isLastQuestion ? 'Finalizar Trivia' : 'Continuar'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>

    {/* Modal de felicitaciones removido - padre maneja la retroalimentación */}
  </>);
}

