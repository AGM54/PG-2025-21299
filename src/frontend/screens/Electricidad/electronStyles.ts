import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#061C64',
    padding: scale(isSmallPhone ? 18 : 22),
    justifyContent: 'center',
  },
  title: {
    fontSize: msFont(isSmallPhone ? 22 : isTablet ? 28 : 26),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: vs(16),
    textAlign: 'center',
  },
  image: {
    width: scale(isSmallPhone ? 200 : isTablet ? 280 : 225),
    height: scale(isSmallPhone ? 200 : isTablet ? 280 : 225),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: vs(16),
  },
  description: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    color: '#fff',
    textAlign: 'center',
    marginBottom: vs(24),
  },
  progressBarContainer: {
    height: vs(10),
    backgroundColor: '#ccc',
    borderRadius: ms(5),
    overflow: 'hidden',
    marginBottom: vs(16),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF7A00',
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vs(24),
  },
  circle: {
    width: scale(12),
    height: scale(12),
    borderRadius: ms(6),
    marginHorizontal: scale(6),
  },
  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: vs(12),
    borderRadius: ms(10),
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: 'bold',
  },
});
