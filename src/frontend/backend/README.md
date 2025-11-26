# Backend - Sistema de Puntuación y Progreso

## Descripción
Sistema backend para manejar puntuaciones, progreso y estadísticas de usuarios en la aplicación educativa.

## Requisitos Previos
- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- npm o yarn

## Estructura del Proyecto
\`\`\`
backend/
├── config/
│   └── moduleConfig.js     # Configuración de módulos y actividades
├── controllers/
│   └── scoreController.js  # Controladores para puntuaciones
├── middleware/
│   ├── auth.js            # Middleware de autenticación
│   └── validation.js      # Validación de datos
├── models/
│   └── Score.js           # Modelos de MongoDB
├── routes/
│   └── scoreRoutes.js     # Rutas de la API
└── .env                   # Variables de entorno
\`\`\`

## Instalación

1. Clonar el repositorio:
\`\`\`bash
git clone [url-del-repositorio]
cd backend
\`\`\`

2. Instalar dependencias:
\`\`\`bash
npm install
# o
yarn install
\`\`\`

3. Instalar dependencias específicas:
\`\`\`bash
npm install mongoose express joi jsonwebtoken dotenv cors
\`\`\`

4. Crear archivo .env:
\`\`\`env
MONGODB_URI=mongodb://localhost:27017/tu_base_de_datos
JWT_SECRET=tu_secreto_jwt
PORT=3000
NODE_ENV=development
\`\`\`

## Configuración de la Base de Datos

1. Asegúrate de que MongoDB está corriendo:
\`\`\`bash
mongod
\`\`\`

2. Crear índices necesarios:
\`\`\`javascript
// Ejecutar en MongoDB shell
db.activityScores.createIndex({ userId: 1, moduleId: 1, activityId: 1 })
db.moduleProgress.createIndex({ userId: 1, moduleId: 1 }, { unique: true })
db.userProgress.createIndex({ userId: 1 }, { unique: true })
\`\`\`

## Implementación

1. Configurar el servidor Express:

\`\`\`javascript
// app.js o index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const moduleConfig = require('./config/moduleConfig');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
});

// Configuración global
app.locals.moduleConfig = moduleConfig;

// Rutas
const scoreRoutes = require('./routes/scoreRoutes');
app.use('/api/scores', scoreRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Error interno del servidor',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Servidor corriendo en puerto \${PORT}\`);
});
\`\`\`

## Endpoints de la API

### Puntuaciones de Actividades

#### Guardar puntuación
\`\`\`
POST /api/scores/activity
Content-Type: application/json

{
  "activityId": "cnee_trivia",
  "userId": "user123",
  "moduleId": "cnee",
  "correctAnswers": 8,
  "incorrectAnswers": 2,
  "totalQuestions": 10,
  "timeSpent": 300,
  "score": 80,
  "activityType": "trivia",
  "correctStreak": 3
}
\`\`\`

#### Obtener puntuaciones de módulo
\`\`\`
GET /api/scores/module/:moduleId/user/:userId
\`\`\`

### Progreso

#### Obtener progreso de usuario
\`\`\`
GET /api/progress/user/:userId
\`\`\`

#### Actualizar progreso de módulo
\`\`\`
PUT /api/progress/module/:moduleId/user/:userId
Content-Type: application/json

{
  "activitiesCompleted": 2,
  "totalActivities": 3,
  "averageScore": 85,
  "isCompleted": false
}
\`\`\`

### Estadísticas

#### Obtener tabla de clasificación
\`\`\`
GET /api/leaderboard/:activityId?limit=10
\`\`\`

#### Obtener estadísticas de actividad
\`\`\`
GET /api/stats/:activityId/user/:userId
\`\`\`

## Validación de Datos

El sistema incluye validación exhaustiva para todos los datos entrantes:

1. Validación de puntuaciones:
   - Rango válido (0-100)
   - Suma correcta de respuestas
   - Campos requeridos según tipo de actividad

2. Validación de progreso:
   - Valores no negativos
   - Actividades completadas ≤ total de actividades
   - Promedio válido (0-100)

## Manejo de Errores

El sistema implementa manejo de errores consistente:

\`\`\`javascript
{
  "error": "Descripción del error",
  "details": ["Detalles específicos del error"]
}
\`\`\`

## Seguridad

1. Autenticación:
   - Todas las rutas requieren token JWT
   - Validación de usuario para acceso a datos

2. Validación de datos:
   - Sanitización de entradas
   - Validación de tipos
   - Prevención de inyección

## Pruebas

1. Ejecutar pruebas:
\`\`\`bash
npm test
\`\`\`

2. Verificar cobertura:
\`\`\`bash
npm run test:coverage
\`\`\`

## Monitoreo

1. Logs:
   - Errores de validación
   - Errores de base de datos
   - Accesos no autorizados

2. Métricas:
   - Tiempo de respuesta
   - Uso de memoria
   - Errores por minuto

## Mantenimiento

1. Backups:
   - Configurar respaldos diarios de MongoDB
   - Mantener logs por 30 días

2. Actualizaciones:
   - Revisar dependencias mensualmente
   - Actualizar índices según necesidad

## Solución de Problemas

### Problemas Comunes

1. Error de conexión a MongoDB:
   - Verificar URI en .env
   - Confirmar que MongoDB está corriendo
   - Revisar permisos de red

2. Validación fallando:
   - Revisar formato de datos
   - Verificar tipos de datos
   - Consultar esquemas de validación

3. Autenticación fallando:
   - Verificar JWT_SECRET
   - Confirmar formato de token
   - Revisar expiración de token

## Contribución

1. Fork del repositorio
2. Crear rama feature/fix
3. Commit cambios
4. Push a la rama
5. Crear Pull Request

## Soporte

Para soporte técnico:
- Crear issue en GitHub
- Contactar al equipo de desarrollo

## Licencia

[Tu licencia aquí]