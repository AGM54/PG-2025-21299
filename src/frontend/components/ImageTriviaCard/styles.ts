import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  triviaContainer: {
    borderRadius: ms(28),
    padding: scale(15),
    marginBottom: vs(8),
    marginHorizontal: scale(6),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.3)',
    flex: 1,
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
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  questionNumber: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: '700',
    opacity: 0.95,
    fontFamily: 'Century Gothic',
  },
  scoreText: {
    color: '#58CCF7',
    fontSize: msFont(isSmallPhone ? 13 : 15),
    fontWeight: '600',
    textShadowColor: 'rgba(88, 204, 247, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Century Gothic',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: vh(15),
    minHeight: vh(90),
  },
  questionCard: {
    borderRadius: ms(20),
    padding: scale(15),
    marginBottom: vs(16),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.2)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  activityTitle: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: vs(20),
    lineHeight: msFont(isSmallPhone ? 21 : isTablet ? 25 : 20.6),
    paddingHorizontal: scale(7.5),
    textShadowColor: 'rgba(88, 204, 247, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    fontFamily: 'Century Gothic',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: vs(20),
    borderRadius: ms(20),
    padding: scale(15),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.4)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  situationImage: {
    width: scale(isSmallPhone ? 115 : isTablet ? 160 : 131),
    height: scale(isSmallPhone ? 115 : isTablet ? 160 : 131),
    borderRadius: ms(15),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  situationText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 19 : 17.3),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: vs(16),
    lineHeight: msFont(isSmallPhone ? 22 : isTablet ? 27 : 22.5),
    paddingHorizontal: scale(7.5),
    fontFamily: 'Century Gothic',
  },
  questionText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 18 : 16.5),
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: vs(20),
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 25 : 20.6),
    paddingHorizontal: scale(7.5),
    textShadowColor: 'rgba(88, 204, 247, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    fontFamily: 'Century Gothic',
  },
  answersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: vs(20),
    paddingHorizontal: scale(7.5),
  },
  answersContainerWithFeedback: {
    marginBottom: vh(12),
  },
  answerButton: {
    width: '48%',
    height: vs(isSmallPhone ? 60 : 65),
    borderRadius: ms(12),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.3)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#4A9FE7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  answerText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 15.8),
    textAlign: 'center',
    fontWeight: '600',
    fontFamily: 'Century Gothic',
  },
  selectedAnswerText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  correctButton: {
    borderColor: '#28A745',
    ...Platform.select({
      ios: {
        shadowColor: '#28A745',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  incorrectButton: {
    borderColor: '#DC3545',
    ...Platform.select({
      ios: {
        shadowColor: '#DC3545',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  feedbackContainer: {
    paddingHorizontal: scale(15),
    paddingVertical: vs(16),
    borderRadius: ms(15),
    marginHorizontal: scale(7.5),
    marginTop: vs(20),
    minHeight: vh(10),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  correctFeedback: {
    borderColor: '#28A745',
  },
  incorrectFeedback: {
    borderColor: '#DC3545',
  },
  feedbackTitle: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 13 : 15),
    fontWeight: '700',
    marginBottom: vs(6),
    textAlign: 'center',
    textShadowColor: 'rgba(88, 204, 247, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Century Gothic',
  },
  feedbackText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 12 : isTablet ? 15 : 13.9),
    textAlign: 'center',
    opacity: 0.95,
    lineHeight: msFont(isSmallPhone ? 18 : isTablet ? 21 : 18),
    fontWeight: '500',
    fontFamily: 'Century Gothic',
  },
  continueButton: {
    backgroundColor: '#58CCF7',
    paddingVertical: vs(20),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(20),
    marginBottom: vs(24),
    marginHorizontal: scale(7.5),
    alignSelf: 'center',
    width: '96%',
    minHeight: vs(56),
    borderWidth: 2,
    borderColor: '#58CCF7',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Century Gothic',
  },
  disabledButton: {
    borderColor: '#666666',
    opacity: 0.5,
  },
  disabledButtonText: {
    color: '#FFFFFF',
    opacity: 0.5,
  },
});
