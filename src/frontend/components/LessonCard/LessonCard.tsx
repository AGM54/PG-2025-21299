import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './styles';

interface LessonCardProps {
  title: string;
  description?: string;
  duration?: string;
  image?: any; // <-- ahora opcional
  onPress?: () => void;
  hasButton?: boolean;
  buttonText?: string;
}

const LessonCard: React.FC<LessonCardProps> = ({
  title,
  description,
  duration,
  image,
  onPress,
  hasButton = false,
  buttonText = 'Continuar',
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          {description && <Text style={styles.description}>{description}</Text>}
          {duration && (
            <View style={styles.durationRow}>
              <Ionicons name="time-outline" size={18} color="#fff" />
              <Text style={styles.durationText}>{duration}</Text>
            </View>
          )}
        </View>
        {image && <Image source={image} style={styles.image} />}
      </View>

      {hasButton && (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default LessonCard;

