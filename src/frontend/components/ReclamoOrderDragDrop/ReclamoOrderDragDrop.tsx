import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface ReclamoStep {
  id: number;
  text: string;
  icon: string;
}

interface ReclamoOrderDragDropProps {
  onComplete: () => void;
}

const reclamoSteps: ReclamoStep[] = [
  {
    id: 3,
    text: 'Anota el número de reclamo',
    icon: '📝',
  },
  {
    id: 1,
    text: 'Comunícate con tu distribuidora',
    icon: '📞',
  },
  {
    id: 5,
    text: 'Si no recibes respuesta, puedes acudir a la CNEE',
    icon: '🏛️',
  },
  {
    id: 4,
    text: 'Espera la respuesta (deben darte una solución en pocos días)',
    icon: '⏰',
  },
  {
    id: 2,
    text: 'Explica el problema con detalles',
    icon: '💬',
  },
];

const correctOrder = [1, 2, 3, 4, 5]; // Orden correcto de los pasos

export default function ReclamoOrderDragDrop({ onComplete }: ReclamoOrderDragDropProps) {
  const [currentOrder, setCurrentOrder] = useState<ReclamoStep[]>([...reclamoSteps]);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const checkOrder = () => {
    const userOrder = currentOrder.map(step => step.id);
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(correctOrder);
    
    setAttempts(attempts + 1);
    
    if (isCorrect) {
      setIsComplete(true);
      Alert.alert(
        '¡Excelente! 🎉',
        'Has ordenado correctamente los pasos para presentar un reclamo.',
        [
          {
            text: 'Continuar',
            onPress: () => {
              setTimeout(() => {
                onComplete();
              }, 500);
            }
          }
        ]
      );
    } else {
      Alert.alert(
        '¡Inténtalo de nuevo! 💪',
        `Piensa en el orden lógico: primero contactas, luego explicas, después anotas el número, esperas respuesta y si no hay respuesta vas a la CNEE.\n\nIntentos: ${attempts + 1}`,
        [{ text: 'Seguir intentando' }]
      );
    }
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setCurrentOrder(newOrder);
  };

  const resetOrder = () => {
    setCurrentOrder([...reclamoSteps]);
    setAttempts(0);
    setIsComplete(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 Ordena los pasos para presentar un reclamo</Text>
      <Text style={styles.instruction}>
        Arrastra los pasos al orden correcto para presentar un reclamo efectivo:
      </Text>

      {/* Hint */}
      <LinearGradient
        colors={['rgba(88, 204, 247, 0.2)', 'rgba(139, 69, 255, 0.2)']}
        style={styles.hintBox}
      >
        <Text style={styles.hintText}>
          💡 Piensa en el orden lógico: desde el primer contacto hasta la instancia final
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
                  ? ['#28A745', '#34CE57', '#40E869']
                  : ['#1a0033', '#2d1b4d', '#3d2b5f']
              }
              style={styles.stepGradient}
            >
              <View style={styles.stepHeader}>
                <Text style={styles.stepIcon}>{step.icon}</Text>
                <Text style={styles.stepNumber}>Paso {index + 1}</Text>
              </View>
              
              <Text style={styles.stepText}>{step.text}</Text>

              {/* Move buttons */}
              {!isComplete && (
                <View style={styles.moveButtons}>
                  {index > 0 && (
                    <TouchableOpacity
                      style={styles.moveButton}
                      onPress={() => moveItem(index, index - 1)}
                    >
                      <Text style={styles.moveButtonText}>↑</Text>
                    </TouchableOpacity>
                  )}
                  {index < currentOrder.length - 1 && (
                    <TouchableOpacity
                      style={styles.moveButton}
                      onPress={() => moveItem(index, index + 1)}
                    >
                      <Text style={styles.moveButtonText}>↓</Text>
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
                colors={['#58CCF7', '#4A9FE7', '#3B82F6']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>✅ Verificar Orden</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetOrder}>
              <LinearGradient
                colors={['#6C757D', '#545B62', '#454D55']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>🔄 Reiniciar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Progress indicator */}
      {attempts > 0 && (
        <Text style={styles.attemptsText}>
          Intentos: {attempts} {isComplete ? '🎯' : ''}
        </Text>
      )}
    </View>
  );
}

