// src/screens/Electricidad/styles.ts
import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#061C64',
  },

  container: {
    paddingHorizontal: scale(isSmallPhone ? 18 : 22),
    paddingBottom: vs(isTablet ? 180 : 200),
  },

  // Header con saludo y logo
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(19),
    paddingTop: vs(24),
    marginBottom: vs(24),
  },

  greeting: {
    fontSize: msFont(isSmallPhone ? 15 : 17),
    fontFamily: 'Inter_600SemiBold',
    color: '#fff',
  },

  username: {
    fontFamily: 'Inter_700Bold',
    color: '#fff',
  },

  wave: {
    fontSize: msFont(isSmallPhone ? 15 : 17),
    fontFamily: 'Inter_400Regular',
  },

  logo: {
    width: scale(isSmallPhone ? 80 : isTablet ? 120 : 94),
    height: vs(isSmallPhone ? 50 : isTablet ? 75 : 65),
    resizeMode: 'contain',
  },

  // Título centrado
  headerCentered: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(32),
  },

  titleCentered: {
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 22 : isTablet ? 28 : 26),
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },

  description: {
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontFamily: 'Inter_400Regular',
    marginBottom: vs(32),
    textAlign: 'center',
  },

  // Tarjetas
  lessonCardGradient: {
    borderRadius: ms(16),
    padding: scale(15),
    marginBottom: vs(24),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },

  lessonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(11),
  },

  lessonTitle: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    fontSize: msFont(isSmallPhone ? 16 : isTablet ? 20 : 18.75),
    marginBottom: vs(8),
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: scale(7.5),
    marginBottom: vs(12),
  },

  duration: {
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 13 : 15),
    fontFamily: 'Inter_400Regular',
  },

  lessonImageSide: {
    width: scale(isSmallPhone ? 80 : isTablet ? 120 : 94),
    height: scale(isSmallPhone ? 80 : isTablet ? 120 : 94),
    resizeMode: 'contain',
  },

  // Menú inferior
  bottomMenuGradient: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: vs(16),
    paddingBottom: vs(24),
    backgroundColor: '#fff',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: scale(19),
    borderTopRightRadius: scale(19),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },

  menuButton: {
    alignItems: 'center',
  },

  menuText: {
    color: '#061C64',
    fontSize: msFont(isSmallPhone ? 11 : 13),
    fontFamily: 'Inter_400Regular',
    marginTop: vs(4),
  },

  menuTextActive: {
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 11 : 13),
    fontFamily: 'Inter_700Bold',
    marginTop: vs(4),
  },
});
