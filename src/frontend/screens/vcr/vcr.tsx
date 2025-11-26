import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../Electricidad/Generacion/generacionStyles';
import TriviaCard from '../../components/TriviaCard';
import MatchingGame from './MatchingActivity';

const { width, height } = Dimensions.get('window');

const lessonSteps = [
  {
    title: '🔌 Voltaje (V)',
    description:
      'También conocido como diferencia de potencial, es la fuerza que empuja a los electrones a moverse por un circuito.\n\n📏 Unidad de medida: Voltios (V)\n📘 Ejemplo: Si piensas en una manguera, el voltaje sería como la presión del agua. Cuanto mayor es el voltaje, mayor es el “empuje” que tienen los electrones.',
    image: require('../../assets/voltaje.png'),
  },
  {
    title: '🔁 Corriente (I)',
    description:
      'Es la cantidad de electrones que pasa por un punto del circuito en un segundo.\n\n📏 Unidad de medida: Amperios (A)\n📘 Ejemplo: En la manguera, la corriente sería la cantidad de agua que fluye. Si hay más electrones pasando, la corriente es mayor.',
    image: require('../../assets/corrientee.png'),
  },
  {
    title: '🚧 Resistencia (R)',
    description:
      'Es la oposición que presenta un material al paso de los electrones.\n\n📏 Unidad de medida: Ohmios (Ω)\n📘 Ejemplo: La resistencia sería como tener una manguera angosta: impide que el agua (o los electrones) fluyan fácilmente.',
    image: require('../../assets/resistencia.png'),
  },
  {
    title: 'Trivia: ¿Qué representa la resistencia?',
    isTrivia: true,
    question: '¿Cuál de las siguientes opciones describe mejor la resistencia eléctrica?',
    options: [
      { label: 'La cantidad de electrones que pasan por segundo', correct: false },
      { label: 'La oposición al flujo de electrones', correct: true },
      { label: 'La fuerza que empuja los electrones', correct: false },
    ],
    explanation: '✅ ¡Correcto! La resistencia es la oposición que presenta un material al paso de los electrones.',
  },
  {
    title: '🧠 ¡Empareja conceptos con sus definiciones!',
    isGame: true,
  },
  {
    title: '💡 Ejemplo práctico: El ventilador',
    description:
      'Cuando conectas un ventilador a la corriente:\n\n• La energía eléctrica sale del tomacorriente (fuente).\n• Viaja por el cable (conductor).\n• Llega al motor del ventilador (carga), que transforma la energía eléctrica en energía mecánica (giro de aspas).\n• El circuito se completa y el flujo de electrones continúa mientras el ventilador esté encendido.',
    image: require('../../assets/venticeleste.png'),
  },
  {
    title: '¿Por qué es importante la energía eléctrica?',
    description:
      'La energía eléctrica es una de las formas más eficientes, limpias (en el punto de uso) y versátiles de energía.\n\n• Se puede transportar fácilmente a través de cables.\n• Puede transformarse en luz, calor o movimiento.\n• Es la base de casi toda la tecnología moderna.',
    image: require('../../assets/electros.png'),
  },
];

export default function VcrScreen() {
  const [step, setStep] = useState(0);
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];
  const navigation = useNavigation();

  const handleNext = () => {
    if (step < lessonSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleFinish = () => {
    navigation.navigate('Electricidad');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
          image={current.image}
          question={current.question}
          options={current.options}
          explanation={current.explanation}
          onNext={step === lessonSteps.length - 1 ? handleFinish : handleNext}
          isLast={step === lessonSteps.length - 1}
        />
      ) : current.isGame ? (
       <MatchingGame onNext={handleNext} />

      ) : (
        <>
          {current.image && (
            <Image
              source={current.image}
              style={styles.image}
              resizeMode="contain"
            />
          )}
          <Text style={[styles.description, { textAlign: 'justify' }]}>{current.description}</Text>
        </>
      )}

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      {!current.isTrivia && !current.isGame && step < lessonSteps.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      )}

      {!current.isTrivia && !current.isGame && step === lessonSteps.length - 1 && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#f77f00' }]} onPress={handleFinish}>
          <Text style={styles.buttonText}>Finalizar</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

