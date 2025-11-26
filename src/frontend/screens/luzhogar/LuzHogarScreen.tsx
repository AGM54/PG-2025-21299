import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStackNavigator';
import TriviaCard from '../../components/TriviaCard/TriviaCard';
import TriviaCardScreen5 from '../../components/TriviaCard/TriviaCardScreen5';
import GlossaryGame from '../../components/GlossaryGame/GlossaryGame_fixed';
import TypewriterList from '../../components/TypewriterText/TypewriterList';
import ImageTriviaCard from '../../components/ImageTriviaCard/ImageTriviaCard';
import StoryCard from '../../components/StoryCard/StoryCard';
import EnergyDragDropGame from '../../components/EnergyDragDropGame/EnergyDragDropGame';
import TrueFalseQuiz from '../../components/TrueFalseQuiz/TrueFalseQuiz';
import SofiaStoryCard from '../../components/SofiaStoryCard/SofiaStoryCard';
import OrderDragDrop from '../../components/OrderDragDrop/OrderDragDrop';
import MultipleChoiceTrivia from '../../components/TriviaCard/MultipleChoiceTrivia';
// Confetti no se usará en este módulo para evitar estrellas/brillos en los modales

import { auth, db } from '../../firebase.config';
import { logger } from '../../utils/logger';
import { saveProgress, incrementCompletedModules, addPoints, addTotalTime, getUserProfile, updateDoc, doc } from '../../src/lib/firestore';
import { useScreenTime } from '../../src/hooks/useScreenTime';

const { width, height } = Dimensions.get('window');

// Detectar si es tablet
const isTablet = width >= 768;

// Función para escalar fuentes de manera responsiva
const scale = (size: number) => {
  if (isTablet) {
    return size * 0.7; // Reducir un 30% en tablets
  }
  return size;
};

// Función para escalar espacios
const scaleSpace = (size: number) => {
  if (isTablet) {
    return size * 0.8; // Reducir un 20% en tablets
  }
  return size;
};

type LuzHogarScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'LuzHogar'>;

interface LessonStep {
  title: string;
  description?: string;
  image?: any;
  isTrivia?: boolean;
  isNewTrivia?: boolean;
  isGlossary?: boolean;
  isAchievements?: boolean;
  isImageTrivia?: boolean;
  isStory?: boolean;
  isDragDrop?: boolean;
  isTrueFalse?: boolean;
  isOrderDragDrop?: boolean;
  isSofiaStory?: boolean;
  isMultipleChoice?: boolean;
  multipleChoiceData?: {
    question: string;
    options: Array<{
      id: string;
      text: string;
      correct: boolean;
    }>;
    // Explanation when the user selects the correct option
    explanationCorrect?: string;
    // Explanation when the user selects an incorrect option
    explanationIncorrect?: string;
  };
}

