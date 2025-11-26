import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export default StyleSheet.create({
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
    paddingHorizontal: scale(isSmallPhone ? 24 : 30),
  },
  logo: {
    width: scale(isSmallPhone ? 120 : isTablet ? 200 : 150),
    height: vs(isSmallPhone ? 50 : isTablet ? 80 : 65),
    resizeMode: 'contain',
    marginBottom: vs(16),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 24 : isTablet ? 32 : 26),
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: vs(8),
    fontFamily: 'Century Gothic',
  },
  subtitle: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 19 : 17),
    color: '#ccc',
    marginBottom: vs(24),
    fontFamily: 'Century Gothic',
  },
  inputWrapper: {
    backgroundColor: '#D9D9D9',
    borderRadius: ms(20),
    paddingHorizontal: scale(20),
    width: '100%',
    height: vs(isSmallPhone ? 48 : isTablet ? 60 : 52),
    justifyContent: 'center',
    marginBottom: vs(16),
  },
  input: {
    fontSize: msFont(isSmallPhone ? 14 : 15),
    color: '#000',
    fontFamily: 'Century Gothic',
  },
  forgotText: {
    alignSelf: 'flex-start',
    color: '#fff',
    marginBottom: vs(12),
    fontFamily: 'Century Gothic',
    fontSize: msFont(14),
  },
  loginRedirect: {
    color: '#fff',
    marginTop: vs(8),
    marginBottom: vs(24),
    textAlign: 'center',
    fontFamily: 'Century Gothic',
    fontSize: msFont(14),
  },
  link: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontFamily: 'Century Gothic',
  },
  loginButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: vs(isSmallPhone ? 12 : 15),
    paddingHorizontal: scale(isSmallPhone ? 30 : isTablet ? 50 : 40),
    borderRadius: ms(20),
    width: '100%',
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontFamily: 'Century Gothic',
  },
});
