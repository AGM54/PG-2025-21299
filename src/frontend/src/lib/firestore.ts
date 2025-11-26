import { getFirestore, doc, setDoc, updateDoc, getDoc, collection, addDoc, serverTimestamp, increment } from 'firebase/firestore';
import { app, auth } from '../../firebase.config';
import { logger } from '../../utils/logger';

// Inicializar Firestore
export const db = getFirestore(app);

// Exportar funciones de Firestore para uso externo
export { doc, updateDoc } from 'firebase/firestore';

// Generar un sessionId único para la sesión actual
let currentSessionId: string | null = null;

export const getSessionId = (): string => {
  if (!currentSessionId) {
    currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
  return currentSessionId;
};

// Interfaces
export interface UserProfile {
  email: string;
  displayName?: string;
  createdAt: any;
  lastLoginAt: any;
  avatarUrl?: string;
  level: number;
  points: number;
  streakDays: number;
  totalTimeMs: number;
  completedModules: number;
  badges: string[];
}

export interface EventLog {
  type: string;
  screen?: string;
  value?: number;
  extra?: Record<string, any>;
  sessionId?: string;
  createdAt: any;
}

export interface ModuleProgress {
  step: number;
  score?: number;
  updatedAt: any;
}

export interface ProgressData {
  [modulo: string]: ModuleProgress;
}

/**
 * Crear o actualizar el perfil del usuario
 */
export const createUserProfile = async (
  uid: string,
  email: string,
  displayName?: string
): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileDoc = await getDoc(profileRef);

    const profileData: Partial<UserProfile> = {
      email,
      displayName: displayName || email.split('@')[0],
    };

    if (!profileDoc.exists()) {
      // Crear nuevo perfil con campos gamificados
      await setDoc(profileRef, {
        ...profileData,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        level: 1,
        points: 0,
        streakDays: 1,
        totalTimeMs: 0,
        completedModules: 0,
        badges: [],
      });
      logger.log('✅ Perfil de usuario creado:', uid);
    } else {
      // Actualizar perfil existente
      await updateDoc(profileRef, {
        ...profileData,
        lastLoginAt: serverTimestamp(),
      });
      logger.log('✅ Perfil de usuario actualizado:', uid);
    }
  } catch (error) {
    logger.silent('❌ Error al crear/actualizar perfil:', error);
    throw error;
  }
};

/**
 * Actualizar el último login del usuario
 */
export const touchLastLogin = async (uid: string): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileDoc = await getDoc(profileRef);
    
    if (!profileDoc.exists()) {
      // Si el perfil no existe, crearlo (para usuarios registrados antes del sistema)
      const user = auth.currentUser;
      await setDoc(profileRef, {
        email: user?.email || '',
        displayName: user?.displayName || user?.email?.split('@')[0] || 'Usuario',
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
        level: 1,
        points: 0,
        streakDays: 1,
        totalTimeMs: 0,
        completedModules: 0,
        badges: [],
      });
      logger.log('✅ Perfil creado para usuario existente:', uid);
    } else {
      // Si existe, solo actualizar lastLoginAt
      await updateDoc(profileRef, {
        lastLoginAt: serverTimestamp(),
      });
      logger.log('✅ Último login actualizado:', uid);
    }
    
    // Registrar evento de login
    await logEvent(uid, 'login_success', {});
  } catch (error) {
    logger.silent('❌ Error al actualizar último login:', error);
    throw error;
  }
};

/**
 * Registrar un evento
 */
export const logEvent = async (
  uid: string,
  type: string,
  payload?: Record<string, any>
): Promise<void> => {
  try {
    const eventsRef = collection(db, 'profiles', uid, 'events');
    const eventData: Record<string, any> = {
      type,
      sessionId: getSessionId(),
      createdAt: serverTimestamp(),
    };

    // Solo agregar campos si tienen valores definidos
    if (payload?.screen) eventData.screen = payload.screen;
    if (payload?.value !== undefined) eventData.value = payload.value;
    if (payload?.extra) eventData.extra = payload.extra;

    await addDoc(eventsRef, eventData);
    logger.log(`✅ Evento registrado: ${type}`, payload);
  } catch (error) {
    logger.silent('❌ Error al registrar evento:', error);
    // No lanzar error para no interrumpir la UX
  }
};

