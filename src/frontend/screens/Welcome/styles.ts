import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1F2D55',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#1F2D55',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(40),
    paddingHorizontal: scale(20),
  },
  logo: {
    width: scale(isSmallPhone ? 120 : isTablet ? 200 : 150),
    height: vs(isSmallPhone ? 50 : isTablet ? 80 : 65),
    resizeMode: 'contain',
    marginBottom: vs(8),
  },
  character: {
    width: scale(isSmallPhone ? 260 : isTablet ? 400 : 300),
    height: scale(isSmallPhone ? 260 : isTablet ? 400 : 300),
    resizeMode: 'contain',
    marginBottom: vs(24),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 24 : isTablet ? 32 : 26),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: vs(40),
    fontFamily: 'Century Gothic',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: ms(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: vs(isSmallPhone ? 12 : 15),
    paddingHorizontal: scale(isSmallPhone ? 24 : isTablet ? 40 : 30),
    borderRadius: ms(50),
    elevation: 4,
  },
  rightButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: vs(isSmallPhone ? 12 : 15),
    paddingHorizontal: scale(isSmallPhone ? 24 : isTablet ? 40 : 30),
    borderRadius: ms(50),
    elevation: 4,
  },
  leftButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: msFont(isSmallPhone ? 14 : 15),
    fontFamily: 'Century Gothic',
  },
  rightButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: msFont(isSmallPhone ? 14 : 15),
    fontFamily: 'Century Gothic',
  },
});
