import { StyleSheet } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1F2D55',
  },
  container: {
    flex: 1,
    padding: scale(20),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 20 : isTablet ? 28 : 24),
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: vs(16),
  },
  card: {
    backgroundColor: 'rgba(15,23,42,0.9)',
    borderRadius: ms(20),
    padding: scale(isSmallPhone ? 16 : 20),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: 'rgba(59,130,246,0.4)'
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  pctText: { 
    fontSize: msFont(isSmallPhone ? 28 : isTablet ? 36 : 32), 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  label: { 
    fontSize: msFont(isSmallPhone ? 12 : 14), 
    color: '#cbd5e1', 
    marginTop: ms(4) 
  },
  timeLabel: { 
    fontSize: msFont(isSmallPhone ? 14 : 16), 
    color: '#fff', 
    marginBottom: vs(10) 
  },
  barRail: { 
    height: vs(14), 
    borderRadius: ms(7), 
    backgroundColor: 'rgba(255,255,255,0.15)', 
    overflow: 'hidden' 
  },
  barFill: { 
    height: '100%', 
    borderRadius: ms(7) 
  },
});