/**
 * Guardar progreso del usuario en un módulo
 */
export const saveProgress = async (
  uid: string,
  modulo: string,
  data: Partial<ModuleProgress>
): Promise<void> => {
  try {
    const progressRef = doc(db, 'progress', uid);
    const progressData = {
      [modulo]: {
        ...data,
        updatedAt: serverTimestamp(),
      },
    };

    await setDoc(progressRef, progressData, { merge: true });
    logger.log(`✅ Progreso guardado en ${modulo}:`, data);
  } catch (error) {
    logger.silent('❌ Error al guardar progreso:', error);
    throw error;
  }
};

/**
 * Obtener progreso del usuario
 */
export const getProgress = async (uid: string): Promise<ProgressData | null> => {
  try {
    const progressRef = doc(db, 'progress', uid);
    const progressDoc = await getDoc(progressRef);
    
    if (progressDoc.exists()) {
      return progressDoc.data() as ProgressData;
    }
    return null;
  } catch (error) {
    logger.silent('❌ Error al obtener progreso:', error);
    return null;
  }
};

/**
 * Incrementar métricas diarias (opcional pero recomendado)
 */
export const bumpDaily = async (
  field: string,
  value: number = 1
): Promise<void> => {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const metricsRef = doc(db, 'metrics_daily', today);
    
    await setDoc(
      metricsRef,
      {
        [field]: increment(value),
        lastUpdated: serverTimestamp(),
      },
      { merge: true }
    );
    
    logger.log(`✅ Métrica diaria actualizada: ${field} +${value}`);
  } catch (error) {
    logger.silent('❌ Error al actualizar métrica diaria:', error);
    // No lanzar error para no interrumpir la UX
  }
};

/**
 * Obtener métricas de un día específico
 */
export const getDailyMetrics = async (date: string): Promise<Record<string, any> | null> => {
  try {
    const metricsRef = doc(db, 'metrics_daily', date);
    const metricsDoc = await getDoc(metricsRef);
    
    if (metricsDoc.exists()) {
      return metricsDoc.data();
    }
    return null;
  } catch (error) {
    logger.silent('❌ Error al obtener métricas diarias:', error);
    return null;
  }
};

/**
 * Helper para registrar un clic
 */
export const logClick = async (
  uid: string,
  screen: string,
  target: string
): Promise<void> => {
  await logEvent(uid, 'click', { screen, target });
  await bumpDaily(`clicks_${target}`);
};

/**
 * Helper para registrar un quiz
 */
export const logQuizSubmit = async (
  uid: string,
  screen: string,
  correct: number,
  total: number,
  timeMs: number
): Promise<void> => {
  await logEvent(uid, 'quiz_submit', {
    screen,
    correct,
    total,
    timeMs,
    extra: {
      score: Math.round((correct / total) * 100),
    },
  });
  
  await bumpDaily(`quiz_submits`);
  await bumpDaily(`quiz_correct_answers`, correct);
  await bumpDaily(`quiz_total_answers`, total);
};

/**
 * Obtener perfil completo del usuario
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileDoc = await getDoc(profileRef);
    
    if (profileDoc.exists()) {
      return profileDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    logger.silent('❌ Error al obtener perfil:', error);
    return null;
  }
};

/**
 * Agregar puntos al usuario
 */
export const addPoints = async (uid: string, points: number): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    await updateDoc(profileRef, {
      points: increment(points),
    });
    logger.log(`✅ ${points} puntos agregados`);
  } catch (error) {
    logger.silent('❌ Error al agregar puntos:', error);
  }
};

/**
 * Agregar badge al usuario
 */
