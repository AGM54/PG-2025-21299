import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Alert,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
// (revert) remove SVG-based arc; keep RN views/gradients only
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../firebase.config';
import { getProgress, saveProgress, getUserProfile, incrementCompletedModules } from '../lib/firestore';
import { useScreenTime } from '../hooks/useScreenTime';
import type { ProgressData } from '../lib/firestore';
import { MODULE_CONFIGS, calculateModuleProgress, calculateOverallProgress } from '../../utils/moduleConfig';
import { moderateScale as ms, msFont } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

// Mapa de módulos sin Electricidad - solo 5 módulos (UI information only)
const MODULES_UI_INFO: Record<string, { 
  screen: string; 
  icon: string;
  image: any;
  colors: string[];
  neonColor: string;
}> = {
  'CNEE': { 
    screen: 'Cnne', 
    icon: 'balance-scale',
    image: require('../../assets/progreso/cnee.png'),
    colors: ['#0f172a', '#1e293b', '#0f172a'],
    neonColor: '#00d4ff'
  },
  'Luz al Hogar': { 
    screen: 'LuzHogar', 
    icon: 'home',
    image: require('../../assets/progreso/luzhogar.png'),
    colors: ['#0f172a', '#1e293b', '#0f172a'],
    neonColor: '#00ff88'
  },
  'Precios y Factura': { 
    screen: 'PreciosFactura', 
    icon: 'file-invoice-dollar',
    image: require('../../assets/progreso/factura.png'),
    colors: ['#0f172a', '#1e293b', '#0f172a'],
    neonColor: '#ff0095'
  },
  'Obligaciones': { 
    screen: 'Obligaciones', 
    icon: 'hands-helping',
    image: require('../../assets/progreso/obligaciones.png'),
    colors: ['#0f172a', '#1e293b', '#0f172a'],
    neonColor: '#ffaa00'
  },
  'Alumbrado Público': { 
    screen: 'Alumbrado', 
    icon: 'lightbulb',
    image: require('../../assets/progreso/alumbrado.png'),
    colors: ['#0f172a', '#1e293b', '#0f172a'],
    neonColor: '#aa00ff'
  },
};

