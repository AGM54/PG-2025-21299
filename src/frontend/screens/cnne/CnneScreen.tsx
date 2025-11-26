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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/MainStackNavigator';
import TriviaCard from '../../components/TriviaCard/TriviaCard';
import TriviaCardScreen5 from '../../components/TriviaCard/TriviaCardScreen5';
import DiegoTrivia from '../../components/TriviaCard/DiegoTrivia';
import GlossaryGame from '../../components/GlossaryGame/GlossaryGame_fixed';
import TypewriterList from '../../components/TypewriterText/TypewriterList';
import ImageTriviaCard from '../../components/ImageTriviaCard/ImageTriviaCard';
import DiegoStoryCard from '../../components/DiegoStoryCard/DiegoStoryCard';
import { Confetti } from '../../components/TriviaCard/Confetti';
import { auth, db } from '../../firebase.config';
import { saveProgress, incrementCompletedModules, addPoints, addTotalTime, getUserProfile, updateDoc, doc, getProgress } from '../../src/lib/firestore';
import { logger } from '../../utils/logger';

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

type CnneScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Cnne'>;

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
  isDiegoTrivia?: boolean;
  isSabias?: boolean;
}

const lessonSteps: LessonStep[] = [
  {
    title: 'Bienvenida',
    description: 'Hoy conocerás una institución muy importante para Guatemala: la Comisión Nacional de Energía Eléctrica o CNEE.',
    image: require('../../assets/original.png'),
  },
  {
    title: '¿Qué es la CNEE?',
    description: 'La CNEE es la institución que lidera el desarrollo del sector eléctrico en Guatemala.\n\nLa CNEE no produce electricidad, pero, en su calidad de ente regulador, trabaja todos los días para que los guatemaltecos recibamos un servicio de energía de calidad, sin cortes y con precios estables.',
    image: require('../../assets/imagen.png'),
  },
  {
    title: '¿Qué hace la CNEE?',
    description: `La CNEE tiene 6 funciones:

1. Cumplir y hacer cumplir la Ley General de Electricidad y sus reglamentos.

2. Velar por el cumplimiento de las obligaciones de las empresas del sector, proteger los derechos de los usuarios y prevenir conductas atentatorias contra la libre competencia, así como prácticas abusivas y discriminatorias.

3. Definir las tarifas de transmisión y distribución sujetas a regulación.

4. Dirimir las controversias que surjan entre las empresas del sector eléctrico cuando éstas no hayan llegado a un acuerdo.

5. Emitir las normas técnicas relativas al sector eléctrico y fiscalizar su cumplimiento.

6. Emitir las disposiciones y normativas para garantizar el libre acceso y uso de las líneas de transmisión y redes de distribución.`,
  },
  {
    title: 'Comprueba lo que has aprendido',
    isTrivia: true,
  },
  {
    title: '¿Qué ha logrado la CNEE?',
    description: `Inversión extranjera: empresas de otros países han invertido en Guatemala, generando empleo.

Infraestructura moderna: se han construido redes eléctricas nuevas y seguras.

Trámites más rápidos y sencillos para los usuarios.

Un servicio de energía seguro y de calidad.

Precios estables.`,
    isAchievements: true,
  },
  {
    title: 'Trivia - ¡Pon a prueba tu conocimiento!',
    isNewTrivia: true,
  },
  {
    title: 'Glosario animado',
    isGlossary: true,
  },
  {
    title: 'La CNEE actúa para que la energía llegue a tu hogar',
    description: 'La CNEE no genera ni distribuye energía, pero supervisa que todo funcione bien. Vigila que las empresas cumplan y que las personas reciban un servicio de energía fluido, de calidad y confiable.',
    image: require('../../assets/guardian.png'),
  },
  {
    title: '¿Cómo vemos la función reguladora de la CNEE?',
    description: `Cuando enciendes la luz en tu cuarto.

Cuando cargas tu celular.

Cuando tu familia paga el recibo de la luz.

Cuando se va la energía y vuelve rápido.

Cuando exiges a la distribuidora que no te cobren de más.`,
    image: require('../../assets/cinco.png'),
  },
  {
    title: 'Actividad: Relaciona cada situación y decide si es regulada o no por la CNEE',
    isImageTrivia: true,
  },
  {
    title: 'Conoce a Diego y cómo descubre la CNEE',
    isStory: true,
  },
  {
    title: 'Actividad: ¿Qué aprendió Diego?',
    isDiegoTrivia: true,
  },
  {
    title: '¿SABÍAS QUE...?',
    isSabias: true,
    description: 'La CNEE se financia con una tasa del 0.3% sobre la venta de energía por parte de las empresas distribuidoras, no con nuestros impuestos.'
  },
  
];

