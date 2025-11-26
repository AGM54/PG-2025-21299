import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStackNavigator';
import { LinearGradient } from 'expo-linear-gradient';
import TriviaCard from '../../components/TriviaCard/TriviaCard';
import TriviaCardScreen5 from '../../components/TriviaCard/TriviaCardScreen5';
import BillGlossary from '../../components/BillGlossary/BillGlossary';
import ImageTriviaCard from '../../components/ImageTriviaCard/ImageTriviaCard';
import SofiaStoryCard from '../../components/SofiaStoryCard/SofiaStoryCard';
import StoryCard from '../../components/StoryCard/StoryCard';
import AlumbradoSelectMatch from '../../components/AlumbradoDragDrop/AlumbradoSelectMatch';
import EnergyDragDropGame from '../../components/EnergyDragDropGame/EnergyDragDropGame';
import TrueFalseQuiz from '../../components/TrueFalseQuiz/TrueFalseQuiz';
import OrderDragDrop from '../../components/OrderDragDrop/OrderDragDrop';
import InteractiveFactura from '../../components/InteractiveFactura/InteractiveFactura';
import ConsumptionSimulator from '../../components/ConsumptionSimulator/ConsumptionSimulator';
import DragDropOrder from '../../components/DragDropOrder/DragDropOrder';
import MeterReading from '../../components/MeterReading/MeterReading';
import { Confetti } from '../../components/TriviaCard/Confetti';
import { auth, db } from '../../firebase.config';
import { saveProgress, incrementCompletedModules, addPoints, addTotalTime, getUserProfile, updateDoc, doc, getProgress } from '../../src/lib/firestore';
import { logger } from '../../utils/logger';

const { width, height } = Dimensions.get('window');

type AlumbradoScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Alumbrado'>;
interface LessonStep {
  title: string;
  description?: string;
  image?: any;
  isTrivia?: boolean;
  isNewTrivia?: boolean;
  isGlossary?: boolean;
  isImageTrivia?: boolean;
  isStory?: boolean;
  isDragDrop?: boolean;
  isTrueFalse?: boolean;
  isOrderDragDrop?: boolean;
  isInteractiveFactura?: boolean;
  isSimulation?: boolean;
  isTarifaSocialActivity?: boolean;
  isMeterReading?: boolean;
  isDragDropAlumbrado?: boolean;
  isAlumbradoSelectMatch?: boolean;
  questions?: Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>;
  dragDropAlumbradoData?: Array<{
    phrase: string;
    entity: string;
  }>;
  slides?: Array<{
    title: string;
    content: string;
    image?: any;
    correctAnswer?: number;
    explanation?: {
      correct: string;
      incorrect: string;
    };
  }>;
  correctAnswer?: number;
  explanation?: {
    correct: string;
    incorrect: string;
  };
}