export const ProgressScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalPoints, setTotalPoints] = useState(0);
  
  // Animaciones
  const starRotation = useRef(new Animated.Value(0)).current;
  const starScale = useRef(new Animated.Value(1)).current;
  const progressAnimValue = useRef(new Animated.Value(0)).current;
  const ringRotation = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef<Animated.Value[]>([]).current;

  // Inicializar animaciones de tarjetas
  useEffect(() => {
    if (cardAnimations.length === 0) {
      for (let i = 0; i < 5; i++) {
        cardAnimations.push(new Animated.Value(0));
      }
    }
  }, []);

  // Track screen time for analytics
  useScreenTime('Progress');

  // Animación de estrella girando y pulsando
  useEffect(() => {
    const rotateAnimation = Animated.loop(
      Animated.timing(starRotation, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const scaleAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(starScale, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(starScale, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    rotateAnimation.start();
    scaleAnimation.start();

    const ringAnim = Animated.loop(
      Animated.timing(ringRotation, {
        toValue: 1,
        duration: 5000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    ringAnim.start();

    return () => {
      rotateAnimation.stop();
      scaleAnimation.stop();
      ringAnim.stop();
    };
  }, []);

  // Recargar datos cada vez que la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadProgress();
    }, [])
  );

  const loadProgress = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      const [userProgress, userProfile] = await Promise.all([
        getProgress(uid),
        getUserProfile(uid),
      ]);
      
      // Filtrar Electricidad del progreso
      const filteredProgress: ProgressData = {};
      if (userProgress) {
        Object.keys(userProgress).forEach(key => {
          if (key !== 'Electricidad') {
            filteredProgress[key] = userProgress[key];
          }
        });
      }
      
      setProgress(filteredProgress);
      setTotalPoints(userProfile?.points || 0);
      
      // Animar progreso circular usando pasos reales del moduleConfig
      const overallProg = calculateOverallProgress(filteredProgress);
      Animated.timing(progressAnimValue, {
        toValue: overallProg,
        duration: 1500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();

      // Animar tarjetas secuencialmente
      const animations = cardAnimations.map((anim, index) => 
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay: index * 100,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        })
      );
      Animated.stagger(100, animations).start();
    } catch (error) {
      console.error('Error cargando progreso:', error);
    } finally {
      setLoading(false);
    }
  };

  const getModuleProgress = (moduleName: string): number => {
    if (!progress || !progress[moduleName]) return 0;
    const currentStep = progress[moduleName].step || 0;
    return calculateModuleProgress(moduleName, currentStep);
  };

  const getOverallProgress = (): number => {
    return calculateOverallProgress(progress);
  };

  const handleContinue = (moduleName: string) => {
    const moduleInfo = MODULES_UI_INFO[moduleName];
    if (moduleInfo && navigation) {
      navigation.navigate('Home', { screen: moduleInfo.screen });
    }
  };

  const [showResetModal, setShowResetModal] = useState(false);
  const [resetModuleName, setResetModuleName] = useState('');

  const handleResetModule = async (moduleName: string) => {
    setResetModuleName(moduleName);
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    const uid = auth.currentUser?.uid;
    if (uid && resetModuleName) {
      await saveProgress(uid, resetModuleName, { step: 1, score: 0 });
      loadProgress();
    }
    setShowResetModal(false);
    setResetModuleName('');
  };

  const handleCompleteModule = async (moduleName: string) => {
    const uid = auth.currentUser?.uid;
    if (uid) {
      await incrementCompletedModules(uid, moduleName);
      Alert.alert('¡Felicidades!', `Has completado el módulo "${moduleName}"`);
      loadProgress();
    }
  };

  if (loading) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
          <Text style={styles.loadingText}>Cargando progreso...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const overallProgress = getOverallProgress();

  const starRotate = starRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const ringRotate = ringRotation.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  const progressColor = progressAnimValue.interpolate({
    inputRange: [0, 25, 50, 75, 100],
    outputRange: ['#ff6b6b', '#f5d020', '#6ee7b7', '#3b82f6', '#a855f7'],
  });

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Logo CNEE */}
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logoImage}
        resizeMode="contain"
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header con Progreso General */}
        <LinearGradient
          colors={['#1e40af', '#3b82f6', '#60a5fa']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerCard}
        >
          <View style={styles.headerContent}>
            <View style={styles.circularProgress}>
              <Animated.View style={[styles.gradientRingWrap, { transform: [{ rotate: ringRotate }] }]}>
                <LinearGradient
                  colors={['#ff6b6b', '#f5d020', '#6ee7b7', '#3b82f6', '#a855f7', '#ff6b6b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientRing}
                />
              </Animated.View>
              <View style={styles.progressCircle}>
                <Text style={styles.progressNumber}>{overallProgress}%</Text>
                <Text style={styles.progressLabel}>Completado</Text>
              </View>
            </View>
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <FontAwesome5 name="graduation-cap" size={30} color="#fff" />
                <Text style={styles.statValue}>
                  {Object.keys(MODULE_CONFIGS).filter((name) => {
                    const config = MODULE_CONFIGS[name];
                    const step = Math.min(progress?.[name]?.step || 0, config.totalSteps);
                    return step >= config.totalSteps;
                  }).length}
                  /{Object.keys(MODULE_CONFIGS).length}
                </Text>
                <Text style={styles.statLabel}>Completados</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Título */}
        <View style={styles.titleSection}>
          <FontAwesome5 name="tasks" size={24} color="#3b82f6" />
          <Text style={styles.titleText}>Mi Progreso por Módulo</Text>
        </View>

        {/* Módulos */}
        {Object.entries(MODULE_CONFIGS).map(([moduleName, moduleConfig], index) => {
          const moduleProgress = progress?.[moduleName];
          const progressPercent = getModuleProgress(moduleName);
          const hasStarted = moduleProgress !== undefined;
          const moduleUIInfo = MODULES_UI_INFO[moduleName];
          
          if (!moduleUIInfo) return null;

          const cardAnim = cardAnimations[index] || new Animated.Value(1);

          return (
            <Animated.View
              key={moduleName}
              style={[
                {
                  opacity: cardAnim,
                  transform: [
                    {
                      translateY: cardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                    {
                      scale: cardAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <LinearGradient
                colors={moduleUIInfo.colors as [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                  styles.moduleCard,
                  {
                    borderColor: moduleUIInfo.neonColor,
                    shadowColor: moduleUIInfo.neonColor,
                  }
                ]}
              >
                {/* Imagen del módulo */}
                <Image
                  source={moduleUIInfo.image}
                  style={[
                    styles.moduleImage,
                    moduleName === 'Precios y Factura' && styles.moduleImageLarge
                  ]}
                  resizeMode="contain"
                />
                
                <View style={styles.moduleHeader}>
                  <View style={styles.moduleTitle}>
                    <Text style={styles.moduleName}>{moduleName}</Text>
                  </View>
                  <View style={styles.progressBadge}>
                    <Text style={styles.progressBadgeText}>{progressPercent}%</Text>
                  </View>
                </View>

                {/* Círculo de progreso */}
            <View style={styles.moduleProgressContainer}>
              <View style={[styles.moduleProgressCircle, { borderColor: moduleUIInfo.neonColor }]}>
                <Text style={[styles.moduleProgressText, { color: moduleUIInfo.neonColor }]}>
                  {progressPercent}%
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.moduleStatusText}>
                  {hasStarted 
                    ? `Paso ${Math.min(moduleProgress.step, moduleConfig.totalSteps)} de ${moduleConfig.totalSteps}`
                    : 'No iniciado'
                  }
                </Text>
                {hasStarted && moduleProgress.score !== undefined && (
                  <Text style={[styles.moduleStatusText, { fontSize: 12, opacity: 0.8, marginTop: 4 }]}>
                    Score: {moduleProgress.score}%
                  </Text>
                )}
              </View>
            </View>

                {/* Botones de Acción */}
                <View style={styles.actionsRow}>
                  {hasStarted ? (
                    <>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.primaryAction]}
                        onPress={() => handleContinue(moduleName)}
                      >
                        <FontAwesome5 name="play" size={16} color="#1e293b" />
                        <Text style={styles.actionButtonText}>Continuar</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.actionButton, styles.secondaryAction]}
                        onPress={() => handleResetModule(moduleName)}
                      >
                        <FontAwesome5 name="redo-alt" size={16} color="#6b7280" />
                        <Text style={styles.secondaryActionText}>Reiniciar</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <TouchableOpacity
                      style={[styles.actionButton, styles.startAction]}
                      onPress={() => handleContinue(moduleName)}
                    >
                      <FontAwesome5 name="rocket" size={16} color="#1e293b" />
                      <Text style={styles.actionButtonText}>Comenzar</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          );
        })}

        {/* Consejos */}
        <LinearGradient
          colors={['#0b1020', '#0f172a', '#0b1020']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.tipsCard}
        >
          <FontAwesome5 name="lightbulb" size={22} color="#3b82f6" />
          <Text style={styles.tipsTitle}>Consejos rápidos</Text>
          <Text style={styles.tipsText}>
            Completa los pasos y repasa los quizzes. Mantén tu racha activa.
          </Text>
        </LinearGradient>
      </ScrollView>

      {/* Modal de Confirmación de Reinicio con Degradado */}
      {showResetModal && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: width * 0.05,
          }}
        >
          <View
            style={{
              width: width * 0.9,
              borderRadius: 20,
              borderWidth: 3,
              borderColor: '#DC3545',
              overflow: 'hidden',
              shadowColor: '#DC3545',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.6,
              shadowRadius: 20,
              elevation: 20,
            }}
          >
            <LinearGradient
              colors={['#1f2d55', '#2a3f6f', '#DC3545']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ padding: width * 0.06 }}
            >
              <Text
                style={{
                  fontSize: width * 0.065,
                  fontWeight: '900',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginBottom: height * 0.02,
                  fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
                }}
              >
                Reiniciar Módulo
              </Text>
              <Text
                style={{
                  fontSize: width * 0.042,
                  fontWeight: '600',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  lineHeight: width * 0.06,
                  marginBottom: height * 0.03,
                  fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
                }}
              >
                ¿Estás seguro de que quieres reiniciar "{resetModuleName}"? Perderás todo el progreso.
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => setShowResetModal(false)}
                >
                  <LinearGradient
                    colors={['#6b7280', '#9ca3af']}
                    style={{
                      paddingVertical: height * 0.02,
                      borderRadius: 15,
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: width * 0.045,
                        fontWeight: '800',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
                      }}
                    >
                      Cancelar
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={confirmReset}
                >
                  <LinearGradient
                    colors={['#DC3545', '#FF6B6B']}
                    style={{
                      paddingVertical: height * 0.02,
                      borderRadius: 15,
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                  >
                    <Text
                      style={{
                        fontSize: width * 0.045,
                        fontWeight: '800',
                        color: '#FFFFFF',
                        textAlign: 'center',
                        fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
                      }}
                    >
                      Reiniciar
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2D55', // Igual que Home
  },
  logoImage: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? height * 0.06 : height * 0.02,
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
  },
  scrollContent: {
    padding: width * 0.05,
    paddingTop: height * 0.08,
    paddingBottom: height * 0.20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: msFont(16),
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  headerCard: {
    borderRadius: 28,
    padding: ms(28),
    marginBottom: height * 0.03,
    marginTop: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circularProgress: {
    width: ms(140),
    height: ms(140),
    borderRadius: ms(70),
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gradientRingWrap: {
    position: 'absolute',
    width: ms(140),
    height: ms(140),
    borderRadius: ms(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradientRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: ms(70),
    opacity: 0.9,
  },
  progressCircle: {
    width: ms(115),
    height: ms(115),
    borderRadius: ms(58),
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  progressNumber: {
    fontSize: msFont(36),
    fontWeight: 'bold',
    color: '#1e40af',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  progressLabel: {
    fontSize: msFont(14),
    color: '#6b7280',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    fontWeight: '600',
  },
  // removed time meta on Progress header
  headerStats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginLeft: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: msFont(28),
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  statLabel: {
    fontSize: msFont(14),
    color: 'rgba(255,255,255,0.9)',
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    fontWeight: '600',
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  titleText: {
    fontSize: msFont(22),
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  moduleCard: {
    borderRadius: 24,
    padding: ms(20),
    marginBottom: 20,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 15,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 200,
    borderWidth: 2,
  },
  moduleImage: {
    position: 'absolute',
    top: ms(15),
    right: ms(20),
    width: ms(110),
    height: ms(110),
    zIndex: 1,
  },
  moduleImageLarge: {
    width: ms(130),
    height: ms(130),
    top: ms(5),
    right: ms(10),
  },
  moduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    zIndex: 0,
    position: 'relative',
  },
  moduleTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
  },
  moduleProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  moduleProgressCircle: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginRight: ms(12),
  },
  moduleProgressText: {
    fontSize: msFont(14),
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  moduleStatusText: {
    fontSize: msFont(14),
    color: '#ffffff',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    flex: 1,
  },
  moduleName: {
    fontSize: msFont(20),
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  progressBadge: {
    backgroundColor: 'transparent',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    display: 'none',
  },
  progressBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: msFont(14),
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  progressBarContainer: {
    marginBottom: 8,
    zIndex: 0,
    position: 'relative',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressBarFill: {
    height: '100%',
  },
  progressText: {
    fontSize: msFont(13),
    color: '#ffffff',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    zIndex: 0,
    position: 'relative',
  },
  scoreText: {
    fontSize: msFont(14),
    color: '#ffffff',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    zIndex: 0,
    position: 'relative',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(12),
    paddingHorizontal: ms(16),
    borderRadius: 12,
    gap: ms(8),
  },
  primaryAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  startAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  secondaryAction: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  successAction: {
    backgroundColor: '#10b981',
    flex: 0,
    paddingHorizontal: 16,
  },
  actionButtonText: {
    color: '#1e293b',
    fontWeight: '700',
    fontSize: msFont(14),
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  secondaryActionText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: msFont(14),
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  tipsCard: {
    borderRadius: 16,
    padding: ms(20),
    marginTop: 10,
    marginBottom: height * 0.02,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: msFont(18),
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 8,
    marginBottom: ms(12),
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  tipsText: {
    fontSize: msFont(14),
    color: '#cbd5e1',
    lineHeight: msFont(20),
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
});

export default ProgressScreen;
