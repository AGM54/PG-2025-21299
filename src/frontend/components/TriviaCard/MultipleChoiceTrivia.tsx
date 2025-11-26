import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface TriviaOption {
  id: string;
  text: string;
  correct: boolean;
}

interface MultipleChoiceTriviaProps {
  question: string;
  options: TriviaOption[];
  // Explanation to show when the user selects the correct option
  explanationCorrect: string;
  // Explanation to show when the user selects an incorrect option
  explanationIncorrect: string;
  onComplete: () => void;
  // Optional scoring callback to accumulate results at module level
  onScored?: (correct: number, total: number) => void;
}

export default function MultipleChoiceTrivia({ 
  question, 
  options, 
  explanationCorrect, 
  explanationIncorrect, 
  onComplete,
  onScored
}: MultipleChoiceTriviaProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (optionId: string) => {
    setSelectedAnswer(optionId);
    setShowFeedback(true);
  };

  const handleContinue = () => {
    // Report score to parent (1 question total)
    if (onScored) {
      onScored(isCorrect ? 1 : 0, 1);
    }
    onComplete();
  };

  const selectedOption = options.find(opt => opt.id === selectedAnswer);
  const isCorrect = selectedOption?.correct || false;

  return (
    <LinearGradient
      colors={['#1f2d55', '#2a3f6f', '#3a5a8c']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: 1,
        minHeight: height * 0.7,
        paddingHorizontal: width * 0.05,
        paddingVertical: height * 0.02,
      }}
    >
        <LinearGradient
        colors={['#2a3f6f', '#1f2d55', '#1a2744']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 20,
          padding: width * 0.06,
          marginVertical: height * 0.02,
          borderWidth: 2,
          borderColor: 'rgba(88, 204, 247, 0.3)',
        }}
      >
        {/* Título interno removido para evitar duplicación y emojis; el screen ya muestra el título */}

        <Text style={{
          fontSize: width * 0.045,
          color: '#E0E0E0',
          marginBottom: height * 0.03,
          lineHeight: width * 0.06,
          textAlign: 'left',
          fontFamily: 'Century Gothic',
        }}>
          {question}
        </Text>

        <View style={{ marginBottom: height * 0.02 }}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={{
                marginBottom: height * 0.015,
              }}
              onPress={() => handleAnswer(option.id)}
              disabled={showFeedback}
            >
              <LinearGradient
                colors={
                  selectedAnswer === option.id
                    ? (option.correct ? ['#28A745', '#34CE57'] : ['#DC3545', '#FF6B6B'])
                    : showFeedback && option.correct
                    ? ['#28A745', '#34CE57']
                    : ['#2c2c2c', '#1c1c1c']
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: 12,
                  padding: width * 0.04,
                  borderWidth: 2,
                  borderColor:
                    selectedAnswer === option.id
                      ? option.correct
                        ? '#28A745'
                        : '#DC3545'
                      : showFeedback && option.correct
                      ? '#28A745'
                      : 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Text style={{
                  fontSize: width * 0.04,
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontFamily: 'Century Gothic',
                }}>
                  {option.text}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {showFeedback && (
          <View
            style={{
              borderRadius: 15,
              padding: width * 0.045,
              marginBottom: height * 0.02,
              borderWidth: 2,
              borderColor: isCorrect ? '#28A745' : '#DC3545',
              backgroundColor: 'transparent',
            }}
          >
            <LinearGradient
              colors={
                isCorrect
                  ? ['rgba(40, 167, 69, 0.12)', 'rgba(40, 167, 69, 0.06)']
                  : ['rgba(220, 53, 69, 0.14)', 'rgba(220, 53, 69, 0.07)']
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 12,
                padding: width * 0.04,
              }}
            >
              <Text
                style={{
                  fontSize: width * 0.045,
                  fontWeight: '800',
                  color: '#FFFFFF',
                  textAlign: 'center',
                  marginBottom: height * 0.01,
                  fontFamily: 'Century Gothic',
                }}
              >
                {isCorrect ? 'Es correcto porque' : 'Es incorrecto porque'}
              </Text>
              <Text
                style={{
                  fontSize: width * 0.04,
                  color: '#FFFFFF',
                  textAlign: 'center',
                  opacity: 0.95,
                  lineHeight: width * 0.055,
                  fontFamily: 'Century Gothic',
                }}
              >
                {isCorrect ? explanationCorrect : explanationIncorrect}
              </Text>
            </LinearGradient>
          </View>
        )}

        {showFeedback && (
          <TouchableOpacity
            style={{
              marginTop: height * 0.02,
            }}
            onPress={handleContinue}
          >
            <LinearGradient
              colors={['#58CCF7', '#4A9FE7']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 16,
                padding: width * 0.04,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: 'rgba(88, 204, 247, 0.6)'
              }}
            >
              <Text style={{
                fontSize: width * 0.045,
                fontWeight: 'bold',
                color: '#FFFFFF',
                fontFamily: 'Century Gothic',
              }}>
                Continuar
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </LinearGradient>
  );
}

