import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';

const { width } = Dimensions.get('window');

interface TypewriterListProps {
  items: string[];
  style?: any;
  itemStyle?: any;
  speed?: number;
  itemDelay?: number;
  onComplete?: () => void;
  startDelay?: number;
  scrollViewRef?: React.RefObject<ScrollView | null>;
  autoScroll?: boolean;
}

export default function TypewriterList({
  items,
  style,
  itemStyle,
  speed = 25,
  itemDelay = 2000,
  onComplete,
  startDelay = 1000,
  scrollViewRef,
  autoScroll = true
}: TypewriterListProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [displayedItems, setDisplayedItems] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Limpiar todos los timers al desmontar
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Iniciar el proceso después del delay inicial
  useEffect(() => {
    if (!isTyping && !isComplete) {
      const delayTimer = setTimeout(() => {
        setIsTyping(true);
        startNextItem();
      }, startDelay);
      
      timersRef.current.push(delayTimer);
      
      return () => clearTimeout(delayTimer);
    }
  }, []);

  const startNextItem = () => {
    if (currentItemIndex >= items.length) {
      if (!isComplete) {
        setIsComplete(true);
        onComplete?.();
      }
      return;
    }

    // Animar la aparición del nuevo item
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setCurrentText('');
    setCurrentCharIndex(0);
  };

  // Efecto para escribir caracteres
  useEffect(() => {
    if (!isTyping || currentItemIndex >= items.length || isComplete) return;

    const currentItem = items[currentItemIndex];
    
    if (currentCharIndex < currentItem.length) {
      const timer = setTimeout(() => {
        setCurrentText(prev => prev + currentItem[currentCharIndex]);
        setCurrentCharIndex(prev => prev + 1);
      }, speed);

      timersRef.current.push(timer);
      
      return () => clearTimeout(timer);
    } else if (currentCharIndex === currentItem.length) {
      // Item completado, pasar al siguiente después del delay
      const nextItemTimer = setTimeout(() => {
        setDisplayedItems(prev => [...prev, currentText]);
        setCurrentItemIndex(prev => prev + 1);
        fadeAnim.setValue(0);
        
        // Auto scroll
        if (autoScroll && scrollViewRef?.current && currentItemIndex < items.length - 1) {
          const scrollTimer = setTimeout(() => {
            const scrollTo = (currentItemIndex + 1) * 100;
            scrollViewRef.current?.scrollTo({
              y: scrollTo,
              animated: true
            });
          }, 300);
          timersRef.current.push(scrollTimer);
        }
        
        // Continuar con el siguiente item o finalizar
        if (currentItemIndex + 1 < items.length) {
          startNextItem();
        } else {
          setIsComplete(true);
          onComplete?.();
        }
      }, itemDelay);

      timersRef.current.push(nextItemTimer);
    }
  }, [currentCharIndex, currentItemIndex, isTyping, isComplete]);

  return (
    <View style={[styles.container, style]}>
      {/* Items completados */}
      {displayedItems.map((item, index) => (
        <View 
          key={index} 
          style={styles.itemContainer}
        >
          <Text style={styles.bullet}>●</Text>
          <Text style={[styles.itemText, itemStyle]}>{item}</Text>
        </View>
      ))}

      {/* Item actual siendo escrito */}
      {currentItemIndex < items.length && (
        <Animated.View
          style={[
            styles.itemContainer,
            { opacity: fadeAnim }
          ]}
        >
          <Text style={styles.bullet}>●</Text>
          <Text style={[styles.itemText, itemStyle]}>
            {currentText}
            {!isComplete && <Text style={styles.cursor}>|</Text>}
          </Text>
        </Animated.View>
      )}
      
      {/* Indicador de progreso y mensaje de espera */}
      {!isComplete && (
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            Leyendo punto {currentItemIndex + 1} de {items.length}...
          </Text>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: `${((currentItemIndex + 1) / items.length) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.waitText}>
            Por favor, espera a que termine la lectura
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: width * 0.04,
    paddingHorizontal: width * 0.02,
  },
  bullet: {
    fontSize: width * 0.044,
    color: '#58CCF7',
    fontWeight: 'bold',
    marginRight: width * 0.03,
    marginTop: width * 0.005,
  },
  itemText: {
    flex: 1,
    fontSize: width * 0.044,
    color: '#FFFFFF',
    textAlign: 'justify',
    lineHeight: width * 0.072,
    letterSpacing: 0.3,
  },
  cursor: {
    opacity: 1,
    color: '#58CCF7',
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: width * 0.08,
    alignItems: 'center',
    paddingHorizontal: width * 0.04,
    paddingVertical: width * 0.04,
    backgroundColor: 'rgba(88, 204, 247, 0.1)',
    borderRadius: 12,
    marginHorizontal: width * 0.02,
  },
  progressText: {
    color: '#58CCF7',
    fontSize: width * 0.038,
    marginBottom: width * 0.02,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressBar: {
    width: '80%',
    height: 6,
    backgroundColor: 'rgba(88, 204, 247, 0.3)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: width * 0.02,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#58CCF7',
    borderRadius: 3,
  },
  waitText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: width * 0.032,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

