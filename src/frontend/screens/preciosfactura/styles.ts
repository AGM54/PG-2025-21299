import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: vs(isSmallPhone ? 50 : isTablet ? 70 : 65),
  },
  scrollContent: {
    paddingBottom: vh(30),
    paddingHorizontal: scale(isSmallPhone ? 16 : 19),
    minHeight: vh(120),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 22 : isTablet ? 28 : 26),
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(24),
    textShadowColor: 'rgba(31, 45, 85, 1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    letterSpacing: 2,
    paddingHorizontal: scale(19),
    lineHeight: msFont(isSmallPhone ? 26 : isTablet ? 32 : 30),
    fontFamily: 'Century Gothic',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: vs(24),
    width: '100%',
  },
  image: {
    width: vw(88),
    height: vs(isTablet ? 38 : 34),
    minHeight: ms(170),
    resizeMode: 'contain',
    borderRadius: ms(22),
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  imageCinco: {
    width: vw(90),
    height: vs(isTablet ? 60 : 54),
    minHeight: ms(220),
    resizeMode: 'contain',
    borderRadius: ms(24),
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 15 },
        shadowOpacity: 0.8,
        shadowRadius: 25,
      },
      android: {
        elevation: 20,
      },
    }),
  },
  descriptionCard: {
    borderRadius: ms(25),
    padding: scale(isSmallPhone ? 14 : 17),
    marginVertical: vs(16),
    borderWidth: 3,
    borderColor: 'rgba(31, 45, 85, 0.8)',
    minHeight: vh(isTablet ? 18 : 20),
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 1,
        shadowRadius: 30,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  gradientBorder: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: ms(22),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.5)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    fontSize: msFont(15),
    color: 'rgba(31, 45, 85, 0.8)',
  },
  descriptionScroll: {
    flex: 1,
    zIndex: 3,
    maxHeight: vh(isTablet ? 40 : 30),
  },
  description: {
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 18 : 16.9),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'justify',
    lineHeight: msFont(isSmallPhone ? 21 : isTablet ? 27 : 24.4),
    letterSpacing: 0.8,
    paddingVertical: vs(8),
    textShadowColor: 'rgba(31, 45, 85, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
    fontFamily: 'Century Gothic',
  },
  curiousFact: {
    backgroundColor: 'rgba(31, 45, 85, 0.15)',
    borderRadius: ms(20),
    padding: scale(15),
    marginTop: vs(16),
    borderWidth: 2,
    borderColor: 'rgba(31, 45, 85, 0.4)',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 12,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  curiousFactGradient: {
    flex: 1,
    width: '100%',
    borderRadius: ms(18),
    padding: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  curiousFactText: {
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 15.8),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(31, 45, 85, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
    fontFamily: 'Century Gothic',
  },
  lightningIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: msFont(30),
    color: '#FFD700',
    textShadowColor: '#FFAA00',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: vs(65),
    left: vw(4),
    right: vw(4),
    paddingHorizontal: scale(7.5),
    paddingBottom: vs(8),
    paddingTop: vs(8),
    backgroundColor: 'rgba(31,45,85,0.85)',
    borderRadius: ms(18),
    width: '92%',
    alignSelf: 'center',
    zIndex: 10,
  },
  progressBarContainer: {
    height: vs(8),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: ms(8),
    overflow: 'hidden',
    marginBottom: vs(8),
    marginHorizontal: scale(7.5),
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#58CCF7',
    borderRadius: ms(6),
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vs(8),
    paddingVertical: vs(4),
    flexWrap: 'wrap',
    paddingHorizontal: scale(7.5),
  },
  circle: {
    width: scale(8.25),
    height: scale(8.25),
    borderRadius: ms(4.125),
    marginHorizontal: scale(2.25),
    marginVertical: vs(2.4),
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  activeCircle: {
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.7,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  button: {
    backgroundColor: '#58CCF7',
    paddingVertical: vs(isSmallPhone ? 12 : 14.5),
    paddingHorizontal: scale(isSmallPhone ? 30 : isTablet ? 50 : 37.5),
    borderRadius: ms(16),
    alignItems: 'center',
    marginHorizontal: scale(30),
    borderWidth: 0,
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  finishButton: {
    backgroundColor: '#28A745',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...Platform.select({
      ios: {
        shadowColor: '#28A745',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17.3),
    fontWeight: '600',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
        fontWeight: '600',
      },
      android: {
        fontFamily: 'Century Gothic',
        fontWeight: '600',
      },
    }),
  },
  disabledButton: {
    backgroundColor: 'rgba(88, 204, 247, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(88, 204, 247, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  disabledButtonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
  },
});