const lessonSteps: LessonStep[] = [
  {
    title: '¿Qué es el alumbrado público?',
    description: 'El alumbrado público son las luces que iluminan calles, avenidas, parques y espacios públicos. Sirve para:\n\n● Caminar con más seguridad.\n● Prevenir accidentes.\n● Que nuestras calles y plazas no estén oscuras.',
    image: require('../../assets/parque.png'),
  },
 
  {
    title: '¿Quién paga el alumbrado público?',
    description: 'El alumbrado público es pagado por los vecinos a través de la factura de energía eléctrica que emite la empresa distribuidora.\n\nLa municipalidad fija la tasa de alumbrado público según lo establecido en el Código Municipal.',
    image: require('../../assets/vecinos.png'),
  },

  {
    title: '¿Quién paga el alumbrado público? (Parte 2)',
    description: 'La empresa distribuidora de energía recauda la tasa de alumbrado público en la factura de luz de cada usuario.\n\nLa CNEE no fija ni administra ese cobro. Solo vela porque esté correctamente detallado y separado en tu factura.',
    image: require('../../assets/distribuidora.png'),
  },

  {
    title: 'Marco legal',
    description: 'Fundamento:\n\nEl Artículo 68, literal a) del Código Municipal de Guatemala (Decreto 12-2002) establece que el alumbrado público es una competencia propia del municipio, lo que implica su obligación de prestar este servicio de forma directa o mediante convenios.',
    image: require('../../assets/leyes.png'),
  },

  {
    title: 'Marco legal (Parte 2)',
    description: 'Este permite que las municipalidades cobren una tasa de alumbrado público a través de la empresa distribuidora.\n\nLa CNEE no puede intervenir en el monto, pero sí vigilar que se respete la ley en cómo se refleja en la factura.',
    image: require('../../assets/queescn.png'),
  },



  {
    title: 'Actividad: Selecciona la frase y la entidad correcta',
    isAlumbradoSelectMatch: true,
  },
  {
    title: 'Trivia rápida',
    description: 'Pregunta 1: ¿Quién fija la tasa de alumbrado público?\nPregunta 2: ¿Se puede reclamar a la distribuidora si el cobro no está detallado en la factura?\nPregunta 3: ¿La CNEE cobra el alumbrado?',
    isTrueFalse: true,
  },
  {
    title: 'Ejemplo ilustrado – El caso de Julio',
    description: 'Historia interactiva sobre el cobro de alumbrado público.',
    isStory: true,
    correctAnswer: 1,
    explanation: {
      correct: 'La municipalidad fija la tasa y la distribuidora puede incluir el cargo en la factura.',
      incorrect: 'La municipalidad y/o la distribuidora son las instancias que pueden aclarar el cobro.'
    },
    slides: [
      {
        title: 'Julio nota un cobro nuevo',
        content: '',
        image: require('../../assets/julio1.png'),
        correctAnswer: 1,
        explanation: {
          correct: 'No. La CNEE supervisa y regula, pero no fija montos municipales.',
          incorrect: 'La CNEE supervisa y regula el sector, pero no decide montos municipales.'
        }
      },
      {
        title: 'Pregunta a la distribuidora',
        content: '',
        image: require('../../assets/julio2.png'),
        correctAnswer: 0,
        explanation: {
          correct: 'Sí. La municipalidad debe informar sobre el uso de los recursos.',
          incorrect: 'El uso del dinero no es confidencial: la municipalidad debe rendir cuentas.'
        }
      },
      {
        title: 'Visita su municipalidad',
        content: '',
        image: require('../../assets/julio3.png'),
        correctAnswer: 0,
        explanation: {
          correct: 'Sí. El cargo por alumbrado debe aparecer separado en la factura.',
          incorrect: 'El cobro debe figurar separado de tu consumo.'
        }
      },
      {
        title: 'Entiende que es legal',
        content: '',
        image: require('../../assets/julio4.png'),
      },
      {
        title: 'Aprende sobre la separación',
        content: '',
        image: require('../../assets/julio5.png'),
      }
    ],
  },
  {
    title: 'Puntos clave del alumbrado público',
    description: 'El alumbrado público es importante para que nuestras calles y plazas estén iluminadas.\n\nLo cobra la empresa distribuidora a través de la factura eléctrica.\n\nLa CNEE no lo fija, pero sí revisa que se detalle bien en la factura.\n\nSi no aparece claro, puedes presentar un reclamo a la distribuidora.',
    image: require('../../assets/final.png'),
  },
  {
    title: 'Beneficios ambientales del alumbrado LED',
    description: 'El alumbrado público también beneficia al medio ambiente cuando se usan luminarias LED.\n\nEstas consumen hasta 80% menos energía que las luminarias tradicionales y duran aproximadamente 10 veces más.\n\nAdemás, al generar menos calor, contribuyen a reducir el efecto isla de calor urbano en las ciudades.',
    image: require('../../assets/cuatro.png'),
  },
  {
    title: '¿Por qué varía el cobro entre municipios?',
    description: 'El monto que pagas por alumbrado público no es igual en todos los municipios. Cambia según:\n\n● Cantidad de lámparas en el municipio.\n● Tipo de luminarias (tradicionales o LED).\n● Presupuesto municipal disponible.\n\nPor eso puedes pagar diferente que alguien de otro municipio.',
    image: require('../../assets/cuatro.png'),
  },
  {
    title: '¿Qué hacer si hay una lámpara dañada?',
    description: 'Si ves una lámpara pública dañada:\n\n1. Toma nota de la ubicación.\n2. Reporta a tu municipalidad o empresa distribuidora.\n\nLa responsabilidad es municipal, pero algunas lo delegan.',
    image: require('../../assets/dano.png'),
  },
  {
    title: '¿Qué pasa si hay una lámpara dañada?',
    description: 'Actividad 5: ¿A quién reporto esta lámpara dañada?',
    image: require('../../assets/poste.png'),
    isNewTrivia: true,
  },
  {
    title: '¿Cuánto se invierte en alumbrado?',
    description: 'El dinero que se cobra por alumbrado público no se va a la CNEE ni a la empresa distribuidora. Se transfiere a la municipalidad, que debe usarlo para:\n\n● Pagar el consumo de energía de luminarias.\n● Dar mantenimiento a postes y cables.\n● Ampliar la cobertura de alumbrado.\n● Sustituir bombillas por luminarias LED.',
    image: require('../../assets/guardian.png'),
  },
  {
    title: '¿Cuánto se invierte en alumbrado? (Parte 2)',
    description: 'Como usuario tienes derecho a la información:\n\nPuedes pedir a tu municipalidad un informe detallado de cómo se usa el dinero del alumbrado público.\n\nEsto está respaldado por la Ley de Acceso a la Información Pública.\n\nLa municipalidad debe ser transparente en el uso de estos fondos.',
    image: require('../../assets/guardian.png'),
  },
  {
    title: 'Trivia extendida – ¿Cuánto sabes?',
    description: 'Pregunta 1: ¿A quién debes acudir si tienes dudas sobre el monto del cobro de alumbrado?\nPregunta 2: ¿La CNEE puede modificar el monto que cobras por alumbrado público?\nPregunta 3: ¿Puedes consultar cómo se usa el dinero del alumbrado?\nPregunta 4: ¿El cobro debe estar separado de tu consumo?',
    isTrivia: true,
  },
  {
    title: 'Lo que debes saber sobre el alumbrado público',
    description: 'Como usuario puedes:\n\n● Conocer cuánto pagas por alumbrado.\n● Ver este cobro separado en tu factura.\n● Reclamar errores a tu distribuidora.\n● Solicitar reparación de luminarias.\n● Pedir iluminación para zonas oscuras.',
    image: require('../../assets/final2.png'),
   
  },

    {
    title: 'Slogan final',
    description: '"Una comunidad segura es una comunidad bien iluminada.\nConsulta y aprende a leer tu factura de energía."',
    image: require('../../assets/iluminada.png'),
  },
];

