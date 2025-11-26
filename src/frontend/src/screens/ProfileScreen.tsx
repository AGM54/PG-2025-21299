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
  Platform,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../firebase.config';
import { getUserProfile, getProgress } from '../lib/firestore';
import type { UserProfile, ProgressData } from '../lib/firestore';
import { getCompletedModulesCount, calculateOverallProgress, calculateUserLevel } from '../../utils/moduleConfig';
import { moderateScale as ms, msFont } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

export const ProfileScreen: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Animaciones
  const fireAnimation = useRef(new Animated.Value(0)).current;
  const barAnimation = useRef(new Animated.Value(0)).current;
  const progressBarAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de fuego
    Animated.loop(
      Animated.sequence([
        Animated.timing(fireAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(fireAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Animación inicial de barras subiendo
    Animated.parallel([
      Animated.timing(barAnimation, {
        toValue: 1,
        duration: 1200,
        delay: 300,
        useNativeDriver: false,
      }),
      Animated.timing(progressBarAnimation, {
        toValue: 1,
        duration: 1500,
        delay: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // Recargar datos cada vez que la pantalla recibe foco
  useFocusEffect(
    React.useCallback(() => {
      loadUserData();
    }, [])
  );

  const loadUserData = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    setLoading(true);
    try {
      const [userProfile, userProgress] = await Promise.all([
        getUserProfile(uid),
        getProgress(uid),
      ]);
      setProfile(userProfile);
      setProgress(userProgress);
    } catch (error) {
      console.error('Error cargando datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms: number): string => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m`;
    } else {
      return '0m';
    }
  };

  const getProgressPercentage = (): number => {
    return calculateOverallProgress(progress);
  };

  const getLevelName = (level: number): string => {
    if (level >= 10) return 'Maestro de la Energía';
    if (level >= 7) return 'Experto en Energía';
    if (level >= 5) return 'Estudiante Avanzado';
    if (level >= 3) return 'Aprendiz de Energía';
    return 'Explorador de Energía';
  };

  const getCompletedModules = (): number => {
    return getCompletedModulesCount(progress);
  };

  const getCurrentLevel = (): number => {
    return calculateUserLevel(getCompletedModules());
  };

  const fireScale = fireAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.1],
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#1e1b4b', '#312e81', '#1e1b4b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#a855f7" />
          <Text style={styles.loadingText}>Cargando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2D55', '#2a3f6f', '#1F2D55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
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
        {/* Tarjeta Principal del Perfil - Estilo Gato */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.cardGradient}
          >
            {/* Imagen del perfil que llena el área superior */}
            <View style={styles.profileImageContainer}>
              <View style={styles.imageWrapper}>
                <Image
                  source={require('../../assets/persona.png')}
                  style={styles.profileImage}
                  resizeMode="contain"
                />
              </View>
              {/* Badge de nivel estático */}
              <View style={styles.levelBadgeTop}>
                <LinearGradient
                  colors={['#fbbf24', '#f59e0b']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.levelBadgeGradient}
                >
                  <MaterialCommunityIcons name="shield-star" size={18} color="#fff" />
                  <Text style={styles.levelBadgeText}>{getCurrentLevel()}</Text>
                </LinearGradient>
              </View>
            </View>

            {/* Nombre del usuario */}
            <Text style={styles.profileName}>{profile?.displayName || 'Usuario'}</Text>
            <Text style={styles.profileSubtitle}>{getLevelName(getCurrentLevel())}</Text>

            {/* Estadísticas con iconos */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Image 
                  source={require('../../assets/iconos/sombrero.png')} 
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={styles.statLabel}>Nivel</Text>
                <Text style={styles.statValue}>{getCurrentLevel()}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Animated.View style={{ transform: [{ scale: fireScale }] }}>
                  <Image 
                    source={require('../../assets/iconos/fuego.png')} 
                    style={styles.statIcon}
                    resizeMode="contain"
                  />
                </Animated.View>
                <Text style={styles.statLabel}>Racha</Text>
                <Text style={styles.statValue}>{profile?.streakDays || 0}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Image 
                  source={require('../../assets/iconos/trofeo.png')} 
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={styles.statLabel}>Puntos</Text>
                <Text style={styles.statValue}>{profile?.points || 0}</Text>
              </View>
              
              <View style={styles.statItem}>
                <Image 
                  source={require('../../assets/iconos/libros.png')} 
                  style={styles.statIcon}
                  resizeMode="contain"
                />
                <Text style={styles.statLabel}>Módulos</Text>
                <Text style={styles.statValue}>{getCompletedModules()}/5</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Tarjetas con Gráficos */}
        <View style={styles.graphCardsContainer}>
          {/* Tarjeta de Progreso de Aprendizaje */}
          <View style={styles.graphCard}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.graphCardGradient}
            >
              <View style={styles.graphCardHeader}>
                <MaterialCommunityIcons name="chart-line" size={24} color="#fff" />
                <View style={styles.graphCardTitleContainer}>
                  <Text style={styles.graphCardTitle}>Progreso</Text>
                  <Text 
                    style={styles.graphCardValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.7}
                  >
                    {getProgressPercentage()}%
                  </Text>
                </View>
              </View>
              
              {/* Gráfico de onda simplificado */}
              <View style={styles.waveChart}>
                <View style={styles.waveLine} />
                <View style={styles.waveLineAlt} />
              </View>
            </LinearGradient>
          </View>

          {/* Tarjeta de Tiempo de Estudio */}
          <View style={styles.graphCard}>
            <LinearGradient
              colors={['#eab308', '#ca8a04']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.graphCardGradient}
            >
              <View style={styles.graphCardHeader}>
                <MaterialCommunityIcons name="clock-outline" size={24} color="#fff" />
                <View style={styles.graphCardTitleContainer}>
                  <Text style={styles.graphCardTitle}>Tiempo</Text>
                  <Text 
                    style={styles.graphCardValue}
                    numberOfLines={1}
                    adjustsFontSizeToFit={true}
                    minimumFontScale={0.7}
                  >
                    {formatTime(profile?.totalTimeMs || 0)}
                  </Text>
                </View>
              </View>
              
              {/* Gráfico de barras con animación */}
              <View style={styles.barChart}>
                <Animated.View style={[styles.bar, { height: barAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', '40%']}) }]} />
                <Animated.View style={[styles.bar, { height: barAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', '65%']}) }]} />
                <Animated.View style={[styles.bar, { height: barAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', '50%']}) }]} />
                <Animated.View style={[styles.bar, { height: barAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', '80%']}) }]} />
                <Animated.View style={[styles.bar, { height: barAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', '70%']}) }]} />
                <Animated.View style={[styles.bar, { height: barAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', '90%']}) }]} />
                <Animated.View style={[styles.bar, { height: barAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', '75%']}) }]} />
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Barra de Progreso General */}
        <View style={styles.progressSection}>
          <LinearGradient
            colors={['#f3e8ff', '#ede9fe']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.progressGradient}
          >
            <View style={styles.progressHeader}>
              <View style={styles.progressTitleRow}>
                <MaterialCommunityIcons name="star-circle" size={22} color="#20d4c8" />
                <Text style={styles.sectionTitle}>Progreso General</Text>
              </View>
              <Text style={styles.progressPercent}>{getProgressPercentage()}%</Text>
            </View>
            <View style={styles.progressBar}>
              <Animated.View style={{ width: progressBarAnimation.interpolate({inputRange: [0, 1], outputRange: ['0%', `${getProgressPercentage()}%`]}) }}>
                <LinearGradient
                  colors={['#20d4c8', '#14b8a6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.progressFill}
                />
              </Animated.View>
            </View>
            <Text style={styles.progressText}>
              {getCompletedModules()} de 5 módulos completados
            </Text>
          </LinearGradient>
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => auth.signOut()}
        >
          <Ionicons name="log-out-outline" size={22} color="#20d4c8" />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    paddingTop: height * 0.02,
    paddingBottom: height * 0.15,
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
  
  // Tarjeta Principal del Perfil
  profileCard: {
    borderRadius: 30,
    marginTop: height * 0.08,
    marginBottom: height * 0.03,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
    borderWidth: 8,
    borderColor: '#20d4c8',
  },
  cardGradient: {
    paddingBottom: 24,
    alignItems: 'center',
    paddingHorizontal: 0,
  },
  profileImageContainer: {
    width: '100%',
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    position: 'relative',
    overflow: 'hidden',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f9ff',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    zIndex: 2,
    position: 'relative',
  },
  levelBadgeTop: {
    position: 'absolute',
    top: 16,
    right: 16,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  levelBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  levelBadgeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: Math.min(width * 0.04, 16),
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  profileName: {
    fontSize: Math.min(width * 0.07, 28),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    textAlign: 'center',
    paddingHorizontal: width * 0.02,
  },
  profileSubtitle: {
    fontSize: Math.min(width * 0.035, 14),
    color: '#6b7280',
    marginBottom: height * 0.03,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    textAlign: 'center',
    paddingHorizontal: width * 0.02,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: height * 0.02,
    paddingHorizontal: width * 0.02,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
    minWidth: width * 0.2,
    marginVertical: height * 0.01,
  },
  statIcon: {
    width: Math.min(width * 0.13, 55),
    height: Math.min(width * 0.13, 55),
    marginBottom: height * 0.005,
  },
  statLabel: {
    fontSize: Math.min(width * 0.028, 12),
    color: '#6b7280',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    textAlign: 'center',
  },
  statValue: {
    fontSize: Math.min(width * 0.042, 18),
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    textAlign: 'center',
  },

  // Tarjetas con Gráficos
  graphCardsContainer: {
    flexDirection: 'row',
    gap: width * 0.03,
    marginBottom: height * 0.03,
    paddingHorizontal: width * 0.01,
  },
  graphCard: {
    flex: 1,
    minWidth: width * 0.4,
    maxWidth: width * 0.48,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  graphCardGradient: {
    padding: width * 0.04,
    height: height * 0.2,
    minHeight: 140,
  },
  graphCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: height * 0.02,
    minHeight: height * 0.08,
  },
  graphCardTitleContainer: {
    marginLeft: width * 0.02,
    flex: 1,
    justifyContent: 'center',
  },
  graphCardTitle: {
    fontSize: Math.min(width * 0.032, 14),
    color: '#fff',
    opacity: 0.9,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  graphCardValue: {
    fontSize: Math.min(width * 0.05, 20),
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
    flexShrink: 1,
  },
  waveChart: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  waveLine: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 1,
    transform: [{ scaleY: 2 }, { translateY: -10 }],
  },
  waveLineAlt: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 1,
    marginTop: 8,
    transform: [{ scaleY: 1.5 }],
  },
  barChart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  bar: {
    width: 8,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: 4,
    minHeight: 20,
  },

  // Progreso General
  progressSection: {
    marginBottom: height * 0.025,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderRadius: 18,
    overflow: 'hidden',
  },
  progressGradient: {
    padding: ms(22),
    borderRadius: 18,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  progressTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(8),
  },
  sectionTitle: {
    fontSize: msFont(18),
    fontWeight: 'bold',
    color: '#1f2937',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  progressPercent: {
    fontSize: msFont(24),
    fontWeight: 'bold',
    color: '#20d4c8',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
  progressBar: {
    height: ms(14),
    backgroundColor: '#e5e7eb',
    borderRadius: ms(7),
    overflow: 'hidden',
    marginBottom: ms(10),
  },
  progressFill: {
    height: '100%',
    width: '100%',
  },
  progressText: {
    fontSize: msFont(14),
    color: '#6b7280',
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },

  // Botón Cerrar Sesión
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: ms(16),
    borderRadius: 16,
    gap: ms(8),
    borderWidth: 3,
    borderColor: '#20d4c8',
    marginBottom: height * 0.05,
    shadowColor: '#20d4c8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  logoutText: {
    color: '#20d4c8',
    fontSize: msFont(17),
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'Century Gothic' : 'sans-serif',
  },
});

export default ProfileScreen;
