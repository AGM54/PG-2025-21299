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
import BillGlossary from '../../components/BillGlossary/BillGlossary';
import TypewriterList from '../../components/TypewriterText/TypewriterList';
import ImageTriviaCard from '../../components/ImageTriviaCard/ImageTriviaCard';
import StoryCard from '../../components/StoryCard/StoryCard';
import EnergyDragDropGame from '../../components/EnergyDragDropGame/EnergyDragDropGame';
import ObligacionesDragDrop from '../../components/ObligacionesDragDrop/ObligacionesDragDrop';
import TrueFalseQuiz from '../../components/TrueFalseQuiz/TrueFalseQuiz';
import OrderDragDrop from '../../components/OrderDragDrop/OrderDragDrop';
import ReclamoOrderDragDrop from '../../components/ReclamoOrderDragDrop/ReclamoOrderDragDrop';
import FacturaExplorer from '../../components/FacturaExplorer/FacturaExplorer';
import ConsumptionSimulator from '../../components/ConsumptionSimulator/ConsumptionSimulator';
import DragDropOrder from '../../components/DragDropOrder/DragDropOrder';
import MeterReading from '../../components/MeterReading/MeterReading';
import InteractiveFactura from '../../components/InteractiveFactura/InteractiveFactura';
import SofiaStoryCard from '../../components/SofiaStoryCard/SofiaStoryCard';
import ObligacionesMatching from '../../components/ObligacionesMatching/ObligacionesMatching';
import TermMatching from '../../components/TermMatching/TermMatching';
import { Confetti } from '../../components/TriviaCard/Confetti';
import { auth, db } from '../../firebase.config';
import { logger } from '../../utils/logger';
import { saveProgress, incrementCompletedModules, addPoints, addTotalTime, getUserProfile, updateDoc, doc, getProgress } from '../../src/lib/firestore';
import { useScreenTime } from '../../src/hooks/useScreenTime';

const { width, height } = Dimensions.get('window');

type ObligacionesScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Obligaciones'>;

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
  isInteractiveFactura?: boolean;
  isSimulation?: boolean;
  isTarifaSocialActivity?: boolean;
  isMeterReading?: boolean;
  isTermMatching?: boolean;
  isDragDropAlumbrado?: boolean;
  dragDropAlumbradoData?: Array<{
    phrase: string;
    entity: string;
  }>;
  slides?: Array<{
    title: string;
    content: string;
    image?: any;
  }>;
}

