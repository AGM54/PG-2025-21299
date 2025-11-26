import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  fullImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 0,
    marginHorizontal: 0,
    width: '100%',
    height: vh(70),
  },
  fullImage: {
    width: vw(95),
    height: vh(65),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 0,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: scale(isSmallPhone ? 18 : 22),
    paddingTop: vs(isSmallPhone ? 50 : isTablet ? 70 : 65),
  },
  scrollContent: {
    paddingBottom: vs(isTablet ? 220 : 240),
  },
  fixedBottom: {
    position: 'absolute',
    bottom: vs(24),
    left: 0,
    right: 0,
    paddingHorizontal: scale(15),
    paddingBottom: vs(12),
    paddingTop: vs(10),
    backgroundColor: 'rgba(31,45,85,0.95)',
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 22 : isTablet ? 28 : 26),
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: vs(20),
    textAlign: 'center',
    paddingHorizontal: scale(15),
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
        fontWeight: '700',
      },
      android: {
        fontFamily: 'Century Gothic',
        fontWeight: '700',
      },
    }),
  },
  image: {
    width: scale(isSmallPhone ? 220 : isTablet ? 340 : 244),
    height: scale(isSmallPhone ? 150 : isTablet ? 230 : 169),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: vs(12),
    marginBottom: vs(12),
  },
  imageCinco: {
    width: scale(isSmallPhone ? 320 : isTablet ? 450 : 356),
    height: scale(isSmallPhone ? 270 : isTablet ? 380 : 300),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: vs(16),
    marginBottom: vs(16),
  },
  imageContainer: {
    alignSelf: 'center',
    marginTop: vs(16),
    marginBottom: vs(20),
    borderRadius: ms(20),
    borderWidth: 2,
    borderColor: 'rgba(31, 45, 85, 0.4)',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  descriptionCard: {
    borderRadius: ms(24),
    padding: scale(isSmallPhone ? 18 : 22),
    marginBottom: vs(16),
    marginHorizontal: scale(7.5),
    maxHeight: vh(isTablet ? 65 : 50),
    borderWidth: 2,
    borderColor: 'rgba(31, 45, 85, 0.4)',
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  descriptionScroll: {
    maxHeight: vh(isTablet ? 65 : 50),
  },
  description: {
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 16.5),
    color: '#FFFFFF',
    textAlign: 'justify',
    lineHeight: msFont(isSmallPhone ? 22 : isTablet ? 27 : 27),
    letterSpacing: 0.3,
    fontWeight: '500',
    zIndex: 10,
    textAlignVertical: 'top',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
        fontWeight: '500',
      },
      android: {
        fontFamily: 'Century Gothic',
        fontWeight: '500',
        textAlignVertical: 'top',
      },
    }),
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
    marginBottom: vs(10),
    paddingVertical: vs(6.5),
    flexWrap: 'nowrap',
    paddingHorizontal: scale(3.75),
    overflow: 'hidden',
  },
  circle: {
    width: scale(6.75),
    height: scale(6.75),
    borderRadius: ms(3.375),
    marginHorizontal: scale(1.5),
    marginVertical: 0,
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
  curiousFact: {
    backgroundColor: '#2A4B7C',
    borderRadius: ms(16),
    padding: scale(18.75),
    marginTop: vs(12),
    borderWidth: 2,
    borderColor: '#58CCF7',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  curiousFactText: {
    fontSize: msFont(isSmallPhone ? 16 : isTablet ? 20 : 18),
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.8,
    lineHeight: msFont(isSmallPhone ? 22 : isTablet ? 27 : 24.4),
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
        fontWeight: '700',
      },
      android: {
        fontFamily: 'Century Gothic',
        fontWeight: '700',
      },
    }),
  },
  lightningIcon: {
    fontSize: msFont(22.5),
    textAlign: 'center',
    marginTop: vs(8),
  },
  glassmorphicOverlay: {
    flex: 1,
    borderRadius: ms(20),
    padding: scale(18.75),
    position: 'relative',
  },
  sparkleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    pointerEvents: 'none',
  },
  sparkle: {
    position: 'absolute',
    fontSize: msFont(11.25),
    opacity: 0.6,
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(255, 255, 255, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      },
      android: {
        textShadowColor: 'rgba(255, 255, 255, 0.6)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 8,
      },
    }),
  },
  curiousFactGradient: {
    borderRadius: ms(20),
    padding: scale(30),
    borderWidth: 3,
    borderColor: 'rgba(31, 45, 85, 0.8)',
    marginHorizontal: scale(7.5),
    marginVertical: vs(16),
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.8,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  gradientBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: ms(24),
    borderWidth: 2,
    borderColor: 'rgba(31, 45, 85, 0.6)',
    ...Platform.select({
      ios: {
        shadowColor: '#1f2d55',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
