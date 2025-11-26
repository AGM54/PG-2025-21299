import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface FacturaSectionData {
  id: number;
  title: string;
  explanation: string;
  position: { top: number; left: number; width: number; height: number };
}

interface FacturaExplorerProps {
  onComplete: () => void;
}

const facturaSections: FacturaSectionData[] = [
  {
    id: 1,
    title: 'Datos del cliente',
    explanation: 'Tu nombre, dirección y número de servicio para identificar tu cuenta.',
    position: { top: 15, left: 10, width: 80, height: 15 },
  },
  {
    id: 2,
    title: 'Fecha de emisión',
    explanation: 'Día en que se generó la factura.',
    position: { top: 35, left: 10, width: 40, height: 10 },
  },
  {
    id: 3,
    title: 'Fecha de vencimiento',
    explanation: 'Día límite para pagar sin recargos.',
    position: { top: 35, left: 55, width: 35, height: 10 },
  },
  {
    id: 4,
    title: 'Consumo en kWh',
    explanation: 'Cuánta energía usaste ese mes (más consumo = más pago).',
    position: { top: 50, left: 10, width: 35, height: 15 },
  },
  {
    id: 5,
    title: 'Total a pagar',
    explanation: 'Lo que debes pagar, incluyendo impuestos y otros cargos.',
    position: { top: 50, left: 50, width: 40, height: 15 },
  },
  {
    id: 6,
    title: 'Historial de consumo',
    explanation: 'Gráfico con tu consumo en meses anteriores.',
    position: { top: 70, left: 10, width: 80, height: 20 },
  },
];

export default function FacturaExplorer({ onComplete }: FacturaExplorerProps) {
  const [exploredSections, setExploredSections] = useState<number[]>([]);
  const [selectedSection, setSelectedSection] = useState<FacturaSectionData | null>(null);
  const [completed, setCompleted] = useState(false);

  const handleSectionPress = (section: FacturaSectionData) => {
    setSelectedSection(section);
    if (!exploredSections.includes(section.id)) {
      setExploredSections([...exploredSections, section.id]);
    }
  };

  const handleCloseExplanation = () => {
    setSelectedSection(null);
  };

  // Marca completado para mostrar el CTA de continuar
  useEffect(() => {
    setCompleted(exploredSections.length === facturaSections.length);
  }, [exploredSections]);

  const progress = (exploredSections.length / facturaSections.length) * 100;

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Explora tu factura</Text>
      <Text style={styles.instruction}>
        Haz clic en cada sección de la factura para conocer su significado:
      </Text>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Explorado: {exploredSections.length}/{facturaSections.length}
        </Text>
        <View style={styles.progressBar}>
          <LinearGradient
            colors={['#58CCF7', '#60A5FA', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${progress}%` }]}
          />
        </View>
      </View>

      {/* Simulated Invoice */}
      <LinearGradient
        colors={['rgba(255, 255, 255, 0.95)', 'rgba(245, 245, 255, 0.9)']}
        style={styles.invoiceContainer}
      >
        <Text style={styles.invoiceTitle}>FACTURA ELÉCTRICA</Text>
        
        {/* Clickable Sections */}
        {facturaSections.map((section) => (
          <TouchableOpacity
            key={section.id}
            style={[
              styles.clickableSection,
              {
                top: `${section.position.top}%`,
                left: `${section.position.left}%`,
                width: `${section.position.width}%`,
                height: `${section.position.height}%`,
              },
              exploredSections.includes(section.id) && styles.exploredSection,
            ]}
            onPress={() => handleSectionPress(section)}
          >
            <LinearGradient
              colors={
                exploredSections.includes(section.id)
                  ? ['rgba(88, 204, 247, 0.5)', 'rgba(59, 130, 246, 0.4)']
                  : ['rgba(88, 204, 247, 0.3)', 'rgba(96, 165, 250, 0.2)']
              }
              style={styles.sectionGradient}
            >
              <Text style={styles.sectionLabel}>{section.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </LinearGradient>

      {/* CTA para continuar: aparece solo cuando se explora todo; no muestra modal propio */}
      {completed && (
        <TouchableOpacity style={styles.completeButton} onPress={onComplete}>
          <Text style={styles.completeButtonText}>Continuar</Text>
        </TouchableOpacity>
      )}

      {/* Explanation Modal */}
      {selectedSection && (
        <View style={styles.explanationOverlay}>
          <View style={styles.explanationCard}>
            <View style={styles.neonLine} />
            <Text style={styles.explanationTitle}>{selectedSection.title}</Text>
            <ScrollView
              style={styles.explanationScroll}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: height * 0.012 }}
            >
              <Text style={styles.explanationText}>{selectedSection.explanation}</Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={handleCloseExplanation}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
}

