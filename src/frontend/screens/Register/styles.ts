import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1F2D55',
  },
  container: {
    flex: 1,
    backgroundColor: '#1F2D55',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  logo: {
    position: 'absolute',
    top: vs(40),
    width: scale(isSmallPhone ? 100 : isTablet ? 150 : 112),
    height: vs(isSmallPhone ? 40 : isTablet ? 60 : 48),
    resizeMode: 'contain',
  },
  title: {
    fontSize: msFont(isSmallPhone ? 22 : isTablet ? 30 : 24),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: vs(8),
    fontFamily: 'Century Gothic',
  },
  subtitle: {
    fontSize: msFont(isSmallPhone ? 12 : isTablet ? 15 : 13),
    color: '#ccc',
    marginBottom: vs(24),
    textAlign: 'center',
    fontFamily: 'Century Gothic',
  },
  inputWrapper: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: ms(10),
    marginBottom: vs(12),
    paddingHorizontal: scale(12),
    height: vs(isSmallPhone ? 48 : isTablet ? 60 : 52),
  },
  icon: {
    marginRight: scale(8),
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 14 : 15),
    fontFamily: 'Century Gothic',
  },
  registerButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: vs(isSmallPhone ? 12 : 15),
    borderRadius: ms(10),
    alignItems: 'center',
    marginTop: vs(16),
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontFamily: 'Century Gothic',
  },
  loginRedirect: {
    color: '#ccc',
    marginTop: vs(16),
    textAlign: 'center',
    fontSize: msFont(isSmallPhone ? 12 : 13),
    fontFamily: 'Century Gothic',
  },
  link: {
    color: '#FF7A00',
    fontWeight: 'bold',
    fontFamily: 'Century Gothic',
  },
});

export default styles;
