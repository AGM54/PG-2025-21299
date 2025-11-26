export interface ActivityScore {
  activityId: string;
  userId: string;
  moduleId: string;
  correctAnswers: number;
  incorrectAnswers: number;
  totalQuestions: number;
  timeSpent: number; // en segundos
  completedAt: Date;
  score: number; // puntuación calculada (0-100)
}

export interface ModuleProgress {
  moduleId: string;
  userId: string;
  activitiesCompleted: number;
  totalActivities: number;
  averageScore: number;
  lastActivityDate: Date;
  isCompleted: boolean;
}

export interface UserProgress {
  userId: string;
  totalScore: number;
  modulesCompleted: number;
  totalModules: number;
  activitiesCompleted: number;
  totalActivities: number;
  lastActive: Date;
}

// Tipos para las actividades específicas
export interface TriviaScore extends ActivityScore {
  correctStreak: number; // racha de respuestas correctas consecutivas
  hintsUsed: number; // número de pistas utilizadas
}

export interface DragDropScore extends ActivityScore {
  correctPlacements: number;
  incorrectAttempts: number;
  completionTime: number;
}

export interface MatchingScore extends ActivityScore {
  correctMatches: number;
  incorrectMatches: number;
  attemptsPerMatch: Record<string, number>; // intentos por cada par
}

// Enums para identificación
export enum ActivityType {
  TRIVIA = 'trivia',
  DRAG_DROP = 'drag_drop',
  MATCHING = 'matching',
  INTERACTIVE = 'interactive'
}

export enum ModuleType {
  CNEE = 'cnee',
  ELECTRICIDAD = 'electricidad',
  FACTURA = 'factura',
  ALUMBRADO = 'alumbrado',
  OBLIGACIONES = 'obligaciones'
}