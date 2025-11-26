import React, { useMemo, useRef, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';
import { Animated } from 'react-native';
import { moderateScale as ms, msFont } from '../../utils/responsive';

const { width, height } = Dimensions.get('window');

interface GlossaryTerm {
  id: number;
  term: string;
  definition: string;
  icon: string;
  color: string[];
}

interface BillGlossaryProps {
  onComplete: () => void;
}

// Orden solicitado: kWh, CNEE, Distribuidora, Tarifa, Factura eléctrica
const glossaryTerms: GlossaryTerm[] = [
  {
    id: 2,
    term: 'kWh',
    definition: 'Unidad de medida de energía.',
    icon: '',
    color: [],
  },
  {
    id: 5,
    term: 'CNEE',
    definition:
      'Entidad que regula el precio y calidad del servicio eléctrico que las empresas distribuidoras brindan a los usuarios.',
    icon: '',
    color: [],
  },
  {
    id: 3,
    term: 'Distribuidora',
    definition: 'Empresa que entrega la electricidad a tu hogar.',
    icon: '',
    color: [],
  },
  {
    id: 1,
    term: 'Tarifa',
    definition: 'Precio por cada kilovatio hora consumido.',
    icon: '',
    color: [],
  },
  {
    id: 4,
    term: 'Factura eléctrica',
    definition: 'Documento que muestra tu consumo y cuánto debes pagar.',
    icon: '',
    color: [],
  },
];

export default function BillGlossary({ onComplete }: BillGlossaryProps) {
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<GlossaryTerm | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string } | null>(null);
  const [hasCompleted, setHasCompleted] = useState(false);
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;

  // Shuffle definitions for the matching game
  const [shuffledDefinitions] = useState(
    [...glossaryTerms].sort(() => Math.random() - 0.5)
  );

  const progress = (matchedPairs.length / glossaryTerms.length) * 100;

  // Simple entrance animation for content
  useEffect(() => {
    Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 350,
      useNativeDriver: true,
    }).start();
  }, [fadeInAnim]);

  // Auto complete when all pairs are matched
  useEffect(() => {
    if (matchedPairs.length === glossaryTerms.length && matchedPairs.length > 0 && !hasCompleted) {
      setHasCompleted(true);
      // Small delay to show completion state before calling onComplete
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  }, [matchedPairs.length, onComplete, hasCompleted]);

  const handleTermPress = (term: GlossaryTerm) => {
    if (matchedPairs.includes(term.id)) return;
    setSelectedTerm(term);
    if (selectedDefinition) {
      checkMatch(term, selectedDefinition);
    }
  };

  const handleDefinitionPress = (definition: GlossaryTerm) => {
    if (matchedPairs.includes(definition.id)) return;
    setSelectedDefinition(definition);
    if (selectedTerm) {
      checkMatch(selectedTerm, definition);
    }
  };

  const checkMatch = (term: GlossaryTerm, definition: GlossaryTerm) => {
    setAttempts(attempts + 1);

    if (term.id === definition.id) {
      // Match successful
      setMatchedPairs([...matchedPairs, term.id]);
      setSelectedTerm(null);
      setSelectedDefinition(null);
    } else {
      // Match failed
      setSelectedTerm(null);
      setSelectedDefinition(null);
      // Shake animation
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -1, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 1, duration: 60, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
      ]).start();
      setErrorModal({ visible: true, message: 'Es incorrecto. Intenta de nuevo.' });
    }
  };

  const resetGame = () => {
    setSelectedTerm(null);
    setSelectedDefinition(null);
    setMatchedPairs([]);
    setAttempts(0);
    setHasCompleted(false);
  };

  const isGameComplete = matchedPairs.length === glossaryTerms.length;

  // Standardized gradients
  const baseGradient = useMemo(() => ['#2a3f6f', '#3b4a99', '#5a5bd6'] as const, []);
  const baseGradientAlt = useMemo(() => ['#324b7a', '#4653a3', '#6b64db'] as const, []);
  const selectedGradient = useMemo(() => ['#58CCF7', '#7aa7ff'] as const, []);
  const matchedGradient = useMemo(() => ['#3b3f54', '#2e3044'] as const, []);

  return (
    <LinearGradient
      colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={[styles.container, { backgroundColor: 'transparent', flex: 1 }]}> 
        <Text style={styles.instruction}>Empareja cada término con su definición correcta:</Text>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Emparejados: {matchedPairs.length}/{glossaryTerms.length}
          </Text>
          <View style={styles.progressBar}>
            <LinearGradient
              colors={['#8B45FF', '#58CCF7', '#3B82F6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>

  <ScrollView style={styles.gameContainer} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
          {/* Terms Section */}
          <Text style={styles.sectionTitle}>TÉRMINOS</Text>
          <Animated.View style={[styles.chipsContainer, { opacity: fadeInAnim, transform: [{ translateY: fadeInAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
            {glossaryTerms.map((term) => (
              <TouchableOpacity
                key={`term-${term.id}`}
                style={[
                  styles.termChip,
                  selectedTerm?.id === term.id && styles.termChipSelected,
                  matchedPairs.includes(term.id) && styles.termChipMatched,
                ]}
                onPress={() => handleTermPress(term)}
                disabled={matchedPairs.includes(term.id)}
              >
                <Animated.View style={{ transform: [{ translateX: shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] }) }] }}>
                  <View style={styles.chipInner}>
                    <Text style={styles.chipText}>✓ {term.term}</Text>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </Animated.View>

          {/* Definitions Section */}
          <Text style={styles.sectionTitle}>DEFINICIONES</Text>
          <Animated.View style={[styles.definitionsContainer, { opacity: fadeInAnim, transform: [{ translateY: fadeInAnim.interpolate({ inputRange: [0, 1], outputRange: [10, 0] }) }] }]}>
            {shuffledDefinitions.map((definition) => (
              <TouchableOpacity
                key={`def-${definition.id}`}
                style={[
                  styles.definitionCard,
                  selectedDefinition?.id === definition.id && styles.selectedCard,
                  matchedPairs.includes(definition.id) && styles.matchedCard,
                ]}
                onPress={() => handleDefinitionPress(definition)}
                disabled={matchedPairs.includes(definition.id)}
              >
                <Animated.View style={{ transform: [{ translateX: shakeAnim.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] }) }] }}>
                  <View style={styles.definitionGradient}>
                    <ScrollView style={styles.definitionScroll} nestedScrollEnabled showsVerticalScrollIndicator>
                      <Text style={styles.definitionText}>{definition.definition}</Text>
                    </ScrollView>
                  </View>
                </Animated.View>
              </TouchableOpacity>
            ))}
          </Animated.View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {!isGameComplete && (
            <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
              <LinearGradient
                colors={['#2a3f6f', '#4653a3']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Reiniciar</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>

        {/* Game Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>
            Intentos: {attempts} | Aciertos: {matchedPairs.length}
          </Text>
        </View>

        {/* Modal de error minimalista */}
        {errorModal?.visible && (
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', alignItems: 'center', padding: ms(24) }}>
            <View style={{ width: '88%', backgroundColor: '#0f172a', borderRadius: 16, borderWidth: 2, borderColor: '#58CCF7', padding: ms(22) }}>
              <Text style={{ color: '#fff', fontSize: msFont(18), fontWeight: '800', textAlign: 'center', marginBottom: ms(8) }}>Es incorrecto</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: msFont(16), textAlign: 'center' }}>Intenta de nuevo. Revisa cuidadosamente las definiciones.</Text>
              <TouchableOpacity onPress={() => setErrorModal(null)} style={{ marginTop: ms(16), alignSelf: 'center' }}>
                <View style={{ borderRadius: 12, borderWidth: 2, borderColor: '#58CCF7', paddingVertical: ms(10), paddingHorizontal: ms(24), backgroundColor: '#2a3f6f' }}>
                  <Text style={{ color: '#fff', fontSize: msFont(16), fontWeight: '700' }}>Cerrar</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

