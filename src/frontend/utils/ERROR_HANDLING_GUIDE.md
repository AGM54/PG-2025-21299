# Guía de Manejo de Errores Profesional

Esta guía explica cómo usar el sistema de manejo de errores estandarizado para producción en Play Store.

## 📦 Componentes del Sistema

### 1. ErrorModal Component
Modal profesional con diseño degradado y responsivo que muestra errores de manera amigable.

**Ubicación:** `components/ErrorModal/ErrorModal.tsx`

**Características:**
- Diseño con gradientes profesionales
- 3 tipos: `error`, `warning`, `info`
- Totalmente responsivo (tablets y móviles)
- Iconos distintivos por tipo
- Botón de cierre elegante

### 2. Error Handler Utility
Funciones que convierten errores técnicos en mensajes amigables para usuarios.

**Ubicación:** `utils/errorHandler.ts`

**Funciones principales:**
- `handleFirebaseError()` - Maneja errores de Firebase
- `handleAppError()` - Maneja errores generales
- `createSuccessMessage()` - Crea mensajes de éxito
- `createWarningMessage()` - Crea advertencias personalizadas
- `createInfoMessage()` - Crea mensajes informativos

## 🚀 Cómo Usar

### Ejemplo 1: Manejo de errores en Login

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import ErrorModal from '../components/ErrorModal';
import { handleFirebaseError } from '../utils/errorHandler';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase.config';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{ visible: boolean; title: string; message: string; type: 'error' | 'warning' | 'info' }>({
    visible: false,
    title: '',
    message: '',
    type: 'error',
  });

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Éxito - navegar a home
    } catch (err) {
      // Convertir error técnico a mensaje amigable
      const errorInfo = handleFirebaseError(err);
      setError({
        visible: true,
        ...errorInfo,
      });
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleLogin}>
        <Text>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Modal de error profesional */}
      <ErrorModal
        visible={error.visible}
        title={error.title}
        message={error.message}
        type={error.type}
        onClose={() => setError({ ...error, visible: false })}
      />
    </View>
  );
}
```

### Ejemplo 2: Manejo de errores en Firestore

```typescript
import { handleFirebaseError } from '../utils/errorHandler';
import { saveProgress } from '../src/lib/firestore';

const [error, setError] = useState({
  visible: false,
  title: '',
  message: '',
  type: 'error' as 'error' | 'warning' | 'info',
});

const handleSaveProgress = async () => {
  try {
    await saveProgress(userId, 'CNEE', { step: 5, score: 80 });
    // Éxito
  } catch (err) {
    const errorInfo = handleFirebaseError(err);
    setError({
      visible: true,
      ...errorInfo,
    });
  }
};

// En el render:
<ErrorModal
  visible={error.visible}
  title={error.title}
  message={error.message}
  type={error.type}
  onClose={() => setError({ ...error, visible: false })}
/>
```

### Ejemplo 3: Mensajes personalizados

```typescript
import { createWarningMessage, createSuccessMessage } from '../utils/errorHandler';

// Advertencia personalizada
const warningInfo = createWarningMessage(
  'Datos incompletos',
  'Por favor completa todos los campos antes de continuar.'
);
setError({
  visible: true,
  ...warningInfo,
});

// Mensaje de éxito
const successInfo = createSuccessMessage('Tu progreso ha sido guardado exitosamente.');
setError({
  visible: true,
  ...successInfo,
});
```

## 🎨 Tipos de Modales

### Error (Rojo)
- Color: Rojo degradado
- Uso: Errores críticos (fallo de autenticación, errores de red)
- Icono: ⚠️

### Warning (Naranja)
- Color: Naranja degradado
- Uso: Advertencias (contraseña débil, datos incompletos)
- Icono: ⚠️

### Info (Azul)
- Color: Azul degradado
- Uso: Información o éxito (operación completada, mensajes informativos)
- Icono: ℹ️

## 📋 Errores Manejados Automáticamente

### Errores de Autenticación
- `auth/user-not-found` → "Usuario o contraseña incorrectos"
- `auth/wrong-password` → "Usuario o contraseña incorrectos"
- `auth/email-already-in-use` → "Este correo ya está registrado"
- `auth/weak-password` → "La contraseña debe tener al menos 6 caracteres"
- `auth/invalid-email` → "Correo electrónico inválido"
- `auth/network-request-failed` → "Sin conexión a internet"
- `auth/too-many-requests` → "Demasiados intentos, espera unos minutos"

### Errores de Firestore
- `permission-denied` → "No tienes permisos para esta acción"
- `unavailable` → "Servicio temporalmente no disponible"
- `not-found` → "Información no encontrada"

### Errores de Red
- Timeout, network, fetch → "Error de conexión, verifica tu internet"

## ✅ Best Practices

1. **Siempre usa try-catch** en operaciones asíncronas
2. **Nunca muestres errores técnicos** directamente al usuario
3. **Usa el tipo apropiado** de modal (error/warning/info)
4. **Mensajes claros y accionables** - di al usuario qué hacer
5. **Log errores técnicos** en consola para debugging

## 🔧 Personalización

Para agregar nuevos tipos de errores, edita `utils/errorHandler.ts`:

```typescript
// Agregar nuevo caso de error
case 'tu-nuevo-error-code':
  return {
    title: 'Título Amigable',
    message: 'Mensaje claro para el usuario.',
    type: 'error',
  };
```

## 📱 Responsive Design

El ErrorModal es completamente responsivo:
- **Tablets**: Texto y espacios reducidos un 20-30%
- **Móviles**: Tamaño completo optimizado
- **Máximo ancho**: 500px en dispositivos grandes

## 🚫 NO hacer

❌ NO mostrar errores técnicos:
```typescript
alert(error.message); // MAL
console.log(error); // Solo en desarrollo
```

✅ SÍ usar el sistema estandarizado:
```typescript
const errorInfo = handleFirebaseError(error);
setError({ visible: true, ...errorInfo }); // BIEN
```

## 📝 Notas de Producción

- Los errores técnicos se loggean en consola (solo visible en desarrollo)
- Los usuarios ven mensajes amigables
- El diseño es profesional y consistente
- Compatible con Play Store guidelines
