// generacionStyles.ts
import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vh } from '../../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#061C64',
    paddingHorizontal: scale(isSmallPhone ? 16 : 19),
    paddingTop: vs(40),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 20 : isTablet ? 26 : 22.5),
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: vs(24),
  },
  description: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: vs(16),
    marginBottom: vs(32),
    paddingHorizontal: scale(7.5),
  },
  image: {
    width: '100%',
    height: vh(30),
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  progressBarContainer: {
    height: vs(10),
    backgroundColor: '#ccc',
    borderRadius: ms(5),
    marginTop: vs(24),
    marginBottom: vs(12),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF7A00',
    borderRadius: ms(5),
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vs(24),
    marginTop: vs(8),
  },
  circle: {
    width: scale(12),
    height: scale(12),
    borderRadius: ms(6),
    backgroundColor: '#ccc',
    marginHorizontal: scale(5),
  },
  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: vs(12),
    paddingHorizontal: scale(isSmallPhone ? 30 : isTablet ? 50 : 37.5),
    borderRadius: ms(10),
    alignSelf: 'center',
    marginBottom: vs(32),
  },
  buttonText: {
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: 'bold',
  },
});

export default styles;