export default function AlumbradoScreen() {
  const [step, setStep] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [moduleCorrect, setModuleCorrect] = useState(0);
  const [moduleTotal, setModuleTotal] = useState(0);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const scrollViewRef = useRef<ScrollView>(null);
  const innerScrollViewRef = useRef<ScrollView>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollRequired, setScrollRequired] = useState(false);

  const navigation = useNavigation<AlumbradoScreenNavigationProp>();
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];
  const textLength = current.description?.length || 0;
  
  // Steps with long info that require scroll to enable continue
  const infoStepsWithScroll: string[] = [
    'Puntos clave del alumbrado público',
    'Beneficios ambientales del alumbrado LED',
    '¿Por qué varía el cobro entre municipios?',
    '¿Cuánto se invierte en alumbrado?',
    '¿Cuánto se invierte en alumbrado? (Parte 2)',
  ];

  // Steps that should use compact card size (menos espacio)
  const compactCardSteps = [
    '¿Quién paga el alumbrado público?',
    '¿Quién paga el alumbrado público? (Parte 2)',
    'Marco legal',
    'Marco legal (Parte 2)',
    '¿Cuánto se invierte en alumbrado?',
    '¿Cuánto se invierte en alumbrado? (Parte 2)',
    // Excluimos los pasos de resumen para que tengan tarjetas más grandes
  ];

  const isScrollBlockStep = infoStepsWithScroll.includes(current.title);
  const isCompactCard = compactCardSteps.includes(current.title);

  // Cálculo responsive dinámico para usar TODO el espacio disponible
  const topSafeSpace = height * 0.02;
  const minGap = 8;
  const reservedGap = Math.max(height * 0.02, 14);
  const effectiveFooter = footerHeight && footerHeight > 0 ? footerHeight : height * 0.16;
  const chromePaddingApprox = width * 0.09 + 8;
  const safety = 2;

  // Espacio disponible máximo para la tarjeta
  const availableHeightPreferred = Math.max(
    height - titleHeight - imageHeight - effectiveFooter - topSafeSpace - reservedGap - safety,
    height * 0.30
  );
  const availableHeightMax = Math.max(
    height - titleHeight - imageHeight - effectiveFooter - topSafeSpace - minGap - safety,
    height * 0.30
  );

  // Estimación de contenido
  const descLineHeight = width * 0.065;
  const estimatedContent = contentHeight || (textLength * (descLineHeight / 30));
  const targetToFitAll = estimatedContent + chromePaddingApprox + 6;

  // La tarjeta usa TODO el espacio disponible, creciendo hasta el máximo
  let cardHeight = targetToFitAll <= availableHeightPreferred
    ? Math.max(targetToFitAll, availableHeightPreferred * 0.85) // Usa al menos 85% del espacio disponible
    : (targetToFitAll <= availableHeightMax ? targetToFitAll : availableHeightMax);
  
  // Para tarjetas compactas, reducir el espacio usado
  if (isCompactCard) {
    cardHeight = Math.min(cardHeight, height * 0.45); // Máximo 45% de altura para compactas
  } else {
    cardHeight = Math.max(cardHeight, height * 0.50); // Altura mínima más generosa para tarjetas normales
  }

  // Para pasos clave, forzar tarjeta alta
  if (isScrollBlockStep) {
    cardHeight = Math.max(cardHeight, availableHeightPreferred * 0.95);
  }

  const innerScrollMaxHeight = Math.max(cardHeight - chromePaddingApprox, height * 0.25);
  const hasScrollableContent = contentHeight - innerScrollMaxHeight > 2;

  // Reset scroll state when step changes
  useEffect(() => {
    setHasScrolledToEnd(!isScrollBlockStep);
    setTypewriterComplete(false);
    setContentHeight(0);
    setTitleHeight(0);
    setImageHeight(0);
    setScrollRequired(false);
  }, [step, isScrollBlockStep]);

  // Determinar si se requiere scroll
  useEffect(() => {
    const epsilonOn = 6;
    const overflow = contentHeight - innerScrollMaxHeight;
    if (!scrollRequired && overflow > epsilonOn) {
      setScrollRequired(true);
    }
  }, [contentHeight, innerScrollMaxHeight, scrollRequired]);

  // Cargar progreso guardado
  useEffect(() => {
    const loadSavedProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          const progressData = await getProgress(uid);
          if (progressData && progressData['Alumbrado Público']) {
            const savedStep = progressData['Alumbrado Público'].step || 0;
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

  const handleNext = async () => {
    if (step < lessonSteps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          await saveProgress(uid, 'Alumbrado Público', {
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
    if (finishing) return;
    setFinishing(true);
    setShowConfetti(true);

    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        const finalScore = moduleTotal > 0 ? Math.round((moduleCorrect / moduleTotal) * 100) : 100;
        
        const profile = await getUserProfile(uid);
        
        // Guardar progreso ANTES de incrementar
        await saveProgress(uid, 'Alumbrado Público', {
          step: lessonSteps.length,
          score: finalScore,
        });
        
        // Incrementar solo si es primera vez
        await incrementCompletedModules(uid, 'Alumbrado Público');
        
        const triviaPoints = moduleCorrect * 10;
        const completionBonus = 100;
        const totalPoints = triviaPoints + completionBonus;
        await addPoints(uid, totalPoints);
        
        const timeSpent = Date.now() - startTimeRef.current;
        await addTotalTime(uid, timeSpent);
        
        // Recalcular nivel basado en módulos completados reales
        const updatedProfile = await getUserProfile(uid);
        const newLevel = Math.min((updatedProfile?.completedModules || 0) + 1, 5);
        if (newLevel > (profile?.level || 1)) {
          const profileRef = doc(db, 'profiles', uid);
          await updateDoc(profileRef, { level: newLevel });
        }
        
        logger.log(`✅ Alumbrado Público completado: +${totalPoints} pts, Nivel: ${newLevel}, Score: ${finalScore}%`);
      } catch (error) {
        logger.error('Error al finalizar módulo:', error);
      }
    }

    setTimeout(() => {
      setShowConfetti(false);
      setFinishing(false);
      navigation.navigate('HomeMain');
    }, 2200);
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
      <ScrollView
  ref={scrollViewRef}
  style={styles.scrollContainer}
  contentContainerStyle={[
    styles.scrollContent,
    { paddingBottom: Math.max(footerHeight, height * 0.18) + height * 0.03 }
  ]}
  showsVerticalScrollIndicator={true}
  onScroll={handleScroll}
  scrollEventThrottle={16}
      >
        {/* Título - Oculto para Story */}
        {!current.isStory && (
          <Text 
            style={styles.title}
            onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)}
          >
            {current.title}
          </Text>
        )}

        {/* Contenido */}
  {current.isTrivia ? (
          <TrueFalseQuiz
            onScored={handleScoreAccumulate}
            questions={[
              {
                question: '¿A quién debes acudir si tienes dudas sobre el monto del cobro de alumbrado?',
                options: ['Empresa de telefonía', 'Municipalidad y/o distribuidora', 'Policía'],
                correctAnswer: 1,
                explanation: {
                  correct: 'La municipalidad fija la tasa y la distribuidora puede incluir el cargo en la factura; consulta en tu municipalidad para detalles.',
                  incorrect: 'Revisa el desglose en tu factura: la municipalidad y/o la distribuidora son quienes pueden aclarar este cobro.'
                }
              },
              {
                question: '¿La CNEE puede modificar el monto que cobras por alumbrado público?',
                options: ['Sí', 'No'],
                correctAnswer: 1,
                explanation: {
                  correct: 'No. La CNEE regula y supervisa, pero no fija montos municipales; la municipalidad es la que establece la tasa.',
                  incorrect: 'Aunque la CNEE supervisa que el cobro esté bien desglosado, no es la instancia que fija montos municipales.'
                }
              },
              {
                question: '¿Puedes consultar cómo se usa el dinero del alumbrado?',
                options: ['Sí, en la municipalidad', 'No, es confidencial'],
                correctAnswer: 0,
                explanation: {
                  correct: 'Sí. Puedes solicitar a la municipalidad información sobre el uso de los recursos del alumbrado público.',
                  incorrect: 'El uso de esos fondos no es confidencial: la municipalidad debe rendir cuentas y puedes pedir un informe.'
                }
              },
              {
                question: '¿El cobro debe estar separado de tu consumo?',
                options: ['Sí', 'No'],
                correctAnswer: 0,
                explanation: {
                  correct: 'Sí. El cargo por alumbrado debe aparecer separado en la factura para que puedas identificarlo del consumo de electricidad.',
                  incorrect: 'El cobro por alumbrado debe figurar separado del consumo; si no aparece así, puedes reclamar a la distribuidora.'
                }
              }
            ]}
            onComplete={handleNext}
          />
        ) : current.isNewTrivia ? (
          <TrueFalseQuiz
            onScored={handleScoreAccumulate}
            questions={[
              {
                question: '¿A quién reporto una lámpara dañada?',
                options: ['Policía Nacional', 'Empresa de telefonía', 'Municipalidad y/o distribuidora'],
                correctAnswer: 2
              }
            ]}
            onComplete={handleNext}
          />
        ) : current.isGlossary ? (
          <BillGlossary onComplete={handleNext} />
        ) : current.isImageTrivia ? (
          <ImageTriviaCard onComplete={handleNext} />
        ) : current.isDragDrop ? (
          <EnergyDragDropGame onComplete={handleNext} />
        ) : current.dragDropAlumbradoData ? (
          <EnergyDragDropGame alumbradoData={current.dragDropAlumbradoData} onComplete={handleNext} />
        ) : current.isAlumbradoSelectMatch ? (
          <AlumbradoSelectMatch onComplete={handleNext} />
        ) : current.isTrueFalse ? (
          <TrueFalseQuiz
            onScored={handleScoreAccumulate}
            questions={[
              {
                question: '¿Quién fija la tasa de alumbrado público?',
                options: ['CNEE', 'Municipalidad', 'Empresa distribuidora'],
                correctAnswer: 1,
                explanation: {
                  correct: 'La Municipalidad fija la tasa de alumbrado público.',
                  incorrect: 'La Municipalidad fija la tasa de alumbrado público; no la CNEE ni la distribuidora.'
                }
              },
              {
                question: '¿Se puede reclamar a la distribuidora si el cobro no está detallado en la factura?',
                options: ['Si', 'No'],
                correctAnswer: 0,
                explanation: {
                  correct: 'Puedes reclamar a la distribuidora si el cobro no está detallado en la factura.',
                  incorrect: 'Puedes reclamar a la distribuidora si el cobro no está detallado en la factura.'
                }
              },
              {
                question: '¿La CNEE cobra el alumbrado?',
                options: ['Si', 'No'],
                correctAnswer: 1,
                explanation: {
                  correct: 'La CNEE no cobra el alumbrado público.',
                  incorrect: 'La CNEE no cobra el alumbrado público.'
                }
              }
            ]}
            onComplete={handleNext}
          />
        ) : current.isOrderDragDrop ? (
          <OrderDragDrop onComplete={handleNext} />
        ) : current.isInteractiveFactura ? (
          <InteractiveFactura onComplete={handleNext} />
        ) : current.isSimulation ? (
          <ConsumptionSimulator onComplete={handleNext} />
        ) : current.isTarifaSocialActivity ? (
          <DragDropOrder onComplete={handleNext} />
        ) : current.isMeterReading ? (
          <MeterReading onComplete={handleNext} />
        ) : current.isStory ? (
          <SofiaStoryCard
            slides={current.slides || []}
            onComplete={handleNext}
          />
        ) : (
          <>
            {current.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={current.image}
                  style={
                    current.title === '¿Qué es el alumbrado público?' || 
                    current.title === '¿Quién paga el alumbrado público? (Parte 2)' 
                      ? styles.imageSmall 
                      : styles.image
                  }
                  onLayout={(e) => setImageHeight(e.nativeEvent.layout.height)}
                />
              </View>
            )}
            {/* Tarjeta de información con diseño profesional */}
            <LinearGradient
              colors={['rgba(42, 63, 111, 0.9)', 'rgba(31, 45, 85, 0.95)', 'rgba(42, 63, 111, 0.9)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.descriptionCard,
                { height: cardHeight }
              ]}
            >
              {/* Border interior con gradiente */}
              <View style={styles.gradientBorder} />
              
              <ScrollView 
                ref={innerScrollViewRef}
                style={[styles.descriptionScroll, { maxHeight: innerScrollMaxHeight }]}
                nestedScrollEnabled={true}
                scrollEnabled={scrollRequired || isScrollBlockStep}
                showsVerticalScrollIndicator={scrollRequired || isScrollBlockStep}
                onScroll={(event) => {
                  if (isScrollBlockStep || scrollRequired) {
                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                    const paddingToBottom = 20;
                    const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
                    if (isEnd && !hasScrolledToEnd) setHasScrolledToEnd(true);
                  }
                }}
                scrollEventThrottle={16}
                onContentSizeChange={(w, h) => {
                  if (Math.abs(h - contentHeight) > 1) setContentHeight(h);
                }}
              >
                <Text style={styles.description}>{current.description || ''}</Text>
              </ScrollView>
            </LinearGradient>
          </>
        )}
      </ScrollView>

      {/* Elementos fijos en la parte inferior - Ocultos durante la trivia */}
  {!current.isTrivia && !current.isNewTrivia && !current.isGlossary && !current.isImageTrivia && !current.isDragDrop && !current.isStory && !current.isTrueFalse && !current.isOrderDragDrop && !current.isInteractiveFactura && !current.isSimulation && !current.isTarifaSocialActivity && !current.isMeterReading && !current.isAlumbradoSelectMatch &&
        (!current.title.includes('específicamente') || typewriterComplete) && (
          <View 
            style={styles.fixedBottom}
            onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}
          >
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
        )}

      {/* Confetti Effect */}
      {showConfetti && <Confetti />}
    </LinearGradient>
  );
}

