import { ActivityScore, TriviaScore, DragDropScore, MatchingScore } from '../types/score.types';

export const calculateBaseScore = (correct: number, total: number): number => {
  return Math.round((correct / total) * 100);
};

export const calculateTriviaScore = (
  correctAnswers: number,
  totalQuestions: number,
  timeSpent: number,
  correctStreak: number
): number => {
  const baseScore = calculateBaseScore(correctAnswers, totalQuestions);
  const timeBonus = Math.max(0, 10 - Math.floor(timeSpent / 30)); // Bonus por velocidad
  const streakBonus = Math.min(10, correctStreak); // Bonus por racha

  return Math.min(100, baseScore + timeBonus + streakBonus);
};

export const calculateDragDropScore = (
  correctPlacements: number,
  totalItems: number,
  incorrectAttempts: number,
  completionTime: number
): number => {
  const baseScore = calculateBaseScore(correctPlacements, totalItems);
  const penaltyPerError = 2;
  const timePenalty = Math.floor(completionTime / 60) * 1; // -1 punto por minuto

  return Math.max(0, baseScore - (incorrectAttempts * penaltyPerError) - timePenalty);
};

export const calculateMatchingScore = (
  correctMatches: number,
  totalPairs: number,
  incorrectMatches: number,
  attemptsPerMatch: Record<string, number>
): number => {
  const baseScore = calculateBaseScore(correctMatches, totalPairs);
  const averageAttempts = Object.values(attemptsPerMatch).reduce((a, b) => a + b, 0) / totalPairs;
  const attemptPenalty = Math.max(0, averageAttempts - 1) * 2;

  return Math.max(0, baseScore - attemptPenalty);
};

export const calculateModuleProgress = (
  activityScores: ActivityScore[]
): { averageScore: number; completionPercentage: number } => {
  if (activityScores.length === 0) {
    return { averageScore: 0, completionPercentage: 0 };
  }

  const totalScore = activityScores.reduce((sum, score) => sum + score.score, 0);
  const averageScore = Math.round(totalScore / activityScores.length);
  const completionPercentage = Math.round((activityScores.length / activityScores.length) * 100);

  return { averageScore, completionPercentage };
};

export const calculateOverallProgress = (
  moduleScores: { averageScore: number; completionPercentage: number }[]
): number => {
  if (moduleScores.length === 0) return 0;

  const totalProgress = moduleScores.reduce(
    (sum, module) => sum + (module.averageScore * (module.completionPercentage / 100)),
    0
  );

  return Math.round(totalProgress / moduleScores.length);
};