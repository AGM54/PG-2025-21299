/**
 * Utilidad para manejar errores de manera profesional en producción
 * Convierte errores técnicos de Firebase y otros servicios en mensajes amigables para el usuario
 */

export interface ErrorMessage {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

/**
 * Maneja errores de Firebase y los convierte en mensajes amigables
 */
export function handleFirebaseError(error: any): ErrorMessage {
  const errorCode = error?.code || error?.message || '';

  // Errores de autenticación
  if (errorCode.includes('auth/')) {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        return {
          title: 'Error de inicio de sesión',
          message: 'Usuario o contraseña incorrectos. Por favor verifica tus credenciales.',
          type: 'error',
        };
      case 'auth/email-already-in-use':
        return {
          title: 'Correo en uso',
          message: 'Este correo electrónico ya está registrado. Intenta iniciar sesión.',
          type: 'warning',
        };
      case 'auth/weak-password':
        return {
          title: 'Contraseña débil',
          message: 'La contraseña debe tener al menos 6 caracteres.',
          type: 'warning',
        };
      case 'auth/invalid-email':
        return {
          title: 'Correo inválido',
          message: 'Por favor ingresa un correo electrónico válido.',
          type: 'warning',
        };
      case 'auth/network-request-failed':
        return {
          title: 'Sin conexión',
          message: 'No se pudo conectar al servidor. Verifica tu conexión a internet.',
          type: 'error',
        };
      case 'auth/too-many-requests':
        return {
          title: 'Demasiados intentos',
          message: 'Has intentado muchas veces. Espera unos minutos e intenta nuevamente.',
          type: 'warning',
        };
      default:
        return {
          title: 'Error de autenticación',
          message: 'No se pudo completar la operación. Intenta nuevamente.',
          type: 'error',
        };
    }
  }

  // Errores de Firestore
  if (errorCode.includes('firestore/') || errorCode.includes('permission-denied')) {
    switch (errorCode) {
      case 'firestore/permission-denied':
      case 'permission-denied':
        return {
          title: 'Acceso denegado',
          message: 'No tienes permisos para realizar esta acción.',
          type: 'warning',
        };
      case 'firestore/unavailable':
        return {
          title: 'Servicio no disponible',
          message: 'El servicio está temporalmente no disponible. Intenta más tarde.',
          type: 'warning',
        };
      case 'firestore/not-found':
        return {
          title: 'No encontrado',
          message: 'La información solicitada no fue encontrada.',
          type: 'info',
        };
      default:
        return {
          title: 'Error de base de datos',
          message: 'No se pudo guardar o cargar la información. Intenta nuevamente.',
          type: 'error',
        };
    }
  }

  // Errores de red
  if (
    errorCode.includes('network') ||
    errorCode.includes('timeout') ||
    error?.message?.includes('network') ||
    error?.message?.includes('fetch')
  ) {
    return {
      title: 'Error de conexión',
      message: 'Verifica tu conexión a internet e intenta nuevamente.',
      type: 'error',
    };
  }

  // Error genérico
  return {
    title: 'Error inesperado',
    message: 'Ocurrió un error inesperado. Por favor intenta nuevamente.',
    type: 'error',
  };
}

/**
 * Maneja errores generales de la aplicación
 */
export function handleAppError(error: any): ErrorMessage {
  // Si es un error de Firebase, manejarlo específicamente
  if (error?.code || error?.message?.includes('auth') || error?.message?.includes('firestore')) {
    return handleFirebaseError(error);
  }

  // Error de validación
  if (error?.message?.includes('validation') || error?.message?.includes('required')) {
    return {
      title: 'Datos incompletos',
      message: 'Por favor completa todos los campos requeridos.',
      type: 'warning',
    };
  }

  // Error genérico
  console.error('Error no manejado:', error);
  return {
    title: 'Error',
    message: 'Ocurrió un problema inesperado. Por favor intenta nuevamente.',
    type: 'error',
  };
}

/**
 * Crea un mensaje de éxito
 */
export function createSuccessMessage(message: string): ErrorMessage {
  return {
    title: 'Éxito',
    message,
    type: 'info',
  };
}

/**
 * Crea un mensaje de advertencia personalizado
 */
export function createWarningMessage(title: string, message: string): ErrorMessage {
  return {
    title,
    message,
    type: 'warning',
  };
}

/**
 * Crea un mensaje informativo personalizado
 */
export function createInfoMessage(title: string, message: string): ErrorMessage {
  return {
    title,
    message,
    type: 'info',
  };
}
