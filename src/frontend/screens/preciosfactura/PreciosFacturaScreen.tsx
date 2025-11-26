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
import SofiaStoryCard from '../../components/SofiaStoryCard/SofiaStoryCard';
import EnergyDragDropGame from '../../components/EnergyDragDropGame/EnergyDragDropGame';
import TrueFalseQuiz from '../../components/TrueFalseQuiz/TrueFalseQuiz';
import OrderDragDrop from '../../components/OrderDragDrop/OrderDragDrop';
import FacturaExplorer from '../../components/FacturaExplorer/FacturaExplorer';
import ConsumptionSimulator from '../../components/ConsumptionSimulator/ConsumptionSimulator';
import DragDropOrder from '../../components/DragDropOrder/DragDropOrder';
import MeterReading from '../../components/MeterReading/MeterReading';
import InteractiveFactura from '../../components/InteractiveFactura/InteractiveFactura';
// Confetti no se usará en este módulo para evitar estrellas/brillos en los modales

import { auth, db } from '../../firebase.config';
import { logger } from '../../utils/logger';
import { saveProgress, incrementCompletedModules, addPoints, addTotalTime, getUserProfile, updateDoc, doc, getProgress } from '../../src/lib/firestore';
import { useScreenTime } from '../../src/hooks/useScreenTime';

const { width, height } = Dimensions.get('window');

type PreciosFacturaScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'PreciosFactura'>;

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
  slides?: Array<{
    title: string;
    content: string;
    image?: any;
  }>;
}

