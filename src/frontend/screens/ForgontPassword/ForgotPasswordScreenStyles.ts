import { ViewStyle, TextStyle, ImageStyle } from "react-native";
import { moderateScale as ms, msFont, verticalScale as vs, scale, deviceInfo } from '../../utils/responsive';

const { isTablet, isSmallPhone } = deviceInfo();

interface Styles {
  safeArea: ViewStyle;
  safeAreaContent: ViewStyle;
  container: ViewStyle;
  header: ViewStyle;
  backButton: ViewStyle;
  logo: ImageStyle;
  title: TextStyle;
  subtitle: TextStyle;
  inputWrapper: ViewStyle;
  icon: ViewStyle;
  input: TextStyle;
  resetButton: ViewStyle;
  resetButtonText: TextStyle;
  backToLoginText: TextStyle;
}

export const styles: Styles = {
  safeArea: {
    flex: 1,
  },
  safeAreaContent: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: scale(isSmallPhone ? 20 : 22),
    paddingTop: vs(16),
    paddingBottom: vs(24),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(32),
  },
  backButton: {
    padding: ms(8),
  },
  logo: {
    width: scale(isSmallPhone ? 80 : isTablet ? 120 : 94),
    height: vs(isSmallPhone ? 35 : isTablet ? 50 : 40),
    resizeMode: 'contain',
  },
  title: {
    fontSize: msFont(isSmallPhone ? 24 : isTablet ? 32 : 26),
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: vs(12),
    color: "#fff",
    fontFamily: 'Century Gothic',
  },
  subtitle: {
    fontSize: msFont(isSmallPhone ? 14 : isTablet ? 17 : 15),
    textAlign: "center",
    marginBottom: vs(32),
    color: "#e0e0e0",
    lineHeight: msFont(isSmallPhone ? 20 : isTablet ? 24 : 21),
    fontFamily: 'Century Gothic',
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: ms(12),
    marginBottom: vs(20),
    paddingHorizontal: scale(15),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  icon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    height: vs(isSmallPhone ? 48 : isTablet ? 60 : 52),
    fontSize: msFont(isSmallPhone ? 14 : 15),
    color: "#fff",
    fontFamily: 'Century Gothic',
  },
  resetButton: {
    backgroundColor: "#58CCF7",
    borderRadius: ms(16),
    paddingVertical: vs(isSmallPhone ? 12 : 15),
    paddingHorizontal: scale(isSmallPhone ? 30 : isTablet ? 50 : 40),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: msFont(isSmallPhone ? 15 : isTablet ? 18 : 17),
    fontWeight: "bold",
    fontFamily: 'Century Gothic',
  },
  backToLoginText: {
    textAlign: "center",
    color: "#58CCF7",
    fontSize: msFont(isSmallPhone ? 14 : 15),
    fontWeight: "600",
    fontFamily: 'Century Gothic',
  },
};