export const addBadge = async (uid: string, badge: string): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileDoc = await getDoc(profileRef);
    
    if (profileDoc.exists()) {
      const currentBadges = profileDoc.data().badges || [];
      if (!currentBadges.includes(badge)) {
        await updateDoc(profileRef, {
          badges: [...currentBadges, badge],
        });
        logger.log(`✅ Badge agregado: ${badge}`);
      }
    }
  } catch (error) {
    logger.silent('❌ Error al agregar badge:', error);
  }
};

/**
 * Incrementar módulos completados
 */
/**
 * Incrementar módulos completados (solo si el módulo no estaba completado antes)
 */
export const incrementCompletedModules = async (uid: string, moduleId: string): Promise<void> => {
  try {
    const progressData = await getProgress(uid);
    const moduleProgress = progressData?.[moduleId];
    
    // Solo incrementar si el módulo no tenía score (primera vez que se completa)
    const wasNotCompleted = !moduleProgress || !moduleProgress.score || moduleProgress.score === 0;
    
    if (wasNotCompleted) {
      const profileRef = doc(db, 'profiles', uid);
      await updateDoc(profileRef, {
        completedModules: increment(1),
      });
      logger.log(`✅ Módulo ${moduleId} completado por primera vez - contador incrementado`);
    } else {
      logger.log(`ℹ️ Módulo ${moduleId} ya estaba completado - no se incrementa contador`);
    }
  } catch (error) {
    logger.silent('❌ Error al incrementar módulos:', error);
  }
};

/**
 * Agregar tiempo total
 */
export const addTotalTime = async (uid: string, timeMs: number): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    await updateDoc(profileRef, {
      totalTimeMs: increment(timeMs),
    });
  } catch (error) {
    logger.silent('❌ Error al agregar tiempo:', error);
  }
};

/**
 * Actualizar racha de días consecutivos
 */
