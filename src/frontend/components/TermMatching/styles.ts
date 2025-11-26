import { StyleSheet, Platform } from 'react-native';
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo, vw, vh } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E1A2B',
    padding: scale(19),
    paddingBottom: vh(12),
  },
  title: {
    fontSize: msFont(isSmallPhone ? 18 : isTablet ? 23 : 20.6),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(16),
    letterSpacing: 0.5,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  instructions: {
    fontSize: msFont(15),
    color: '#E0E0E0',
    textAlign: 'center',
    marginBottom: vs(10),
  },
  score: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 16.9),
    fontWeight: '600',
    color: '#58CCF7',
    textAlign: 'center',
    marginBottom: vs(20),
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  termsSection: {
    marginBottom: vs(24),
  },
  sectionTitle: {
    fontSize: msFont(isSmallPhone ? 17 : isTablet ? 21 : 18.75),
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(16),
    textShadowColor: 'rgba(139, 69, 255, 0.8)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  termsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: scale(7.5),
  },
  termCard: {
    width: scale(isSmallPhone ? 150 : isTablet ? 200 : 165),
    height: vh(isSmallPhone ? 20 : isTablet ? 24 : 22),
    marginBottom: vs(12),
    borderRadius: ms(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#8B45FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  selectedTermCard: {
    transform: [{ scale: 1.05 }],
    ...Platform.select({
      ios: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  termCardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(11),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: '#101018',
  },
  termImageContainer: {
    width: scale(isSmallPhone ? 75 : isTablet ? 100 : 85),
    height: scale(isSmallPhone ? 55 : isTablet ? 75 : 65),
    backgroundColor: '#FFFFFF',
    borderRadius: ms(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  termImage: {
    width: '85%',
    height: '85%',
    resizeMode: 'contain',
  },
  termText: {
    fontSize: msFont(isSmallPhone ? 13 : isTablet ? 15 : 14.3),
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  definitionsSection: {
    marginBottom: vs(16),
  },
  definitionsContainer: {
    paddingHorizontal: scale(7.5),
  },
  definitionCard: {
    marginBottom: vs(12),
    borderRadius: ms(16),
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#8B45FF',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  matchedDefinitionCard: {
    ...Platform.select({
      ios: {
        shadowColor: '#28A745',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  definitionCardGradient: {
    padding: scale(15),
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.85)',
    backgroundColor: '#101018',
    minHeight: vh(8),
    justifyContent: 'center',
  },
  definitionText: {
    fontSize: msFont(15),
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: msFont(isSmallPhone ? 19 : isTablet ? 23 : 20.6),
    ...Platform.select({
      ios: {
        fontFamily: 'System',
      },
      android: {
        fontFamily: 'Roboto',
      },
    }),
  },
  checkMark: {
    position: 'absolute',
    top: scale(7.5),
    right: scale(7.5),
    width: scale(22.5),
    height: scale(22.5),
    backgroundColor: '#28A745',
    borderRadius: scale(11.25),
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#28A745',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  checkMarkText: {
    fontSize: msFont(15),
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  completionMessage: {
    position: 'absolute',
    top: vh(30),
    left: vw(10),
    right: vw(10),
    zIndex: 1000,
  },
  completionCardNeon: {
    padding: scale(22.5),
    borderRadius: ms(18),
    alignItems: 'center',
    backgroundColor: '#0B0B10',
    borderWidth: 2,
    borderColor: '#00E5FF',
  },
  completionTitleNeon: {
    fontSize: msFont(isSmallPhone ? 18 : isTablet ? 23 : 20.6),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(6),
  },
  completionTextNeon: {
    fontSize: msFont(15),
    color: '#E0E0E0',
    textAlign: 'center',
    lineHeight: msFont(isSmallPhone ? 18 : isTablet ? 21 : 19.5),
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(19),
  },
  modalContainerNeon: {
    width: vw(90),
    borderRadius: ms(18),
    padding: scale(22.5),
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#00E5FF',
    backgroundColor: '#0B0B10',
  },
  modalTitle: {
    fontSize: msFont(isSmallPhone ? 20 : isTablet ? 26 : 22.5),
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: vs(16),
    textShadowColor: 'rgba(0, 229, 255, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    letterSpacing: 1,
  },
  modalMessage: {
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 16.9),
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    lineHeight: msFont(isSmallPhone ? 22 : isTablet ? 27 : 24.4),
    marginBottom: vs(24),
    paddingHorizontal: scale(7.5),
  },
  modalButton: {
    borderRadius: ms(20),
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.6)',
  },
  modalButtonGradientNeon: {
    paddingVertical: vs(16),
    paddingHorizontal: scale(30),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00E5FF',
  },
  modalButtonText: {
    fontSize: msFont(isSmallPhone ? 17 : isTablet ? 21 : 18.75),
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
  },
});