const lessonSteps: LessonStep[] = [
  {
    title: 'Obligaciones de las empresas distribuidoras',
    description: '¿Sabías que tu empresa distribuidora tiene varias obligaciones que debe cumplir contigo?',
    image: require('../../assets/cnee.png'),
  },
  {
    title: 'Conectar tu servicio',
    description: 'Si tu casa está a menos de 200 metros de la red, deben instalarte el servicio si lo solicitas.\n\nEsta es una de las obligaciones principales de tu empresa distribuidora.',
    image: require('../../assets/conectar.png'),
  },
  {
    title: 'Dar energía continua',
    description: 'No pueden suspender el servicio sin razón o sin avisarte con tiempo.\n\nRecibir un servicio eléctrico estable y confiable.',
    image: require('../../assets/cortar.png'),
  },
  {
    title: 'Revisar tu contador',
    description: 'Deben verificar que mida correctamente tu consumo.\n\nSi crees que tu contador está mal, puedes solicitar una revisión técnica.',
    image: require('../../assets/revisar.png'),
  },
  {
    title: 'Entregar factura a tiempo',
    description: 'Recibir tu factura mensual puntualmente.\n\nLa factura debe llegar con suficiente tiempo para que puedas pagarla antes del vencimiento.',
    image: require('../../assets/facturatiempo.png'),
  },
  {
    title: 'Reparar fallas eléctricas',
    description: 'Las empresas distribuidoras deben atender cortes de luz o fallas en el menor tiempo posible.',
    image: require('../../assets/arreglar.png'),
  },
  {
    title: 'Dar mantenimiento a redes',
    description: 'Postes, cables y transformadores deben funcionar bien y de forma segura.',
    image: require('../../assets/arre.png'),
  },

  {
    title: '¿Qué pasa si no cumplen?',
    description: 'Puedes presentar un reclamo a la distribuidora si no te conectan, no recibes tu factura, te cortan sin motivo, tu contador falla o no reparan averías.',
    image: require('../../assets/derechos.png'),
  },
  {
    title: '¿Es obligación o no?',
    description: 'Selecciona cada frase y decide si ES o NO ES obligación de la distribuidora.',
    isDragDrop: true,
  },
  {
    title: '¿Cómo reclamar?',
    description: 'Pasos: comunícate con tu distribuidora, explica el problema, anota el número de reclamo, espera respuesta. Si no responden, acude a la CNEE.',
    image: require('../../assets/usuario.png'),
  },

  {
    title: 'Distribuidora',
    description: 'Empresa que lleva la electricidad a tu casa.\n\nEs la encargada de mantener los postes de energía en buen estado.',
    image: require('../../assets/obligaciones/distribuidora.png'),
  },
  {
    title: 'Contador',
    description: 'Aparato que mide cuánta energía consumes.\n\nDebe estar calibrado correctamente para que pagues solo lo que realmente usas.',
    image: require('../../assets/obligaciones/medidor.png'),
  },
  {
    title: 'Tarifa',
    description: 'Precio que pagas por cada kilovatio-hora (kWh) de electricidad consumido.\n\nPuede variar según el horario, el consumo y la empresa distribuidora.',
    image: require('../../assets/obligaciones/tarifa.png'),
  },
  {
    title: 'Reclamo',
    description: 'Solicitud que haces a la empresa distribuidora si detectas un error en tu factura o tienes problemas con el servicio.\n\nLa empresa distribuidora debe investigar y entregarte una respuesta clara.',
    image: require('../../assets/obligaciones/reclamo.png'),
  },
  {
    title: 'Empareja el término con su definición',
    description: '1. Selecciona un término\n2. Selecciona su definición correcta.',
    isTermMatching: true,
  },
  {
    title: 'Trivia: ¿Conoces las obligaciones de las distribuidoras?',
    description: 'Pon a prueba tus conocimientos sobre las obligaciones de las distribuidoras.',
    isTrueFalse: true,
  },
  {
    title: 'La historia de Sonia',
    description: 'Aprende de la experiencia de Sonia y cómo resolvió su problema.',
    isStory: true,
    slides: [
      { title: 'Sonia recibe una factura altísima', content: 'Un día, Sonia recibió una factura de electricidad mucho más alta de lo normal.', image: require('../../assets/sonia1.png') },
      { title: 'Llama a la empresa distribuidora', content: 'Sonia llamó inmediatamente a su empresa distribuidora.', image: require('../../assets/sonia2.png') },
      { title: 'Solicita una revisión de su contador', content: 'Pidió que revisaran su contador porque sospechaba que algo estaba mal.', image: require('../../assets/sonia3.png') },
      { title: 'Le corrigen el error y le reembolsan', content: 'La empresa encontró el error, lo corrigió y le devolvió el dinero de más que había pagado.', image: require('../../assets/sonia4.png') },
      { title: 'Sonia aprende sobre las obligaciones de las distribuidoras', content: 'Sonia aprendió que puede hacer un reclamo a la empresa distribuidora en caso de error y exigirle un servicio de calidad.', image: require('../../assets/sonia5.png') }
    ],
  },
  {
    title: 'Actividad: ¿Qué aprendió Sonia?',
    description: 'Selecciona la lección correcta que aprendió Sonia.',
    isNewTrivia: true,
  },

   {
    title: 'Normas adicionales de las distribuidoras',
    description: 'Las distribuidoras no solo deben darte energía, también deben cumplir con reglas técnicas y de calidad definidas por la CNEE.\n\n✔ Garantizar calidad del voltaje\n\n✔ Avisarte sobre cortes programados\n\n✔ Medir correctamente tu consumo\n\n✔ Respetar los plazos de atención\n\n✔ Mantener la red en buen estado\n\n✔ Atender emergencias y fallas\n\n✔ Informarte con claridad',
    image: require('../../assets/importante.png'),
  },
  {
    title: 'Actividad: Arrastra a su obligación',
    description: '1. Selecciona una acción\n2. Selecciona la obligación que corresponde.',
    isTarifaSocialActivity: true,
  },
    {
      title: 'En resumen',
    description: 'Recuerda: Las distribuidoras deben conectarte, dar energía continua, entregar facturas y reparar fallas. Puedes reclamar si no cumplen. La CNEE vigila que se cumpla.',
    image: require('../../assets/tres.png'),
  },
  {
      title: 'Mensaje final',
    description: 'CNEE: trabajamos día a día para que el servicio de energía sea fluido, confiable y de calidad.',
    image: require('../../assets/organizacion.png'),
  },
];