export const updateStreak = async (uid: string): Promise<void> => {
  try {
    const profileRef = doc(db, 'profiles', uid);
    const profileDoc = await getDoc(profileRef);
    
    if (profileDoc.exists()) {
      const profile = profileDoc.data();
      const lastLogin = profile.lastLoginAt?.toDate();
      const now = new Date();
      
      if (lastLogin) {
        const daysDiff = Math.floor((now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff === 1) {
          // Día consecutivo
          await updateDoc(profileRef, {
            streakDays: increment(1),
          });
          logger.log(`✅ Racha incrementada`);
        } else if (daysDiff > 1) {
          // Se rompió la racha
          await updateDoc(profileRef, {
            streakDays: 1,
          });
          logger.log(`⚠️ Racha reiniciada`);
        }
      }
    }
  } catch (error) {
    logger.silent('❌ Error al actualizar racha:', error);
  }
};

// ========================================
// FUNCIONES ADMINISTRATIVAS
// ========================================

import { getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';

export interface UserStats extends UserProfile {
  uid: string;
  eventCount: number;
  lastActivityDate?: Date;
  moduleProgress?: Record<string, ModuleProgress>;
}

export interface AdminMetrics {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  totalPoints: number;
  averagePoints: number;
  totalModulesCompleted: number;
  averageCompletionRate: number;
  topUsers: UserStats[];
}

/**
 * Obtener todos los perfiles de usuarios para el admin
 */
export const getAllUserProfiles = async (): Promise<UserStats[]> => {
  try {
    const profilesRef = collection(db, 'profiles');
    const profilesSnapshot = await getDocs(profilesRef);
    
    const users: UserStats[] = [];
    
    for (const profileDoc of profilesSnapshot.docs) {
      const userData = profileDoc.data() as UserProfile;
      const uid = profileDoc.id;
      
      // Obtener conteo de eventos del usuario
      const eventsRef = collection(db, 'profiles', uid, 'events');
      const eventsSnapshot = await getDocs(eventsRef);
      
      // Obtener progreso del usuario
      const progressData = await getProgress(uid);
      
      users.push({
        ...userData,
        uid,
        eventCount: eventsSnapshot.size,
        lastActivityDate: userData.lastLoginAt?.toDate(),
        moduleProgress: progressData || undefined,
      });
    }
    
    // Ordenar por puntos descendente
    return users.sort((a, b) => (b.points || 0) - (a.points || 0));
  } catch (error) {
    logger.silent('❌ Error al obtener perfiles de usuarios:', error);
    return [];
  }
};

/**
 * Obtener métricas administrativas generales
 */
export const getAdminMetrics = async (): Promise<AdminMetrics> => {
  try {
    const users = await getAllUserProfiles();
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const activeUsersToday = users.filter(
      u => u.lastActivityDate && u.lastActivityDate > oneDayAgo
    ).length;
    
    const activeUsersWeek = users.filter(
      u => u.lastActivityDate && u.lastActivityDate > oneWeekAgo
    ).length;
    
    const totalPoints = users.reduce((sum, u) => sum + (u.points || 0), 0);
    const totalModulesCompleted = users.reduce((sum, u) => sum + (u.completedModules || 0), 0);
    
    const averagePoints = users.length > 0 ? totalPoints / users.length : 0;
    const averageCompletionRate = users.length > 0 ? totalModulesCompleted / users.length : 0;
    
    return {
      totalUsers: users.length,
      activeUsersToday,
      activeUsersWeek,
      totalPoints,
      averagePoints: Math.round(averagePoints),
      totalModulesCompleted,
      averageCompletionRate: Math.round(averageCompletionRate * 10) / 10,
      topUsers: users.slice(0, 10),
    };
  } catch (error) {
    logger.silent('❌ Error al obtener métricas administrativas:', error);
    return {
      totalUsers: 0,
      activeUsersToday: 0,
      activeUsersWeek: 0,
      totalPoints: 0,
      averagePoints: 0,
      totalModulesCompleted: 0,
      averageCompletionRate: 0,
      topUsers: [],
    };
  }
};

/**
 * Obtener eventos de un usuario específico (para el admin)
 */
export const getUserEvents = async (uid: string, limitCount: number = 50): Promise<EventLog[]> => {
  try {
    const eventsRef = collection(db, 'profiles', uid, 'events');
    const q = query(eventsRef, orderBy('createdAt', 'desc'), limit(limitCount));
    const eventsSnapshot = await getDocs(q);
    
    return eventsSnapshot.docs.map(doc => ({
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate(),
    } as EventLog));
  } catch (error) {
    logger.silent('❌ Error al obtener eventos del usuario:', error);
    return [];
  }
};

/**
 * Obtener estadísticas de uso por módulo
 */
export const getModuleStatistics = async (): Promise<Record<string, any>> => {
  try {
    const users = await getAllUserProfiles();
    const moduleStats: Record<string, {
      usersStarted: number;
      usersCompleted: number;
      averageScore: number;
      totalScores: number[];
    }> = {};
    
    for (const user of users) {
      if (user.moduleProgress) {
        for (const [moduleId, progress] of Object.entries(user.moduleProgress)) {
          if (!moduleStats[moduleId]) {
            moduleStats[moduleId] = {
              usersStarted: 0,
              usersCompleted: 0,
              averageScore: 0,
              totalScores: [],
            };
          }
          
          moduleStats[moduleId].usersStarted++;
          
          if (progress.score !== undefined) {
            moduleStats[moduleId].totalScores.push(progress.score);
          }
          
          // Considerar completado si tiene score > 0 y step alto
          if (progress.score && progress.score > 0 && progress.step >= 5) {
            moduleStats[moduleId].usersCompleted++;
          }
        }
      }
    }
    
    // Calcular promedios
    for (const moduleId in moduleStats) {
      const scores = moduleStats[moduleId].totalScores;
      if (scores.length > 0) {
        const sum = scores.reduce((a, b) => a + b, 0);
        moduleStats[moduleId].averageScore = Math.round(sum / scores.length);
      }
    }
    
    return moduleStats;
  } catch (error) {
    logger.silent('❌ Error al obtener estadísticas de módulos:', error);
    return {};
  }
};

/**
 * Exportar datos de usuarios a formato CSV
 */
export const exportUsersToCSV = async (): Promise<string> => {
  try {
    const users = await getAllUserProfiles();
    
    // Encabezados CSV
    let csv = 'Email,Nombre,Nivel,Puntos,Racha,Tiempo Total (min),Módulos Completados,Badges,Último Login,Fecha Registro\n';
    
    // Datos de usuarios
    for (const user of users) {
      const timeMinutes = Math.round((user.totalTimeMs || 0) / 60000);
      const lastLogin = user.lastLoginAt?.toDate?.()?.toLocaleDateString() || 'N/A';
      const createdAt = user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A';
      const badges = (user.badges || []).join(';');
      
      csv += `"${user.email}","${user.displayName}",${user.level},${user.points},${user.streakDays},${timeMinutes},${user.completedModules},"${badges}","${lastLogin}","${createdAt}"\n`;
    }
    
    return csv;
  } catch (error) {
    logger.silent('❌ Error al exportar usuarios:', error);
    return '';
  }
};

/**
 * Función de migración: Recalcular completedModules basado en progreso real
 * Esta función corrige el contador de módulos completados para todos los usuarios
 */
export const migrateCompletedModules = async (): Promise<{ fixed: number; errors: number }> => {
  try {
    logger.log('🔧 Iniciando migración de completedModules...');
    
    const profilesRef = collection(db, 'profiles');
    const profilesSnapshot = await getDocs(profilesRef);
    
    let fixed = 0;
    let errors = 0;
    
    for (const profileDoc of profilesSnapshot.docs) {
      const uid = profileDoc.id;
      const userData = profileDoc.data() as UserProfile;
      
      try {
        // Obtener progreso del usuario
        const progressData = await getProgress(uid);
        
        if (!progressData) {
          logger.log(`ℹ️ Usuario ${userData.email} no tiene progreso guardado`);
          continue;
        }
        
        // Contar módulos con score > 0 (completados)
        const moduleNames = [
          'CNEE',
          'Luz al Hogar',
          'Precios y Factura',
          'Obligaciones',
          'Alumbrado Público'
        ];
        
        const actualCompletedCount = moduleNames.filter(moduleName => {
          const moduleProgress = progressData[moduleName];
          return moduleProgress && moduleProgress.score && moduleProgress.score > 0;
        }).length;
        
        const currentCount = userData.completedModules || 0;
        
        // Solo actualizar si hay diferencia
        if (actualCompletedCount !== currentCount) {
          const profileRef = doc(db, 'profiles', uid);
          await updateDoc(profileRef, {
            completedModules: actualCompletedCount,
          });
          
          logger.log(`✅ ${userData.email}: ${currentCount} → ${actualCompletedCount} módulos`);
          fixed++;
        } else {
          logger.log(`✓ ${userData.email}: ${currentCount} módulos (correcto)`);
        }
      } catch (error) {
        logger.silent(`❌ Error al migrar usuario ${userData.email}:`, error);
        errors++;
      }
    }
    
    logger.log(`🎉 Migración completada: ${fixed} usuarios corregidos, ${errors} errores`);
    return { fixed, errors };
  } catch (error) {
    logger.silent('❌ Error en migración:', error);
    return { fixed: 0, errors: 1 };
  }
};

/**
 * Recalcular completedModules para un usuario específico
 */
export const recalculateUserModules = async (uid: string): Promise<number> => {
  try {
    const progressData = await getProgress(uid);
    
    if (!progressData) {
      return 0;
    }
    
    const moduleNames = [
      'CNEE',
      'Luz al Hogar',
      'Precios y Factura',
      'Obligaciones',
      'Alumbrado Público'
    ];
    
    const completedCount = moduleNames.filter(moduleName => {
      const moduleProgress = progressData[moduleName];
      return moduleProgress && moduleProgress.score && moduleProgress.score > 0;
    }).length;
    
    const profileRef = doc(db, 'profiles', uid);
    await updateDoc(profileRef, {
      completedModules: completedCount,
    });
    
    logger.log(`✅ Módulos recalculados para usuario: ${completedCount}`);
    return completedCount;
  } catch (error) {
    logger.silent('❌ Error al recalcular módulos:', error);
    return 0;
  }
};