export default function CnneScreen() {
  const [step, setStep] = useState(0);
  const [typewriterComplete, setTypewriterComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasScrolledToEnd, setHasScrolledToEnd] = useState(false);
  const [showSabiasInfo, setShowSabiasInfo] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [moduleCorrect, setModuleCorrect] = useState(0);
  const [moduleTotal, setModuleTotal] = useState(0);
  const [currentUserPoints, setCurrentUserPoints] = useState(0);
  const [titleHeight, setTitleHeight] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const innerScrollViewRef = useRef<ScrollView>(null);
  const startTimeRef = useRef(Date.now());
  
  // Estados para modales de retroalimentación
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [activityModalData, setActivityModalData] = useState<{ title: string; message?: string; scoreText?: string; image: any } | null>(null);
  
  // Ciclo de imágenes de personas para retroalimentación
  const personaCycle = [
    require('../../assets/persona/persona.png'),
    require('../../assets/persona/persona2.png'),
    require('../../assets/persona/persona3.png'),
    require('../../assets/persona/persona4.png'),
    require('../../assets/persona/persona5.png'),
    require('../../assets/persona/persona6.png'),
  ];
  const personaIdxRef = useRef(0);

  const navigation = useNavigation<CnneScreenNavigationProp>();
  const progress = (step + 1) / lessonSteps.length;
  const current = lessonSteps[step];

  // Cargar progreso guardado al iniciar
  useEffect(() => {
    const loadSavedProgress = async () => {
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          const progressData = await getProgress(uid);
          if (progressData && progressData['CNEE']) {
            const savedStep = progressData['CNEE'].step || 0;
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

  // Calcular altura de tarjeta basada en cantidad de texto - RESPONSIVO MEJORADO
  const textLength = current.description?.length || 0;
  let cardHeight;
  
  // Ajustar alturas según tipo de dispositivo
  const heightMultiplier = isTablet ? 0.85 : 1; // Reducir en tablets
  
  // Pantalla especial "¿Cómo vemos..." requiere scroll forzado
  if (current.title === '¿Cómo vemos la función reguladora de la CNEE?') {
    cardHeight = height * 0.38 * heightMultiplier; // Altura reducida para forzar scroll
  } else if (textLength < 120) {
    // Texto MUY corto (Bienvenida) - tarjeta pequeña
    cardHeight = height * 0.30 * heightMultiplier;
  } else if (textLength < 200) {
    // Texto corto-medio (La CNEE actúa...) - tarjeta mediana
    cardHeight = height * 0.40 * heightMultiplier;
  } else if (textLength < 350) {
    // Texto medio (¿Qué es la CNEE?, ¿Qué ha logrado?) - tarjeta grande
    cardHeight = height * 0.48 * heightMultiplier;
  } else {
    // Texto largo (¿Qué hace la CNEE?) - tarjeta extra grande con scroll interno
    cardHeight = height * 0.58 * heightMultiplier;
  }

  // Steps que tienen contenido largo y REQUIEREN que el usuario lea todo antes de continuar
  const longContentSteps: string[] = [
    '¿Qué hace la CNEE?',
    '¿Qué ha logrado la CNEE?',
    '¿Cómo vemos la función reguladora de la CNEE?',
  ];

  const isLongContentStep = longContentSteps.includes(current.title);
  
  // Detectar si el contenido excede el espacio disponible
  const hasScrollableContent = contentHeight > scrollViewHeight;

  // Reset scroll state cuando cambia el step
  useEffect(() => {
    setHasScrolledToEnd(false);
    setTypewriterComplete(true);
    setContentHeight(0);
    setScrollViewHeight(0);
  }, [step]);
  
  // Para steps largos, el usuario DEBE hacer scroll hasta el final
  useEffect(() => {
    // Solo para steps con contenido largo
    if (!isLongContentStep) {
      setHasScrolledToEnd(true);
      return;
    }
    
    // NO auto-habilitar automáticamente - el usuario debe leer todo
    setHasScrolledToEnd(false);
  }, [step, isLongContentStep]);

  // Detectar cuando el usuario hace scroll al final del contenido
  const handleInnerScroll = (event: any) => {
    try {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const paddingToBottom = 20;
      const isNearEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
      
      if (isNearEnd && !hasScrolledToEnd) {
        setHasScrolledToEnd(true);
      }
    } catch (error) {
      // Si hay error, permitir continuar
      setHasScrolledToEnd(true);
    }
  };

  const handleNext = async () => {
    if (step < lessonSteps.length - 1) {
      const nextStep = step + 1;
      setStep(nextStep);
      
      // Guardar progreso en Firebase
      const uid = auth.currentUser?.uid;
      if (uid) {
        try {
          await saveProgress(uid, 'CNEE', {
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
        const profile = await getUserProfile(uid);
        
        // Guardar progreso final ANTES de incrementar
        await saveProgress(uid, 'CNEE', { 
          step: lessonSteps.length, 
          score: moduleTotal > 0 ? Math.round((moduleCorrect / moduleTotal) * 100) : 100 
        });

        // Incrementar módulos completados solo si es primera vez
        await incrementCompletedModules(uid, 'CNEE');

        // Calcular y agregar puntos
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
        
        if (newLevel > (profile?.level || 1)) {
          const profileRef = doc(db, 'profiles', uid);
          await updateDoc(profileRef, { level: newLevel });
        }

        logger.log(`✅ Módulo CNEE completado: +${totalPoints} puntos, Nivel: ${newLevel}`);
      } catch (error) {
        logger.error('Error al finalizar módulo:', error);
      }
    }
    
    setTimeout(() => {
      setShowConfetti(false);
      setFinishing(false);
      try {
        navigation.navigate('HomeMain');
      } catch (e) {
        logger.warn('Navigation failed on finish', e);
      }
    }, 2200);
  };

  // Acumular puntos de trivias (corrects e incorrects)
  const handleScoreAccumulate = async (correct: number, total: number) => {
    setModuleCorrect(prev => prev + correct);
    setModuleTotal(prev => prev + total);
    
    const uid = auth.currentUser?.uid;
    if (uid) {
      // +10 puntos por correcta, -5 por incorrecta
      const incorrect = total - correct;
      const pointsEarned = (correct * 10) - (incorrect * 5);
      if (pointsEarned !== 0) {
        await addPoints(uid, pointsEarned);
        setCurrentUserPoints(prev => prev + pointsEarned);
      }
    }
  };

  // Funciones para modales de retroalimentación
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


  return (
    <View style={{ flex: 1, backgroundColor: '#1f2d55' }}>
      <LinearGradient
        colors={['#1f2d55', '#2a3f6f', '#1f2d55', '#2a3f6f', '#1f2d55']}
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
          contentContainerStyle={[styles.scrollContent, { paddingBottom: footerHeight + height * 0.15 }]}
          showsVerticalScrollIndicator={true}
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
            <TriviaCard 
              onComplete={() => {
                // No avanzar automáticamente, el modal lo hará
              }} 
              onScored={(score, total) => {
                handleScoreAccumulate(score, total);
                openFeedbackModal({ 
                  title: '¡Excelente trabajo!', 
                  message: 'Has completado la actividad.',
                  scoreText: `${score}/${total}`
                });
              }} 
            />
          ) : current.isNewTrivia ? (
            <TriviaCardScreen5 
              onComplete={() => {
                // No avanzar automáticamente, el modal lo hará
              }} 
              onScored={(score, total) => {
                handleScoreAccumulate(score, total);
                openFeedbackModal({ 
                  title: '¡Muy bien!', 
                  message: 'Continuemos aprendiendo.',
                  scoreText: `${score}/${total}`
                });
              }} 
            />
          ) : current.isDiegoTrivia ? (
            <DiegoTrivia 
              onComplete={handleNext} 
              onScored={handleScoreAccumulate}
            />
          ) : current.isSabias ? (
            // SABÍAS QUE screen: show a button that reveals the fact, and allow continue
            <>
              {current.image && (
                <Image
                  source={current.image}
                  onLayout={(e) => setImageHeight(e.nativeEvent.layout.height)}
                  style={current.title === '¿Cómo vemos la función reguladora de la CNEE?' ? styles.imageCinco : styles.image}
                />
              )}

              <LinearGradient
                colors={['rgba(31, 45, 85, 0.9)', 'rgba(31, 45, 85, 0.95)', 'rgba(31, 45, 85, 0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.descriptionCard}
              >
                <View style={styles.gradientBorder} />
                <View style={{ padding: 18 }}>
                  {!showSabiasInfo ? (
                    <TouchableOpacity
                      onPress={() => setShowSabiasInfo(true)}
                      style={[styles.button, { marginTop: 18 }]}
                    >
                      <Text style={styles.buttonText}>¿SABÍAS QUE...?</Text>
                    </TouchableOpacity>
                  ) : (
                    <>
                      <View style={{ marginTop: 8 }}>
                        <Text style={[styles.description, { fontWeight: '600' }]}>{current.description}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={handleFinish}
                        style={[styles.button, { marginTop: 18, alignSelf: 'center' }]}
                        disabled={finishing}
                      >
                        <Text style={styles.buttonText}>{finishing ? 'Finalizando...' : 'Continuar'}</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </LinearGradient>
            </>
          ) : current.isGlossary ? (
            <GlossaryGame onComplete={handleNext} />
          ) : current.isImageTrivia ? (
            <ImageTriviaCard onComplete={handleNext} />
          ) : current.isStory ? (
            <DiegoStoryCard onComplete={handleNext} />
          ) : (
            <>
              {current.image && (
                <Image
                  source={current.image}
                  onLayout={(e) => setImageHeight(e.nativeEvent.layout.height)}
                  style={
                    current.title === '¿Cómo vemos la función reguladora de la CNEE?' 
                      ? styles.imageCinco 
                      : current.title === 'La CNEE actúa para que la energía llegue a tu hogar'
                      ? { width: width * 0.6, height: width * 0.4, resizeMode: 'contain', alignSelf: 'center', marginTop: height * 0.01, marginBottom: height * 0.015 }
                      : styles.image
                  }
                />
              )}
              {/* Tarjeta de información con diseño profesional */}
              <LinearGradient
                colors={['rgba(31, 45, 85, 0.9)', 'rgba(31, 45, 85, 0.95)', 'rgba(31, 45, 85, 0.9)']}
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
                  style={styles.descriptionScroll}
                  contentContainerStyle={{ paddingBottom: height * 0.03 }}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={true}
                  onScroll={handleInnerScroll}
                  scrollEventThrottle={16}
                  onLayout={(e) => setScrollViewHeight(e.nativeEvent.layout.height)}
                  onContentSizeChange={(w, h) => setContentHeight(h)}
                >
                  {/* Indicador de scroll para contenido largo */}
                  {isLongContentStep && hasScrollableContent && !hasScrolledToEnd && (
                    <View style={styles.scrollIndicatorTop}>
                      <Text style={styles.scrollIndicatorTextTop}>⬇ Desliza para leer todo ⬇</Text>
                    </View>
                  )}

                  {current.title === '¿Cómo vemos la función reguladora de la CNEE?' && current.description ? (
                    <View style={{ paddingVertical: scaleSpace(height * 0.015) }}>
                      {current.description.split('\n\n').map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', marginBottom: scaleSpace(height * 0.015), alignItems: 'flex-start' }}>
                          <Text style={[styles.description, { marginRight: 8, fontSize: scale(isTablet ? width * 0.035 : width * 0.042) }]}>•</Text>
                          <Text style={[styles.description, { flex: 1 }]}>
                            {item.replace('●  ', '').trim()}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ) : current.title === '¿Qué hace la CNEE?' && current.description ? (
                    <View style={{ paddingVertical: scaleSpace(height * 0.015) }}>
                      {current.description.split('\n\n').filter(line => line.trim()).map((item, index) => {
                        // Si es la primera línea (título)
                        if (index === 0) {
                          return (
                            <Text key={index} style={[styles.description, { fontWeight: '600', marginBottom: scaleSpace(height * 0.012) }]}>
                              {item}
                            </Text>
                          );
                        }
                        // Las demás son items numerados
                        return (
                          <View key={index} style={{ flexDirection: 'row', marginBottom: scaleSpace(height * 0.012), alignItems: 'flex-start' }}>
                            <Text style={[styles.description, { marginRight: 8, minWidth: width * 0.05 }]}>
                              {item.match(/^\d+\./) ? item.match(/^\d+\./)?.[0] : '•'}
                            </Text>
                            <Text style={[styles.description, { flex: 1 }]}>
                              {item.replace(/^\d+\.\s*/, '').trim()}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : current.title === '¿Qué ha logrado la CNEE?' && current.description ? (
                    <View style={{ paddingVertical: scaleSpace(height * 0.015) }}>
                      {current.description.split('\n\n').filter(line => line.trim()).map((item, index) => {
                        // Si es la primera línea, saltarla (no hay título en este caso)
                        return (
                          <View key={index} style={{ flexDirection: 'row', marginBottom: scaleSpace(height * 0.015), alignItems: 'flex-start' }}>
                            <Text style={[styles.description, { marginRight: 8, fontSize: scale(isTablet ? width * 0.035 : width * 0.042) }]}>•</Text>
                            <Text style={[styles.description, { flex: 1 }]}>
                              {item.trim()}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  ) : (
                    <Text style={styles.description}>{current.description || ''}</Text>
                  )}
                </ScrollView>
              </LinearGradient>
            </>
          )}
        </ScrollView>
      </LinearGradient>

  {/* Elementos fijos en la parte inferior - Ocultos durante la trivia */}
  {!current.isTrivia && !current.isNewTrivia && !current.isGlossary && !current.isImageTrivia && !current.isStory && !current.isDiegoTrivia && !current.isSabias && (
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
                (isLongContentStep && hasScrollableContent && !hasScrolledToEnd) && styles.disabledButton
              ]}
              onPress={handleNext}
              disabled={isLongContentStep && hasScrollableContent && !hasScrolledToEnd}
            >
              <Text style={[
                styles.buttonText,
                (isLongContentStep && hasScrollableContent && !hasScrolledToEnd) && styles.disabledButtonText
              ]}>
                {(isLongContentStep && hasScrollableContent && !hasScrolledToEnd) ? 'Lee todo el contenido' : 'Continuar'}
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

      {/* Modal de retroalimentación con personaje */}
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

      {/* Confetti Effect */}
  {showConfetti && <Confetti />}
    </View>
  );
}

