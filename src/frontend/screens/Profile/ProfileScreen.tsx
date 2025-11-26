// src/screens/Profile/ProfileScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, SafeAreaView, Animated, Easing } from 'react-native';
import styles from './styles';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';
import { useFocusEffect } from '@react-navigation/native';
import { auth } from '../../firebase.config';
import { getProgress } from '../../src/lib/firestore';

const AnimatedCircle: any = Animated.createAnimatedComponent(Circle);

// Totales de pasos por módulo (mismos que Progreso)
const MODULE_TOTALS: Record<string, number> = {
  'CNEE': 13,
  'Luz al Hogar': 12,
  'Precios y Factura': 9,
  'Obligaciones': 7,
  'Alumbrado Público': 6,
};

export default function ProfileScreen() {
  const [overall, setOverall] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timeAnim = useRef(new Animated.Value(0)).current;

  const barGoalSec = 600; // objetivo 10 min

  const fetchProgress = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const prog = await getProgress(uid);
    let sumSteps = 0;
    let sumTotals = 0;
    Object.entries(MODULE_TOTALS).forEach(([name, total]) => {
      const step = Math.min(prog?.[name]?.step || 0, total);
      sumSteps += step;
      sumTotals += total;
    });
    const pct = sumTotals === 0 ? 0 : Math.round((sumSteps / sumTotals) * 100);
    setOverall(pct);
    Animated.timing(progressAnim, {
      toValue: pct,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchProgress();
      const start = Date.now();
      const id = setInterval(() => {
        const secs = Math.floor((Date.now() - start) / 1000);
        setElapsed(secs);
        Animated.timing(timeAnim, {
          toValue: Math.min(secs / barGoalSec, 1),
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }).start();
      }, 1000);
      return () => clearInterval(id);
    }, [])
  );

  const r = 60, cx = 70, cy = 70, stroke = 10, circumference = 2 * Math.PI * r;
  const arcDashoffset = progressAnim.interpolate({ inputRange: [0, 100], outputRange: [circumference, 0] });

  const timePct = timeAnim.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] });
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
  const ss = String(elapsed % 60).padStart(2, '0');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>

        {/* Gráfica 1: Progreso General */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Svg width={140} height={140} viewBox="0 0 140 140">
              <Defs>
                <SvgLinearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <Stop offset="0%" stopColor="#60a5fa" />
                  <Stop offset="50%" stopColor="#3b82f6" />
                  <Stop offset="100%" stopColor="#1e40af" />
                </SvgLinearGradient>
              </Defs>
              <Circle cx={cx} cy={cy} r={r} stroke="rgba(255,255,255,0.15)" strokeWidth={stroke} fill="none" />
              <AnimatedCircle
                cx={cx}
                cy={cy}
                r={r}
                stroke="url(#blueGrad)"
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={arcDashoffset}
                fill="none"
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            </Svg>
            <View>
              <Text style={styles.pctText}>{overall}%</Text>
              <Text style={styles.label}>Progreso general</Text>
            </View>
          </View>
        </View>

        {/* Gráfica 2: Tiempo de sesión */}
        <View style={styles.card}>
          <Text style={styles.timeLabel}>Tiempo de sesión: {mm}:{ss}</Text>
          <View style={styles.barRail}>
            <Animated.View style={[styles.barFill, { width: timePct }]}> 
              <LinearGradient colors={[ '#60a5fa', '#3b82f6', '#1e40af' ]} style={{ flex: 1 }} start={{x:0,y:0}} end={{x:1,y:0}} />
            </Animated.View>
          </View>
          <Text style={styles.label}>Objetivo: 10 min</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

