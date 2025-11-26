import { ActivityScore, ModuleProgress, UserProgress, ActivityType } from '../types/score.types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const ScoreService = {
  // Guardar puntuación de una actividad
  saveActivityScore: async (activityScore: ActivityScore): Promise<ActivityScore> => {
    try {
      const response = await fetch(`${API_BASE_URL}/scores/activity`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activityScore),
      });
      
      if (!response.ok) throw new Error('Error al guardar puntuación');
      return response.json();
    } catch (error) {
      console.error('Error en saveActivityScore:', error);
      throw error;
    }
  },

  // Obtener puntuaciones de un usuario por módulo
  getModuleScores: async (userId: string, moduleId: string): Promise<ActivityScore[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scores/module/${moduleId}/user/${userId}`
      );
      
      if (!response.ok) throw new Error('Error al obtener puntuaciones del módulo');
      return response.json();
    } catch (error) {
      console.error('Error en getModuleScores:', error);
      throw error;
    }
  },

  // Obtener progreso general del usuario
  getUserProgress: async (userId: string): Promise<UserProgress> => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/user/${userId}`);
      
      if (!response.ok) throw new Error('Error al obtener progreso del usuario');
      return response.json();
    } catch (error) {
      console.error('Error en getUserProgress:', error);
      throw error;
    }
  },

  // Actualizar progreso de un módulo
  updateModuleProgress: async (moduleProgress: ModuleProgress): Promise<ModuleProgress> => {
    try {
      const response = await fetch(`${API_BASE_URL}/progress/module`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(moduleProgress),
      });
      
      if (!response.ok) throw new Error('Error al actualizar progreso del módulo');
      return response.json();
    } catch (error) {
      console.error('Error en updateModuleProgress:', error);
      throw error;
    }
  },

  // Obtener mejores puntuaciones por actividad
  getLeaderboard: async (activityId: string, limit: number = 10): Promise<ActivityScore[]> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scores/leaderboard/${activityId}?limit=${limit}`
      );
      
      if (!response.ok) throw new Error('Error al obtener tabla de puntuaciones');
      return response.json();
    } catch (error) {
      console.error('Error en getLeaderboard:', error);
      throw error;
    }
  },

  // Obtener estadísticas de actividad específica
  getActivityStats: async (activityId: string, userId: string): Promise<{
    attempts: number;
    bestScore: number;
    averageScore: number;
    completionTime: number;
  }> => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/scores/stats/${activityId}/user/${userId}`
      );
      
      if (!response.ok) throw new Error('Error al obtener estadísticas de actividad');
      return response.json();
    } catch (error) {
      console.error('Error en getActivityStats:', error);
      throw error;
    }
  },
};