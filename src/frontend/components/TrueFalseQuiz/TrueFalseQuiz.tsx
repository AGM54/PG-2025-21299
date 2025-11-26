import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string | { correct: string; incorrect: string };
}

const defaultQuestions: Question[] = [
  {
    question: 'La CNEE instala los cables de energía en tu colonia.',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 1,
    explanation: {
      correct: 'La CNEE supervisa, pero son las empresas distribuidoras quienes instalan los cables.',
      incorrect: 'La CNEE supervisa, pero son las empresas distribuidoras quienes instalan los cables.'
    }
  },
  {
    question: 'La CNEE supervisa que el servicio eléctrico sea de calidad.',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 0,
    explanation: {
      correct: '¡Correcto! La CNEE vigila que las empresas distribuidoras brinden un servicio de calidad.',
      incorrect: 'En realidad, la CNEE sí supervisa que el servicio que brinda la distribuidora sea de calidad.'
    }
  },
  {
    question: 'Tú pagas según lo que marca el contador.',
    options: ['Verdadero', 'Falso'],
    correctAnswer: 0,
    explanation: {
      correct: 'Solo pagas por la electricidad que consumes.',
      incorrect: 'En realidad, pagas según lo que registra el contador: solo por la electricidad que consumes.'
    }
  }
];

interface Props {
  onComplete: () => void;
  questions?: Question[];
  // Optional: report total score to parent when quiz completes
  onScored?: (correct: number, total: number) => void;
}

export default function TrueFalseQuiz({ onComplete, questions = defaultQuestions, onScored }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);

  // Función para limpiar emojis de las opciones
  const cleanOption = (option: string) => {
    // Elimina emojis comunes y espacios al inicio
    return option.replace(/[\u2705\u274C\u2728\u2B50\uD83C-\uDBFF\uDC00-\uDFFF]+/g, '').trim();
  };

  // Limpia explicaciones para evitar duplicar frases como "La respuesta es correcta porque" o "¡Correcto!"
  const cleanExplanation = (raw?: string): string => {
    if (!raw) return '';
    // Quitar marcas como ¡Correcto!, Incorrecto., La respuesta es correcta porque, La respuesta es incorrecta porque, Tu respuesta es correcta porque, etc.
    let cleaned = raw.trim();
    // Remove leading punctuation/markers
    cleaned = cleaned.replace(/^\u00A1?\s*Correcto[!¡]?\s*/i, '');
    cleaned = cleaned.replace(/^\s*Incorrecto[.!]?\s*/i, '');
    cleaned = cleaned.replace(/^\s*La respuesta es correcta porque\s*/i, '');
    cleaned = cleaned.replace(/^\s*La respuesta es incorrecta porque\s*/i, '');
    cleaned = cleaned.replace(/^\s*Tu respuesta es correcta porque\s*/i, '');
    cleaned = cleaned.replace(/^\s*Tu respuesta es incorrecta porque\s*/i, '');
    // Also remove leading punctuation like ':' or '-'
    cleaned = cleaned.replace(/^[\-:\s]+/, '');
    return cleaned.trim();
  };

  const handleAnswer = (answerIndex: number) => {
    const correct = answerIndex === questions[currentQuestion].correctAnswer;
    setSelectedAnswer(answerIndex);
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setQuizComplete(true);
      // Report final score to parent for module aggregation
      if (onScored) {
        onScored(score, questions.length);
      }
      // Call onComplete immediately when using onScored pattern
      // Parent decides whether to show modal or just advance
      onComplete();
    }
  };

  const current = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <View style={styles.container}>
      {/* Barra de progreso */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Pregunta {currentQuestion + 1} de {questions.length}</Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#58CCF7', '#60A5FA', '#3B82F6', '#2563EB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.progressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
      </View>

      {/* Pregunta */}
      <LinearGradient
        colors={['#1e3a5f', '#2a4a7c', '#3a5a8c', '#4a6a9c']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.questionCard}
      >
        <Text style={styles.questionText}>{current.question}</Text>
      </LinearGradient>

      {/* Botones de respuesta */}
      <View style={styles.answersContainer}>
        {current.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.answerButton,
              selectedAnswer === index && {
                borderWidth: 3,
                borderColor:
                  index === current.correctAnswer ? '#28A745' : '#DC3545',
              }
            ]}
            onPress={() => handleAnswer(index)}
            disabled={showFeedback}
          >
            <LinearGradient
              colors={
                selectedAnswer === index
                  ? (index === current.correctAnswer
                      ? ['#10b981', '#34d399', '#6ee7b7']
                      : ['#ef4444', '#f87171', '#fca5a5'])
                  : ['#1e3a5f', '#2a4a7c', '#3a5a8c']
              }
              style={styles.answerButtonGradient}
            >
              <Text style={styles.answerButtonText}>
                {cleanOption(option)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Score */}
      <Text style={styles.scoreText}>Tu puntuación: {score}/{questions.length}</Text>

      {/* Modal de Feedback con diseño mejorado */}
      <Modal transparent visible={showFeedback} animationType="fade">
        <View style={styles.modalOverlay}>
          <View
            style={{
              width: width * 0.9,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: isCorrect ? '#28A745' : '#DC3545',
              overflow: 'hidden',
              shadowColor: isCorrect ? '#28A745' : '#DC3545',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.6,
              shadowRadius: 15,
              elevation: 15,
            }}
          >
            <LinearGradient
              colors={
                isCorrect
                  ? ['#1e3a5f', '#2a4a7c', '#10b981']
                  : ['#1e3a5f', '#2a4a7c', '#ef4444']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ padding: width * 0.06 }}
            >
              <Text style={styles.feedbackTitle}>
                {isCorrect ? 'Es correcto porque' : 'Es incorrecto porque'}
              </Text>
              <Text style={styles.feedbackMessage}>
                {isCorrect 
                  ? (typeof current.explanation === 'object' ? cleanExplanation(current.explanation.correct) : cleanExplanation(current.explanation as string) || '')
                  : (typeof current.explanation === 'object' ? cleanExplanation(current.explanation.incorrect) : cleanExplanation(current.explanation as string) || '') + '\n\nLa opción correcta es: ' + current.options[current.correctAnswer]
                }
              </Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
                <LinearGradient
                  colors={['#58CCF7', '#4A9FE7', '#3B82F6']}
                  style={styles.nextButtonGradient}
                >
                  <Text style={styles.nextButtonText}>
                    {currentQuestion < questions.length - 1 ? 'Siguiente' : 'Finalizar'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      </Modal>

      {/* Removed internal completion stars overlay to avoid double modal; parent will show persona modal with score */}
    </View>
  );
}

