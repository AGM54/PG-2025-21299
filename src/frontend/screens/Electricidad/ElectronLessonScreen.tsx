import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import styles from './electronStyles';
import AtomGame from './AtomGame';
import TriviaCard from '../../components/TriviaCard';
import CircuitDropGame from './CircuitDropGame';

const { width, height } = Dimensions.get('window');

const lessonSteps = [
  {
    title: '¿Qué es un electrón?',
    description: 'Un electrón es una partícula subatómica con carga negativa.',
    image: require('../../assets/atomico.png'),
  },
  {
    title: '¿Cómo se mueven los electrones?',
    description: 'Los electrones se desplazan por materiales conductores generando corriente.',
    image: require('../../assets/corriente.png'),
  },
  {
    title: '🧩 Juego interactivo',
    description: 'Arrastra cada parte del átomo al lugar correcto.',
    image: null,
    isGame: true,
  },
  {
    title: '¿Qué es la energía eléctrica?',
    description: 'Es el resultado del movimiento ordenado de electrones impulsados por voltaje.',
    image: require('../../assets/rayo.png'),
  },
  {
    title: '¿Cómo funciona la energía eléctrica?',
    description:
      'La energía eléctrica se produce cuando los electrones se mueven por un conductor. Este movimiento, llamado corriente eléctrica, ocurre gracias a una fuerza llamada voltaje que los impulsa. ¡Así se encienden las luces y funcionan los dispositivos!',
    image: require('../../assets/electricidad.png'),
  },
  {
    title: '¿Por qué es una energía secundaria?',
    description:
      'La energía eléctrica no se encuentra directamente en la naturaleza. Se genera a partir de fuentes primarias como el sol, el viento, el agua o el calor. Por eso se considera una forma de energía secundaria.',
    image: require('../../assets/secundaria.png'),
  },
  {
    title: '🧠 Trivia: ¿De dónde viene la electricidad?',
    isTrivia: true,
  },
  {
    title: '🔌 Juego: Completa el circuito',
    isCircuitGame: true,
  },
];

export default function ElectronLessonScreen() {
  const [step, setStep] = useState(0);
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];

  const handleNext = () => {
    if (step < lessonSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleFinish = () => {
    alert('¡Lección completada! 🎉');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/*  */}
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

      {/*  */}
      {!current.isCircuitGame && (
        <Text style={styles.title}>{current.title}</Text>
      )}

      {/* Contenido dinámico */}
      {current.isGame ? (
        <AtomGame onComplete={handleNext} />
      ) : current.isTrivia ? (
        <TriviaCard
          question="¿Por qué se considera la energía eléctrica una forma secundaria?"
          options={[
            { label: 'Porque se encuentra directamente en la naturaleza', correct: false },
            { label: 'Porque se genera a partir de otras fuentes primarias', correct: true },
            { label: 'Porque no se puede usar en casa', correct: false },
            { label: 'Porque es más débil que otras energías', correct: false },
          ]}
          onNext={handleNext}
        />
      ) : current.isCircuitGame ? (
        <CircuitDropGame onComplete={handleNext} />
      ) : (
        <>
          {current.image && <Image source={current.image} style={styles.image} />}
          <Text style={styles.description}>{current.description}</Text>
        </>
      )}

      {/* Barra de progreso */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Indicadores de pasos */}
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

      {/* Botón continuar o finalizar (excepto para juegos o trivia) */}
      {!current.isGame && !current.isTrivia && !current.isCircuitGame && step < lessonSteps.length - 1 && (
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Continuar</Text>
        </TouchableOpacity>
      )}

      {!current.isGame && !current.isTrivia && !current.isCircuitGame && step === lessonSteps.length - 1 && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#00C853' }]} onPress={handleFinish}>
          <Text style={styles.buttonText}>Finalizar lección</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

