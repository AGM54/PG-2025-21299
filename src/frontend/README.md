# CNEE Energía

Aplicación móvil educativa sobre energía eléctrica construida con Expo y React Native.

## 📱 Plataformas Soportadas

- ✅ **Android** - Completamente funcional
- ✅ **iOS** - Completamente funcional (iPhone y iPad)
- ✅ **Web** - Disponible

## Requisitos

- Node.js 18 o superior
- npm
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (opcional)
- Para iOS: Mac con Xcode (opcional, solo para simulador) o iPhone/iPad con Expo Go

## Instalación

```bash
npm install
```

## Ejecución

### Inicio Rápido

```bash
npm start
```

### Plataformas Específicas

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

### 🍎 Ejecutar en iOS

La aplicación está completamente configurada para iOS. Tienes varias opciones:

#### Opción 1: Expo Go (Más Fácil - Recomendado)
1. Instala [Expo Go](https://apps.apple.com/app/expo-go/id982107779) en tu iPhone/iPad
2. Ejecuta `npm start`
3. Escanea el código QR con Expo Go
4. ¡Listo! La app correrá en tu dispositivo

#### Opción 2: Simulador de iOS (Requiere Mac)
```bash
npm run ios
```

**📖 Para más detalles sobre configuración iOS, consulta [IOS_SETUP_GUIDE.md](./IOS_SETUP_GUIDE.md)**

## Estructura del proyecto

El código fuente principal se encuentra en archivos TypeScript dentro de directorios como `components`, `hooks`, `screens` y `navigation`.

## Licencia

Este proyecto está licenciado bajo 0BSD.
