import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import { styles } from './styles';
import TriviaCardScreen5 from '../../components/TriviaCard/TriviaCardScreen5';
import CustomModal from '../../components/CustomModal';
import { useCustomModal } from '../../hooks/useCustomModal';

const { width, height } = Dimensions.get('window');

const lessonSteps = [
  {
    title: 'Trivia - ¡Pon a prueba tu conocimiento!',
    description: 'Responde las siguientes preguntas sobre la CNEE para demostrar lo que has aprendido.',
    isTrivia: true,
  },
  {
    title: '¡Felicitaciones! 🎉',
    description: 'Has completado exitosamente la trivia sobre la CNEE. Ahora conoces mejor el papel fundamental que desempeña esta institución en el sector eléctrico de Guatemala.',
    image: require('../../assets/cnee.png'),
    isCompletion: true,
  },
];

export default function TriviaScreen5() {
  const [step, setStep] = useState(0);
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];
  const { modalConfig, isVisible, hideModal, showSuccess } = useCustomModal();

  const handleNext = () => {
    if (step < lessonSteps.length - 1) {
      setStep(step + 1);
    }
  };

  const handleFinish = () => {
    showSuccess(
      '¡Trivia completada! 🎉', 
      'Has demostrado un excelente conocimiento sobre la CNEE y su importante papel en el sector eléctrico de Guatemala.'
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Logo */}
      <Image
        source={require('../../assets/icon.png')}
        style={{
          position: 'absolute',
          top: height * 0.02,
          right: width * 0.04,
          width: width * 0.25,
          height: height * 0.05,
          zIndex: 99,
          opacity: 0.95,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            },
            android: {
              elevation: 4,
            },
          }),
        }}
        resizeMode="contain"
      />

      {/* Contenido scrolleable */}
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* Título */}
        <Text style={styles.title}>{current.title}</Text>

        {/* Contenido */}
        {current.isTrivia ? (
          <TriviaCardScreen5 onComplete={handleNext} />
        ) : (
          <>
            {current.image && <Image source={current.image} style={styles.image} />}
            {/* Tarjeta de información */}
            <View style={styles.descriptionCard}>
              <ScrollView
                style={styles.descriptionScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.description}>{current.description}</Text>
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>

      {/* Elementos fijos en la parte inferior - Ocultos durante la trivia */}
      {!current.isTrivia && (
        <View style={styles.fixedBottom}>
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
                  i === step && styles.activeCircle,
                  { backgroundColor: i === step ? '#58CCF7' : 'rgba(255, 255, 255, 0.1)' },
                ]}
              />
            ))}
          </View>

          {/* Botón continuar o finalizar */}
          {step < lessonSteps.length - 1 && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          )}

          {step === lessonSteps.length - 1 && (
            <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={handleFinish}>
              <Text style={styles.buttonText}>Finalizar trivia</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal personalizado hermoso */}
      {modalConfig && (
        <CustomModal
          visible={isVisible}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
          buttons={modalConfig.buttons}
          onClose={hideModal}
          icon={modalConfig.icon}
        />
      )}
    </SafeAreaView>
  );
}

