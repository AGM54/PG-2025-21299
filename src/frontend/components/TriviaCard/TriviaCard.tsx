import React, { useState, useRef, useEffect } from 'react';
import { logger } from '../../utils/logger';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { auth } from '../../firebase.config';
import { addPoints, logQuizSubmit, addBadge } from '../../src/lib/firestore';

const { width, height } = Dimensions.get('window');

interface TriviaQuestion {
  id: number;
  question: string;
  correct: boolean;
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

const triviaQuestions: TriviaQuestion[] = [
  {
    id: 1,
    question: '¿La CNEE genera electricidad en Guatemala?',
    correct: false,
    feedbackCorrect: 'la CNEE no produce electricidad. Sin embargo, sí supervisa a las empresas que generan y distribuyen energía.',
    feedbackIncorrect: 'la CNEE no genera electricidad. La CNEE regula y supervisa el sector eléctrico, no produce energía.'
  },
  {
    id: 2,
    question: '¿La CNEE se encarga de que la energía que recibimos sea de calidad y sin cortes?',
    correct: true,
    feedbackCorrect: 'la CNEE supervisa la calidad del servicio eléctrico que presta la empresa distribuidora, vigilando que llegue con la potencia adecuada y con menos fallas.',
    feedbackIncorrect: 'en realidad, la CNEE sí tiene la función de supervisar la calidad del servicio que brindan las distribuidoras a los usuarios.'
  },
  {
    id: 3,
    question: '¿La CNEE aplica la Ley General de Electricidad en el país?',
    correct: true,
    feedbackCorrect: 'una de las funciones más importantes de la CNEE es cumplir y hacer cumplir la Ley General de Electricidad y sus reglamentos.',
    feedbackIncorrect: 'la CNEE sí aplica y hace cumplir la Ley General de Electricidad.'
  },
  {
    id: 4,
    question: '¿La CNEE supervisa que las distribuidoras cumplan sus obligaciones con los usuarios?',
    correct: true,
    feedbackCorrect: 'una función de la CNEE es supervisar que las empresas distribuidoras brinden un servicio de calidad a los usuarios.',
    feedbackIncorrect: 'en realidad, la CNEE cumple esta función de supervisión a las distribuidoras.'
  },
  {
    id: 5,
    question: '¿La CNEE vigila que las empresas del sector eléctrico actúen correctamente?',
    correct: true,
    feedbackCorrect: 'la CNEE supervisa y puede sancionar a las empresas del sector que no cumplen sus obligaciones.',
    feedbackIncorrect: 'la CNEE sí vigila el comportamiento de las empresas del sector.'
  },
  {
    id: 6,
    question: '¿La CNEE decide cuánto pueden cobrar las distribuidoras por llevar la energía a los hogares?',
    correct: true,
    feedbackCorrect: 'la CNEE define y autoriza las tarifas que las distribuidoras pueden cobrar a los usuarios residenciales.',
    feedbackIncorrect: 'la CNEE sí participa en la regulación y autorización de tarifas para los usuarios residenciales.'
  },
  {
    id: 7,
    question: '¿La CNEE resuelve conflictos entre empresas del sector eléctrico?',
    correct: true,
    feedbackCorrect: 'la CNEE puede mediar y resolver disputas entre actores del sector.',
    feedbackIncorrect: 'la CNEE sí puede mediar en desacuerdos entre empresas del sector.'
  },
  {
    id: 8,
    question: '¿La CNEE establece normas y permite el uso de las redes eléctricas?',
    correct: true,
    feedbackCorrect: 'la CNEE crea normas técnicas que permiten el uso ordenado y seguro de las redes eléctricas.',
    feedbackIncorrect: 'la CNEE sí establece normas que regulan el uso de las redes.'
  }
];

interface TriviaCardProps {
  onComplete: () => void;
  onScored?: (correct: number, total: number) => void;
}

export default function TriviaCard({ onComplete, onScored }: TriviaCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [startTime] = useState(Date.now());

  const question = triviaQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === triviaQuestions.length - 1;

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === question.correct) {
      setScore(score + 1);
    }
  };

  const handleContinue = async () => {
    if (isLastQuestion) {
      // Calcular tiempo total
      const timeMs = Date.now() - startTime;
      const uid = auth.currentUser?.uid;
      
      if (uid) {
        // Agregar puntos (10 puntos por respuesta correcta)
        const earnedPoints = score * 10;
        await addPoints(uid, earnedPoints);
        
        // Registrar quiz completado
        await logQuizSubmit(uid, 'CNEE_Trivia', score, triviaQuestions.length, timeMs);
        
        // Agregar badges según desempeño
        const percentage = (score / triviaQuestions.length) * 100;
        if (percentage === 100) {
          await addBadge(uid, 'Experto CNEE');
        } else if (percentage >= 75) {
          await addBadge(uid, 'Conocedor CNEE');
        }
        
        logger.log(`🎯 Trivia completada: ${score}/${triviaQuestions.length} - ${earnedPoints} puntos`);
      }
      
      // Reportar puntuación al padre
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

  const isCorrect = selectedAnswer === question.correct;

  return (
    <>
      <LinearGradient
        colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#2a3f6f', '#1f2d55']}
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

      <View
        style={[styles.scrollContainer, styles.scrollContent]}
      >
        <LinearGradient
          colors={['#2a3f6f', '#1f2d55', '#1f2d55']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questionCard}
        >
          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.answersContainer}>
            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedAnswer === true && (isCorrect ? styles.correctButton : styles.incorrectButton)
              ]}
              onPress={() => handleAnswer(true)}
              disabled={showFeedback}
            >
              <LinearGradient
                colors={
                  selectedAnswer === true 
                    ? (isCorrect ? ['#28A745', '#20C751'] : ['#DC3545', '#FF4757'])
                    : ['#2a3f6f', '#1f2d55']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}
              >
                <Text style={[
                  styles.answerText,
                  selectedAnswer === true && styles.selectedAnswerText
                ]}>
                  ✅ Sí
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.answerButton,
                selectedAnswer === false && (isCorrect ? styles.correctButton : styles.incorrectButton)
              ]}
              onPress={() => handleAnswer(false)}
              disabled={showFeedback}
            >
              <LinearGradient
                colors={
                  selectedAnswer === false 
                    ? (isCorrect ? ['#28A745', '#20C751'] : ['#DC3545', '#FF4757'])
                    : ['#2c2c2c', '#1c1c1c']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 12 }}
              >
                <Text style={[
                  styles.answerText,
                  selectedAnswer === false && styles.selectedAnswerText
                ]}>
                  ❌ No
                </Text>
              </LinearGradient>
            </TouchableOpacity>
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
                {isCorrect ? question.feedbackCorrect : question.feedbackIncorrect}
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
      </View>
    </LinearGradient>

    {/* Modal de felicitaciones removido - padre maneja la retroalimentación */}
  </>);
}


