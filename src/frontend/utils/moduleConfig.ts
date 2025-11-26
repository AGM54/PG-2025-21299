// utils/moduleConfig.ts
// Centralized module configuration with correct step counts

interface ModuleConfig {
  displayName: string;
  totalSteps: number;
  storageKey: string;
}

// Actual module step counts based on lesson arrays
const MODULE_CONFIGS: Record<string, ModuleConfig> = {
  'CNEE': {
    displayName: 'CNEE',
    totalSteps: 13,
    storageKey: 'CNEE'
  },
  'Luz al Hogar': {
    displayName: 'Luz al Hogar',
    totalSteps: 24,
    storageKey: 'Luz al Hogar'
  },
  'Precios y Factura': {
    displayName: 'Precios y Factura',
    totalSteps: 20,
    storageKey: 'Precios y Factura'
  },
  'Obligaciones': {
    displayName: 'Obligaciones',
    totalSteps: 22,
    storageKey: 'Obligaciones'
  },
  'Alumbrado Público': {
    displayName: 'Alumbrado Público',
    totalSteps: 18,
    storageKey: 'Alumbrado Público'
  },
};

/**
 * Get the total steps for all modules combined
 */
const getTotalStepsForAllModules = (): number => {
  return Object.values(MODULE_CONFIGS).reduce((sum, config) => sum + config.totalSteps, 0);
};

/**
 * Get module configuration by key
 */
const getModuleConfig = (moduleKey: string): ModuleConfig | null => {
  return MODULE_CONFIGS[moduleKey] || null;
};

/**
 * Get all module keys
 */
const getAllModuleKeys = (): string[] => {
  return Object.keys(MODULE_CONFIGS);
};

/**
 * Calculate overall progress percentage based on actual step counts
 */
const calculateOverallProgress = (progressData: Record<string, { step: number }> | null): number => {
  if (!progressData) return 0;
  
  let totalCompletedSteps = 0;
  let totalSteps = 0;
  
  Object.entries(MODULE_CONFIGS).forEach(([moduleKey, config]) => {
    const moduleProgress = progressData[moduleKey];
    const completedSteps = Math.min(moduleProgress?.step || 0, config.totalSteps);
    
    totalCompletedSteps += completedSteps;
    totalSteps += config.totalSteps;
  });
  
  return totalSteps === 0 ? 0 : Math.round((totalCompletedSteps / totalSteps) * 100);
};

/**
 * Calculate progress for a specific module
 */
const calculateModuleProgress = (moduleKey: string, currentStep: number): number => {
  const config = getModuleConfig(moduleKey);
  if (!config) return 0;
  
  const completedSteps = Math.min(currentStep, config.totalSteps);
  return Math.round((completedSteps / config.totalSteps) * 100);
};

/**
 * Get completed modules count
 */
const getCompletedModulesCount = (progressData: Record<string, { step: number }> | null): number => {
  if (!progressData) return 0;
  
  return Object.entries(MODULE_CONFIGS).filter(([moduleKey, config]) => {
    const moduleProgress = progressData[moduleKey];
    return (moduleProgress?.step || 0) >= config.totalSteps;
  }).length;
};

/**
 * Calculate user level based on completed modules
 */
const calculateUserLevel = (completedModules: number): number => {
  return Math.min(Math.max(1, completedModules + 1), 5);
};

// Export all at once
export {
  ModuleConfig,
  MODULE_CONFIGS,
  getTotalStepsForAllModules,
  getModuleConfig,
  getAllModuleKeys,
  calculateOverallProgress,
  calculateModuleProgress,
  getCompletedModulesCount,
  calculateUserLevel,
};