const lessonSteps: LessonStep[] = [
  {
    title: '¿Quién fija el precio de la luz?',
    description: 'El precio de la luz lo fija la Comisión Nacional de Energía Eléctrica, CNEE.\n\nGracias a su trabajo, el precio de la energía se ha mantenido estable para beneficio de todos los guatemaltecos.\n\nDato extra:\nLa CNEE revisa cada 3 meses los costos de producción de energía y ajusta los precios, si es necesario, pensando siempre en los usuarios.',
    image: require('../../assets/queesla.png'),
  },
  {
    title: '¿Qué es una factura eléctrica?',
    description: 'Cada mes recibes tu factura. El monto a pagar depende del consumo de energía de tu hogar o negocio.\n\nTu factura incluye datos importantes que debes revisar.',
    image: require('../../assets/recibo.png'),
    isInteractiveFactura: true,
  },
  {
    title: '1. Datos del cliente y servicio',
    description: 'Acá aparece tu nombre, dirección y el número de servicio.\n\nEs importante verificar que todos tus datos estén correctos para evitar problemas con el servicio eléctrico.',
    image: require('../../assets/factura/clienta.png'), 
  },
  {
    title: '2. Fecha de emisión y de vencimiento',
    description: 'La fecha de emisión indica cuándo se imprimió la factura.\n\nLa fecha de vencimiento indica hasta cuándo puedes pagar sin recargos.\n\nSiempre revisa estas fechas para pagar a tiempo y evitar multas.',
    image: require('../../assets/factura/vencimiento.png'), 
  },
  {
    title: '3. Consumo de energía',
    description: 'Esta es la cantidad total de luz que usaste en el mes facturado y la puedes ver donde dice kWh . Pagas según la cantidad de energía que hayas consumido.\n\nEntre menos consumas, menos pagarás en energía.',
    image: require('../../assets/factura/consumo.png'),
  },
  {
    title: '4. Cantidad a pagar',
    description: 'Aquí ves el monto total que debes pagar en tu factura.\n\nIncluye el consumo de energía, impuestos y otros cargos.\n\nSi descubres algún error, contacta a tu distribuidora para hacer un reclamo.',
    image: require('../../assets/factura/pagar.png'),
  },
  {
    title: '¿Cómo se calcula lo que pagas?',
    description: 'El precio se basa en los kilovatios hora (kWh) que consumiste.\n\n¡Entre menos consumes, menos pagas!\n\nUsa el simulador para calcular tu consumo.',
    image: require('../../assets/contador.png'),
    isSimulation: true,
  },
  {
    title: 'Glosario animado de la factura',
    isGlossary: true,
  },
  {
    title: 'Trivia: ¿Qué tanto entiendes tu factura de energía?',
    isTrueFalse: true,
  },
  {
    title: 'La historia de Manuel y su factura sorpresa',
    isStory: true,
    slides: [
      {
        title: 'Manuel revisa su recibo',
        content: '',
        image: require('../../assets/manuel1.png'),
      },
      {
        title: 'Revisa su contador',
        content: '',
        image: require('../../assets/manuel2.png'),
      },
      {
        title: 'Llama a la distribuidora',
        content: '',
        image: require('../../assets/manuel3.png'),
      },
      {
        title: 'Le ajustan el cobro',
        content: '',
        image: require('../../assets/manuel4.png'),
      },
      {
        title: 'Conclusión',
        content: '',
        image: require('../../assets/manuel5.png'),
      }
    ]
  },
  {
    title: 'En resumen',
    description: 'Lo que aprendiste hoy:\n\n• La CNEE fija el precio de la electricidad para el usuario residencial.\n• Tu factura muestra tu consumo real en kWh.\n• Si ves un error, puedes reclamar a la distribuidora.\n• Puedes usar el simulador en línea de la CNEE para estimar cuánto pagarás.',
    image: require('../../assets/varios.png'),
  },
  {
    title: 'Sabías que…',
    description: '¿Guatemala tiene uno de los sistemas eléctricos más modernos y eficientes de Latinoamérica? La Ley de Electricidad de Guatemala ha sido estudiada como caso de éxito en otros países.',
    image: require('../../assets/sabias.png'),
  },
  {
    title: '¿Qué contiene la factura eléctrica?',
    description: 'La factura de electricidad está dividida en partes importantes. Cada sección cumple una función clave para que sepas exactamente cuánto estás pagando y por qué.\n\n1. Datos del cliente y servicio → Tu nombre, dirección y número de servicio para identificar tu cuenta.\n\n2. Fecha de emisión → Día en que se generó la factura.\n\n3. Fecha de vencimiento → Día límite para pagar sin recargos.\n\n4. Consumo de energía (kWh) → Cuánta energía usaste ese mes (menos consumo = menos pago).\n\n5. Monto a pagar → Lo que debes pagar, incluyendo impuestos y otros cargos.\n\n6. Historial de consumo → Gráfico con tu consumo en meses anteriores.',
    image: require('../../assets/factu.png'),
  },
  {
    title: '¿Por qué es importante revisar tu factura?',
    description: 'Te ayuda a:\n\n• Detectar errores a tiempo.\n• Controlar tu consumo.\n• Saber cuánto pagas por mes y por qué.\n\nSi algo no cuadra, puedes reclamar directamente a tu empresa distribuidora.',
    image: require('../../assets/preo.png'),
  },
  {
    title: 'En resumen',
    description: 'Tu factura eléctrica te informa de tu consumo, monto a pagar, fechas de pago y más.\n\n¡Aprender a leerla es muy importante!',
    image: require('../../assets/factup.png'),
  },
  {
    title: '¿Qué es el subsidio a la tarifa social?',
    description: 'En Guatemala existe una tarifa especial para familias que consumen poca energía eléctrica: la tarifa social.\n\nCaracterística → Detalle\n\n¿Quién la recibe? → Usuarios que consumen 0 a 88 kWh al mes.\n\n¿Quién la otorga? → El gobierno, a través del INDE y bajo supervisión de la CNEE.\n\n¿Qué beneficio da? → Paga solo una parte del precio total; el resto lo cubre el Estado.',
    image: require('../../assets/casa.png'),
  },
  {
    title: 'Actividad: Tarifa Social',
    description: 'Selecciona el rango correcto de consumo para la "tarifa social".',
    image: require('../../assets/subetarifas.png'),
    isTarifaSocialActivity: true,
  },
  {
    title: '¿Cómo leer tu contador eléctrico?',
    description: 'El contador es el aparato que mide tu consumo de energía.\n\nSuele estar fuera de tu casa y tiene un número en kilovatios hora (kWh). Cada mes, ese número es registrado por la empresa y se usa para generar tu factura.\n\nDato: Si crees que el consumo registrado no es correcto, puedes solicitar una revisión técnica.',
    image: require('../../assets/contador.png'),
  },
  {
    title: 'Lectura del contador',
    description: 'Rueda animada tipo contador donde debes leer correctamente los dígitos.',
    image: require('../../assets/contador.png'),
    isMeterReading: true,
  },
  {
    title: '¿Sabías que...?',
    description: 'La CNEE no solo define los precios de energía a los usuarios residenciales, también supervisa que las empresas distribuidoras atiendan los reclamos.\n\nUna familia promedio en Guatemala consume entre 100 y 200 kWh al mes.\n\nPuedes solicitar gratis tu factura a la distribuidora si la perdiste.',
    image: require('../../assets/ultima.png'),
  },
];

