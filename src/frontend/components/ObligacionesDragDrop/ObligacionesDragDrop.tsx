import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface Statement {
  id: string;
  text: string;
  isObligation: boolean;
  placed: boolean;
  correctCategory?: string;
}

interface DropZone {
  id: string;
  name: string;
  items: Statement[];
}

const statements: Statement[] = [
  {
    id: '1',
    text: 'Instalar servicio si lo solicitas y estás cerca de la red',
    isObligation: true,
    placed: false,
  },
  {
    id: '2',
    text: 'Reembolsarte si hubo un corte de luz por mantenimiento programado',
    isObligation: false,
    placed: false,
  },
  {
    id: '3',
    text: 'Reparar postes en mal estado',
    isObligation: true,
    placed: false,
  },
  {
    id: '4',
    text: 'Garantizar que nunca se te vaya la luz, incluso en emergencias climáticas',
    isObligation: false,
    placed: false,
  },
  {
    id: '5',
    text: 'Informarte si sube el precio de la energía',
    isObligation: true,
    placed: false,
  },
  {
    id: '6',
    text: 'Ayudarte con una extensión para cargar el celular',
    isObligation: false,
    placed: false,
  },
  {
    id: '7',
    text: 'Dar mantenimiento a postes y cables',
    isObligation: true,
    placed: false,
  },
];

const initialDropZones: DropZone[] = [
  {
    id: 'yes',
    name: '✅ SÍ ES obligación',
    items: [],
  },
  {
    id: 'no',
    name: '❌ NO ES obligación',
    items: [],
  },
];

interface Props {
  onComplete: () => void;
  onScored?: (correct: number, total: number) => void;
}

export default function ObligacionesDragDrop({ onComplete, onScored }: Props) {
  const [availableStatements, setAvailableStatements] = useState(statements);
  const [dropZones, setDropZones] = useState(initialDropZones);
  const [selectedStatement, setSelectedStatement] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showIncorrectModal, setShowIncorrectModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [incorrectStatement, setIncorrectStatement] = useState<string>('');

  const handleStatementSelect = (statementId: string) => {
    if (selectedStatement === statementId) {
      setSelectedStatement(null);
    } else {
      setSelectedStatement(statementId);
    }
  };

  const handleZoneDrop = (zoneId: string) => {
    if (!selectedStatement) {
      setShowSelectModal(true);
      return;
    }

    const statement = availableStatements.find(s => s.id === selectedStatement);
    if (!statement) return;

    const isCorrect = 
      (zoneId === 'yes' && statement.isObligation) || 
      (zoneId === 'no' && !statement.isObligation);

    if (isCorrect) {
      // Correct placement
      setDropZones(prev => 
        prev.map(zone => 
          zone.id === zoneId 
            ? { ...zone, items: [...zone.items, { ...statement, placed: true }] }
            : zone
        )
      );
      
      setAvailableStatements(prev => 
        prev.filter(s => s.id !== selectedStatement)
      );
      
      const newScore = score + 1;
      setScore(newScore);
      setSelectedStatement(null);
      
      if (availableStatements.length === 1) {
        // Report score to parent before completing
        if (onScored) {
          onScored(newScore, 7);
        }
        setTimeout(() => {
          setShowSuccessModal(true);
        }, 500);
      }
    } else {
      // Incorrect placement
      setIncorrectStatement(statement.text);
      setShowIncorrectModal(true);
      setSelectedStatement(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎮 ¿Es obligación o no?</Text>
      <Text style={styles.subtitle}>1. Selecciona una frase de abajo{'\n'}2. Toca si ES o NO ES obligación</Text>
      
      <Text style={styles.score}>Tu puntuación: {score}/7</Text>

      {/* Drop Zones */}
      <View style={styles.dropZonesContainer}>
        {dropZones.map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.dropZone,
              zone.id === 'yes' ? styles.yesZone : styles.noZone
            ]}
            onPress={() => handleZoneDrop(zone.id)}
          >
            <Text style={styles.zoneTitle}>{zone.name}</Text>
            <View style={styles.zoneContent}>
              {zone.items.map((item, index) => (
                <View key={item.id} style={styles.placedItem}>
                  <Text style={styles.placedItemText}>{item.text}</Text>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
              ))}
              {zone.items.length === 0 && (
                <Text style={styles.emptyZoneText}>Toca aquí después de seleccionar</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Available Statements */}
      <View style={styles.statementsContainer}>
        <Text style={styles.statementsTitle}>Frases disponibles:</Text>
        {availableStatements.map((statement) => (
          <TouchableOpacity
            key={statement.id}
            style={[
              styles.statementItem,
              selectedStatement === statement.id && styles.selectedStatement
            ]}
            onPress={() => handleStatementSelect(statement.id)}
          >
            <Text style={styles.statementText}>{statement.text}</Text>
            {selectedStatement === statement.id && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.selectedIndicatorText}>👆 Seleccionada</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {score === 7 && (
        <View style={styles.completionMessage}>
          <Text style={styles.completionText}>¡Perfecto! 🎉</Text>
          <Text style={styles.completionSubText}>Has clasificado correctamente todas las obligaciones</Text>
        </View>
      )}

      {/* Modal: Selecciona una frase */}
      <Modal transparent visible={showSelectModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Primero selecciona una frase</Text>
            <Text style={styles.modalMessage}>Toca una de las frases de abajo para seleccionarla.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSelectModal(false)}
            >
              <LinearGradient
                colors={['#58CCF7', '#4A9FE7']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Modal: Incorrecto */}
      <Modal transparent visible={showIncorrectModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>¡Inténtalo de nuevo!</Text>
            <Text style={styles.modalMessage}>
              "{incorrectStatement}" no va en esa columna. 
              {'\n\n'}Piensa: ¿Es realmente una obligación de la empresa distribuidora?
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowIncorrectModal(false)}
            >
              <LinearGradient
                colors={['#58CCF7', '#4A9FE7']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Modal: ¡Excelente! */}
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>¡Excelente!</Text>
            <Text style={styles.modalMessage}>
              ¡Has clasificado correctamente todas las obligaciones!
              {'\n\n'}Ahora sabes qué pueden y qué NO pueden exigir a tu empresa distribuidora.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                onComplete();
              }}
            >
              <LinearGradient
                colors={['#58CCF7', '#4A9FE7']}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Continuar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </View>
  );
}

