import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061C64',
    paddingHorizontal: scale(isSmallPhone ? 16 : 19),
    paddingTop: vs(16),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 16 : isTablet ? 20 : 18.75),
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: vs(12),
  },
  subtitle: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(12),
  },
  horizontalOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: vs(24),
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  atomImage: {
    width: scale(isSmallPhone ? 200 : isTablet ? 280 : 225),
    height: scale(isSmallPhone ? 200 : isTablet ? 280 : 225),
  },
  atom: {
    width: scale(isSmallPhone ? 80 : isTablet ? 110 : 94),
    height: scale(isSmallPhone ? 26 : isTablet ? 35 : 30),
    backgroundColor: '#FDDFA0',
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  atomText: {
    color: '#003366',
    fontWeight: 'bold',
    fontSize: msFont(isSmallPhone ? 13 : 15),
  },
  placed: {
    backgroundColor: '#00C853',
  },
  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: vs(14),
    borderRadius: ms(10),
    alignItems: 'center',
    marginTop: vs(16),
    marginHorizontal: scale(isSmallPhone ? 80 : 94),
  },
  buttonText: {
    color: '#fff',
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: 'bold',
  },
  svgOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },
  dropBox: {
    width: scale(isSmallPhone ? 80 : isTablet ? 110 : 94),
    height: scale(isSmallPhone ? 26 : isTablet ? 35 : 30),
    backgroundColor: '#FFFFFF',
    borderRadius: ms(8),
    borderWidth: 2,
    borderColor: '#FF7A00',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.95,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  dropBoxEmpty: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FF7A00',
  },
  dropBoxPlaced: {
    backgroundColor: '#C8E6C9',
    borderColor: '#00C853',
  },
});
