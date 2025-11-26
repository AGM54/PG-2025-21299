/**
 * Logger utility - Solo muestra mensajes en desarrollo
 * En producción, los mensajes se silencian para no confundir al usuario
 */

// Detecta si estamos en modo desarrollo
// En Expo/React Native, __DEV__ es una variable global
const isDevelopment = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

// Flag para forzar silencio de errores Firebase (útil para producción)
const SILENT_FIREBASE = true;

export const logger = {
  log: (...args: any[]) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
  
  error: (...args: any[]) => {
    // Silenciar errores de Firebase completamente
    if (SILENT_FIREBASE) {
      const errorString = JSON.stringify(args);
      if (errorString.includes('Firebase') || errorString.includes('firestore')) {
        return; // No mostrar errores de Firebase
      }
    }
    
    if (isDevelopment) {
      console.error(...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },
  
  info: (...args: any[]) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },
  
  // Método especial para debugging que SIEMPRE imprime (usar con precaución)
  debug: (...args: any[]) => {
    console.log('[DEBUG]', ...args);
  },
  
  // Método silencioso que nunca imprime (útil para Firebase)
  silent: (...args: any[]) => {
    // No hace nada - completamente silencioso
  },
};
