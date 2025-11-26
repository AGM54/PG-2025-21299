import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: scale(19),
    backgroundColor: '#000000',
  },
  
  // Story styles
  storyTitle: {
    fontSize: msFont(isSmallPhone ? 22 : isTablet ? 28 : 24.4),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(16),
    marginTop: vs(16),
    textShadowColor: 'rgba(88, 204, 247, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 0.5,
  },
  
  slideNumber: {
    fontSize: msFont(15),
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: vs(24),
    fontWeight: '500',
  },
  
  slideCard: {
    borderRadius: ms(25),
    padding: scale(19),
    marginHorizontal: scale(9),
    marginVertical: vs(8),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.3)',
    alignItems: 'center',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  
  slideTitle: {
    fontSize: msFont(isSmallPhone ? 18 : isTablet ? 23 : 20.6),
    fontWeight: '700',
    color: '#58CCF7',
    textAlign: 'center',
    marginBottom: vs(16),
    textShadowColor: 'rgba(88, 204, 247, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  
  storyImage: {
    width: scale(isSmallPhone ? 240 : isTablet ? 400 : 300),
    height: vh(isSmallPhone ? 28 : isTablet ? 32 : 30),
    marginVertical: vs(20),
    borderRadius: ms(20),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  
  slideDescription: {
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 15.8),
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 25 : 22.5),
    marginBottom: vs(20),
    fontWeight: '500',
    paddingHorizontal: scale(7.5),
  },
  
  nextSlideButton: {
    borderRadius: ms(20),
    paddingHorizontal: scale(30),
    paddingVertical: vs(12),
    marginTop: vs(12),
    marginBottom: vs(16),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.5)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  
  nextSlideButtonText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Trivia styles
  triviaTitle: {
    fontSize: msFont(isSmallPhone ? 18 : isTablet ? 23 : 20.6),
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: vs(10),
    marginTop: vs(20),
  },
  
  questionNumber: {
    fontSize: msFont(15),
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: vs(20),
  },
  
  questionCard: {
    backgroundColor: 'white',
    borderRadius: ms(15),
    padding: scale(19),
    margin: scale(9),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  questionText: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: vs(20),
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 25 : 22.5),
  },
  
  optionsContainer: {
    marginVertical: vs(10),
  },
  
  optionButton: {
    backgroundColor: '#ecf0f1',
    padding: scale(14),
    borderRadius: ms(10),
    marginVertical: vs(5),
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  selectedOption: {
    borderColor: '#58CCF7',
    backgroundColor: '#e3f2fd',
  },
  
  correctOption: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  
  incorrectOption: {
    borderColor: '#f44336',
    backgroundColor: '#ffebee',
  },
  
  optionText: {
    fontSize: msFont(15),
    color: '#2c3e50',
    flex: 1,
  },
  
  selectedOptionText: {
    fontWeight: 'bold',
  },
  
  checkMark: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    marginLeft: scale(9),
  },
  
  resultContainer: {
    alignItems: 'center',
    marginTop: vs(20),
  },
  
  resultText: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: 'bold',
    marginBottom: vs(15),
  },
  
  nextButton: {
    backgroundColor: '#58CCF7',
    paddingHorizontal: scale(28),
    paddingVertical: vs(12),
    borderRadius: ms(25),
  },
  
  nextButtonText: {
    color: 'white',
    fontSize: msFont(15),
    fontWeight: 'bold',
  },
  
  // Final screen styles
  finalText: {
    fontSize: msFont(15),
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 25 : 22.5),
    marginVertical: vs(20),
    fontWeight: '500',
  },
  
  scoreText: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: 'bold',
    color: '#58CCF7',
    textAlign: 'center',
    marginBottom: vs(30),
  },
  
  sabiasQueButton: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: scale(38),
    paddingVertical: vs(15),
    borderRadius: ms(25),
    alignSelf: 'center',
    marginTop: vs(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  sabiasQueButtonText: {
    color: 'white',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: 'bold',
    textAlign: 'center',
  },
  
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  modalContent: {
    backgroundColor: 'white',
    borderRadius: ms(20),
    padding: scale(28),
    margin: scale(19),
    maxWidth: vw(90),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  
  sabiasQueImage: {
    width: scale(isSmallPhone ? 200 : isTablet ? 300 : 240),
    height: vh(isSmallPhone ? 18 : isTablet ? 22 : 20),
    marginBottom: vs(20),
  },
  
  sabiasQueText: {
    fontSize: msFont(15),
    color: '#2c3e50',
    textAlign: 'center',
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 25 : 22.5),
    marginBottom: vs(30),
  },
  
  closeButton: {
    backgroundColor: '#58CCF7',
    paddingHorizontal: scale(28),
    paddingVertical: vs(12),
    borderRadius: ms(25),
  },
  
  closeButtonText: {
    color: 'white',
    fontSize: msFont(15),
    fontWeight: 'bold',
  },
});