const lessonSteps: LessonStep[] = [
  {
    title: 'Fuentes de energía en Guatemala',
    description: 'Guatemala genera electricidad usando diferentes recursos naturales: las centrales hidroeléctricas aprovechan la fuerza del agua, los paneles solares captan la energía del sol, los aerogeneradores usan el viento, las plantas de biomasa queman caña de azúcar, y las centrales térmicas utilizan combustibles.',
    image: require('../../assets/principal.png'),
  },
  {
    title: 'Central Hidroeléctrica',
    description: 'Agua de ríos\n\nLas centrales hidroeléctricas aprovechan la fuerza del agua de nuestros ríos para generar electricidad de manera limpia y renovable.',
    image: require('../../assets/hidrocolor.png'),
  },
  {
    title: 'Paneles Solares',
    description: 'Sol\n\nLos paneles solares capturan la energía del sol y la convierten en electricidad, aprovechando uno de nuestros recursos más abundantes.',
    image: require('../../assets/solarcolor.png'),
  },
  {
    title: 'Aerogeneradores',
    description: 'Viento\n\nLos aerogeneradores utilizan la fuerza del viento para hacer girar sus aspas y generar energía eléctrica de forma sostenible.',
    image: require('../../assets/generadorcolor.png'),
  },
  {
    title: 'Planta de Biomasa',
    description: 'Caña de azúcar\n\nLas plantas de biomasa queman residuos de caña de azúcar y otros materiales orgánicos para producir electricidad.',
    image: require('../../assets/biomasaa.png'),
  },
  {
    title: 'Planta Térmica',
    description: 'Combustibles\n\nLas plantas térmicas utilizan combustibles como gas natural o diésel para generar electricidad cuando se necesita más energía.',
    image: require('../../assets/termopng.png'),
  },
  {
    title: 'Conecta las fuentes de energía',
    isDragDrop: true,
  },
  {
    title: 'Líneas de Transmisión',
    description: 'La electricidad viaja por líneas de alto voltaje desde las plantas de generación de energía, pasando por todos los departamentos del país.',
    image: require('../../assets/lineastransmision.png'),
  },
  {
    title: 'Mini quiz interactivo',
    isMultipleChoice: true,
    multipleChoiceData: {
      question: '¿Cómo viaja la electricidad por el país?',
      options: [
        { id: 'A', text: 'A) En camiones eléctricos', correct: false },
        { id: 'B', text: 'B) Por torres de transmisión de alto voltaje', correct: true },
        { id: 'C', text: 'C) Por tubos subterráneos de agua', correct: false }
      ],
      explanationCorrect: 'la electricidad viaja por torres de transmisión de alto voltaje, desde las plantas generadoras hasta llegar a todos los departamentos del país.',
      explanationIncorrect: 'la electricidad no viaja en camiones ni por tubos de agua; viaja por torres de transmisión de alto voltaje que la transportan desde las plantas hasta las distintas regiones.'
    }
  },
  {
    title: 'Distribución en tu colonia y hogar',
    description: 'Las empresas distribuidoras llevan la energía por postes y cables. Llega con la fuerza justa para que la uses con seguridad.',
    image: require('../../assets/casas.png'),
  },
  {
    title: '¿Sabías que...?',
    description: 'La electricidad que llega a tu casa pasa por un transformador que baja el voltaje para que no dañe tus aparatos.',
    image: require('../../assets/sabias.png'),
  },
  {
    title: 'Contador',
    description: 'Registra cuánto consumes\n\nEl contador eléctrico es un dispositivo que mide exactamente cuánta electricidad utiliza tu hogar cada mes, para que pagues lo que consumes.',
    image: require('../../assets/contador.png'),
  },
  {
    title: 'Transformador',
    description: 'Ajusta el voltaje para que sea seguro\n\nLos transformadores reducen el alto voltaje de las líneas de transmisión a un nivel seguro que pueden usar los electrodomésticos de tu casa sin dañarse.',
    image: require('../../assets/transformador.png'),
  },
  {
    title: 'Usuario',
    description: 'Persona que recibe y paga por el servicio\n\nTú, como usuario del servicio eléctrico, recibes la energía en tu hogar y pagas mensualmente según tu consumo registrado en tu contador.',
      image: require('../../assets/usuario.png'),
  },
  {
    title: 'Transporte de Electricidad',
    description: 'La energía eléctrica se transporta desde las plantas generadoras hasta las áreas urbanas y rurales del país a través de una extensa red de torres de transmisión de energía.\n\nA través de montañas, valles y llanuras, estas torres llevan electricidad a todos los guatemaltecos.',
  
  },

  {
    title: 'La CNEE actúa',
    description: 'La CNEE no genera ni distribuye energía, pero supervisa que todo funcione bien. Vigila que las empresas del sector eléctrico cumplan y que las personas reciban un servicio de energía fluido, de calidad y confiable por parte de las empresas distribuidoras.',
  image: require('../../assets/guardian.png'),
  },
  {
    title: '¿Sabías que...?',
    description: 'Guatemala tiene una de las redes eléctricas más extensas de Centroamérica. Miles de kilómetros de cables conectan desde las ciudades más grandes hasta las comunidades más alejadas, garantizando que la energía llegue a todos los rincones del país.',
    image: require('../../assets/expansion.png'),
  },
  {
    title: 'Mini quiz verdadero/falso',
    isTrueFalse: true,
  },
  {
    title: 'Historia de Sofía',
    isSofiaStory: true,
  },
  {
    title: 'Mini quiz sobre Sofía',
    isMultipleChoice: true,
    multipleChoiceData: {
      question: 'Según la historia de Sofía, ¿cuál es la función principal de la CNEE?',
      options: [
        { id: 'A', text: 'A) Generar electricidad en plantas solares', correct: false },
        { id: 'B', text: 'B) Supervisar y regular el sector eléctrico', correct: true },
        { id: 'C', text: 'C) Instalar contadores en las casas', correct: false }
      ],
  explanationCorrect: 'Como aprendió Sofía, la CNEE no genera ni distribuye electricidad, sino que supervisa y regula todo el sector eléctrico para garantizar un servicio de calidad.',
      explanationIncorrect: 'La CNEE no genera ni instala contadores; su función principal es supervisar y regular el sector eléctrico para garantizar un servicio de calidad.'
    }
  },
  {
    title: 'Etapas del viaje de la electricidad',
    
   image: require('../../assets/etapas.png'),
  },
  {
    title: '1. Generación',
    description: '¿Dónde empieza?\nEn las plantas generadoras, que convierten agua, sol, viento, biomasa o combustibles en electricidad.\n\nDato: En Guatemala, más del 60% de la energía proviene de fuentes renovables.',
  image: require('../../assets/pares.png'),
  },
  {
    title: '2. Transmisión',
    description: '¿Cómo se mueve?\nA través de líneas de alto voltaje, sostenidas por grandes torres. Estas líneas llevan la electricidad por todo el país de forma rápida y segura.\n\nDato: Las líneas de transmisión operan con altos voltajes para que no se pierda energía en el camino.',
  image: require('../../assets/distribucion.png'),
  },
  {
    title: '3. Distribución',
    description: '¿Cómo llega a ti?\nLas empresas distribuidoras bajan el voltaje y envían la electricidad por los postes y cables de tu colonia hasta llegar a tu casa. Un contador registra cuánta energía consumes.\n\nDato: ¡Paga solo lo que consumes! La CNEE supervisa que las empresas distribuidoras cobren las tarifas autorizadas.',
  image: require('../../assets/casad.png'),
  },
  {
    title: '',
    isOrderDragDrop: true,
  },
  {
    title: 'En resumen',
    description: 'La luz que usas cada día sigue un recorrido desde la planta de producción hasta tu hogar.\n\nLa CNEE no produce ni distribuye la energía, pero vigila que todo el sistema funcione de forma eficiente, confiable y segura.',
    image: require('../../assets/final.png'),
  },
];