export default function PreciosFacturaScreen() {
  const [step, setStep] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false); // no confetti en este módulo
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [moduleCorrect, setModuleCorrect] = useState(0);
  const [moduleTotal, setModuleTotal] = useState(0);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const startTimeRef = useRef<number>(Date.now());
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalData, setActivityModalData] = useState<{ title: string; message?: string; scoreText?: string; image: any } | null>(null);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const innerScrollViewRef = useRef<ScrollView>(null);
  const [footerHeight, setFooterHeight] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [scrollRequired, setScrollRequired] = useState(false);
  const navigation = useNavigation<PreciosFacturaScreenNavigationProp>();
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];
  const textLength = current.description?.length || 0;

  // Cálculo responsive refinado: la tarjeta crece solo lo necesario, deja un pequeño gap sobre el botón
  const topSafeSpace = height * 0.02; // deja más espacio al contenido
  const minGap = 6; // gap mínimo seguro justo encima del botón/barra
  const reservedGap = Math.max(height * 0.02, 12); // gap preferido
  const effectiveFooter = footerHeight && footerHeight > 0 ? footerHeight : height * 0.16; // fallback cuando aún no midió
  // padding vertical aproximado dentro de la tarjeta (padding top+bottom de la card + pequeños bordes)
  const chromePaddingApprox = width * 0.09 + 8;
  const safety = 2; // margen de seguridad para evitar solaparse por redondeos
  const availableHeightPreferred = Math.max(
    height - titleHeight - imageHeight - effectiveFooter - topSafeSpace - reservedGap - safety,
    height * 0.26  // Reducido de 0.30 a 0.26
  );
  // Espacio máximo estirable si el texto está a punto de caber (usando gap mínimo)
  let availableHeightMax = Math.max(
    height - titleHeight - imageHeight - effectiveFooter - topSafeSpace - minGap - safety,
    height * 0.28  // Reducido de 0.30 a 0.28
  );
  
  // Para tarjetas grandes, permitir más espacio pero no excesivo
  const willBeLargeCard = ['¿Por qué es importante revisar tu factura?', 'En resumen'].includes(current.title);
  if (willBeLargeCard) {
    availableHeightMax = Math.max(availableHeightMax, height * 0.50); // Hasta 50% de pantalla (un poco más pequeña)
  }

  // Estimación de contenido cuando aún no hay medición
  const descLineHeight = width * 0.065; // sincronizado con styles.description.lineHeight
  const estimatedContent = contentHeight || (textLength * (descLineHeight / 30));

  // Pasos con imagen más compacta para priorizar texto visible y reducir tamaño de contenido
  const compactImageSteps = [
    '¿Quién fija el precio de la luz?',
  ];
  
  // Pasos que necesitan imagen EXTRA compacta para que quepa todo sin scroll
  const extraCompactImageSteps: string[] = [
    // '¿Por qué es importante revisar tu factura?', - REMOVIDO: ahora usa tarjeta grande con imagen normal
  ];
  
  // "En resumen" con "Lo que aprendiste hoy" necesita imagen aún más pequeña
  const tinyImageForResumen = current.title === 'En resumen' && 
    current.description?.includes('Lo que aprendiste hoy');
  
  const isCompactImageStep = compactImageSteps.includes(current.title);
  const isExtraCompactImageStep = extraCompactImageSteps.includes(current.title);
  
  // Pasos que deben tener tamaño de tarjeta reducido (contenido corto) - REMOVIDOS los que necesitan más espacio
  const compactCardSteps: string[] = [
    // '¿Por qué es importante revisar tu factura?' - REMOVIDO: necesita ser más grande para leer todo
    // '2. Fecha de emisión y de vencimiento', - REMOVIDO para hacerlo más grande
    // '4. Cantidad a pagar', - REMOVIDO para hacerlo más grande
    // 'En resumen' - REMOVIDO para hacerlo MÁS GRANDE y aprovechar todo el espacio
  ];
  
  // Pasos que necesitan tarjetas GRANDES para mostrar todo el contenido sin scroll
  const largeCardSteps = [
    '¿Por qué es importante revisar tu factura?',
    'En resumen'
  ];
  
  const isCompactCardStep = compactCardSteps.includes(current.title);
  const isLargeCardStep = largeCardSteps.includes(current.title);

  // Altura deseada para mostrar todo el texto sin scroll (si cabe)
  // Altura objetivo para mostrar todo el texto (si cabe)
  const targetToFitAll = estimatedContent + chromePaddingApprox + 6; // buffer anti-redondeo

  // Lógica de altura: nunca exceder el espacio preferido salvo que sea necesario para que quepa todo
  let cardHeight = targetToFitAll <= availableHeightPreferred
    ? targetToFitAll
    : (targetToFitAll <= availableHeightMax ? targetToFitAll : availableHeightMax);
  
  // Para pasos que necesitan tarjetas GRANDES, usar más espacio pero equilibrado
  if (isLargeCardStep) {
    cardHeight = Math.max(cardHeight, height * 0.40); // Mínimo 40% de pantalla (un poco más pequeña)
    cardHeight = Math.min(cardHeight, height * 0.52); // Máximo 52% de pantalla (reducido)
  } else {
    cardHeight = Math.max(cardHeight, height * 0.25); // altura mínima más compacta solo para no-large
  }

  // Para pasos con contenido corto y conciso, usar tamaño más compacto y bien medido
  if (isCompactCardStep) {
    // Reduce aún más el tamaño - proporcional y compacto
    cardHeight = Math.min(cardHeight, height * 0.22); // Más compacto
  }

  // Altura máxima del área scrolleable interna, considerando el cromo de la tarjeta
  const innerScrollMaxHeight = Math.max(cardHeight - chromePaddingApprox, height * 0.22);

  // Evita marcar scroll por diferencias mínimas (tolerancia 2px)
  const hasScrollableContent = contentHeight - innerScrollMaxHeight > 2;
  const isLongContentStep = hasScrollableContent || textLength >= 300;
  const dynamicImageHeight = current.image
    ? (tinyImageForResumen ? height * 0.15 : // Imagen muy pequeña para "Lo que aprendiste hoy"
       isExtraCompactImageStep ? height * 0.16 : // Imagen extra compacta para "¿Por qué es importante...?"
       scrollRequired ? height * 0.18 : 
       isCompactImageStep ? height * 0.2 : 
       height * 0.25)
    : 0;


  // Animation values for curious fact
  const lightningOpacity = useRef(new Animated.Value(0)).current;
  const factScale = useRef(new Animated.Value(0.8)).current;

  // Steps with long info that require scroll to enable continue
  const infoStepsWithScroll = [
    '¿Quién fija el precio de la luz?',
    '¿Qué es el subsidio a la tarifa social?',
    '¿Cómo leer tu contador eléctrico?',
    '¿Qué contiene la factura eléctrica?',
    '¿Por qué es importante revisar tu factura?', // ACTIVADO: requiere scroll obligatorio para leer todo
  ];

  // Ya no bloquear "En resumen" porque ahora cabrá todo con la imagen pequeña
  const isScrollBlockStep = infoStepsWithScroll.includes(current.title);
  
  // Si es un paso con scroll obligatorio Y tarjeta grande, hacer la tarjeta más pequeña para forzar scroll
  if (isLargeCardStep && isScrollBlockStep) {
    cardHeight = Math.max(cardHeight, height * 0.30); // Más pequeña para forzar scroll
    cardHeight = Math.min(cardHeight, height * 0.38); // Máximo más bajo para garantizar scroll
  }
  
  // Bonus screen should NOT block
  const isBonusScreen = current.title === '¿Sabías que...?';

  // Reset scroll state when step changes (y mediciones)
  useEffect(() => {
    // Bonus screen doesn't require scrolling to continue
    setHasScrolledToEnd(!isScrollBlockStep || isBonusScreen);
    setTypewriterComplete(false);
    setContentHeight(0);
    setScrollViewHeight(0);
    setTitleHeight(0);
    setImageHeight(0);
    setScrollRequired(false);
  }, [step, isScrollBlockStep]);

  // Forzar scroll para pantallas de contenido largo obligatorio
  useEffect(() => {
    if (isScrollBlockStep) {
      // SIEMPRE forzar scroll para estas pantallas
      setScrollRequired(true);
    }
  }, [isScrollBlockStep]);

  // Detectar scroll al final para pasos informativos largos
  // Cargar progreso guardado
  useEffect(() => {
    const loadSavedProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          const progressData = await getProgress(uid);
          if (progressData && progressData['Precios y Factura']) {
            const savedStep = progressData['Precios y Factura'].step || 0;
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

  const handleScroll = (event: any) => {
    if (isScrollBlockStep) {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
      setHasScrolledToEnd(isEnd);
    }
  };

  const handleNext = async () => {
    if (step < lessonSteps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          await saveProgress(uid, 'Precios y Factura', {
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

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinish = async () => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      try {
        const profile = await getUserProfile(uid);
        
        await saveProgress(uid, 'Precios y Factura', { 
          step: lessonSteps.length, 
          score: moduleTotal > 0 ? Math.round((moduleCorrect / moduleTotal) * 100) : 100 
        });
        
        await incrementCompletedModules(uid, 'Precios y Factura');
        
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
        
        logger.log(`✅ Módulo Precios y Factura completado: +${totalPoints} puntos, Nivel: ${newLevel}`);
      } catch (error) {
        logger.error('Error al finalizar módulo:', error);
      }
    }
    setShowScoreModal(true);
  };

  // Acumular puntaje proveniente de trivias/actividades
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

  // Personas rotativas para modales de retroalimentación
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

  // Modales de actividad estandarizados
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

  return (
    <LinearGradient
      colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#2a3f6f', '#1f2d55']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.safeArea}
    >
      {/* Flecha de regreso */}
      {step > 0 && (
        <TouchableOpacity
          onPress={handleBack}
          style={{
            position: 'absolute',
            top: height * 0.02,
            left: width * 0.04,
            zIndex: 99,
            backgroundColor: 'rgba(88, 204, 247, 0.2)',
            borderRadius: 20,
            padding: 10,
            borderWidth: 2,
            borderColor: '#58CCF7',
          }}
        >
          <Text style={{ fontSize: 24, color: '#58CCF7' }}>←</Text>
        </TouchableOpacity>
      )}

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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(footerHeight, height * 0.16) + height * 0.06 }]}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {/* Título - Oculto para Story */}
        {!current.isStory && (
          <Text style={styles.title} onLayout={(e) => setTitleHeight(e.nativeEvent.layout.height)}>{current.title}</Text>
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
          <EnergyDragDropGame onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Completaste la actividad correctamente.' })} />
        ) : current.isTrueFalse ? (
          <TrueFalseQuiz
            questions={[
              {
                question: '¿Quién fija el precio de la electricidad en Guatemala?',
                options: ['Tu alcalde', 'La CNEE', 'La empresa distribuidora'],
                correctAnswer: 1,
                explanation: {
                  correct: 'la CNEE fija el precio de la electricidad para los usuarios residenciales.',
                  incorrect: 'la CNEE es la entidad que fija el precio de la electricidad para los usuarios residenciales.'
                }
              },
              {
                question: '¿De qué depende lo que pagas cada mes?',
                options: ['Del humor del cobrador', 'De cuánta electricidad consumes', 'De la cantidad de focos en tu casa'],
                correctAnswer: 1,
                explanation: {
                  correct: 'pagas según cuánta electricidad consumes (kWh).',
                  incorrect: 'lo que pagas depende de tu consumo real de electricidad en kWh.'
                }
              },
              {
                question: '¿Qué debes hacer si ves un error en tu factura?',
                options: ['Pagar igual', 'Reclamar a la empresa distribuidora', 'Esperar a que alguien arregle el error'],
                correctAnswer: 1,
                explanation: {
                  correct: 'debes reclamar a la empresa distribuidora si hay un error en tu factura.',
                  incorrect: 'en caso de error, no debes pagar. Debes reportar a la distribuidora si detectas un error en tu factura.'
                }
              }
            ]}
            onComplete={() => { /* modal mostrado en onResult */ }}
            onScored={(score, total) => {
              handleScoreAccumulate(score, total);
              openActivityModal({
                title: 'Mini quiz completado',
                message: 'Tu resultado:',
                scoreText: `${score} de ${total}`,
                image: require('../../assets/persona/persona5.png'),
              });
            }}
          />
        ) : current.isOrderDragDrop ? (
          <OrderDragDrop onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Ordenaste correctamente.' })} />
        ) : current.isInteractiveFactura ? (
          <InteractiveFactura onComplete={() => openFeedbackModal({ title: 'Exploración completada', message: 'Ya entiendes mejor tu factura.' })} />
        ) : current.isSimulation ? (
          <ConsumptionSimulator onComplete={() => openFeedbackModal({ title: 'Simulación completada', message: 'Revisaste cómo impacta el consumo en tu pago.' })} />
        ) : current.isTarifaSocialActivity ? (
          <DragDropOrder onComplete={() => openFeedbackModal({ title: 'Actividad completada', message: 'Ubicaste el rango de la tarifa social.' })} />
        ) : current.isMeterReading ? (
          <MeterReading onComplete={handleNext} />
        ) : current.isStory ? (
          current.slides ? (
            <SofiaStoryCard
              slides={current.slides}
              onComplete={() => openFeedbackModal({ title: 'Historia completada', message: 'Has seguido la historia con atención.' })}
            />
          ) : (
            <StoryCard onComplete={() => openFeedbackModal({ title: 'Historia completada', message: 'Has seguido la historia con atención.' })} />
          )
        ) : (
          <>
            {current.image && (
              <View style={styles.imageContainer}>
                <Image
                  source={current.image}
                  style={[styles.image, { height: dynamicImageHeight }]}
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
                {
                  // La tarjeta usa la altura calculada: si cabe todo, crece; si no, se limita y activa scroll
                  height: cardHeight,
                },
              ]}
            >
              {/* Border interior con gradiente */}
              <View style={styles.gradientBorder} />
              
              {/* Efectos de partículas removidos para estandarizar sin estrellas */}
              
              <ScrollView
                ref={innerScrollViewRef}
                style={[styles.descriptionScroll, { maxHeight: innerScrollMaxHeight }]}
                nestedScrollEnabled={true}
                scrollEnabled={true}
                showsVerticalScrollIndicator={true}
                persistentScrollbar={true}
                indicatorStyle="white"
                contentContainerStyle={{ 
                  paddingBottom: isScrollBlockStep ? height * 0.15 : Math.max(width * 0.02, 10)
                }}
                onScroll={(event) => {
                  const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                  const paddingToBottom = 20;
                  const isEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
                  if (isEnd && !hasScrolledToEnd) setHasScrolledToEnd(true);
                }}
                onLayout={(e) => {
                  const h = e.nativeEvent.layout.height;
                  if (Math.abs(h - scrollViewHeight) > 1) setScrollViewHeight(h);
                }}
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
      {!current.isTrivia && !current.isNewTrivia && !current.isGlossary && !current.isImageTrivia && !current.isDragDrop && !current.isStory && !current.isTrueFalse && !current.isOrderDragDrop && !current.isInteractiveFactura && !current.isSimulation && !current.isTarifaSocialActivity && !current.isMeterReading &&
        (!current.title.includes('específicamente') || typewriterComplete) && (
          <View style={styles.fixedBottom} onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}>
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
        )}

      {/* Modales estandarizados: actividad y resultado del módulo */}
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
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: width * 0.065,
                fontWeight: '900',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: height * 0.015,
                fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
              }}
            >
              Resultado del módulo
            </Text>
            <Text
              style={{
                fontSize: width * 0.08,
                fontWeight: '800',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: height * 0.015,
              }}
            >
              {moduleCorrect} de {moduleTotal}
            </Text>
            <Text
              style={{
                fontSize: width * 0.042,
                color: '#FFFFFF',
                opacity: 0.95,
                textAlign: 'center',
                marginBottom: height * 0.02,
              }}
            >
              {moduleTotal > 0 ? '¡Bien hecho! Sigue explorando para aprender más.' : 'Completa los mini quizes para obtener tu puntuación.'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowScoreModal(false);
                navigation.navigate('HomeMain');
              }}
              style={{ width: '100%' }}
            >
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
                <Text
                  style={{
                    fontSize: width * 0.05,
                    fontWeight: '800',
                    color: '#FFFFFF',
                  }}
                >
                  Listo
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </LinearGradient>
  );
}


