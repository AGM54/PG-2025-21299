import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
// LinearGradient no longer used after dark/neon redesign
import { styles } from './styles';

// no need for Dimensions in this component

interface DragDropOrderProps {
  onComplete: () => void;
  items?: Array<{
    text: string;
    correct?: boolean;
    order?: number;
  }>;
  correctCategory?: string;
  incorrectCategory?: string;
  isOrderActivity?: boolean;
}

interface DragItem {
  id: string;
  text: string;
  correctPosition?: number;
  correct?: boolean;
  order?: number;
}

const defaultDragItems: DragItem[] = [
  { id: '1', text: '0 a 88 kWh', correctPosition: 0 },
  { id: '2', text: '89 a 150 kWh', correctPosition: 1 },
  { id: '3', text: '151 a 300 kWh', correctPosition: 2 },
  { id: '4', text: 'Más de 300 kWh', correctPosition: 3 },
];

const DragDropOrder: React.FC<DragDropOrderProps> = ({ 
  onComplete, 
  items: propItems, 
  correctCategory, 
  incorrectCategory, 
  isOrderActivity 
}) => {
  const [items, setItems] = useState(propItems ? 
    propItems.map((item, index) => ({
      id: index.toString(),
      text: item.text,
      correct: item.correct,
      order: item.order,
      correctPosition: item.order ? item.order - 1 : undefined
    })) : defaultDragItems
  );
  const [targetBoxContent, setTargetBoxContent] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ visible: boolean; correct: boolean; title: string; message: string }>(
    { visible: false, correct: false, title: '', message: '' }
  );

  const handleDrop = (itemId: string) => {
    const item = items.find((i: DragItem) => i.id === itemId);
    if (item && item.id === '1') { // Solo el primer item (0 a 88 kWh) es correcto
      setTargetBoxContent(item.text);
      setIsCompleted(true);
      setFeedback({
        visible: true,
        correct: true,
        title: '¡Correcto!',
        message: 'La tarifa social aplica para consumos de 0 a 88 kWh al mes.'
      });
    } else {
      setFeedback({
        visible: true,
        correct: false,
        title: 'Respuesta incorrecta',
        message: 'Intenta de nuevo. La tarifa social es para consumos de 0 a 88 kWh.'
      });
    }
  };

  const renderDragItem = (item: DragItem) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.dragItem,
        draggedItem === item.id && styles.draggingItem
      ]}
      onPress={() => handleDrop(item.id)}
      disabled={isCompleted}
    >
      <Text style={styles.dragItemText}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.instruction}>¿Qué rango de consumo recibe la tarifa social?</Text>

      {/* Target Box */}
      <View style={[styles.targetBox, isCompleted && styles.completedTargetBox]}>
        <Text style={styles.targetLabel}>Tarifa social</Text>
        {targetBoxContent ? (
          <Text style={styles.targetContent}>{targetBoxContent}</Text>
        ) : (
          <Text style={styles.placeholder}>Selecciona la opción correcta</Text>
        )}
      </View>

      {/* Drag Items */}
      <View style={styles.dragItemsContainer}>
        {items.map(renderDragItem)}
      </View>

      {isCompleted && (
        <TouchableOpacity style={styles.continueButton} onPress={onComplete}>
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
      )}

      {/* Feedback Modal */}
      {feedback.visible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={[
              styles.feedbackBadge,
              feedback.correct ? styles.feedbackBadgeCorrect : styles.feedbackBadgeIncorrect
            ]}>
              <Text style={feedback.correct ? styles.feedbackBadgeTextDark : styles.feedbackBadgeTextLight}>
                {feedback.title}
              </Text>
            </View>
            <Text style={styles.modalText}>{feedback.message}</Text>
            {feedback.correct ? (
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => {
                  setFeedback({ ...feedback, visible: false });
                }}
              >
                <Text style={styles.primaryButtonText}>Listo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setFeedback({ ...feedback, visible: false })}
              >
                <Text style={styles.secondaryButtonText}>Intentar de nuevo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default DragDropOrder;

