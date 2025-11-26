import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  Modal,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface AlumbradoDragDropProps {
  onComplete: () => void;
}

interface PhraseItem {
  id: number;
  text: string;
  correctEntity: string;
  explanation?: string;
  position: Animated.ValueXY;
  isMatched: boolean;
}

const phraseData = [
  { text: 'Definir tasa de alumbrado público', correctEntity: 'Municipalidad', explanation: 'La municipalidad puede establecer una tasa destinada al alumbrado público; su uso y cobro deben estar regulados y explicados en la factura. Si tienes dudas, acude a la Municipalidad o a tu empresa distribuidora.' },
  { text: 'Verificar que los montos de la factura estén desglosados', correctEntity: 'CNEE', explanation: 'La CNEE supervisa que los cobros y conceptos estén claramente desglosados en la factura, para que puedas identificar cargos como la tarifa de alumbrado. Si tienes dudas, acude a la municipalidad o a tu empresa distribuidora.' },
  { text: 'Cobrar tasa de alumbrado público al usuario', correctEntity: 'Distribuidora', explanation: 'La distribuidora es la entidad que incluye este cargo en la factura; debe mostrar claramente el monto y concepto en el desglose. Si tienes dudas, acude a la Distribuidora o a la Municipalidad según corresponda.' },
];

const entities = ['CNEE', 'Municipalidad', 'Distribuidora'];

