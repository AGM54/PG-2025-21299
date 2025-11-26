const { ActivityScore, ModuleProgress, UserProgress } = require('../models/Score');

exports.saveActivityScore = async (req, res) => {
  try {
    const scoreData = req.body;
    
    // Crear nueva puntuación de actividad
    const activityScore = new ActivityScore(scoreData);
    await activityScore.save();

    // Actualizar progreso del módulo
    let moduleProgress = await ModuleProgress.findOne({
      userId: scoreData.userId,
      moduleId: scoreData.moduleId
    });

    if (!moduleProgress) {
      moduleProgress = new ModuleProgress({
        userId: scoreData.userId,
        moduleId: scoreData.moduleId,
        totalActivities: req.app.locals.moduleConfig[scoreData.moduleId].totalActivities
      });
    }

    moduleProgress.updateProgress(scoreData.score);
    await moduleProgress.save();

    // Actualizar progreso del usuario
    let userProgress = await UserProgress.findOne({ userId: scoreData.userId });
    if (!userProgress) {
      userProgress = new UserProgress({
        userId: scoreData.userId,
        totalModules: Object.keys(req.app.locals.moduleConfig).length,
        totalActivities: Object.values(req.app.locals.moduleConfig)
          .reduce((total, module) => total + module.totalActivities, 0)
      });
    }

    userProgress.activitiesCompleted += 1;
    userProgress.totalScore = await calculateUserTotalScore(scoreData.userId);
    userProgress.lastActive = new Date();
    await userProgress.save();

    res.status(201).json({
      activityScore,
      moduleProgress,
      userProgress
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al guardar la puntuación',
      details: error.message
    });
  }
};

exports.getModuleScores = async (req, res) => {
  try {
    const { moduleId, userId } = req.params;
    const scores = await ActivityScore.find({ moduleId, userId })
      .sort('-completedAt')
      .limit(10);
    
    res.json(scores);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener puntuaciones del módulo',
      details: error.message
    });
  }
};

exports.getUserProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    const progress = await UserProgress.findOne({ userId });
    
    if (!progress) {
      return res.status(404).json({
        error: 'Progreso no encontrado para este usuario'
      });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener progreso del usuario',
      details: error.message
    });
  }
};

exports.updateModuleProgress = async (req, res) => {
  try {
    const { moduleId, userId } = req.params;
    const updateData = req.body;
    
    const progress = await ModuleProgress.findOneAndUpdate(
      { moduleId, userId },
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!progress) {
      return res.status(404).json({
        error: 'Progreso del módulo no encontrado'
      });
    }
    
    res.json(progress);
  } catch (error) {
    res.status(500).json({
      error: 'Error al actualizar progreso del módulo',
      details: error.message
    });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { limit = 10 } = req.query;
    
    const leaderboard = await ActivityScore.find({ activityId })
      .sort('-score')
      .limit(Number(limit))
      .populate('userId', 'name avatar');
    
    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener tabla de puntuaciones',
      details: error.message
    });
  }
};

exports.getActivityStats = async (req, res) => {
  try {
    const { activityId, userId } = req.params;
    
    const stats = await ActivityScore.aggregate([
      { $match: { activityId, userId } },
      {
        $group: {
          _id: null,
          attempts: { $sum: 1 },
          bestScore: { $max: '$score' },
          averageScore: { $avg: '$score' },
          totalTime: { $sum: '$timeSpent' }
        }
      }
    ]);
    
    if (stats.length === 0) {
      return res.status(404).json({
        error: 'No hay estadísticas disponibles'
      });
    }
    
    res.json(stats[0]);
  } catch (error) {
    res.status(500).json({
      error: 'Error al obtener estadísticas',
      details: error.message
    });
  }
};

// Función auxiliar para calcular puntuación total
async function calculateUserTotalScore(userId) {
  const result = await ActivityScore.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        totalScore: { $avg: '$score' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].totalScore : 0;
}