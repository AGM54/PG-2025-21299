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
import styles from './generacionStyles';
import TriviaCard from '../../../components/TriviaCard';
import ImageTriviaCard from '../../../components/ImageTriviaCard';
import ClasificaCorrienteGame from './ClasificaCorrienteGame';

const { width, height } = Dimensions.get('window');

const lessonSteps = [
  {
    title: '¿Qué es la generación de electricidad?',
    description:
      'La corriente eléctrica es el movimiento continuo y ordenado de electrones a través de un material conductor, como un cable de cobre. Este flujo se genera cuando los electrones se desplazan debido a una diferencia de potencial eléctrico, conocida como voltaje. Dicho de forma sencilla: la corriente eléctrica es como un río de electrones que viajan por los cables llevando energía a los aparatos eléctricos.',
    image: require('../../../assets/flujo.png'),
  },
  {
    title: '¿Qué se necesita?',
    description:
      'Para que exista corriente eléctrica, debe haber un circuito cerrado que permita a los electrones circular desde una fuente de energía hasta una carga (como un foco o un ventilador) y regresar.',
    image: require('../../../assets/ventilador.png'),
  },
  {
    title: '🧠 Trivia: ¿Cuál es una fuente renovable?',
    isTrivia: true,
    question: '¿Cuál es una fuente de energía renovable?',
    options: [
      { label: 'Carbón', correct: false },
      { label: 'Sol', correct: true },
      { label: 'Petróleo', correct: false },
      { label: 'Gas natural', correct: false },
    ],
  },
  {
    title: 'Corriente continua (DC - Direct Current)',
    description:
      'En este tipo de corriente, los electrones se mueven siempre en la misma dirección.',
    image: require('../../../assets/continua.png'),
  },
  {
    title: 'Ejemplo',
    description:
      'Cuando conectas un control remoto con baterías, los electrones viajan en una sola dirección desde el polo negativo al polo positivo.',
    image: require('../../../assets/ejemplo.png'),
  },
  {
    title: 'Corriente alterna (AC - Alternating Current)',
    description:
      'En este caso, los electrones no siguen una sola dirección, sino que cambian de dirección muchas veces por segundo (en Guatemala, 60 veces por segundo, o 60 Hz). Es el tipo de corriente que se usa para alimentar nuestros hogares, escuelas y empresas.',
    image: require('../../../assets/alterna.png'),
  },
  {
    title: 'Trivia: Ventaja de la corriente alterna',
    isTriviaImage: true,
    triviaType: 'acVentaja',
  },
  {
    title: 'Ejemplo',
    description:
      'La electricidad que llega a los tomacorrientes de tu casa es corriente alterna. Esto significa que los electrones no se mueven en una sola dirección, sino que cambian de dirección muchas veces por segundo.',
    image: require('../../../assets/toma.png'),
  },
  {
    title: '¿Por qué existen dos tipos de corriente?',
    description:
      '• La corriente continua es ideal para aparatos electrónicos sensibles y para almacenar energía en baterías.\n\n• La corriente alterna, en cambio, es más fácil y eficiente de transportar a través de largas distancias, por eso se usa en las redes eléctricas.',
  },
  {
    title: 'Trivia: Edison vs. Tesla ⚡',
    isImageTrivia: true,
    triviaType: 'edisonTesla',
  },
  {
    title: 'Trivia: ¿Cuál usa corriente continua?',
    isImageTrivia: true,
    triviaType: 'corrienteContinua',
  },
  {
    title: 'Juego: Clasifica por tipo de corriente ⚡',
    isGame: true,
  },
  {
    title: 'Trivia: ¿Qué pasa si conectas una licuadora a corriente DC?',
    isTrivia: true,
    image: require('../../../assets/licuadora.png'),
    question:
      '¿Qué puede pasar si conectas una licuadora a una batería de corriente continua (DC)?',
    options: [
      { label: 'Funciona mejor que con AC', correct: false },
      { label: 'No funciona o se daña', correct: true },
      { label: 'Se convierte en ventilador', correct: false },
    ],
    explanation:
      'Correcto. Muchos aparatos diseñados para AC no funcionan con DC. Podrías dañarlos.',
  },
  {
    title: 'Trivia: ¿Por qué es importante saber el tipo de corriente?',
    isTrivia: true,
    image: require('../../../assets/enchufe.png'),
    question: '¿Por qué es importante saber el tipo de corriente que necesita un aparato?',
    options: [
      { label: 'Porque puede afectar la velocidad del WiFi', correct: false },
      { label: 'Porque usar el tipo equivocado puede dañarlo', correct: true },
      { label: 'No importa, todos los aparatos usan ambos', correct: false },
    ],
    explanation: '✅ ¡Correcto! Identificar el tipo de corriente previene daños y accidentes.',
  },
];

export default function GeneracionScreen() {
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

  const renderImageTrivia = () => {
    switch (current.triviaType) {
      case 'edisonTesla':
        return (
          <ImageTriviaCard
            question="¿Quién apoyaba la corriente alterna?"
            options={[
              {
                label: 'Thomas Edison',
                correct: false,
                image: require('../../../assets/edison.png'),
              },
              {
                label: 'Nikola Tesla',
                correct: true,
                image: require('../../../assets/tesla.png'),
                isLarger: true,
              },
            ]}
            onNext={handleNext}
          />
        );
      case 'corrienteContinua':
        return (
          <ImageTriviaCard
            question="¿Cuál de estos aparatos utiliza corriente continua (DC)?"
            options={[
              {
                label: 'Dispositivos portátiles',
                correct: true,
                image: require('../../../assets/portatil.png'),
              },
              {
                label: 'Televisores',
                correct: false,
                image: require('../../../assets/televisor.png'),
              },
            ]}
            onNext={handleNext}
          />
        );
      case 'acVentaja':
        return (
          <TriviaCard
            image={require('../../../assets/cabless.png')}
            question="¿Cuál es una ventaja clave de la corriente alterna (AC)?"
            options={[
              {
                label: 'Es más fácil de transportar a largas distancias',
                correct: true,
              },
              { label: 'Solo funciona con pilas', correct: false },
              {
                label: 'Tiene menor voltaje que la corriente continua',
                correct: false,
              },
            ]}
            onNext={handleNext}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Image
        source={require('../../../assets/icon.png')}
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

      {current.isImageTrivia || current.isTriviaImage
        ? renderImageTrivia()
        : current.isTrivia ? (
            <TriviaCard
              image={current.image}
              question={current.question}
              options={current.options}
              explanation={current.explanation}
              onNext={step === lessonSteps.length - 1 ? handleFinish : handleNext}
              isLast={step === lessonSteps.length - 1}
            />
          ) : current.isGame ? (
            <ClasificaCorrienteGame onSuccess={handleNext} />
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
            </>
          )}

      <View style={styles.progressBarContainer}>
        <View
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>

      <View style={styles.stepIndicators}>
        {lessonSteps.map((_, i) => (
          <View
            key={i}
            style={[
              styles.circle,
              { backgroundColor: i === step ? '#FF7A00' : '#ccc' },
            ]}
          />
        ))}
      </View>

      {!current.isTrivia &&
        !current.isImageTrivia &&
        !current.isTriviaImage &&
        !current.isGame &&
        step < lessonSteps.length - 1 && (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Continuar</Text>
          </TouchableOpacity>
        )}
    </SafeAreaView>
  );
}

