import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Animated,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

// Detectar si es tablet
const isTablet = width >= 768;

// Función para escalar fuentes de manera responsiva
const scale = (size: number) => {
  if (isTablet) {
    return size * 0.7; // Reducir un 30% en tablets
  }
  return size;
};

// Función para escalar espacios
const scaleSpace = (size: number) => {
  if (isTablet) {
    return size * 0.8; // Reducir un 20% en tablets
  }
  return size;
};

interface EnergySource {
  id: string;
  name: string;
  emoji: string;
  image: any;
  matched: boolean;
}

interface DropZone {
  id: string;
  name: string;
  image: any;
  filled: boolean;
  layout?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const energySources: EnergySource[] = [
  {
    id: 'water',
    name: 'Agua de ríos',
    emoji: '💧',
    image: require('../../assets/hidro.png'),
    matched: false,
  },
  {
    id: 'solar',
    name: 'Sol',
    emoji: '🌞',
    image: require('../../assets/solar.png'),
    matched: false,
  },
  {
    id: 'wind',
    name: 'Viento',
    emoji: '🌬️',
    image: require('../../assets/aerogenerador.png'),
    matched: false,
  },
  {
    id: 'biomass',
    name: 'Caña de azúcar',
    emoji: '🌿',
    image: require('../../assets/biomasa.png'),
    matched: false,
  },
  {
    id: 'thermal',
    name: 'Combustibles',
    emoji: '🛢️',
    image: require('../../assets/termica.png'),
    matched: false,
  },
];

const dropZones: DropZone[] = [
  {
    id: 'water',
    name: 'Central hidroeléctrica',
    image: require('../../assets/hidro.png'),
    filled: false,
  },
  {
    id: 'solar',
    name: 'Paneles solares',
    image: require('../../assets/solar.png'),
    filled: false,
  },
  {
    id: 'wind',
    name: 'Aerogeneradores',
    image: require('../../assets/aerogenerador.png'),
    filled: false,
  },
  {
    id: 'biomass',
    name: 'Planta de biomasa',
    image: require('../../assets/biomasa.png'),
    filled: false,
  },
  {
    id: 'thermal',
    name: 'Planta térmica',
    image: require('../../assets/termica.png'),
    filled: false,
  },
];

interface AlumbradoItem {
  phrase: string;
  entity: string;
}

interface Props {
  onComplete: () => void;
  alumbradoData?: AlumbradoItem[];
  onScored?: (correct: number, total: number) => void;
}

export default function EnergyDragDropGame({ onComplete, alumbradoData, onScored }: Props) {
  // Si existe alumbradoData, mostrar la actividad de frases y entidades
  const [completed, setCompleted] = useState(false);
  const [selectedPhrase, setSelectedPhrase] = useState<number | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [matches, setMatches] = useState<Array<{ phrase: string; entity: string; correct: boolean }>>([]);

  if (alumbradoData) {
    // Renderizar la actividad de frases y entidades
    const entities = ['Municipalidad', 'CNEE', 'Distribuidora'];

    const handleMatch = () => {
      if (selectedPhrase !== null && selectedEntity) {
        const phraseObj = alumbradoData[selectedPhrase];
        const correct = phraseObj.entity === selectedEntity;
        setMatches(prev => [...prev, { phrase: phraseObj.phrase, entity: selectedEntity, correct }]);
        setSelectedPhrase(null);
        setSelectedEntity(null);
        if (matches.length + 1 === alumbradoData.length) {
          setTimeout(() => {
            setCompleted(true);
          }, 500);
        }
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>Arrastra cada frase a la entidad correcta</Text>
        <View style={{ marginVertical: 16 }}>
          {alumbradoData.map((item, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: selectedPhrase === idx ? '#1f2d55' : '#fff',
                  borderRadius: 20,
                  padding: 10,
                  marginRight: 10,
                  borderWidth: 2,
                  borderColor: '#1f2d55',
                }}
                onPress={() => setSelectedPhrase(idx)}
                disabled={matches.some(m => m.phrase === item.phrase)}
              >
                <Text style={{ color: selectedPhrase === idx ? '#fff' : '#1f2d55', fontWeight: 'bold', fontFamily: 'Century Gothic' }}>{item.phrase}</Text>
              </TouchableOpacity>
              {matches.find(m => m.phrase === item.phrase) && (
                <Text style={{ marginLeft: 8, color: matches.find(m => m.phrase === item.phrase)?.correct ? '#28A745' : '#FF0000' }}>
                  {matches.find(m => m.phrase === item.phrase)?.entity} {matches.find(m => m.phrase === item.phrase)?.correct ? '✅' : '❌'}
                </Text>
              )}
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
          {entities.map(entity => (
            <TouchableOpacity
              key={entity}
              style={{
                backgroundColor: selectedEntity === entity ? '#1f2d55' : '#fff',
                borderRadius: 20,
                padding: 12,
                marginHorizontal: 8,
                borderWidth: 2,
                borderColor: '#1f2d55',
              }}
              onPress={() => setSelectedEntity(entity)}
            >
              <Text style={{ color: selectedEntity === entity ? '#fff' : '#1f2d55', fontWeight: 'bold', fontFamily: 'Century Gothic' }}>{entity}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: selectedPhrase !== null && selectedEntity ? '#1f2d55' : '#ccc',
            borderRadius: 20,
            padding: 12,
            alignItems: 'center',
            marginBottom: 20,
          }}
          onPress={handleMatch}
          disabled={selectedPhrase === null || !selectedEntity}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Century Gothic' }}>Asignar</Text>
        </TouchableOpacity>
        {completed && (
          <View style={{ alignItems: 'center', marginTop: 20 }}>
            <Text style={{ fontSize: 18, color: '#28A745', fontWeight: 'bold' }}>¡Actividad completada! 🎉</Text>
            <TouchableOpacity
              style={{ backgroundColor: '#1f2d55', borderRadius: 20, padding: 12, marginTop: 10 }}
              onPress={onComplete}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontFamily: 'Century Gothic' }}>Continuar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // ...juego original...
  const [sources, setSources] = useState(energySources);
  const [zones, setZones] = useState(dropZones);
  const [score, setScore] = useState(0);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [showSelectModal, setShowSelectModal] = useState(false);
  const [showOccupiedModal, setShowOccupiedModal] = useState(false);
  const [showRetryModal, setShowRetryModal] = useState(false);
  
  // Animaciones para cada fuente (bounce effect)
  const sourceAnimations = useRef<{[key: string]: Animated.Value}>({
    water: new Animated.Value(1),
    solar: new Animated.Value(1),
    wind: new Animated.Value(1),
    biomass: new Animated.Value(1),
    thermal: new Animated.Value(1),
  }).current;

  const handleSourceSelect = (sourceId: string) => {
    if (selectedSource === sourceId) {
      setSelectedSource(null);
    } else {
      setSelectedSource(sourceId);
      // Animación bounce al seleccionar (estilo Duolingo)
      Animated.sequence([
        Animated.timing(sourceAnimations[sourceId], {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(sourceAnimations[sourceId], {
          toValue: 1,
          friction: 3,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handleZoneSelect = (zoneId: string) => {
    if (!selectedSource) {
      setShowSelectModal(true);
      return;
    }

    const zone = zones.find(z => z.id === zoneId);
    if (zone?.filled) {
      setShowOccupiedModal(true);
      return;
    }

    if (selectedSource === zoneId) {
      // Correct match
      setSources(prev => 
        prev.map(source => 
          source.id === selectedSource ? { ...source, matched: true } : source
        )
      );
      setZones(prev => 
        prev.map(zone => 
          zone.id === zoneId ? { ...zone, filled: true } : zone
        )
      );
      const newScore = score + 1;
      setScore(newScore);
      setSelectedSource(null);
      
      if (newScore === 5) {
        // Report score to parent before completing
        if (onScored) {
          onScored(newScore, 5);
        }
        // Directly notify parent; persona modal will be shown at screen level
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    } else {
      // Incorrect match
      setShowRetryModal(true);
      setSelectedSource(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Conecta las fuentes de energía</Text>

      {/* Instrucciones claras (selección por toque) */}
      <LinearGradient
        colors={['#1e3a8a', '#2563eb', '#3b82f6']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: scaleSpace(16),
          paddingVertical: scaleSpace(14),
          paddingHorizontal: scaleSpace(18),
          marginBottom: scaleSpace(16),
          borderWidth: 2,
          borderColor: '#60a5fa',
          shadowColor: '#3b82f6',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Text style={{ color: '#FFFFFF', textAlign: 'center', fontFamily: 'Century Gothic', fontSize: scale(width * 0.042), fontWeight: '600' }}>
          1️⃣ Selecciona una fuente  •  2️⃣ Toca la planta correspondiente
        </Text>
      </LinearGradient>

      <Text style={styles.score}>Tu puntuación: {score}/5</Text>
      {/* ...resto del juego original... */}
      {/* Drop Zones */}
      <View style={styles.dropZonesContainer}>
        {zones.map((zone) => (
          <TouchableOpacity
            key={zone.id}
            style={[
              styles.dropZone,
              zone.filled && styles.filledDropZone
            ]}
            onPress={() => handleZoneSelect(zone.id)}
            disabled={zone.filled}
          >
            <View style={styles.imageContainer}>
              <Image source={zone.image} style={styles.dropZoneImage} />
            </View>
            <Text style={styles.dropZoneText}>{zone.name}</Text>
            {zone.filled && (
              <View style={styles.checkMark}>
                <Text style={styles.checkMarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Selectable Sources con efecto Duolingo */}
      <View style={styles.sourcesContainer}>
        {sources.filter(source => !source.matched).map((source) => {
          const isSelected = selectedSource === source.id;
          const isBlocked = selectedSource !== null && selectedSource !== source.id;
          
          return (
            <Animated.View
              key={source.id}
              style={{
                width: width * 0.42,
                marginBottom: height * 0.015,
                opacity: isBlocked ? 0.4 : 1,
                transform: [{ scale: sourceAnimations[source.id] }],
              }}
            >
              <TouchableOpacity
                style={{
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: isSelected ? '#10b981' : '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: isSelected ? 0.6 : 0.2,
                  shadowRadius: isSelected ? 12 : 8,
                  elevation: isSelected ? 12 : 4,
                }}
                onPress={() => handleSourceSelect(source.id)}
                disabled={isBlocked}
              >
                <LinearGradient
                  colors={
                    isSelected
                      ? ['#10b981', '#06b6d4', '#3b82f6'] // Verde fosforescente a cyan a azul
                      : isBlocked
                      ? ['#475569', '#64748b', '#94a3b8'] // Gris bloqueado
                      : ['#1e293b', '#334155', '#475569'] // Gris oscuro normal
                  }
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    height: height * 0.09,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: width * 0.04,
                    borderWidth: 2,
                    borderColor: isSelected ? '#10b981' : isBlocked ? '#6b7280' : 'rgba(148, 163, 184, 0.3)',
                    borderRadius: 16,
                  }}
                >
                  <Text 
                    style={[
                      styles.sourceText, 
                      { 
                        fontSize: width * 0.04, 
                        fontWeight: isSelected ? '700' : '600',
                        color: isBlocked ? '#cbd5e1' : '#FFFFFF'
                      }
                    ]}
                  >
                    {source.name}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>

      {score === 5 && (
        <View style={styles.completionMessage}>
          <Text style={styles.completionText}>¡Perfecto! 🎉</Text>
          <Text style={styles.completionSubText}>Has conectado todas las fuentes correctamente</Text>
        </View>
      )}

      {/* Modal: Selecciona una fuente */}
      <Modal transparent visible={showSelectModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#0f172a', '#1e293b', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.modalContainer, { borderWidth: 2, borderColor: '#3b82f6' }]}
          >
            <Text style={styles.modalTitle}>💡 Primero selecciona una fuente de energía</Text>
            <Text style={styles.modalMessage}>Toca una de las fuentes de energía de abajo para seleccionarla.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowSelectModal(false)}
            >
              <LinearGradient
                colors={['#0ea5e9', '#2563eb', '#1d4ed8']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Entendido</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Modal: Posición ocupada */}
      <Modal transparent visible={showOccupiedModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#0f172a', '#1e293b', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.modalContainer, { borderWidth: 2, borderColor: '#f59e0b' }]}
          >
            <Text style={styles.modalTitle}>⚠️ Esta posición ya está ocupada</Text>
            <Text style={styles.modalMessage}>Elige una posición vacía.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowOccupiedModal(false)}
            >
              <LinearGradient
                colors={['#f59e0b', '#d97706', '#b45309']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Modal: Inténtalo de nuevo */}
      <Modal transparent visible={showRetryModal} animationType="fade">
        <View style={styles.modalOverlay}>
          <LinearGradient
            colors={['#0f172a', '#1e293b', '#334155']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.modalContainer, { borderWidth: 2, borderColor: '#ef4444' }]}
          >
            <Text style={styles.modalTitle}>🔄 ¡Inténtalo de nuevo!</Text>
            <Text style={styles.modalMessage}>Esa no es la conexión correcta. Piensa en qué fuente corresponde a cada tipo de planta.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowRetryModal(false)}
            >
              <LinearGradient
                colors={['#ef4444', '#dc2626', '#b91c1c']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.modalButtonGradient}
              >
                <Text style={styles.modalButtonText}>Reintentar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </Modal>

      {/* Removed old completion modal; screen-level persona modal handles completion UI */}
    </View>
  );
}

