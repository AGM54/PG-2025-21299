import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, Modal, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles as triviaStyles } from '../TriviaCard/styles';

const { width, height } = Dimensions.get('window');

interface Term {
  id: number;
  term: string;
  definition: string;
  color: string;
}

const terms: Term[] = [
  {
    id: 1,
    term: "Tarifa",
    definition: "Precio que pagas por la electricidad",
    color: '#FF6B6B'
  },
  {
    id: 2,
    term: "Servicio regulado",
    definition: "Electricidad con precio y calidad supervisados que se brinda a los usuarios residenciales",
    color: '#4ECDC4'
  },
  {
    id: 3,
    term: "Norma técnica",
    definition: "Regla que asegura el buen funcionamiento del sistema",
    color: '#45B7D1'
  },
  {
    id: 4,
    term: "Distribuidor",
    definition: "Empresa que lleva la electricidad hasta tu hogar",
    color: '#96CEB4'
  },
  {
    id: 5,
    term: "Usuario residencial",
    definition: "Persona que recibe y paga el servicio de energía",
    color: '#FFEAA7'
  }
];

interface GlossaryGameProps {
  onComplete: () => void;
}

export default function GlossaryGame({ onComplete }: GlossaryGameProps) {
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [shake] = useState(new Animated.Value(0));
  const [bounce] = useState(new Animated.Value(0));
  const [definitions, setDefinitions] = useState<Term[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
  const [selectedDefinition, setSelectedDefinition] = useState<Term | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [lastMatchedId, setLastMatchedId] = useState<number | null>(null);

  useEffect(() => {
    // Mezclar las definiciones al inicio
    setDefinitions([...terms].sort(() => Math.random() - 0.5));
  }, []);

  const handleTermPress = (term: Term) => {
    if (matchedPairs.includes(term.id)) return;
    setSelectedTerm(term);
  };

  const handleDefinitionPress = (definition: Term) => {
    if (matchedPairs.includes(definition.id)) return;
    setSelectedDefinition(definition);
  };

  const handleContinue = () => {
    setShowCongratulations(false);
    onComplete();
  };

  useEffect(() => {
    if (selectedTerm && selectedDefinition) {
      if (selectedTerm.id === selectedDefinition.id) {
        // Correcto - Animación de salto tipo Duolingo
        setLastMatchedId(selectedTerm.id);
        Animated.sequence([
          Animated.timing(bounce, {
            toValue: -20,
            duration: 200,
            useNativeDriver: true
          }),
          Animated.spring(bounce, {
            toValue: 0,
            friction: 4,
            tension: 40,
            useNativeDriver: true
          })
        ]).start();

        setTimeout(() => {
          setMatchedPairs([...matchedPairs, selectedTerm.id]);
          setSelectedTerm(null);
          setSelectedDefinition(null);
          setLastMatchedId(null);

          // Verificar si completó todos los pares
          if (matchedPairs.length + 1 === terms.length) {
            setTimeout(() => setShowCongratulations(true), 500);
          }
        }, 400);
      } else {
        // Incorrecto - animar shake
        Animated.sequence([
          Animated.timing(shake, {
            toValue: 10,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(shake, {
            toValue: -10,
            duration: 100,
            useNativeDriver: true
          }),
          Animated.timing(shake, {
            toValue: 0,
            duration: 100,
            useNativeDriver: true
          })
        ]).start(() => {
          setSelectedTerm(null);
          setSelectedDefinition(null);
        });
      }
    }
  }, [selectedTerm, selectedDefinition, matchedPairs, onComplete]);

  return (
    <>
      <Animated.View style={[styles.container, { transform: [{ translateX: shake }] }]}>
        <Text style={styles.title}>Conecta cada término con su definición</Text>

        {/* Términos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Términos:</Text>
          {terms.map((term) => (
            <Animated.View
              key={term.id}
              style={{
                transform: [{ translateY: lastMatchedId === term.id ? bounce : 0 }]
              }}
            >
              <TouchableOpacity
                onPress={() => handleTermPress(term)}
                disabled={matchedPairs.includes(term.id)}
                style={[
                  styles.button,
                  selectedTerm?.id === term.id && styles.selectedButton,
                  matchedPairs.includes(term.id) && styles.matchedButton
                ]}
              >
                <Text style={[
                  styles.buttonText,
                  matchedPairs.includes(term.id) && styles.matchedText
                ]}>
                  {term.term}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Definiciones */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📖 Definiciones:</Text>
          {definitions.map((def) => (
            <Animated.View
              key={def.id}
              style={{
                transform: [{ translateY: lastMatchedId === def.id ? bounce : 0 }]
              }}
            >
              <TouchableOpacity
                onPress={() => handleDefinitionPress(def)}
                disabled={matchedPairs.includes(def.id)}
                style={[
                  styles.button,
                  selectedDefinition?.id === def.id && styles.selectedButton,
                  matchedPairs.includes(def.id) && styles.matchedButton
                ]}
              >
                <Text style={[
                  styles.buttonText,
                  matchedPairs.includes(def.id) && styles.matchedText
                ]}>
                  {def.definition}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Progreso */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            ✨ {matchedPairs.length} de {terms.length} pares encontrados
          </Text>
        </View>
      </Animated.View>

      {/* Modal de Felicitaciones */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showCongratulations}
        onRequestClose={() => setShowCongratulations(false)}
      >
        <View style={triviaStyles.modalOverlay}>
          <LinearGradient
            colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#2a3f6f', '#1f2d55']}
            style={triviaStyles.congratulationsModal}
          >
            <Image
              source={require('../../assets/persona/persona5.png')}
              style={triviaStyles.congratulationsImage}
              resizeMode="contain"
            />
            <Text style={triviaStyles.congratulationsTitle}>
              ¡Excelente trabajo!
            </Text>
            <Text style={triviaStyles.congratulationsMessage}>
              Has completado el glosario correctamente. ¡Conoces muy bien estos términos importantes!
            </Text>
            <TouchableOpacity style={triviaStyles.continueFromModalButton} onPress={handleContinue}>
              <LinearGradient
                colors={['#58CCF7', '#4A9FE7']}
                style={triviaStyles.continueFromModalGradient}
              >
                <Text style={triviaStyles.continueFromModalText}>Continuar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: width * 0.04,
    backgroundColor: 'rgba(31, 45, 85, 0.95)',
    borderRadius: 16,
  },
  title: {
    color: '#FFFFFF',
    fontSize: width * 0.05,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: height * 0.025,
    fontFamily: 'Century Gothic',
  },
  section: {
    marginBottom: height * 0.025,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: width * 0.045,
    fontWeight: '600',
    marginBottom: height * 0.015,
    fontFamily: 'Century Gothic',
  },
  button: {
    backgroundColor: '#7c3aed',
    padding: width * 0.04,
    borderRadius: 16,
    marginBottom: height * 0.012,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  selectedButton: {
    backgroundColor: '#8b5cf6',
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ scale: 1.02 }],
  },
  matchedButton: {
    backgroundColor: '#4a5568',
    opacity: 0.6,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: '500',
    fontFamily: 'Century Gothic',
  },
  matchedText: {
    color: '#9CA3AF',
    fontWeight: '600',
    opacity: 0.7,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: height * 0.02,
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: width * 0.04,
    fontWeight: '600',
    textAlign: 'center',
    backgroundColor: 'rgba(88, 204, 247, 0.2)',
    paddingVertical: height * 0.015,
    paddingHorizontal: width * 0.06,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(88, 204, 247, 0.3)',
    fontFamily: 'Century Gothic',
  },
});

