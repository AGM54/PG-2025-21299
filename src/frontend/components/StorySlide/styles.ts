import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: ms(28),
    padding: scale(15),
    marginBottom: vs(8),
    marginHorizontal: scale(5.6),
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.3)',
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
  header: {
    alignItems: 'center',
    marginBottom: vs(16),
  },
  slideCounter: {
    color: '#FFFFFF',
    fontSize: msFont(15),
    fontWeight: '600',
    opacity: 0.8,
    fontFamily: 'Century Gothic',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: vh(12),
  },
  slideCard: {
    borderRadius: ms(20),
    padding: scale(19),
    marginBottom: vs(24),
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
  slideTitle: {
    color: '#58CCF7',
    fontSize: msFont(isSmallPhone ? 17 : isTablet ? 21 : 18.75),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: vs(20),
    textShadowColor: 'rgba(88, 204, 247, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'Century Gothic',
  },
  imageContainer: {
    marginBottom: vs(20),
    borderRadius: ms(15),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(88, 204, 247, 0.3)',
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
  storyImage: {
    width: '100%',
    height: vh(isSmallPhone ? 40 : isTablet ? 50 : 45),
    borderRadius: ms(15),
  },
  descriptionText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 15.8),
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: msFont(isSmallPhone ? 19 : isTablet ? 23 : 20.6),
    paddingHorizontal: scale(7.5),
    fontFamily: 'Century Gothic',
  },
  continueButton: {
    marginTop: vs(16),
    marginHorizontal: scale(7.5),
    borderRadius: ms(16),
    borderWidth: 2,
    borderColor: '#58CCF7',
    overflow: 'hidden',
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
  buttonGradient: {
    paddingVertical: vs(20),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: ms(16),
    minHeight: vh(7),
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 16.9),
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'Century Gothic',
  },
});
