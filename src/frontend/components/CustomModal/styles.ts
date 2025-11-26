import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(30),
  },
  container: {
    width: '100%',
    maxWidth: vw(85),
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2d55',
    borderRadius: ms(24),
    padding: scale(22.5),
    alignItems: 'center',
    minHeight: vh(30),
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
  title: {
    fontSize: msFont(isSmallPhone ? 18 : isTablet ? 23 : 20.6),
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
    marginBottom: vs(20),
    ...Platform.select({
      ios: {
        fontFamily: 'Century Gothic',
      },
      android: {
        fontFamily: 'Century Gothic',
      },
    }),
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: scale(11),
  },
  button: {
    flex: 1,
    borderRadius: ms(25),
    overflow: 'hidden',
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
  singleButton: {
    maxWidth: scale(isSmallPhone ? 170 : 188),
    alignSelf: 'center',
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
  cancelButtonText: {
    color: '#E0E0E0',
  },
});
