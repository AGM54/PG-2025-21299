const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');
const { validateScore, validateModuleProgress } = require('../middleware/validation');
const { authenticate } = require('../middleware/auth');

// Rutas para puntuaciones de actividades
router.post('/activity',
  authenticate,
  validateScore,
  scoreController.saveActivityScore
);

router.get('/module/:moduleId/user/:userId',
  authenticate,
  scoreController.getModuleScores
);

// Rutas para progreso
router.get('/progress/user/:userId',
  authenticate,
  scoreController.getUserProgress
);

router.put('/progress/module/:moduleId/user/:userId',
  authenticate,
  validateModuleProgress,
  scoreController.updateModuleProgress
);

// Rutas para leaderboard y estadísticas
router.get('/leaderboard/:activityId',
  authenticate,
  scoreController.getLeaderboard
);

router.get('/stats/:activityId/user/:userId',
  authenticate,
  scoreController.getActivityStats
);

module.exports = router;