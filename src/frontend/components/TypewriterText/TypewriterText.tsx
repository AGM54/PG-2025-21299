import React, { useState, useEffect, useRef } from 'react';
import { Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

interface TypewriterTextProps {
  text: string;
  style?: any;
  speed?: number;
  onComplete?: () => void;
  startDelay?: number;
}

export default function TypewriterText({ 
  text, 
  style, 
  speed = 50, 
  onComplete,
  startDelay = 0 
}: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const timersRef = useRef<NodeJS.Timeout[]>([]);

  // Limpiar todos los timers al desmontar
  useEffect(() => {
    return () => {
      timersRef.current.forEach(timer => clearTimeout(timer));
    };
  }, []);

  // Iniciar después del delay inicial
  useEffect(() => {
    if (!isTyping && !isComplete) {
      if (startDelay > 0) {
        const delayTimer = setTimeout(() => {
          setIsTyping(true);
        }, startDelay);
        timersRef.current.push(delayTimer);
        return () => clearTimeout(delayTimer);
      } else {
        setIsTyping(true);
      }
    }
  }, []);

  // Efecto para escribir caracteres
  useEffect(() => {
    if (!isTyping || isComplete) return;

    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      timersRef.current.push(timer);
      return () => clearTimeout(timer);
    } else if (!isComplete) {
      setIsComplete(true);
      onComplete?.();
    }
  }, [currentIndex, isTyping, isComplete]);

  return (
    <Text style={[styles.defaultStyle, style]}>
      {displayedText}
      {!isComplete && <Text style={styles.cursor}>|</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  defaultStyle: {
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
});

