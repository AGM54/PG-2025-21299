import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface StorySlide {
  title: string;
  content: string;
  image?: any;
}

interface SofiaStoryCardProps {
  onComplete: () => void;
  slides?: StorySlide[];
}

const defaultSofiaStorySlides: StorySlide[] = [
  {
    title: 'Sofía en su primer apartamento',
    content: '',
    image: require('../../assets/primeram.png'),
  },
  {
    title: 'Su papá le explica por teléfono',
    content: '',
    image: require('../../assets/segundam.png'),
  },
  {
    title: 'Sofía revisa su contador y el recibo',
    content: '',
    image: require('../../assets/terceram.png'),
  },
  {
    title: 'Cierre',
    content: '',
    image: require('../../assets/cuartam.png'),
  },
];

export default function SofiaStoryCard({ onComplete, slides = defaultSofiaStorySlides }: SofiaStoryCardProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const slide = slides[currentSlide];
  
  return (
    <View style={styles.container}>
      <Text style={styles.storyTitle}>
        Historia
      </Text>
      <Text style={styles.slideNumber}>
        {currentSlide + 1} de {slides.length}
      </Text>
      
      <LinearGradient
        colors={['#1f2d55', '#2a3f6f', '#3a5a8c', '#58CCF7', '#2a3f6f', '#1f2d55']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.slideCard}
      >
        <Text style={styles.slideTitle}>{slide.title}</Text>
        
        {/* Comic Frame - Solo imagen grande */}
        <View style={styles.comicFrame}>
          <Image
            source={slide.image}
            style={styles.comicImageLarge}
            resizeMode="contain"
          />
          {slide.content && slide.content.trim() !== '' && (
            <Text style={styles.slideContent}>{slide.content}</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.nextSlideButton} onPress={handleNextSlide}>
          <LinearGradient
            colors={['#58CCF7', '#60A5FA', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.nextSlideButtonGradient}
          >
            <Text style={styles.nextSlideButtonText}>
              {currentSlide < slides.length - 1 ? 'Siguiente' : 'Continuar'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
      
      {/* Progress dots */}
      <View style={styles.progressDots}>
        {slides.map((_: StorySlide, index: number) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentSlide && styles.activeDot,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

