// Centralized responsive utilities for consistent sizing across devices.
// Use moderateScale for fonts and spacings; scale/verticalScale for widths/heights.
// This avoids over-scaling on tablets while remaining readable on small phones.

import { Dimensions, PixelRatio, ScaledSize, Platform } from 'react-native';

// Base guideline dimensions (iPhone 11 / common design draft)
const GUIDELINE_BASE_WIDTH = 375; // px
const GUIDELINE_BASE_HEIGHT = 812; // px

let { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Handle orientation changes gracefully
Dimensions.addEventListener('change', ({ window }: { window: ScaledSize }) => {
  screenWidth = window.width;
  screenHeight = window.height;
});

export const scale = (size: number) => (screenWidth / GUIDELINE_BASE_WIDTH) * size;
export const verticalScale = (size: number) => (screenHeight / GUIDELINE_BASE_HEIGHT) * size;

// Applies a damping factor so large screens don't overscale text excessively
export const moderateScale = (size: number, factor: number = 0.5) => {
  const scaled = scale(size);
  return size + (scaled - size) * factor;
};

// Font scaling aware utility (accounts for user OS text size settings)
export const msFont = (size: number, factor: number = 0.5) => {
  const newSize = moderateScale(size, factor);
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Get responsive sizes for common tokens
export const rs = {
  xs: scale(4),
  sm: scale(8),
  md: scale(16),
  lg: scale(24),
  xl: scale(32),
};

export const deviceInfo = () => {
  const isSmallPhone = screenWidth < 350;
  const isTablet = screenWidth >= 768; // heuristic for RN (can refine with react-native-device-info)
  return { screenWidth, screenHeight, isSmallPhone, isTablet, platform: Platform.OS };
};

// Convenience helpers for component layout percentages
export const vw = (percentage: number) => (screenWidth * percentage) / 100;
export const vh = (percentage: number) => (screenHeight * percentage) / 100;

// Example usage:
// import { moderateScale as ms, msFont, vw } from '../utils/responsive';
// const styles = StyleSheet.create({ title: { fontSize: msFont(18), margin: ms(12) } });

export default { scale, verticalScale, moderateScale, msFont, rs, deviceInfo, vw, vh };
