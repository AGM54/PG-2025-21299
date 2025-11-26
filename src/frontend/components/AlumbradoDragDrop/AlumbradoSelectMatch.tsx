import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { moderateScale as ms, msFont } from '../../utils/responsive';

const phraseData = [
  { text: 'Definir tasa de alumbrado público', correctEntity: 'Municipalidad' },
  { text: 'Verificar que los montos de la factura estén desglosados', correctEntity: 'CNEE' },
  { text: 'Cobrar tasa de alumbrado público al usuario', correctEntity: 'Distribuidora' },
];

const entities = ['CNEE', 'Municipalidad', 'Distribuidora'];

export const AlumbradoSelectMatch = ({ onComplete }: { onComplete: () => void }) => {
  const [selectedPhrase, setSelectedPhrase] = useState<number | null>(null);
  const [matched, setMatched] = useState<{ [key: number]: string }>({});
  const entityMatches: { [entity: string]: string[] } = {};
  Object.entries(matched).forEach(([idx, entity]) => {
    if (!entityMatches[entity]) entityMatches[entity] = [];
    entityMatches[entity].push(phraseData[Number(idx)].text);
  });
  const availablePhrases = phraseData.filter((_, idx) => !matched[idx]);
  const [completedCount, setCompletedCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    if (showModal) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
    }
  }, [showModal]);

  const handlePhraseSelect = (idx: number) => {
    setSelectedPhrase(idx);
  };

  const handleEntitySelect = (entity: string) => {
    if (selectedPhrase === null) return;
    const phrase = phraseData[selectedPhrase];
    if (phrase.correctEntity === entity) {
      setMatched({ ...matched, [selectedPhrase]: entity });
      setCompletedCount(completedCount + 1);
      setIsCorrect(true);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setSelectedPhrase(null);
        if (completedCount + 1 === phraseData.length) {
          setTimeout(() => setShowCompletionModal(true), 300);
        }
      }, 1200);
    } else {
      setIsCorrect(false);
      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        setSelectedPhrase(null);
      }, 2000);
    }
  };

  const handleComplete = () => {
    setShowCompletionModal(false);
    onComplete();
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#2a3f6f', '#1f2d55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <LinearGradient
          colors={['rgba(88, 204, 247, 0.3)', 'rgba(58, 90, 140, 0.4)', 'rgba(88, 204, 247, 0.3)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.titleContainer}
        >
          <Text style={styles.subtitle}>
            Completadas: {completedCount}/{phraseData.length}
          </Text>
        </LinearGradient>

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            1. Primero selecciona la frase
          </Text>
          <Text style={styles.instructionsText}>
            2. Luego selecciona la entidad correspondiente
          </Text>
        </View>

        <View style={styles.phrasesContainer}>
          <Text style={styles.sectionTitle}>📝 Frases disponibles:</Text>
          {availablePhrases.length === 0 ? (
            <Text style={{ color: '#aaa', fontSize: 16, textAlign: 'center', marginVertical: 12 }}>
              ¡Todas las frases han sido asignadas!
            </Text>
          ) : (
            availablePhrases.map((phrase, i) => {
              const idx = phraseData.findIndex(p => p.text === phrase.text);
              let marginTop = 0;
              let marginBottom = 18;
              if (phrase.text.includes('Verificar que los montos')) marginTop = 10;
              if (phrase.text.includes('Cobrar tasa de alumbrado')) marginBottom = 8;
              return (
                <View key={idx} style={{ marginBottom, marginTop, minHeight: 48, justifyContent: 'center' }}>
                  <TouchableOpacity
                    style={[styles.phraseGradient, selectedPhrase === idx && { borderColor: '#58CCF7', borderWidth: 3 }]}
                    disabled={matched[idx] !== undefined}
                    onPress={() => handlePhraseSelect(idx)}
                  >
                    <Text style={styles.phraseText}>{phrase.text}</Text>
                    {!matched[idx] && selectedPhrase === idx && (
                      <Text style={styles.dragHint}>Seleccionada</Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        <View style={[styles.entitiesContainer, { marginTop: 56 }]}>
          <View style={{ alignItems: 'flex-start', marginBottom: 12 }}>
            <Text style={[styles.sectionTitle, { fontSize: 20, textAlign: 'left' }]}>🎯 Elige la entidad:</Text>
          </View>
          <View style={styles.entitiesRow}>
            {entities.map((entity, idx) => (
              <TouchableOpacity
                key={entity}
                style={[styles.entityDropZone, selectedPhrase !== null && { borderColor: '#58CCF7', borderWidth: 3 }]}
                onPress={() => handleEntitySelect(entity)}
                disabled={selectedPhrase === null}
              >
                <Text style={styles.entityTitle}>{entity}</Text>
                {entityMatches[entity] && entityMatches[entity].map((text, i) => (
                  <View key={i} style={styles.matchedItem}>
                    <Text style={styles.matchedText}>✅ {text}</Text>
                  </View>
                ))}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Modal de retroalimentación animado */}
        <Modal
          animationType="none"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalOverlay}>
            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }],
              }}
            >
              <LinearGradient
                colors={isCorrect
                  ? ['#1f2d55', '#2a3f6f', '#28A745']
                  : ['#1f2d55', '#2a3f6f', '#DC3545']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 20,
                  padding: ms(24),
                  maxWidth: '75%',
                  borderWidth: 2,
                  borderColor: isCorrect ? '#28A745' : '#DC3545',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 8,
                }}
              >
                <Text style={{
                  fontSize: msFont(28),
                  fontWeight: 'bold',
                  color: '#fff',
                  textAlign: 'center',
                  marginBottom: ms(8),
                }}>
                  {isCorrect ? '✓' : '✗'}
                </Text>
                <Text style={{
                  fontSize: msFont(16),
                  fontWeight: '600',
                  color: '#fff',
                  textAlign: 'center',
                }}>
                  {isCorrect ? 'Correcto' : 'Incorrecto'}
                </Text>
              </LinearGradient>
            </Animated.View>
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
              colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.modalContent, { borderWidth: 2, borderColor: '#58CCF7' }]}
            >
              <Text style={styles.modalTitle}>¡Actividad completada!</Text>
              <Text style={styles.modalText}>
                Has completado correctamente la actividad de alumbrado público.
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
    </View>
  );
};

export default AlumbradoSelectMatch;

