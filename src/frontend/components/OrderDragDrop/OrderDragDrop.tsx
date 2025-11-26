import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Animated,
  Image,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface ProcessStep {
  id: number;
  title: string;
  description: string;
  image: any;
}

interface OrderDragDropProps {
  onComplete: () => void;
}

const processSteps: ProcessStep[] = [
  {
    id: 3,
    title: 'Distribución',
    description: 'La energía llega a tu hogar a través de postes y cables locales',
    image: require('../../assets/luzhogar/distribucion.png'),
  },
  {
    id: 2,
    title: 'Transmisión',
    description: 'La electricidad viaja por líneas de alto voltaje',
    image: require('../../assets/luzhogar/transmision.png'),
  },
  {
    id: 1,
    title: 'Generación',
    description: 'Se produce la electricidad en las plantas generadoras',
    image: require('../../assets/luzhogar/generacion.png'),
  },
];

const correctOrder = [1, 2, 3]; // Generación, Transmisión, Distribución

export default function OrderDragDrop({ onComplete }: OrderDragDropProps) {
  const [currentOrder, setCurrentOrder] = useState<ProcessStep[]>([...processSteps]);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [lastAttempts, setLastAttempts] = useState(0);
  // Removed old success modal to avoid double modal; parent screen shows persona modal now

  const checkOrder = () => {
    const userOrder = currentOrder.map(step => step.id);
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (isCorrect) {
      setIsComplete(true);
      // Notify parent directly; screen will show persona modal
      setTimeout(() => onComplete(), 350);
    } else {
      setLastAttempts(nextAttempts);
      setShowErrorModal(true);
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setCurrentOrder(newOrder);
  };

  const resetOrder = () => {
    setCurrentOrder([...processSteps]);
    setAttempts(0);
    setIsComplete(false);
    // no internal modal anymore
  };

  return (
    <LinearGradient
      colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#58CCF7', '#2a3f6f', '#1f2d55']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { backgroundColor: 'transparent' }]}
    >
      {/* Removed star particles background per request */}

  <Text style={styles.title}>Actividad final: ¿Cómo llega la luz?</Text>
      <Text style={styles.instruction}>
        Arrastra las etapas del proceso de la electricidad al orden correcto:
      </Text>

      {/* Hint */}
      <LinearGradient
        colors={['rgba(31, 45, 85, 0.5)', 'rgba(88, 204, 247, 0.3)', 'rgba(42, 63, 111, 0.5)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hintBox}
      >
        <Text style={styles.hintText}>
          Piensa en el recorrido desde donde se produce hasta donde la usas
        </Text>
      </LinearGradient>

      {/* Draggable Items */}
      <View style={styles.itemsContainer}>
        {currentOrder.map((step, index) => (
          <TouchableOpacity
            key={step.id}
            style={[
              styles.stepCard,
              isComplete && styles.completedCard
            ]}
          >
            <LinearGradient
              colors={
                isComplete
                  ? ['#28A745', '#34CE57', '#40E869', '#28A745']
                  : step.id === 1
                  ? ['#1f2d55', '#2a3f6f', '#3a5a8c', '#1f2d55']
                  : step.id === 2
                  ? ['#58CCF7', '#7DD3FC', '#38BDF8', '#58CCF7']
                  : ['#2a3f6f', '#3a5a8c', '#4a6fa5', '#2a3f6f']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.stepGradient}
            >
              <View style={styles.stepHeader}>
                <LinearGradient
                  colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
                  style={{
                    borderRadius: width * 0.04,
                    width: width * 0.08,
                    height: width * 0.08,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text style={[styles.stepNumber, { color: '#1a0033' }]}>{index + 1}</Text>
                </LinearGradient>
              </View>

              {/* Imagen de etapa según título */}
              <View style={{ width: '100%', alignItems: 'center', marginVertical: height * 0.01 }}>
                <Image
                  source={step.image}
                  style={{ width: width * 0.7, height: width * 0.35, resizeMode: 'contain' }}
                />
              </View>
              
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>

              {/* Move buttons */}
              {!isComplete && (
                <View style={styles.moveButtons}>
                  {index > 0 && (
                    <TouchableOpacity
                      style={styles.moveButton}
                      onPress={() => moveItem(index, index - 1)}
                    >
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                        style={{
                          borderRadius: width * 0.06,
                          width: width * 0.12,
                          height: width * 0.12,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.moveButtonText}>↑</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                  {index < currentOrder.length - 1 && (
                    <TouchableOpacity
                      style={styles.moveButton}
                      onPress={() => moveItem(index, index + 1)}
                    >
                      <LinearGradient
                        colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
                        style={{
                          borderRadius: width * 0.06,
                          width: width * 0.12,
                          height: width * 0.12,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text style={styles.moveButtonText}>↓</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {!isComplete && (
          <>
            <TouchableOpacity style={styles.checkButton} onPress={checkOrder}>
              <LinearGradient
                colors={['#58CCF7', '#3a5a8c', '#2a3f6f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={[styles.buttonText, { fontFamily: 'Century Gothic' }]}>Verificar Orden</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetOrder}>
              <LinearGradient
                colors={['#2a3f6f', '#1f2d55', '#1a2744']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.buttonGradient}
              >
                <Text style={[styles.buttonText, { fontFamily: 'Century Gothic' }]}>Reiniciar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Progress indicator */}
      {attempts > 0 && (
        <LinearGradient
          colors={['rgba(31, 45, 85, 0.4)', 'rgba(88, 204, 247, 0.3)']}
          style={{
            borderRadius: 12,
            padding: width * 0.03,
            alignSelf: 'center',
            marginTop: height * 0.01,
          }}
        >
          <Text style={styles.attemptsText}>
            Intentos: {attempts}
          </Text>
        </LinearGradient>
      )}

      {/* Removed internal success modal to avoid double modal; screen-level persona modal will show */}
      {/* Error modal estilizado (sin emojis) */}
      <Modal transparent visible={showErrorModal} animationType="fade">
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
            }}
          >
            <Text
              style={{
                fontSize: width * 0.06,
                fontWeight: '900',
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: height * 0.01,
              }}
            >
              Inténtalo de nuevo
            </Text>
            <Text
              style={{
                fontSize: width * 0.042,
                color: '#FFFFFF',
                opacity: 0.95,
                textAlign: 'center',
                marginBottom: height * 0.015,
                lineHeight: width * 0.055,
              }}
            >
              El orden correcto es: Generación → Transmisión → Distribución
            </Text>
            <Text
              style={{
                fontSize: width * 0.042,
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: height * 0.02,
              }}
            >
              Intentos: {lastAttempts}
            </Text>
            <TouchableOpacity onPress={() => setShowErrorModal(false)} style={{ width: '100%' }}>
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
                <Text style={{ fontSize: width * 0.05, fontWeight: '800', color: '#FFFFFF' }}>
                  Seguir intentando
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

