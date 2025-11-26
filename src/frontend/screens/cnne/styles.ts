import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: scale(isSmallPhone ? 18 : 22),
    paddingTop: vs(isSmallPhone ? 50 : isTablet ? 70 : 65),
  },
  scrollContent: {
    paddingBottom: vs(isTablet ? 200 : 160),
  },
  fixedBottom: {
    position: 'absolute',
    bottom: vs(isTablet ? 48 : 40),
    left: vw(4),
    right: vw(4),
    paddingHorizontal: scale(9),
    paddingVertical: vs(12),
    backgroundColor: 'rgba(31,45,85,0.88)',
    borderRadius: ms(18),
    width: '92%',
    alignSelf: 'center',
    zIndex: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
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
    textShadowColor: 'rgba(0, 0, 0, 0.4)',
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
  image: {
    width: scale(isSmallPhone ? 240 : isTablet ? 350 : 260),
    height: scale(isSmallPhone ? 165 : isTablet ? 240 : 180),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: vs(10),
    marginBottom: vs(10),
  },
  imageCinco: {
    width: scale(isSmallPhone ? 280 : isTablet ? 400 : 308),
    height: scale(isSmallPhone ? 180 : isTablet ? 260 : 195),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: vs(6),
    marginBottom: vs(8),
  },
  descriptionCard: {
    borderRadius: ms(24),
    marginBottom: vs(20),
    marginHorizontal: scale(9),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  descriptionCardLarge: {
    borderRadius: ms(24),
    marginBottom: vs(16),
    marginHorizontal: scale(6),
    maxHeight: vh(isTablet ? 78 : 85),
    minHeight: vh(isTablet ? 50 : 55),
    flex: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
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
    borderWidth: 1,
    borderColor: 'rgba(31, 45, 85, 0.5)',
  },
  sparkleContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: ms(24),
  },
  sparkle: {
    position: 'absolute',
    fontSize: msFont(15),
    color: 'rgba(31, 45, 85, 0.6)',
  },
  descriptionScroll: {
    flex: 1,
    paddingHorizontal: scale(isSmallPhone ? 18 : 21),
    paddingTop: vs(20),
    paddingBottom: vs(20),
  },
  descriptionScrollLarge: {
    padding: scale(19),
    paddingBottom: vs(32),
    minHeight: 0,
    flexGrow: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: vs(16),
    marginBottom: vs(16),
  },
  description: {
    fontSize: msFont(isSmallPhone ? 13 : isTablet ? 16 : 15),
    color: '#FFFFFF',
    textAlign: 'justify',
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 25 : 23),
    letterSpacing: 0.3,
    textAlignVertical: 'top',
    paddingHorizontal: scale(6),
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
        fontWeight: '400',
      },
      android: {
        fontFamily: 'Century Gothic',
        fontWeight: '400',
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
    marginBottom: vs(8),
    paddingVertical: vs(4),
    flexWrap: 'wrap',
    paddingHorizontal: scale(7.5),
  },
  circle: {
    width: scale(8),
    height: scale(8),
    borderRadius: ms(4),
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
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 16),
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
  scrollIndicator: {
    position: 'absolute',
    top: vs(8),
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
    backgroundColor: 'rgba(88, 204, 247, 0.9)',
    paddingVertical: vs(6.5),
    borderRadius: ms(12),
    marginHorizontal: scale(15),
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollIndicatorText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 11 : 12.75),
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
  scrollIndicatorTop: {
    backgroundColor: 'rgba(88, 204, 247, 0.85)',
    paddingVertical: vs(10),
    paddingHorizontal: scale(15),
    borderRadius: ms(12),
    marginBottom: vs(12),
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#58CCF7',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollIndicatorTextTop: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 12 : 14.25),
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
});
