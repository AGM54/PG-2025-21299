import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface ImageTriviaQuestion {
  id: number;
  situation: string;
  image: any;
  correct: boolean;
  feedbackCorrect: string;
  feedbackIncorrect: string;
}

const imageTriviaQuestions: ImageTriviaQuestion[] = [
  {
    id: 1,
    situation: "Se fue la luz y la distribuidora repara el problema",
    image: require('../../assets/sefue.png'),
    correct: true,
    feedbackCorrect: 'la distribuidora identificó y reparó la falla. La CNEE supervisa que esto ocurra.',
    feedbackIncorrect: 'la reparación la realiza la distribuidora, bajo la supervisión de  la CNEE.'
  },
  {
    id: 2,
    situation: "Recibo correcto de luz",
    image: require('../../assets/recibo.png'),
    correct: true,
    feedbackCorrect: 'la CNEE supervisa la facturación y vigila que la factura vaya con la información correcta, cumpliendo labores de fiscalización del servicio.',
    feedbackIncorrect: 'la CNEE participa en la supervisión de la facturación y puede intervenir si hay cobros indebidos.'
  },
  {
    id: 3,
    situation: "Electricista instala un foco en casa",
    image: require('../../assets/electricista.png'),
    correct: false,
    feedbackCorrect: 'la instalación de un foco es un trabajo privado y no es regulado directamente por la CNEE.',
    feedbackIncorrect: 'la CNEE no regula ni realiza trabajos privados de instalación en viviendas. Estas son tareas que realiza un electricista.'
  },
  {
    id: 4,
    situation: "Empresa sube tarifas sin razón",
    image: require('../../assets/sinrazon.png'),
    correct: true,
    feedbackCorrect: 'la CNEE define y autoriza tarifas y puede sancionar aumentos que no estén autorizados.',
    feedbackIncorrect: 'la CNEE tiene competencia para revisar y sancionar aumentos de tarifa injustificados.'
  },
  {
    id: 5,
    situation: "Vecino reclama por mal servicio",
    image: require('../../assets/vecino.png'),
    correct: true,
    feedbackCorrect: 'la CNEE supervisa la atención al usuario y puede intervenir si la distribuidora no resuelve los reclamos.',
    feedbackIncorrect: 'la CNEE supervisa que las empresas distribuidoras brinden un servicio de calidad y atiendan los reclamos de los usuarios.'
  }
];

interface ImageTriviaCardProps {
  onComplete: () => void;
}

export default function ImageTriviaCard({ onComplete }: ImageTriviaCardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const question = imageTriviaQuestions[currentQuestion];
  const isLastQuestion = currentQuestion === imageTriviaQuestions.length - 1;

  const handleAnswer = (answer: boolean) => {
    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === question.correct) {
      setScore(score + 1);
    }
  };

  // Scroll automático cuando aparece el feedback
  useEffect(() => {
    if (showFeedback && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 300); // Pequeño delay para asegurar que el feedback se renderice
    }
  }, [showFeedback]);

  const handleContinue = () => {
    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    }
  };

  const isCorrect = selectedAnswer === question.correct;

  return (
    <LinearGradient
      colors={['#1f2d55', '#2a3f6f', '#1f2d55']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.triviaContainer}
    >
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Situación {currentQuestion + 1} de {imageTriviaQuestions.length}
        </Text>
        <Text style={styles.scoreText}>
          Puntuación: {score}/{imageTriviaQuestions.length}
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
          colors={['#2a3f6f', '#1f2d55', '#3a5a8c']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.questionCard}
        >
          <LinearGradient
              colors={['rgba(31, 45, 85, 0.15)', 'rgba(58, 90, 140, 0.1)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.imageContainer}
            >
            <Image
              source={question.image}
              style={styles.situationImage}
              resizeMode="contain"
            />
          </LinearGradient>

          <Text style={styles.situationText}>{question.situation}</Text>

          <Text style={styles.questionText}>
            ¿Esta situación es regulada por la CNEE?
          </Text>

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

        {/* Botón fuera del LinearGradient de la pregunta para mejor accesibilidad */}
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
                {isLastQuestion ? 'Finalizar Actividad' : 'Continuar'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

