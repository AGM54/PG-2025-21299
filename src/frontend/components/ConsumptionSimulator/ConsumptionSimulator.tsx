import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface ConsumptionData {
  kWh: number;
  estimatedPayment: number;
  category: string;
  color: string[];
}

interface ConsumptionSimulatorProps {
  onComplete: () => void;
}

const consumptionOptions: ConsumptionData[] = [
  {
    kWh: 30,
    estimatedPayment: 25,
    category: 'Consumo Bajo',
    color: ['#28A745', '#34CE57', '#40E869'] as string[],
  },
  {
    kWh: 100,
    estimatedPayment: 80,
    category: 'Consumo Medio',
    color: ['#FFC107', '#FFD54F', '#FFF59D'] as string[],
  },
  {
    kWh: 200,
    estimatedPayment: 160,
    category: 'Consumo Alto',
    color: ['#DC3545', '#F28B82', '#FFCDD2'] as string[],
  },
  {
    kWh: 350,
    estimatedPayment: 280,
    category: 'Consumo Muy Alto',
    color: ['#6F42C1', '#9C27B0', '#E1BEE7'] as string[],
  },
];

export default function ConsumptionSimulator({ onComplete }: ConsumptionSimulatorProps) {
  const [selectedConsumption, setSelectedConsumption] = useState<ConsumptionData | null>(null);
  const [hasSimulated, setHasSimulated] = useState(false);
  const [showNeedSelection, setShowNeedSelection] = useState(false);
  
  // Animaciones para efectos eléctricos
  const [typedPayment, setTypedPayment] = useState<string>('Q. 0');
  const typingTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const shimmerX = useRef(new Animated.Value(-width)).current;
  
  // Efecto de pulso continuo
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();
    return () => pulseAnimation.stop();
  }, [pulseAnim]);
  
  // Efecto de brillo cuando se selecciona
  useEffect(() => {
    if (selectedConsumption) {
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Shimmer loop sobre el display
      shimmerX.setValue(-width);
      Animated.loop(
        Animated.sequence([
          Animated.timing(shimmerX, {
            toValue: width,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.delay(500),
        ])
      ).start();
    } else {
      glowAnim.setValue(0);
      shimmerX.stopAnimation();
    }
  }, [selectedConsumption, glowAnim, shimmerX]);

  const handleConsumptionSelect = (consumption: ConsumptionData) => {
    setSelectedConsumption(consumption);
    setHasSimulated(true);
  };

  const handleComplete = () => {
    if (!hasSimulated) {
      setShowNeedSelection(true);
      return;
    }
    onComplete();
  };

  const resetSimulation = () => {
    setSelectedConsumption(null);
    setHasSimulated(false);
    setTypedPayment('Q. 0');
    if (typingTimer.current) {
      clearInterval(typingTimer.current);
      typingTimer.current = null;
    }
  };

  // Animación de tipeo para el pago estimado
  useEffect(() => {
    if (typingTimer.current) {
      clearInterval(typingTimer.current);
      typingTimer.current = null;
    }
    if (!selectedConsumption) {
      setTypedPayment('Q. 0');
      return;
    }
    const target = String(selectedConsumption.estimatedPayment);
    setTypedPayment('Q. ');
    let i = 0;
    typingTimer.current = setInterval(() => {
      i += 1;
      setTypedPayment('Q. ' + target.slice(0, i));
      if (i >= target.length && typingTimer.current) {
        clearInterval(typingTimer.current);
        typingTimer.current = null;
      }
    }, 70);
    return () => {
      if (typingTimer.current) {
        clearInterval(typingTimer.current);
        typingTimer.current = null;
      }
    };
  }, [selectedConsumption]);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Simulador de consumo</Text>
      <Text style={styles.instruction}>
        Selecciona un nivel de consumo (kWh) y observa cuánto pagarías:
      </Text>

      {/* Hint */}
      <LinearGradient
        colors={['rgba(88, 204, 247, 0.2)', 'rgba(31, 45, 85, 0.2)']}
        style={styles.hintBox}
      >
        <Text style={styles.hintText}>Recuerda: Entre menos consumes, menos pagas</Text>
      </LinearGradient>

      {/* Digital Meter Display con efectos eléctricos */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <LinearGradient
          colors={selectedConsumption 
            ? ['#1f2d55', '#2a3f6f', '#58CCF7', '#58CCF7'] 
            : ['rgba(31, 45, 85, 0.9)', 'rgba(42, 63, 111, 0.8)']}
          style={styles.meterContainer}
        >
          <Text style={styles.meterTitle}>Medidor digital</Text>
          <Animated.View style={[styles.meterDisplay, { opacity: glowAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }]}>
            <View style={styles.displayContainer}>
              <LinearGradient
              colors={selectedConsumption 
                ? ['#0aefff', '#00E5FF', '#0aefff'] 
                : ['#202737', '#2a3f6f']}
                style={styles.displayGradient}
              >
                <Text style={[styles.meterValue, selectedConsumption && styles.meterValueActive]}>
                  {selectedConsumption ? selectedConsumption.kWh : '000'} kWh
                </Text>
              </LinearGradient>
              {/* Shimmer */}
              <Animated.View
                pointerEvents="none"
                style={[styles.shimmerOverlay, { transform: [{ translateX: shimmerX }] }]}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(255,255,255,0.9)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ flex: 1 }}
                />
              </Animated.View>
              {/* Brillo superior tipo vidrio */}
              <LinearGradient
                colors={['rgba(255,255,255,0.25)', 'transparent']}
                style={styles.glassHighlight}
              />
            </View>
            <Text style={styles.meterLabel}>Consumo del mes</Text>
          </Animated.View>
          
          {selectedConsumption && (
            <Animated.View style={{ opacity: glowAnim, transform: [{ scale: glowAnim }] }}>
              <LinearGradient
                colors={['#0aefff', '#00E5FF', '#3B82F6'] as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.resultCard}
              >
                <Text style={styles.resultTitle}>{selectedConsumption.category}</Text>
                <Text style={styles.resultPayment}>{typedPayment}.00</Text>
                <Text style={styles.resultLabel}>Estimación de pago</Text>
              </LinearGradient>
            </Animated.View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Consumption Options */}
      <Text style={styles.optionsTitle}>Selecciona un nivel de consumo:</Text>
      <View style={styles.optionsContainer}>
        {consumptionOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionCard,
              selectedConsumption?.kWh === option.kWh && styles.selectedOption,
            ]}
            onPress={() => handleConsumptionSelect(option)}
          >
            <View style={styles.optionInner}>
              <Text style={styles.optionKwh}>{option.kWh} kWh</Text>
              <Text style={styles.optionCategory}>{option.category}</Text>
              <Text style={styles.optionPayment}>≈ Q. {option.estimatedPayment}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Educational Note */}
      {selectedConsumption && (
        <LinearGradient
          colors={['rgba(31, 45, 85, 0.2)', 'rgba(88, 204, 247, 0.1)']}
          style={styles.educationalNote}
        >
          <Text style={styles.noteTitle}>📚 ¿Sabías que?</Text>
          <Text style={styles.noteText}>
            {selectedConsumption.kWh <= 88 
              ? 'Con este consumo podrías calificar para la tarifa social subsidiada.'
              : selectedConsumption.kWh <= 150
              ? 'Este es un consumo típico para una familia guatemalteca.'
              : 'Este nivel de consumo sugiere un uso intensivo de electrodomésticos.'}
          </Text>
        </LinearGradient>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.neonButton, !hasSimulated && styles.neonButtonDisabled]}
          onPress={handleComplete}
          disabled={!hasSimulated}
        >
          <Text style={styles.neonButtonText}>{hasSimulated ? 'Continuar' : 'Simula para continuar'}</Text>
        </TouchableOpacity>

        {hasSimulated && (
          <TouchableOpacity style={[styles.neonGhostButton]} onPress={resetSimulation}>
            <Text style={styles.neonGhostButtonText}>Nueva simulación</Text>
          </TouchableOpacity>
        )}
        {showNeedSelection && !hasSimulated && (
          <Text style={styles.inlineWarning}>Selecciona un consumo para continuar</Text>
        )}
      </View>

      {/* CNEE Link Info */}
      <LinearGradient colors={['rgba(88, 204, 247, 0.15)', 'rgba(31,45,85,0.1)']} style={styles.linkInfo}>
        <Text style={styles.linkTitle}>Simulador oficial CNEE</Text>
        <Text style={styles.linkText}>Puedes usar el simulador oficial de la CNEE para cálculos más precisos</Text>
      </LinearGradient>
    </View>
  );
}

