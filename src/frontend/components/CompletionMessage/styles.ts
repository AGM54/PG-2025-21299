import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  backgroundOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },
  mainContainer: {
    width: vw(85),
    maxWidth: scale(500),
    alignItems: 'center',
  },
  contentCard: {
    backgroundColor: '#1f2d55',
    borderRadius: ms(24),
    padding: scale(22.5),
    alignItems: 'center',
    width: '100%',
    borderWidth: 3,
    borderColor: '#58CCF7',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.5,
        shadowRadius: 30,
      },
      android: {
        elevation: 15,
      },
    }),
  },
  personImage: {
    width: scale(isSmallPhone ? 140 : isTablet ? 220 : 180),
    height: scale(isSmallPhone ? 140 : isTablet ? 220 : 180),
    marginBottom: vs(16),
  },
  starsImage: {
    width: scale(isSmallPhone ? 110 : isTablet ? 160 : 135),
    height: vs(isSmallPhone ? 70 : isTablet ? 105 : 90),
    marginBottom: vs(16),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 20 : isTablet ? 26 : 22.5),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(12),
    letterSpacing: 0.5,
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
      },
      android: {
        fontFamily: 'Century Gothic',
      },
    }),
  },
  message: {
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 15.8),
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 25 : 22.5),
    marginBottom: vs(16),
    paddingHorizontal: scale(7.5),
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
      },
      android: {
        fontFamily: 'Century Gothic',
      },
    }),
  },
  scoreContainer: {
    backgroundColor: 'rgba(88, 204, 247, 0.2)',
    borderRadius: ms(15),
    paddingVertical: vs(8),
    paddingHorizontal: scale(19),
    marginBottom: vs(16),
    borderWidth: 2,
    borderColor: '#58CCF7',
  },
  scoreText: {
    fontSize: msFont(isSmallPhone ? 16 : isTablet ? 21 : 18.75),
    fontWeight: '700',
    color: '#58CCF7',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
      },
      android: {
        fontFamily: 'Century Gothic',
      },
    }),
  },
  continueButton: {
    width: '80%',
    alignSelf: 'center',
    borderRadius: ms(25),
    overflow: 'hidden',
    marginTop: vs(8),
    ...Platform.select({
      ios: {
        shadowColor: '#20d4c8',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonGradient: {
    paddingVertical: vs(14.5),
    paddingHorizontal: scale(15),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(25),
  },
  buttonText: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
      },
      android: {
        fontFamily: 'Century Gothic',
      },
    }),
  },
});