export default function ObligacionesScreen() {
  const [step, setStep] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [moduleCorrect, setModuleCorrect] = useState(0);
  const [moduleTotal, setModuleTotal] = useState(0);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  const navigation = useNavigation<ObligacionesScreenNavigationProp>();
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];
  
  // Track screen time under module name
  useScreenTime('Module/Obligaciones');

  // Cargar progreso guardado
  useEffect(() => {
    const loadSavedProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          const progressData = await getProgress(uid);
          if (progressData && progressData['Obligaciones']) {
            const savedStep = progressData['Obligaciones'].step || 0;
            if (savedStep > 0 && savedStep <= lessonSteps.length) {
              setStep(Math.max(0, savedStep - 1));
            }
          }
          const profile = await getUserProfile(uid);
          setCurrentUserPoints(profile?.points || 0);
        } catch (error) {
          logger.error('Error cargando progreso:', error);
        }
      }
    };
    loadSavedProgress();
  }, []);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalData, setActivityModalData] = useState<{ title: string; message?: string; scoreText?: string; image: any } | null>(null);
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

  const openActivityModal = (data: { title: string; message?: string; scoreText?: string; image: any }) => {
    setActivityModalData(data);
    setShowActivityModal(true);
  };
  const openFeedbackModal = (data: { title: string; message?: string; scoreText?: string }) => {
    openActivityModal({ ...data, image: getNextPersonaImage() });
  };
  const closeActivityModalAndNext = () => {
    setShowActivityModal(false);
    handleNext();
  };

  // Animation values for curious fact
  const lightningOpacity = useRef(new Animated.Value(0)).current;
  const factScale = useRef(new Animated.Value(0.8)).current;

  // Steps with long info that require scroll to enable continue
  const infoStepsWithScroll: string[] = [
    'Normas adicionales de las distribuidoras', // Requiere scroll obligatorio para leer todo
  ];

  // Pasos con imagen más compacta para priorizar texto visible y reducir tamaño de contenido
  const compactImageSteps = [
    'Normas adicionales de las distribuidoras',
  ];
  const isCompactImageStep = compactImageSteps.includes(current.title);

  // Steps that should use extra-large card styles to maximize screen space
  const extraLargeCardSteps: string[] = [
    'Normas adicionales de las distribuidoras',
    'En resumen'  // Hacer esta caja MUY grande para aprovechar TODO el espacio
  ];

  // Steps that should use large card styles
  const largeCardSteps = [
    '¿Cómo reclamar?',
    '¿Qué pasa si no cumplen?'
  ];

  const isScrollBlockStep = infoStepsWithScroll.includes(current.title);
  const isLargeCardStep = largeCardSteps.includes(current.title);
  const isExtraLargeCardStep = extraLargeCardSteps.includes(current.title);

  // Reset scroll state when step changes
  useEffect(() => {
    setHasScrolledToEnd(!isScrollBlockStep);
    setTypewriterComplete(false);
  }, [step, isScrollBlockStep]);

  const handleNext = async () => {
    if (step < lessonSteps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          await saveProgress(uid, 'Obligaciones', {
            step: nextStep + 1,
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
        
        await saveProgress(uid, 'Obligaciones', { 
          step: lessonSteps.length, 
          score: moduleTotal > 0 ? Math.round((moduleCorrect / moduleTotal) * 100) : 100 
        });
        
        await incrementCompletedModules(uid, 'Obligaciones');
        
        const triviaPoints = moduleCorrect * 10;
        const completionBonus = 100;
        const totalPoints = triviaPoints + completionBonus;
        await addPoints(uid, totalPoints);
        
        const timeSpent = Date.now() - startTimeRef.current;
        await addTotalTime(uid, timeSpent);
        
        const updatedProfile = await getUserProfile(uid);
        const newLevel = Math.min((updatedProfile?.completedModules || 0) + 1, 5);
        
        if (newLevel > (profile?.level || 1)) {
          const profileRef = doc(db, 'profiles', uid);
          await updateDoc(profileRef, { level: newLevel });
        }
        
        logger.log(`✅ Módulo Obligaciones completado: +${totalPoints} puntos, Nivel: ${newLevel}`);
      } catch (error) {
        logger.error('Error al finalizar módulo:', error);
      }
    }
    navigation.navigate('HomeMain');
  };

  const handleScoreAccumulate = async (correct: number, total: number) => {
    setModuleCorrect(prev => prev + correct);
    setModuleTotal(prev => prev + total);
    
    const uid = auth.currentUser?.uid;
    if (uid) {
      const incorrect = total - correct;
      const pointsEarned = (correct * 10) - (incorrect * 5);
      if (pointsEarned !== 0) {
        await addPoints(uid, pointsEarned);
        setCurrentUserPoints(prev => prev + pointsEarned);
      }
    }
  };

  // Detectar scroll al final para pasos informativos largos
  const handleScroll = (event: any) => {
    if (isScrollBlockStep) {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
      setHasScrolledToEnd(isEnd);
    }
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

      {/* Flecha para regresar */}
      {step > 0 && (
        <TouchableOpacity
          style={{
            position: 'absolute',
            top: height * 0.02,
            left: width * 0.04,
            width: width * 0.12,
            height: width * 0.12,
            borderRadius: width * 0.06,
            backgroundColor: 'rgba(88, 204, 247, 0.9)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 99,
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
          onPress={() => setStep(step - 1)}
        >
          <Text style={{
            color: 'white',
            fontSize: width * 0.05,
            fontWeight: 'bold'
          }}>←</Text>
        </TouchableOpacity>
      )}

      {/* Contenido scrolleable */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Título - oculto para pantallas interactivas y Story para evitar textos duplicados */}
        {!current.isStory && !current.isDragDrop && !current.isTrueFalse && !current.isNewTrivia && !current.isOrderDragDrop && !current.isInteractiveFactura && !current.isSimulation && !current.isTarifaSocialActivity && !current.isMeterReading && !current.isTermMatching && (
          <Text style={styles.title}>{current.title}</Text>
        )}

        {/* Contenido */}
        {current.isTrivia ? (
          <TriviaCard onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Bien hecho.' })} />
        ) : current.isNewTrivia ? (
          <TriviaCardScreen5 onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Bien hecho.' })} />
        ) : current.isGlossary ? (
          <BillGlossary onComplete={() => openFeedbackModal({ title: 'Glosario completado', message: '¡Excelente! Sigamos.' })} />
        ) : current.isImageTrivia ? (
          <ImageTriviaCard onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Buen trabajo.' })} />
        ) : current.isDragDrop ? (
          <ObligacionesDragDrop 
            onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Clasificaste correctamente.' })} 
            onScored={handleScoreAccumulate}
          />
        ) : current.dragDropAlumbradoData ? (
          <EnergyDragDropGame
            alumbradoData={current.dragDropAlumbradoData}
            onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: '¡Bien! Continuemos.' })}
          />
        ) : current.isTrueFalse ? (
          <TrueFalseQuiz
            questions={[
              {
                question: '¿Puede la distribuidora cortarte la luz sin avisarte?',
                options: ['Sí', 'No'],
                correctAnswer: 1,
                explanation: 'Las distribuidoras NO pueden suspender el servicio sin razón justificada y sin avisarte con tiempo. Es una de tus garantías como usuario.'
              },
              {
                question: '¿Puedes pedir que revisen tu contador si crees que está mal?',
                options: ['Sí', 'No'],
                correctAnswer: 0,
                explanation: 'puedes solicitar a la distribuidora una revisión técnica de tu contador si sospechas que no está midiendo correctamente tu consumo.'
              },
              {
                question: '¿Quién revisa que las distribuidoras cumplan su trabajo?',
                options: ['El vecino', 'La CNEE', 'El alcalde'],
                correctAnswer: 1,
                explanation: 'La Comisión Nacional de Energía Eléctrica, CNEE, es la entidad encargada de supervisar que las empresas distribuidoras cumplan con sus obligaciones.'
              }
            ]}
            onScored={(score, total) => {
              handleScoreAccumulate(score, total);
              openFeedbackModal({ title: 'Actividad completada', message: 'Buen trabajo.', scoreText: `${score}/${total}` });
            }}
            onComplete={() => { if (!showActivityModal) handleNext(); }}
          />
        ) : current.isOrderDragDrop ? (
          <ReclamoOrderDragDrop onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Ordenaste correctamente.' })} />
        ) : current.isInteractiveFactura ? (
          <InteractiveFactura onComplete={() => openFeedbackModal({ title: 'Exploración completada', message: 'Ya entiendes mejor tus derechos.' })} />
        ) : current.isSimulation ? (
          <ConsumptionSimulator onComplete={() => openFeedbackModal({ title: 'Simulación completada', message: 'Revisaste cómo impacta en el servicio.' })} />
        ) : current.isTarifaSocialActivity ? (
          <ObligacionesMatching onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Relacionaste correctamente.' })} />
        ) : current.isMeterReading ? (
          <MeterReading onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Leíste correctamente el contador.' })} />
        ) : current.isTermMatching ? (
          <TermMatching 
            onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Emparejaste correctamente los términos.' })} 
            onScored={handleScoreAccumulate}
          />
        ) : current.isStory ? (
          <SofiaStoryCard
            slides={current.slides}
            onComplete={() => openFeedbackModal({ title: 'Historia completada', message: 'Has seguido la historia con atención.' })}
          />
        ) : (
          <>
            {current.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={current.image}
                  style={[styles.image, {
                    height: isCompactImageStep ? height * 0.2 : styles.image.height
                  }]}
                />
              </View>
            )}
            {/* Tarjeta de información con diseño profesional */}
            <LinearGradient
              colors={['rgba(42, 63, 111, 0.9)', 'rgba(31, 45, 85, 0.95)', 'rgba(42, 63, 111, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={
                isExtraLargeCardStep 
                  ? styles.descriptionCardExtraLarge 
                  : isLargeCardStep 
                    ? styles.descriptionCardLarge 
                    : styles.descriptionCard
              }
            >
              {/* Border interior con gradiente */}
              <View style={styles.gradientBorder} />
              
              <ScrollView 
                style={styles.descriptionScroll}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.description}>{current.description || ''}</Text>
              </ScrollView>
            </LinearGradient>
          </>
        )}
      </ScrollView>

      {/* Elementos fijos en la parte inferior */}
      {!current.isDragDrop && !current.isTrueFalse && !current.isNewTrivia && !current.isOrderDragDrop && !current.isInteractiveFactura && !current.isSimulation && !current.isTarifaSocialActivity && !current.isMeterReading && !current.isTermMatching && !current.isStory && (
        <View style={styles.fixedBottom}>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
          </View>

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

          {step < lessonSteps.length - 1 && (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          )}

          {step === lessonSteps.length - 1 && (
            <TouchableOpacity style={[styles.button, styles.finishButton]} onPress={handleFinish}>
              <Text style={styles.buttonText}>Finalizar lección</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Modal de retroalimentación */}
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
              style={{ width: width * 0.35, height: width * 0.35, marginBottom: height * 0.015 }}
              resizeMode="contain"
            />
            <Text
              style={{
                fontSize: width * 0.06,
                fontWeight: '900',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: height * 0.01,
              }}
            >
              {activityModalData.title}
            </Text>
            {activityModalData.message ? (
              <Text
                style={{
                  fontSize: width * 0.042,
                  color: '#FFFFFF',
                  opacity: 0.95,
                  textAlign: 'center',
                  marginBottom: height * 0.01,
                }}
              >
                {activityModalData.message}
              </Text>
            ) : null}
            {activityModalData.scoreText ? (
              <Text
                style={{
                  fontSize: width * 0.07,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginBottom: height * 0.015,
                }}
              >
                Nota: {activityModalData.scoreText}
              </Text>
            ) : null}
            <TouchableOpacity onPress={closeActivityModalAndNext} style={{ width: '100%', marginTop: height * 0.01 }}>
              <View
                style={{
                  borderRadius: 16,
                  padding: width * 0.04,
                  alignItems: 'center',
                  borderWidth: 2,
                  borderColor: 'rgba(88, 204, 247, 0.6)',
                  backgroundColor: '#4A9FE7',
                }}
              >
                <Text style={{ fontSize: width * 0.05, fontWeight: '800', color: '#FFFFFF' }}>Continuar</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showConfetti && <Confetti />}
    </LinearGradient>
  );
}


