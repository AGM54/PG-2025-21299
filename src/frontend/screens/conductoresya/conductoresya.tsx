import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../Electricidad/Generacion/generacionStyles';
import TriviaCard from '../../components/TriviaCard';

const { width, height } = Dimensions.get('window');

const steps = [
  {
    title: '⚡ ¿Qué son los conductores eléctricos?',
    description:
      'Son materiales que permiten que la electricidad fluya fácilmente a través de ellos, gracias a que sus electrones se mueven con libertad.\n\n📘 Ejemplos comunes:\n• Cobre (muy usado en cables eléctricos)\n• Aluminio\n• Oro y plata (excelentes conductores, pero costosos)\n• Agua con sales (por eso no debemos manipular aparatos eléctricos mojados)',
    image: require('../../assets/conductoress.png'),
  },
  {
    title: '🧠 Dato curioso',
    description:
      'El cobre es el conductor más usado en instalaciones eléctricas por su buen rendimiento y precio accesible.',
    image: require('../../assets/cobre.png'),
  },
  {
    title: '🚫 ¿Qué son los aislantes eléctricos?',
    description:
      'Son materiales que dificultan el movimiento de electrones, por lo que no conducen electricidad fácilmente.\n\n📘 Ejemplos comunes:\n• Plástico\n• Vidrio\n• Madera seca\n• Caucho\n• Cerámica',
    image: require('../../assets/aislantes.png'),
  },
  {
    title: '💡 ¿Para qué sirven los aislantes?',
    description:
      'Los aislantes se utilizan para protegernos del contacto directo con la corriente eléctrica.',
    image: require('../../assets/protector.png'),
  },
  {
    isTrivia: true,
    title: 'Trivia: ¿Cuál de estos es un aislante?',
    question: '¿Cuál de estos es un aislante?',
    options: [
      { label: 'Aluminio', correct: false },
      { label: 'Cobre', correct: false },
      { label: 'Plástico', correct: true },
      { label: 'Agua con sal', correct: false },
    ],
    explanation: '✅ ¡Correcto! El plástico es un material que impide el paso de electricidad, por eso es un aislante.',
  },
  {
    isTrivia: true,
    title: 'Trivia: ¿Qué material es un buen conductor?',
    question: '¿Cuál de los siguientes materiales es un buen conductor eléctrico?',
    options: [
      { label: 'Vidrio', correct: false },
      { label: 'Cobre', correct: true },
      { label: 'Madera seca', correct: false },
      { label: 'Plástico', correct: false },
    ],
    explanation: '✅ ¡Correcto! El cobre es ampliamente usado como conductor por su eficiencia y precio.',
  },
  {
    isTrivia: true,
    title: 'Trivia: ¿Cuál de estos NO es un buen conductor?',
    question: '¿Cuál de estos materiales no permite el paso fácil de electricidad?',
    options: [
      { label: 'Aluminio', correct: false },
      { label: 'Oro', correct: false },
      { label: 'Caucho', correct: true },
      { label: 'Cobre', correct: false },
    ],
    explanation: '✅ ¡Correcto! El caucho es un excelente aislante, por eso recubre cables eléctricos.',
  },
  {
    isTrivia: true,
    title: 'Trivia: ¿Qué afirmación es verdadera?',
    question: '¿Qué afirmación sobre conductores y aislantes es correcta?',
    options: [
      { label: 'El vidrio conduce muy bien la electricidad', correct: false },
      { label: 'El plástico es un conductor económico', correct: false },
      { label: 'El cobre es un excelente conductor', correct: true },
      { label: 'La madera mojada es un buen aislante', correct: false },
    ],
    explanation: '✅ ¡Correcto! El cobre es un excelente conductor, por eso se usa en casi todos los cables eléctricos.',
  }
];

export default function ConductoresYaScreen() {
  const [step, setStep] = useState(0);
  const progress = (step + 1) / steps.length;
  const navigation = useNavigation();

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      navigation.navigate('Electricidad');
    }
  };

  const current = steps[step];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Image
          source={require('../../assets/icon.png')}
          style={{
            position: 'absolute',
            top: 10,
            right: 16,
            width: width * 0.25,
            height: height * 0.05,
            zIndex: 99,
          }}
          resizeMode="contain"
        />

        <Text style={styles.title}>{current.title}</Text>

        {current.isTrivia ? (
          <TriviaCard
            question={current.question}
            options={current.options}
            explanation={current.explanation}
            onNext={handleNext}
            isLast={step === steps.length - 1}
          />
        ) : (
          <>
            {current.image && (
              <Image
                source={current.image}
                style={styles.image}
                resizeMode="contain"
              />
            )}
            <Text style={[styles.description, { textAlign: 'justify' }]}> 
              {current.description}
            </Text>
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>
                {step === steps.length - 1 ? 'Finalizar' : 'Continuar'}
              </Text>
            </TouchableOpacity>
          </>
        )}

        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

