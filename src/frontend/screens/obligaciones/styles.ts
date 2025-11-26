import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Detectar si es tablet
const isTablet = width >= 768;

// Función para escalar fuentes de manera responsiva
const scale = (size: number) => {
  if (isTablet) {
    return size * 0.7; // Reducir un 30% en tablets
  }
  return size;
};

// Función para escalar espacios
const scaleSpace = (size: number) => {
  if (isTablet) {
    return size * 0.8; // Reducir un 20% en tablets
  }
  return size;
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: height * 0.08,
  },
  scrollContent: {
    paddingBottom: height * 0.3,
    paddingHorizontal: width * 0.05,
    minHeight: height * 1.2,
  },
  title: {
    fontSize: scale(width * 0.07),
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: scaleSpace(height * 0.03),
    textShadowColor: 'rgba(139, 69, 255, 1)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 15,
    letterSpacing: 2,
    paddingHorizontal: scaleSpace(width * 0.05),
    lineHeight: scale(width * 0.08),
    fontFamily: 'Century Gothic',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: height * 0.03,
    width: '100%',
  },
  image: {
    width: width * 0.85,
    height: height * 0.25,
    resizeMode: 'contain',
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#8B45FF',
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
    width: width * 0.85,
    height: height * 0.4,
    resizeMode: 'contain',
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#8B45FF',
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
    borderRadius: 25,
    padding: scaleSpace(width * 0.045),
    marginVertical: scaleSpace(height * 0.02),
    borderWidth: 3,
    borderColor: 'rgba(139, 69, 255, 0.8)',
    minHeight: isTablet ? height * 0.18 : height * 0.2,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#8B45FF',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 1,
        shadowRadius: 30,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  descriptionCardLarge: {
    borderRadius: 25,
    padding: scaleSpace(width * 0.045),
    marginVertical: scaleSpace(height * 0.02),
    borderWidth: 3,
    borderColor: 'rgba(139, 69, 255, 0.8)',
    minHeight: isTablet ? height * 0.4 : height * 0.45,
    maxHeight: isTablet ? height * 0.7 : height * 0.65,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#8B45FF',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 1,
        shadowRadius: 30,
      },
      android: {
        elevation: 25,
      },
    }),
  },
  descriptionCardExtraLarge: {
    borderRadius: 25,
    padding: scaleSpace(width * 0.045),
    marginVertical: scaleSpace(height * 0.015),
    borderWidth: 3,
    borderColor: 'rgba(88, 204, 247, 0.9)',
    minHeight: isTablet ? height * 0.6 : height * 0.7,
    maxHeight: isTablet ? height * 0.8 : height * 0.75,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 25 },
        shadowOpacity: 1,
        shadowRadius: 35,
      },
      android: {
        elevation: 30,
      },
    }),
  },
  gradientBorder: {
    position: 'absolute',
    top: 2,
    left: 2,
    right: 2,
    bottom: 2,
    borderRadius: 22,
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
    fontSize: width * 0.04,
    color: 'rgba(139, 69, 255, 0.8)',
  },
  descriptionScroll: {
    flex: 1,
    zIndex: 3,
    maxHeight: isTablet ? height * 0.35 : height * 0.3,
  },
  descriptionScrollLarge: {
    flex: 1,
    zIndex: 3,
    maxHeight: isTablet ? height * 0.6 : height * 0.55,
    minHeight: isTablet ? height * 0.3 : height * 0.35,
  },
  descriptionScrollExtraLarge: {
    flex: 1,
    zIndex: 3,
    maxHeight: isTablet ? height * 0.75 : height * 0.7,
    minHeight: isTablet ? height * 0.5 : height * 0.6,
  },
  description: {
    fontSize: scale(width * 0.045),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'justify',
    lineHeight: scale(width * 0.065),
    letterSpacing: 0.8,
    paddingVertical: scaleSpace(height * 0.01),
    textShadowColor: 'rgba(139, 69, 255, 0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
    fontFamily: 'Century Gothic',
  },
  curiousFact: {
    backgroundColor: 'rgba(139, 69, 255, 0.15)',
    borderRadius: 20,
    padding: width * 0.04,
    marginTop: height * 0.02,
    borderWidth: 2,
    borderColor: 'rgba(139, 69, 255, 0.4)',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#8B45FF',
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
    borderRadius: 18,
    padding: width * 0.04,
    alignItems: 'center',
    justifyContent: 'center',
  },
  curiousFactText: {
    fontSize: scale(width * 0.042),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    textShadowColor: 'rgba(139, 69, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
    fontFamily: 'Century Gothic',
  },
  lightningIcon: {
    position: 'absolute',
    top: -10,
    right: -10,
    fontSize: width * 0.08,
    color: '#FFD700',
    textShadowColor: '#FFAA00',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  fixedBottom: {
    position: 'absolute',
    bottom: height * 0.08,
    left: width * 0.04,
    right: width * 0.04,
    paddingHorizontal: width * 0.02,
    paddingBottom: height * 0.01,
    paddingTop: height * 0.01,
    backgroundColor: 'rgba(31,45,85,0.85)',
    borderRadius: 18,
    width: '92%',
    alignSelf: 'center',
    zIndex: 10,
  },
  progressBarContainer: {
    height: height * 0.01,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: height * 0.01,
    marginHorizontal: width * 0.02,
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
    borderRadius: 6,
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
    marginBottom: height * 0.01,
    paddingVertical: height * 0.005,
    flexWrap: 'wrap',
    paddingHorizontal: width * 0.02,
  },
  circle: {
    width: width * 0.022,
    height: width * 0.022,
    borderRadius: width * 0.011,
    marginHorizontal: width * 0.006,
    marginVertical: height * 0.003,
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
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.1,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: width * 0.08,
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
    fontSize: scale(width * 0.046),
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
