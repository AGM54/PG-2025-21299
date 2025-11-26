import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

interface StorySlideData {
  id: number;
  title: string;
  image: any;
  description: string;
  buttonText?: string;
}

interface Props {
  slides?: StorySlideData[];
  onComplete?: () => void;
}

const defaultSlides: StorySlideData[] = [
  {
    id: 1,
    title: 'Slide 1',
    image: require('../../assets/persona/persona.png'),
    description: 'Contenido del primer slide.',
    buttonText: 'Continuar'
  },
  {
    id: 2,
    title: 'Slide 2', 
    image: require('../../assets/persona/persona2.png'),
    description: 'Contenido del segundo slide.',
    buttonText: 'Continuar'
  },
  {
    id: 3,
    title: 'Slide 3',
    image: require('../../assets/persona/persona3.png'),
    description: 'Contenido del tercer slide.',
    buttonText: 'Finalizar'
  }
];

const StorySlide: React.FC<Props> = ({
  slides = defaultSlides,
  onComplete
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete?.();
    }
  };

  const current = slides[currentSlide];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.slideCard}>
          <Text style={styles.slideTitle}>{current.title}</Text>
          
          {current.image && (
            <View style={styles.imageContainer}>
              <Image
                source={current.image}
                style={styles.storyImage}
                resizeMode="cover"
              />
            </View>
          )}
          
          <Text style={styles.descriptionText}>
            {current.description}
          </Text>
        </View>
      </ScrollView>

      {/* Continue button */}
      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleNext}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#58CCF7', '#4A9FE7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.continueButtonText}>
            {current.buttonText || 'Continuar'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default StorySlide;
