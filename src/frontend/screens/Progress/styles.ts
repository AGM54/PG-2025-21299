import { StyleSheet } from 'react-native';
import { msFont, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: msFont(isSmallPhone ? 20 : isTablet ? 28 : 24),
    fontWeight: 'bold',
  },
});