export default function LuzHogarScreen() {
  const [step, setStep] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [moduleCorrect, setModuleCorrect] = useState(0);
  const [moduleTotal, setModuleTotal] = useState(0);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalData, setActivityModalData] = useState<{ title: string; message?: string; scoreText?: string; image: any } | null>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const navigation = useNavigation<LuzHogarScreenNavigationProp>();
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];

  // Track screen time under module name
  useScreenTime('Module/LuzHogar');

  // Cargar progreso guardado al iniciar
  useEffect(() => {
    const loadSavedProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          const { getProgress } = await import('../../src/lib/firestore');
          const progressData = await getProgress(uid);
          if (progressData && progressData['Luz al Hogar']) {
            const savedStep = progressData['Luz al Hogar'].step || 0;
            if (savedStep > 0 && savedStep <= lessonSteps.length) {
              setStep(Math.max(0, savedStep - 1)); // Restar 1 porque step es 0-indexed
            }
          }
          // Cargar puntos actuales
          const profile = await getUserProfile(uid);
          setCurrentUserPoints(profile?.points || 0);
        } catch (error) {
          logger.error('Error cargando progreso:', error);
        }
      }
    };
    loadSavedProgress();
  }, []);

  // Personas para rotación en modales de retroalimentación (evitar repetir solo persona7)
  const personaCycle = useRef([
    require('../../assets/persona/persona7.png'),
    require('../../assets/persona/persona8.png'),
    require('../../assets/persona/persona9.png'),
    require('../../assets/persona/persona10.png'),
    require('../../assets/persona/persona11.png'),
  ]).current;
  const personaIdxRef = useRef(0);
  const getNextPersonaImage = () => {
    const idx = personaIdxRef.current;
    personaIdxRef.current = (idx + 1) % personaCycle.length;
    return personaCycle[idx];
  };

  // Animation values for curious fact
  const lightningOpacity = useRef(new Animated.Value(0)).current;
  const factScale = useRef(new Animated.Value(0.8)).current;

  // Steps with long info that require scroll to enable continue
  const infoStepsWithScroll: string[] = [];

  const isScrollBlockStep = infoStepsWithScroll.includes(current.title);

  // Reset scroll state when step changes
  useEffect(() => {
    setHasScrolledToEnd(!isScrollBlockStep);
    setTypewriterComplete(false);
  }, [step, isScrollBlockStep]);

  // Detectar scroll al final para pasos informativos largos
  const handleScroll = (event: any) => {
    if (isScrollBlockStep) {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
      setHasScrolledToEnd(isEnd);
    }
  };

  // Lightning animation effect
  useEffect(() => {
    if (current.title === 'Transporte de Electricidad') {
      // Start lightning animation
      const lightningAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(lightningOpacity, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(lightningOpacity, {
            toValue: 0.3,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(lightningOpacity, {
            toValue: 1,
            duration: 150,
            useNativeDriver: true,
          }),
          Animated.timing(lightningOpacity, {
            toValue: 0.5,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      );

      // Start fact scale animation
      const scaleAnimation = Animated.spring(factScale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      });

      lightningAnimation.start();
      scaleAnimation.start();

      return () => {
        lightningAnimation.stop();
        factScale.setValue(0.8);
        lightningOpacity.setValue(0);
      };
    }
  }, [current.title, lightningOpacity, factScale]);

  const handleNext = async () => {
    if (step < lessonSteps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      // Guardar progreso en Firebase
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          await saveProgress(uid, 'Luz al Hogar', {
            step: nextStep + 1, // +1 porque step es 0-indexed pero queremos guardar 1-indexed
            score: moduleTotal > 0 ? Math.round((moduleCorrect / moduleTotal) * 100) : 0,
          });
          logger.log(`✅ Progreso guardado: Paso ${nextStep + 1}/${lessonSteps.length}`);
        } catch (error) {
          logger.error('Error guardando progreso:', error);
        }
      }
    }
  };

  const handleFinish = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        const profile = await getUserProfile(uid);
        
        // Guardar progreso final ANTES de incrementar
        await saveProgress(uid, 'Luz al Hogar', {
          step: lessonSteps.length,
          score: moduleTotal > 0 ? Math.round((moduleCorrect / moduleTotal) * 100) : 100,
        });

        // Incrementar módulos completados solo si es primera vez
        await incrementCompletedModules(uid, 'Luz al Hogar');

        // Calcular y agregar puntos (10 puntos por trivia correcta + bonus por completar módulo)
        const triviaPoints = moduleCorrect * 10;
        const completionBonus = 100;
        const totalPoints = triviaPoints + completionBonus;
        await addPoints(uid, totalPoints);

        // Agregar tiempo total
        const timeSpent = Date.now() - startTimeRef.current;
        await addTotalTime(uid, timeSpent);

        // Recalcular nivel basado en módulos completados reales
        const updatedProfile = await getUserProfile(uid);
        const newLevel = Math.min((updatedProfile?.completedModules || 0) + 1, 5);
        
        // Actualizar nivel si cambió
        if (newLevel > (profile?.level || 1)) {
          const profileRef = doc(db, 'profiles', uid);
          await updateDoc(profileRef, { level: newLevel });
        }

        logger.log(`✅ Módulo Luz al Hogar completado: +${totalPoints} puntos, Nivel: ${newLevel}`);
      } catch (error) {
        logger.error('Error al finalizar módulo:', error);
      }
    }
    
    // Show score modal at end of module instead of immediate navigation
    setShowScoreModal(true);
    // No confetti (estrellas) en este módulo
  };

  // Receive partial scores from trivias
  const handleScoreAccumulate = async (correct: number, total: number) => {
    setModuleCorrect(prev => prev + correct);
    setModuleTotal(prev => prev + total);
    
    // Agregar puntos inmediatamente por cada trivia
    const uid = auth.currentUser?.uid;
    if (uid && correct > 0) {
      const pointsEarned = correct * 10; // 10 puntos por respuesta correcta
      await addPoints(uid, pointsEarned);
      setCurrentUserPoints(prev => prev + pointsEarned);
    }
  };

  // Generic activity modal helpers
  const openActivityModal = (data: { title: string; message?: string; scoreText?: string; image: any }) => {
    setActivityModalData(data);
    setShowActivityModal(true);
    // No confetti (estrellas) en este módulo
  };
  // Helper para abrir modal usando la siguiente persona en ciclo
  const openFeedbackModal = (data: { title: string; message?: string; scoreText?: string }) => {
    openActivityModal({
      ...data,
      image: getNextPersonaImage(),
    });
  };
  const closeActivityModalAndNext = () => {
    setShowActivityModal(false);
    setShowConfetti(false);
    handleNext();
  };

  return (
    <LinearGradient
      colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#2a3f6f', '#1f2d55']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.safeArea}
    >
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
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Título - Oculto para Story y SofiaStory */}
        {!current.isStory && !current.isSofiaStory && (
          <Text style={styles.title}>{current.title}</Text>
        )}
        {/* Contenido */}
        {current.isTrivia ? (
          <TriviaCard onComplete={handleNext} />
        ) : current.isNewTrivia ? (
          <TriviaCardScreen5 onComplete={handleNext} />
        ) : current.isGlossary ? (
          <GlossaryGame onComplete={handleNext} />
        ) : current.isImageTrivia ? (
          <ImageTriviaCard onComplete={handleNext} />
        ) : current.isDragDrop ? (
          <EnergyDragDropGame
            onComplete={() =>
              openActivityModal({
                title: 'Actividad completada',
                message: 'Conectaste correctamente las fuentes de energía.',
                image: require('../../assets/persona/persona6.png'),
              })
            }
            onScored={handleScoreAccumulate}
          />
        ) : current.isTrueFalse ? (
          <TrueFalseQuiz
            onComplete={() => {
              handleNext(); // Avanzar directamente sin modal
            }}
            onScored={(score, total) => {
              handleScoreAccumulate(score, total);
              // No mostrar modal aquí, solo acumular puntaje
            }}
          />
        ) : current.isOrderDragDrop ? (
          <OrderDragDrop
            onComplete={() =>
              openFeedbackModal({
                title: 'Actividad completada',
                message: 'Ordenaste correctamente las etapas del viaje de la electricidad.',
              })
            }
          />
        ) : current.isStory ? (
          <StoryCard
            suppressCompletionModal
            onComplete={() =>
              openFeedbackModal({
                title: 'Historia completada',
                message: 'Has seguido la historia con atención. ¡Sigamos!',
              })
            }
          />
        ) : current.isSofiaStory ? (
          <SofiaStoryCard
            onComplete={() =>
              openFeedbackModal({
                title: 'Historia de Sofía completada',
                message: '¡Excelente! Terminaste la historia de Sofía.',
              })
            }
          />
        ) : current.isMultipleChoice && current.multipleChoiceData ? (
          <MultipleChoiceTrivia 
            question={current.multipleChoiceData.question}
            options={current.multipleChoiceData.options}
            explanationCorrect={current.multipleChoiceData.explanationCorrect || ''}
            explanationIncorrect={current.multipleChoiceData.explanationIncorrect || ''}
            onComplete={() =>
              openFeedbackModal({
                title: 'Quiz completado',
                message: '¡Bien hecho! Continúa con la lección.',
              })
            }
            onScored={(correct, total) => handleScoreAccumulate(correct, total)}
          />
        ) : current.title === 'Etapas del viaje de la electricidad' ? (
          // Solo imagen para "Etapas del viaje de la electricidad", sin recuadro de texto
          current.image && (
            <View style={styles.fullImageContainer}>
              <Image
                source={current.image}
                style={styles.fullImage}
              />
            </View>
          )
        ) : (
          <>
            {current.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={current.image}
                  style={
                    current.title === '¿Cómo llega la electricidad a tu hogar específicamente?' 
                      ? styles.imageCinco 
                      : current.title === 'La CNEE: Tu Guardián Energético'
                      ? { width: width * 0.5, height: width * 0.35, resizeMode: 'contain', alignSelf: 'center' }
                      : styles.image
                  }
                />
              </View>
            )}
            {/* Tarjeta de información con diseño profesional */}
            <LinearGradient
              colors={['rgba(31, 45, 85, 0.9)', 'rgba(31, 45, 85, 0.95)', 'rgba(31, 45, 85, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.descriptionCard,
                current.title === 'La CNEE: Tu Guardián Energético' && {
                  maxHeight: height * 0.35,
                  minHeight: height * 0.2,
                }
              ]}
            >
              {/* Border interior con gradiente */}
              <View style={styles.gradientBorder} />
              
              <ScrollView
                style={styles.descriptionScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                {current.title === '¿Cómo llega la electricidad a tu hogar específicamente?' && current.description ? (
                  <TypewriterList
                    items={current.description.split('\n\n').map(item => item.replace('●  ', '').trim()).filter(item => item.length > 0)}
                    itemStyle={styles.description}
                    speed={25}
                    itemDelay={1200}
                    startDelay={500}
                    onComplete={() => setTypewriterComplete(true)}
                    scrollViewRef={scrollViewRef}
                    autoScroll={false}
                  />
                ) : current.title === 'Transporte de Electricidad' ? (
                  <>
                    <Text style={[styles.description, { fontSize: scale(width * 0.04), lineHeight: scale(width * 0.06) }]}>
                      {current.description?.split('\n\n')[0] || ''}
                    </Text>
                    <Animated.View 
                      style={[
                        {
                          backgroundColor: '#2A4B7C',
                          borderRadius: 12,
                          padding: width * 0.04,
                          marginTop: height * 0.01,
                          borderWidth: 1,
                          borderColor: '#58CCF7',
                          transform: [{ scale: factScale }]
                        }
                      ]}
                    >
                      <LinearGradient
                        colors={['rgba(31, 45, 85, 0.5)', 'rgba(42, 63, 111, 0.6)']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={{
                          borderRadius: 12,
                          padding: scaleSpace(width * 0.04),
                          borderWidth: 1,
                          borderColor: 'rgba(31, 45, 85, 0.8)',
                        }}
                      >
                        <Text style={[styles.curiousFactText, { fontSize: scale(width * 0.038), lineHeight: scale(width * 0.05) }]}>
                          Dato curioso:
                        </Text>
                        <Text style={[styles.curiousFactText, { marginTop: scaleSpace(height * 0.005), fontSize: scale(width * 0.036), lineHeight: scale(width * 0.048) }]}>
                          La electricidad viaja a casi la velocidad de la luz.
                        </Text>
                        {/* Emoji removido para cumplir con requisito de no usar emotes */}
                      </LinearGradient>
                    </Animated.View>
                  </>
                ) : (
                  // Renderizar descripción con títulos centrados cuando aplique
                  current.description?.includes('\n') && 
                  ['Central Hidroeléctrica', 'Paneles Solares', 'Aerogeneradores', 'Planta de Biomasa', 'Planta Térmica'].includes(current.title) ? (
                    <View>
                      {current.description.split('\n').map((line, index) => (
                        <Text 
                          key={index} 
                          style={[
                            styles.description, 
                            index === 0 ? { textAlign: 'center', fontWeight: 'bold', marginBottom: 8 } : {}
                          ]}
                        >
                          {line}
                        </Text>
                      ))}
                    </View>
                  ) : (
                    <Text style={styles.description}>{current.description || ''}</Text>
                  )
                )}
              </ScrollView>
            </LinearGradient>
          </>
        )}
      </ScrollView>

      {/* Elementos fijos en la parte inferior - Ocultos durante la trivia */}
      {!current.isTrivia && !current.isNewTrivia && !current.isGlossary && !current.isImageTrivia && !current.isDragDrop && !current.isStory && !current.isTrueFalse && !current.isSofiaStory && !current.isOrderDragDrop && !current.isMultipleChoice &&
        (!current.title.includes('específicamente') || typewriterComplete) && (
          ((isScrollBlockStep && hasScrolledToEnd) || !isScrollBlockStep) && (
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

              {/* Botón continuar o finalizar, oculto hasta que el usuario lea todo en el paso informativo largo */}
              {step < lessonSteps.length - 1 && (
                  <TouchableOpacity
                    style={[
                      styles.button,
                      (isScrollBlockStep && !hasScrolledToEnd) && styles.disabledButton
                    ]}
                    onPress={handleNext}
                    disabled={isScrollBlockStep && !hasScrolledToEnd}
                  >
                    <Text style={[
                      styles.buttonText,
                      (isScrollBlockStep && !hasScrolledToEnd) && styles.disabledButtonText
                    ]}>
                      {(isScrollBlockStep && !hasScrolledToEnd) ? 'Lee todo el contenido' : 'Continuar'}
                    </Text>
                  </TouchableOpacity>
              )}

              {step === lessonSteps.length - 1 && (
                <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={handleFinish}>
                  <Text style={styles.buttonText}>Finalizar lección</Text>
                </TouchableOpacity>
              )}
            </View>
          )
        )}

  {/* Confetti Effect deshabilitado en este módulo */}

      {/* Activity completion modal with persona image (blue borders, no star effects) */}
      {showActivityModal && activityModalData && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: width * 0.06,
          }}
        >
          <View
            style={{
              width: width * 0.9,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: '#58CCF7',
              overflow: 'hidden',
              backgroundColor: '#1f2d55',
              padding: width * 0.06,
              alignItems: 'center',
            }}
          >
              <Image
                source={activityModalData.image}
                style={{ width: scale(width * 0.35), height: scale(width * 0.35), marginBottom: scaleSpace(height * 0.015) }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: scale(width * 0.06),
                  fontWeight: '900',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginBottom: scaleSpace(height * 0.01),
                }}
              >
                {activityModalData.title}
              </Text>
              {activityModalData.message ? (
                <Text
                  style={{
                    fontSize: scale(width * 0.042),
                    color: '#FFFFFF',
                    opacity: 0.95,
                    textAlign: 'center',
                    marginBottom: scaleSpace(height * 0.01),
                  }}
                >
                  {activityModalData.message}
                </Text>
              ) : null}
              {activityModalData.scoreText ? (
                <Text
                  style={{
                    fontSize: scale(width * 0.07),
                    fontWeight: '800',
                    color: '#FFFFFF',
                    textAlign: 'center',
                    marginBottom: scaleSpace(height * 0.015),
                  }}
                >
                  Nota: {activityModalData.scoreText}
                </Text>
              ) : null}
              <TouchableOpacity onPress={closeActivityModalAndNext} style={{ width: '100%', marginTop: scaleSpace(height * 0.01) }}>
                <LinearGradient
                  colors={['#58CCF7', '#4A9FE7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: scaleSpace(width * 0.04),
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'rgba(88, 204, 247, 0.6)'
                  }}
                >
                  <Text style={{ fontSize: scale(width * 0.05), fontWeight: '800', color: '#FFFFFF' }}>Continuar</Text>
                </LinearGradient>
              </TouchableOpacity>
          </View>
        </View>
      )}

      {/* End-of-module score modal (blue borders) */}
      {showScoreModal && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: width * 0.06,
          }}
        >
          <View
            style={{
              width: width * 0.9,
              borderRadius: 16,
              borderWidth: 2,
              borderColor: '#58CCF7',
              overflow: 'hidden',
              backgroundColor: '#1f2d55',
              padding: width * 0.07,
              alignItems: 'center'
            }}
          >
              <Text
                style={{
                  fontSize: scale(width * 0.065),
                  fontWeight: '900',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginBottom: scaleSpace(height * 0.015),
                  fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
                }}
              >
                Resultado del módulo
              </Text>
              <Text
                style={{
                  fontSize: scale(width * 0.08),
                  fontWeight: '800',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginBottom: scaleSpace(height * 0.015),
                }}
              >
                {moduleCorrect} de {moduleTotal}
              </Text>
              <Text
                style={{
                  fontSize: scale(width * 0.042),
                  color: '#FFFFFF',
                  opacity: 0.95,
                  textAlign: 'center',
                  marginBottom: scaleSpace(height * 0.02),
                }}
              >
                {moduleTotal > 0 ? '¡Bien hecho! Sigue explorando para aprender más.' : 'Completa los mini quizes para obtener tu puntuación.'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowScoreModal(false);
                  setShowConfetti(false);
                  navigation.navigate('HomeMain');
                }}
                style={{ width: '100%' }}
              >
                <LinearGradient
                  colors={['#58CCF7', '#4A9FE7']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    borderRadius: 16,
                    padding: scaleSpace(width * 0.04),
                    alignItems: 'center',
                    borderWidth: 2,
                    borderColor: 'rgba(88, 204, 247, 0.6)'
                  }}
                >
                  <Text
                    style={{
                      fontSize: scale(width * 0.05),
                      fontWeight: '800',
                      color: '#FFFFFF',
                    }}
                  >
                    Listo
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}


