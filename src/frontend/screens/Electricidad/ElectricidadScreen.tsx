import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  SafeAreaView,
  ScrollView,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './styles';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function ElectricidadScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const cardGradient = ['#8e2de2', '#4a00e0']; // púrpura intenso

  const lessons = [
    {
      title: '¿Qué es un electrón?',
      duration: '2 min',
      image: require('../../assets/atomo.png'),
      navigateTo: 'ElectronLesson',
    },
    {
      title: 'Corriente eléctrica',
      duration: '2 min',
      image: require('../../assets/rayo.png'),
      navigateTo: 'Generacion', // 
    },
    {
      title: 'Voltaje,Corriente y Resistencia',
      duration: '2 min',
      image: require('../../assets/corriente.png'),
       navigateTo: 'Vcr',
    },
    {
      title: 'Conductores y aislantes',
      duration: '3 min',
      image: require('../../assets/conductores.png'),
      navigateTo: 'ConductoresYa', 
    },
    {
      title: 'Seguridad básica',
      duration: '3 min',
      image: require('../../assets/seguridad.png'),
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        contentContainerStyle={styles.container}
        style={{ opacity: fadeAnim }}
      >
        {/* Header con logo */}
        <View style={styles.header}>
          <View />
          <Image source={require('../../assets/icon.png')} style={styles.logo} />
        </View>

        {/* Título */}
        <View style={styles.headerCentered}>
          <Text style={styles.titleCentered}>¿Qué es la electricidad?</Text>
        </View>

        <Text style={styles.description}>
          La energía eléctrica es una forma de energía esencial en la vida moderna.
          Está presente en todo lo que nos rodea: desde la luz en nuestras casas.
        </Text>

        {/* Tarjetas con degradado púrpura */}
        {lessons.map((lesson, index) => {
          const CardContent = (
            <LinearGradient
              colors={cardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.lessonCardGradient,
                {
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 10,
                  elevation: 6,
                },
              ]}
            >
              <View style={styles.lessonContent}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <View style={styles.row}>
                    <Ionicons name="flash-outline" size={18} color="#fff" />
                    <Text style={styles.duration}>{lesson.duration}</Text>
                  </View>
                </View>
                <Image source={lesson.image} style={styles.lessonImageSide} />
              </View>
            </LinearGradient>
          );

          return lesson.navigateTo ? (
            <TouchableOpacity
              key={index}
              activeOpacity={0.8}
              onPress={() => navigation.navigate(lesson.navigateTo as keyof RootStackParamList)}
            >
              {CardContent}
            </TouchableOpacity>
          ) : (
            <View key={index}>{CardContent}</View>
          );
        })}
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

