import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width } = Dimensions.get('window');

interface MatchItem {
  id: string;
  action: string;
  obligation: string;
}

const matchItems: MatchItem[] = [
  {
    id: '1',
    action: 'Me avisaron con un día de anticipación sobre un corte',
    obligation: 'Notificar cortes programados'
  },
  {
    id: '2',
    action: 'El voltaje daña mis focos y electrodomésticos frecuentemente',
    obligation: 'Garantizar calidad del voltaje'
  },
  {
    id: '3',
    action: 'Pido revisión del contador porque marcó el doble',
    obligation: 'Medir correctamente el consumo'
  },
  {
    id: '4',
    action: 'Hice un reclamo y llevo 3 semanas sin respuesta',
    obligation: 'Respetar plazos de atención al usuario'
  }
];

interface Props {
  onComplete: () => void;
}

export default function ObligacionesMatching({ onComplete }: Props) {
  const [matches, setMatches] = useState<{[key: string]: string}>({});
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleActionPress = (actionId: string) => {
    if (completed) return;
    setSelectedAction(actionId);
  };

  const handleObligationPress = (obligationId: string) => {
    if (!selectedAction || completed) return;
    
    // Create new matches object
    const newMatches = { ...matches };
    
    // Remove any existing match for this obligation
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === obligationId) {
        delete newMatches[key];
      }
    });
    
    // Add new match
    newMatches[selectedAction] = obligationId;
    
    setMatches(newMatches);
    setSelectedAction(null);
    
    // Check if all items are matched correctly
    if (Object.keys(newMatches).length === matchItems.length) {
      const allCorrect = matchItems.every(item => 
        newMatches[item.id] === item.id
      );
      
      if (allCorrect) {
        setCompleted(true);
        // Call onComplete immediately to show parent modal
        onComplete();
      }
    }
  };

  const getActionStyle = (actionId: string) => {
    if (selectedAction === actionId) {
      return [styles.actionItem, styles.selectedAction];
    }
    if (matches[actionId]) {
      return [styles.actionItem, styles.matchedAction];
    }
    return styles.actionItem;
  };

  const getObligationStyle = (obligationId: string) => {
    const isMatched = Object.values(matches).includes(obligationId);
    if (isMatched) {
      const isCorrect = matches[obligationId] === obligationId;
      return [
        styles.obligationItem, 
        isCorrect ? styles.correctMatch : styles.incorrectMatch
      ];
    }
    return styles.obligationItem;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Instrucciones: 1. Selecciona una acción{'\n'}2. Selecciona la obligación correspondiente
      </Text>
      
      <View style={styles.content}>
        {/* Actions Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Acción</Text>
          {matchItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={getActionStyle(item.id)}
              onPress={() => handleActionPress(item.id)}
              disabled={completed}
            >
              <LinearGradient
                colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
                style={[
                  styles.itemGradient,
                  selectedAction === item.id && styles.itemSelected,
                  matches[item.id] && styles.itemMatched
                ]}
              >
                <Text style={styles.itemText}>{item.action}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Obligations Column */}
        <View style={styles.column}>
          <Text style={styles.columnTitle}>Obligación relacionada</Text>
          {matchItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={getObligationStyle(item.id)}
              onPress={() => handleObligationPress(item.id)}
              disabled={completed}
            >
              <LinearGradient
                colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
                style={[
                  styles.itemGradient,
                  Object.values(matches).includes(item.id) &&
                    (matches[item.id] === item.id ? styles.itemCorrect : styles.itemIncorrect)
                ]}
              >
                <Text style={styles.itemText}>{item.obligation}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Completion message removed to avoid double feedback - parent modal will show */}

      <Text style={styles.progress}>
        Progreso: {Object.keys(matches).length}/{matchItems.length} relaciones
      </Text>
    </View>
  );
}