export const AlumbradoDragDrop: React.FC<AlumbradoDragDropProps> = ({ onComplete }) => {
  const [phrases, setPhrases] = useState<PhraseItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalBody, setModalBody] = useState('');
  const [showInstructions, setShowInstructions] = useState(true);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // Animación de entrada
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Inicializar frases con posiciones animadas
    const initialPhrases = phraseData.map((phrase, index) => ({
      id: index,
      text: phrase.text,
      correctEntity: phrase.correctEntity,
      position: new Animated.ValueXY({
        x: 0,
        y: index * (height * 0.08 + 10),
      }),
      isMatched: false,
    }));
    setPhrases(initialPhrases);

    // Animación de entrada
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const createPanResponder = (phrase: PhraseItem) => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: () => !phrase.isMatched,
      onPanResponderGrant: () => {
        phrase.position.setOffset({
          // @ts-ignore
          x: phrase.position.x._value,
          // @ts-ignore
          y: phrase.position.y._value,
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!phrase.isMatched) {
          phrase.position.setValue({
            x: gestureState.dx,
            y: gestureState.dy,
          });
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        phrase.position.flattenOffset();
        checkDrop(phrase, gestureState);
      },
    });
  };

  const checkDrop = (phrase: PhraseItem, gestureState: any) => {
    const dropX = gestureState.moveX;
    const dropY = gestureState.moveY;

    // Áreas de drop para layout vertical (cada entidad es una franja vertical)
    // Calculamos la posición Y de cada caja de entidad
    // Precisión máxima: calcular el área de drop exactamente igual al área visual
    const topOffset = height * 0.45;
    const gap = height * 0.012;
    const boxHeight = height * 0.13;
    const entityAreas = [
      { name: 'CNEE', minY: topOffset, maxY: topOffset + boxHeight },
      { name: 'Municipalidad', minY: topOffset + boxHeight + gap, maxY: topOffset + 2 * boxHeight + gap },
      { name: 'Distribuidora', minY: topOffset + 2 * (boxHeight + gap), maxY: topOffset + 3 * boxHeight + 2 * gap },
    ];
    // Ajuste horizontal para que el área de drop sea igual al área visual
    const minX = (width - width * 0.85) / 2;
    const maxX = minX + width * 0.85;

    let droppedEntity = null;
    for (const area of entityAreas) {
      if (
        dropY >= area.minY &&
        dropY <= area.maxY &&
        dropX >= minX &&
        dropX <= maxX
      ) {
        droppedEntity = area.name;
        break;
      }
    }

    if (droppedEntity) {
      if (droppedEntity === phrase.correctEntity) {
        // Respuesta correcta
        const newPhrases = phrases.map(p => 
          p.id === phrase.id ? { ...p, isMatched: true } : p
        );
        setPhrases(newPhrases);
        setCompletedCount(prev => prev + 1);

        // Mover a posición final
        Animated.spring(phrase.position, {
          toValue: { x: 0, y: 0 },
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }).start();

  setModalMessage(`Es correcto porque "${phrase.text}" corresponde a ${droppedEntity}.`);
  setModalBody(phrase.explanation || '');
        setShowModal(true);
        
        setTimeout(() => {
          setShowModal(false);
          setModalMessage('');
          setModalBody('');
          if (completedCount + 1 === phraseData.length) {
            setShowCompletionModal(true);
          }
        }, 3000);

      } else {
        // Respuesta incorrecta
  setModalMessage(`Es incorrecto porque "${phrase.text}" no corresponde a ${droppedEntity}. La entidad correcta es ${phrase.correctEntity}.`);
  setModalBody(phrase.explanation || '');
        setShowModal(true);
        
        // Volver a posición original
        Animated.spring(phrase.position, {
          toValue: { x: 0, y: 0 },
          tension: 100,
          friction: 8,
          useNativeDriver: false,
        }).start();

        setTimeout(() => {
          setShowModal(false);
          setModalMessage('');
          setModalBody('');
        }, 3000);
      }
    } else {
      // No se soltó en ninguna área válida
      Animated.spring(phrase.position, {
        toValue: { x: 0, y: 0 },
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleComplete = () => {
    setShowCompletionModal(false);
    onComplete();
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        }
      ]}
    >
      <LinearGradient
        colors={['#1a0033', '#2d1b4d', '#3d2b5f', '#2d1b4d', '#1a0033']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Título */}
        <LinearGradient
          colors={['rgba(139, 69, 255, 0.3)', 'rgba(88, 204, 247, 0.2)', 'rgba(139, 69, 255, 0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.titleContainer}
        >
          <Text style={styles.title}>🎮 Arrastra cada frase a la entidad correcta</Text>
          <Text style={styles.subtitle}>
            Completadas: {completedCount}/{phraseData.length}
          </Text>
        </LinearGradient>

        {/* Área de frases para arrastrar */}
        <View style={styles.phrasesContainer}>
          <Text style={styles.sectionTitle}>📝 Frases disponibles:</Text>
          {phrases.map((phrase, index) => {
            if (phrase.isMatched) return null;
            
            return (
              <Animated.View
                key={phrase.id}
                style={[
                  styles.phraseItem,
                  {
                    transform: [
                      { translateX: phrase.position.x },
                      { translateY: phrase.position.y },
                    ],
                  },
                ]}
                {...createPanResponder(phrase).panHandlers}
              >
                <LinearGradient
                  colors={['rgba(139, 69, 255, 0.8)', 'rgba(88, 204, 247, 0.6)', 'rgba(139, 69, 255, 0.8)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.phraseGradient}
                >
                  <Text style={styles.phraseText}>{phrase.text}</Text>
                  <Text style={styles.dragHint}>👆 Arrastra</Text>
                </LinearGradient>
              </Animated.View>
            );
          })}
        </View>

        {/* Áreas de destino - Entidades */}
        <View style={styles.entitiesContainer}>
          <Text style={styles.sectionTitle}>🎯 Suelta aquí:</Text>
          <View style={styles.entitiesRow}>
            {entities.map((entity, index) => (
              <LinearGradient
                key={entity}
                colors={
                  entity === 'CNEE' 
                    ? ['rgba(139, 69, 255, 0.3)', 'rgba(139, 69, 255, 0.1)']
                    : entity === 'Municipalidad'
                    ? ['rgba(88, 204, 247, 0.3)', 'rgba(88, 204, 247, 0.1)']
                    : ['rgba(255, 193, 7, 0.3)', 'rgba(255, 193, 7, 0.1)']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.entityDropZone}
              >
                <Text style={styles.entityTitle}>{entity}</Text>
                <View style={styles.matchedItemsContainer}>
                  {phrases
                    .filter(p => p.isMatched && p.correctEntity === entity)
                    .map(matchedPhrase => (
                      <View key={matchedPhrase.id} style={styles.matchedItem}>
                        <Text style={styles.matchedText}>✅ {matchedPhrase.text}</Text>
                      </View>
                    ))
                  }
                </View>
              </LinearGradient>
            ))}
          </View>
        </View>

        {/* Modal de instrucciones */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showInstructions}
          onRequestClose={() => setShowInstructions(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['rgba(139, 69, 255, 0.95)', 'rgba(88, 204, 247, 0.9)', 'rgba(139, 69, 255, 0.95)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>🎮 Instrucciones</Text>
              <Text style={styles.modalText}>
                Arrastra cada frase a la entidad que le corresponde:{'\n\n'}
                🏛️ CNEE: Comisión Nacional de Energía Eléctrica{'\n'}
                🏛️ Municipalidad: Gobierno local{'\n'}
                ⚡ Distribuidora: Empresa de electricidad
              </Text>
              <TouchableOpacity 
                style={styles.modalButton}
                onPress={() => setShowInstructions(false)}
              >
                <Text style={styles.modalButtonText}>¡Entendido!</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>

        {/* Modal de retroalimentación */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['rgba(139, 69, 255, 0.95)', 'rgba(88, 204, 247, 0.9)', 'rgba(139, 69, 255, 0.95)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>{modalMessage}</Text>
              <Text style={styles.modalText}>{modalBody}</Text>
            </LinearGradient>
          </View>
        </Modal>

        {/* Modal de finalización */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showCompletionModal}
          onRequestClose={() => setShowCompletionModal(false)}
        >
          <View style={styles.modalOverlay}>
            <LinearGradient
              colors={['rgba(40, 167, 69, 0.95)', 'rgba(88, 204, 247, 0.9)', 'rgba(40, 167, 69, 0.95)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.modalContent}
            >
              <Text style={styles.modalTitle}>🎉 ¡Excelente trabajo!</Text>
              <Text style={styles.modalText}>
                Has completado correctamente la actividad de alumbrado público.{'\n\n'}
                Ahora sabes qué entidad es responsable de cada aspecto del alumbrado público.
              </Text>
              <TouchableOpacity 
                style={styles.completionButton}
                onPress={handleComplete}
              >
                <Text style={styles.modalButtonText}>Continuar</Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </Modal>
      </LinearGradient>
    </Animated.View>
  );
};

export default AlumbradoDragDrop;

