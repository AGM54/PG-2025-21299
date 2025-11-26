const mongoose = require('mongoose');

const activityScoreSchema = new mongoose.Schema({
  activityId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  moduleId: {
    type: String,
    required: true,
    index: true
  },
  correctAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  incorrectAnswers: {
    type: Number,
    required: true,
    min: 0
  },
  totalQuestions: {
    type: Number,
    required: true,
    min: 1
  },
  timeSpent: {
    type: Number,
    required: true,
    min: 0
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  completedAt: {
    type: Date,
    default: Date.now,
    index: true
  },

  activityType: {
    type: String,
    required: true,
    enum: ['trivia', 'drag_drop', 'matching', 'interactive']
  },
  // Campos opcionales para tipos específicos
  correctStreak: Number,
  hintsUsed: Number,
  correctPlacements: Number,
  incorrectAttempts: Number,
  completionTime: Number,
  correctMatches: Number,
  incorrectMatches: Number,
  attemptsPerMatch: {
    type: Map,
    of: Number
  }
}, {
  timestamps: true
});

const moduleProgressSchema = new mongoose.Schema({
  moduleId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  activitiesCompleted: {
    type: Number,
    default: 0
  },
  totalActivities: {
    type: Number,
    required: true
  },
  averageScore: {
    type: Number,
    default: 0
  },
  lastActivityDate: {
    type: Date,
    default: Date.now
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const userProgressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  totalScore: {
    type: Number,
    default: 0
  },
  modulesCompleted: {
    type: Number,
    default: 0
  },
  totalModules: {
    type: Number,
    required: true
  },
  activitiesCompleted: {
    type: Number,
    default: 0
  },
  totalActivities: {
    type: Number,
    required: true
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices compuestos
activityScoreSchema.index({ userId: 1, moduleId: 1, activityId: 1 });
moduleProgressSchema.index({ userId: 1, moduleId: 1 }, { unique: true });

// Métodos del modelo
activityScoreSchema.methods.calculatePercentage = function() {
  return (this.correctAnswers / this.totalQuestions) * 100;
};

moduleProgressSchema.methods.updateProgress = function(newActivityScore) {
  this.activitiesCompleted += 1;
  this.averageScore = ((this.averageScore * (this.activitiesCompleted - 1)) + newActivityScore) / this.activitiesCompleted;
  this.lastActivityDate = new Date();
  this.isCompleted = this.activitiesCompleted === this.totalActivities;
};

// Hooks
activityScoreSchema.pre('save', function(next) {
  if (this.correctAnswers + this.incorrectAnswers !== this.totalQuestions) {
    next(new Error('La suma de respuestas correctas e incorrectas debe ser igual al total de preguntas'));
  }
  next();
});

const ActivityScore = mongoose.model('ActivityScore', activityScoreSchema);
const ModuleProgress = mongoose.model('ModuleProgress', moduleProgressSchema);
const UserProgress = mongoose.model('UserProgress', userProgressSchema);

module.exports = {
  ActivityScore,
  ModuleProgress,
  UserProgress
};