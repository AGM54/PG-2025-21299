import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface StorySlide {
  image: any;
  title: string;
  description: string;
}

interface StoryCardProps {
  onComplete: () => void;
  // If true, skip internal final modals/overlays and let parent handle completion UI
  suppressCompletionModal?: boolean;
}

const storySlides: StorySlide[] = [
  {
    image: require('../../assets/historia1.png'),
    title: 'Se va la luz',
    description: 'Diego está en su cuarto, se va la energía: "¡Nooo! Se fue la luz justo cuando iba a entregar mi tarea..."',
  },
  {
    image: require('../../assets/historia2.png'),
    title: 'Pregunta a su mamá',
    description: 'Mamá le muestra el recibo: "A la empresa distribuidora la supervisa la CNEE, hijo. Ellos vigilan que la distribuidora dé un buen servicio."',
  },
  {
    image: require('../../assets/historia3.png'),
    title: 'Investiga en Internet',
    description: 'Diego encuentra la página web de la CNEE: "¡Ah! No generan energía, pero revisan los precios de energía y si las empresas lo hacen bien."',
  },
  {
    image: require('../../assets/historia4.png'),
    title: 'Vuelve la luz',
    description: 'La energía regresa: "¡Ya tengo luz! Qué bueno que alguien vigila que el servicio funcione."',
  },
];

const triviaQuestions = [
  {
    question: '¿Qué hace la CNEE cuando se va la luz?',
    options: [
      'La ignora',
      'Vigila que la empresa eléctrica distribuidora resuelva rápido',
      'Cobra más'
    ],
    correctAnswer: 1,
  },
  {
    question: '¿La CNEE genera electricidad?',
    options: [
      'Sí',
      'No, la CNEE regula el sector eléctrico',
      'Solo en fin de mes'
    ],
    correctAnswer: 1,
  },
  {
    question: '¿Por qué volvió la luz a la casa de Diego?',
    options: [
      'Porque el vecino la arregló',
      'Porque la empresa hizo bien su trabajo bajo supervisión',
      'Porque Diego reinició su router'
    ],
    correctAnswer: 1,
  },
];

export default function StoryCard({ onComplete, suppressCompletionModal = false }: StoryCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showTrivia, setShowTrivia] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showSabiasQue, setShowSabiasQue] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleNextSlide = () => {
    if (currentSlide < storySlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      setShowTrivia(true);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === triviaQuestions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    if (correct) {
      setScore(score + 1);
    }
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < triviaQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      if (suppressCompletionModal) {
        onComplete();
      } else {
        setShowSabiasQue(true);
      }
    }
  };

  const handleSabiasQueClick = () => {
    if (suppressCompletionModal) {
      onComplete();
    } else {
      setShowModal(true);
    }
  };

  const handleFinish = () => {
    setShowModal(false);
    onComplete();
  };

  // Mostrar modal "Sabías que..."
  if (!suppressCompletionModal && showModal) {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../../assets/sabiasque.png')}
              style={styles.sabiasQueImage}
              resizeMode="contain"
            />
            <Text style={styles.sabiasQueText}>
              La CNEE se financia con una tasa del 0.3% sobre la venta de energía por parte de las empresas distribuidoras, no con nuestros impuestos.
            </Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleFinish}>
              <Text style={styles.closeButtonText}>Finalizar lección</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  // Mostrar botón "Sabías que..."
  if (!suppressCompletionModal && showSabiasQue) {
    return (
      <View style={styles.container}>
        <Text style={styles.storyTitle}>¡Historia completada!</Text>
        <Text style={styles.finalText}>
          La CNEE trabaja para que todos tengamos electricidad de calidad, segura, confiable y justa. ¡Como Diego, ahora tú también sabes qué hace!
        </Text>
        <Text style={styles.scoreText}>Tu puntuación: {score}/{triviaQuestions.length}</Text>
        
        <TouchableOpacity style={styles.sabiasQueButton} onPress={handleSabiasQueClick}>
          <Text style={styles.sabiasQueButtonText}>¿SABÍAS QUE...?</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Mostrar trivia
  if (showTrivia) {
    const question = triviaQuestions[currentQuestion];
    
    return (
      <View style={styles.container}>
        <Text style={styles.triviaTitle}>¿Qué aprendió Diego?</Text>
        <Text style={styles.questionNumber}>Pregunta {currentQuestion + 1} de {triviaQuestions.length}</Text>
        
        <View style={styles.questionCard}>
          <Text style={styles.questionText}>{question.question}</Text>
          
          <View style={styles.optionsContainer}>
            {question.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === index && styles.selectedOption,
                  showResult && index === question.correctAnswer && styles.correctOption,
                  showResult && selectedAnswer === index && index !== question.correctAnswer && styles.incorrectOption,
                ]}
                onPress={() => !showResult && handleAnswerSelect(index)}
                disabled={showResult}
              >
                <Text style={[
                  styles.optionText,
                  selectedAnswer === index && styles.selectedOptionText,
                ]}>{String.fromCharCode(65 + index)}) {option}</Text>
                {showResult && index === question.correctAnswer && (
                  <Text style={styles.checkMark}>✅</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
          {showResult && (
            <View style={styles.resultContainer}>
              <Text style={[styles.resultText, { color: isCorrect ? '#4CAF50' : '#f44336' }]}>
                {isCorrect ? '¡Correcto!' : 'Incorrecto'}
              </Text>
              <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                <Text style={styles.nextButtonText}>
                  {currentQuestion < triviaQuestions.length - 1 ? 'Siguiente' : 'Continuar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  }

  // Mostrar historia
  const slide = storySlides[currentSlide];
  
  return (
    <View style={styles.container}>
      <Text style={styles.storyTitle}>Conoce a Diego y cómo descubre la CNEE</Text>
      <Text style={styles.slideNumber}>Slide {currentSlide + 1} de {storySlides.length}</Text>
      
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slideCard}
      >
        <Text style={styles.slideTitle}>{slide.title}</Text>
        
        <View style={{
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: 8,
          marginVertical: 15,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            },
            android: {
              elevation: 8,
            },
          }),
        }}>
          <Image
            source={slide.image}
            style={styles.storyImage}
            resizeMode="contain"
          />
        </View>
        
        <Text style={styles.slideDescription}>{slide.description}</Text>
        
        <TouchableOpacity style={styles.nextSlideButton} onPress={handleNextSlide}>
          <LinearGradient
            colors={['#58CCF7', '#4A9FE7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 20 }}
          >
            <Text style={styles.nextSlideButtonText}>
              {currentSlide < storySlides.length - 1 ? 'Siguiente' : 'Comenzar trivia'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );
}

