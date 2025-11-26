import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface InteractiveFacturaProps {
  onComplete: () => void;
}

interface FacturaSection {
  id: number;
  title: string;
  description: string;
  position: { top: string; left?: string; right?: string };
}

const facturaSections: FacturaSection[] = [
  {
    id: 1,
    title: "Número de Factura",
    description: "Es el número de registro fiscal y está compuesto por la serie y el número de factura. Este número identifica únicamente tu factura y es importante para cualquier reclamo o consulta.",
    position: { top: '22%', left: '12%' }
  },
  {
    id: 2,
    title: "Datos del Cliente",
    description: "Aquí aparecen tus datos personales como nombre completo, dirección del servicio, NIT y zona. Verifica que todos los datos sean correctos.",
    position: { top: '32%', left: '8%' }
  },
  {
    id: 3,
    title: "Total a Pagar",
    description: "Es el monto total que debes pagar por tu consumo de energía eléctrica del mes. Incluye el consumo de energía, impuestos y otros cargos aplicables.",
    position: { top: '42%', left: '12%' }
  },
  {
    id: 4,
    title: "Detalle de Cargos",
    description: "Aquí se desglosan todos los conceptos que conforman tu factura: cargo fijo, energía consumida, impuestos (IVA), tasa municipal, etc. Te permite entender exactamente por qué pagas cierta cantidad.",
    position: { top: '58%', left: '6%' }
  },
  {
    id: 5,
    title: "Contador",
    description: "Muestra el número de tu medidor eléctrico y las lecturas actual y anterior. La diferencia entre estas lecturas es tu consumo en kWh del mes.",
    position: { top: '22%', right: '12%' }
  },
  {
    id: 6,
    title: "Fecha de Emisión",
    description: "Indica cuándo fue emitida la factura y la fecha límite de pago. Es importante pagar antes de la fecha de vencimiento para evitar recargos.",
    position: { top: '42%', right: '6%' }
  },
  {
    id: 7,
    title: "Historial de Consumo",
    description: "Muestra tu consumo de los últimos meses en kWh. Te ayuda a comparar tu consumo actual con meses anteriores y identificar cambios en tus hábitos de consumo.",
    position: { top: '72%', right: '12%' }
  }
];

const InteractiveFactura: React.FC<InteractiveFacturaProps> = ({ onComplete }) => {
  const [selectedSection, setSelectedSection] = useState<FacturaSection | null>(null);
  const [sectionsViewed, setSectionsViewed] = useState<Set<number>>(new Set());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [showContinue, setShowContinue] = useState(false);

  const handleSectionPress = (section: FacturaSection) => {
    setSelectedSection(section);
    setSectionsViewed(prev => new Set([...prev, section.id]));
    
    // Animación de fade in para la explicación
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeExplanation = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSelectedSection(null);
    });
  };

  const allSectionsViewed = sectionsViewed.size === facturaSections.length;

  // Mostrar CTA de continuar cuando se exploran todas las secciones
  useEffect(() => {
    setShowContinue(allSectionsViewed);
  }, [allSectionsViewed]);

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Explora tu factura</Text>
      <Text style={styles.instruction}>
        Toca los números amarillos para conocer cada sección de tu factura
      </Text>

      <View
        style={[
          styles.imageContainer,
          { height: Math.min(height * 0.5, width * 1.25) },
        ]}
      >
        {/* Imagen de la factura */}
        <Image
          source={require('../../assets/factueeg.png')}
          style={styles.facturaImage}
          resizeMode="contain"
        />

        {/* Botones interactivos sobre la imagen */}
        {facturaSections.map((section) => {
          const isViewed = sectionsViewed.has(section.id);
          const positionStyle: any = section.position.left 
            ? { top: section.position.top, left: section.position.left }
            : { top: section.position.top, right: section.position.right };

          return (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.sectionButton,
                positionStyle,
                isViewed && styles.viewedButton
              ]}
              onPress={() => handleSectionPress(section)}
            >
              <Text style={[
                styles.sectionNumber,
                isViewed && styles.viewedNumber
              ]}>
                {section.id}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Progreso */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>
          Secciones exploradas: {sectionsViewed.size}/7
        </Text>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${(sectionsViewed.size / 7) * 100}%` }
            ]} 
          />
        </View>
      </View>

      {/* Modal de explicación - recuadro negro con borde neón (sin línea superior) */}
      {selectedSection && (
        <Animated.View 
          style={[
            styles.explanationModal,
            { opacity: fadeAnim }
          ]}
        >
          <View style={styles.modalContent}>
            {/* Botón cerrar */}
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={closeExplanation}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>

            {/* Título y descripción */}
            <Text style={styles.modalTitle}>
              {selectedSection!.id}. {selectedSection!.title}
            </Text>

            <ScrollView
              style={styles.modalScroll}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={{ paddingBottom: height * 0.01 }}
            >
              <Text style={styles.modalDescription}>
                {selectedSection!.description}
              </Text>
            </ScrollView>
          </View>
        </Animated.View>
      )}

      {/* CTA discreto para continuar: aparece solo cuando se completan todas las secciones */}
      {showContinue && (
        <TouchableOpacity style={styles.ctaButton} onPress={onComplete}>
          <Text style={styles.ctaText}>Continuar</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InteractiveFactura;

