const Joi = require('joi');

const activityScoreSchema = Joi.object({
  activityId: Joi.string().required(),
  userId: Joi.string().required(),
  moduleId: Joi.string().required(),
  correctAnswers: Joi.number().min(0).required(),
  incorrectAnswers: Joi.number().min(0).required(),
  totalQuestions: Joi.number().min(1).required(),
  timeSpent: Joi.number().min(0).required(),
  score: Joi.number().min(0).max(100).required(),
  activityType: Joi.string().valid('trivia', 'drag_drop', 'matching', 'interactive').required(),
  
  // Campos opcionales según el tipo de actividad
  correctStreak: Joi.number().min(0),
  hintsUsed: Joi.number().min(0),
  correctPlacements: Joi.number().min(0),
  incorrectAttempts: Joi.number().min(0),
  completionTime: Joi.number().min(0),
  correctMatches: Joi.number().min(0),
  incorrectMatches: Joi.number().min(0),
  attemptsPerMatch: Joi.object().pattern(Joi.string(), Joi.number().min(1))
});

const moduleProgressSchema = Joi.object({
  activitiesCompleted: Joi.number().min(0).required(),
  totalActivities: Joi.number().min(1).required(),
  averageScore: Joi.number().min(0).max(100).required(),
  isCompleted: Joi.boolean()
});

exports.validateScore = async (req, res, next) => {
  try {
    const validatedData = await activityScoreSchema.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true
    });
    
    // Validaciones adicionales
    if (validatedData.correctAnswers + validatedData.incorrectAnswers !== validatedData.totalQuestions) {
      throw new Error('La suma de respuestas correctas e incorrectas debe ser igual al total de preguntas');
    }

    // Validaciones específicas por tipo de actividad
    switch (validatedData.activityType) {
      case 'trivia':
        if (validatedData.correctStreak === undefined) {
          throw new Error('correctStreak es requerido para actividades tipo trivia');
        }
        break;
      case 'drag_drop':
        if (validatedData.correctPlacements === undefined) {
          throw new Error('correctPlacements es requerido para actividades drag & drop');
        }
        break;
      case 'matching':
        if (validatedData.correctMatches === undefined) {
          throw new Error('correctMatches es requerido para actividades de matching');
        }
        break;
    }

    req.validatedData = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Error de validación',
      details: error.details ? error.details.map(d => d.message) : [error.message]
    });
  }
};

exports.validateModuleProgress = async (req, res, next) => {
  try {
    const validatedData = await moduleProgressSchema.validateAsync(req.body, {
      abortEarly: false
    });
    
    // Validación adicional
    if (validatedData.activitiesCompleted > validatedData.totalActivities) {
      throw new Error('El número de actividades completadas no puede ser mayor que el total');
    }

    req.validatedData = validatedData;
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Error de validación',
      details: error.details ? error.details.map(d => d.message) : [error.message]
    });
  }
};

// Validación de parámetros de ruta
exports.validateParams = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.params);
    next();
  } catch (error) {
    res.status(400).json({
      error: 'Error de validación en parámetros',
      details: error.details.map(d => d.message)
    });
  }
};