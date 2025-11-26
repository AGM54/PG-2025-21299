import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, View, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

type ConfettiPieceProps = {
  color: string;
  x: number;
  delay: number;
  size: number;
};

// Componente estrella bonito y sin errores
const Star: React.FC<{ color: string; size: number }> = ({ color, size }) => {
  return (
    <View style={{
      width: size,
      height: size,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: size * 0.7,
    }}>
      {/* Glow */}
      <View style={{
        position: 'absolute',
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: size / 2,
        opacity: 0.25,
      }} />
      {/* Estrella */}
      <View style={{
        width: size,
        height: size,
        position: 'absolute',
        transform: [{ rotate: '45deg' }],
      }}>
        <View style={{
          position: 'absolute',
          top: size * 0.15,
          left: size * 0.35,
          width: size * 0.3,
          height: size * 0.7,
          backgroundColor: color,
          borderRadius: size * 0.15,
        }} />
        <View style={{
          position: 'absolute',
          top: size * 0.35,
          left: size * 0.15,
          width: size * 0.7,
          height: size * 0.3,
          backgroundColor: color,
          borderRadius: size * 0.15,
        }} />
      </View>
    </View>
  );
};

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ color, x, delay, size }) => {
  const position = useRef(new Animated.ValueXY({ x, y: -40 })).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(position.y, {
          toValue: height * 0.45,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 3,
          useNativeDriver: true,
        }),
        Animated.timing(rotation, {
          toValue: 360,
          duration: 1400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x + width / 2,
        top: 0,
        transform: [
          { translateY: position.y },
          {
            rotate: rotation.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
          { scale },
        ],
      }}
    >
      <Star color={color} size={size} />
    </Animated.View>
  );
};

export const Confetti: React.FC = () => {
  // Stars that blink across the screen
  const colors = ['#FFD700', '#FFF9C4', '#FFE57F', '#FFF'];
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: colors[i % colors.length],
    left: Math.random() * (width - 20),
    top: Math.random() * (height - 20),
    size: 6 + Math.random() * 14,
    delay: Math.random() * 1200,
    duration: 600 + Math.random() * 1200,
  }));

  return (
    <View style={[styles.container, { justifyContent: 'flex-start' }]} pointerEvents="none">
      {stars.map((s) => (
        <AnimatedFirework key={s.id} left={s.left} top={s.top} size={s.size} color={s.color} delay={s.delay} duration={s.duration} />
      ))}
    </View>
  );
};

// Animated firework/starburst that pulses and shows rays
const AnimatedFirework: React.FC<{ left: number; top: number; size: number; color: string; delay: number; duration: number }> = ({ left, top, size, color, delay, duration }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 1, duration: Math.max(120, duration / 3), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1.05, duration: Math.max(120, duration / 3), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(opacity, { toValue: 0.0, duration: Math.max(200, duration / 2), useNativeDriver: true }),
          Animated.timing(scale, { toValue: 0.8, duration: Math.max(200, duration / 2), useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const rays = [0, 60, 120, 180, 240, 300]; // angles for ray directions

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left,
        top,
        width: size * 2,
        height: size * 2,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ scale }],
        opacity,
      }}
    >
      {/* Glow center */}
      <View style={{ position: 'absolute', width: size * 1.6, height: size * 1.6, borderRadius: (size * 1.6) / 2, backgroundColor: color, opacity: 0.18 }} />
      <View style={{ position: 'absolute', width: size * 1.0, height: size * 1.0, borderRadius: (size * 1.0) / 2, backgroundColor: color, opacity: 0.28 }} />

      {/* Rays */}
      {rays.map((angle, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: size * 0.12,
            height: size * 1.1,
            backgroundColor: color,
            borderRadius: size * 0.06,
            opacity: 0.95,
            transform: [{ rotate: `${angle}deg` }, { translateY: -size * 0.55 }],
          }}
        />
      ))}

      {/* Small center sparkle */}
      <View style={{ width: size * 0.5, height: size * 0.5, borderRadius: (size * 0.5) / 2, backgroundColor: '#fff', opacity: 0.9 }} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  // Removed confetti style, now using custom star shapes
});
