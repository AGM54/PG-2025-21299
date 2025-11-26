import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Alert,
  Share,
  Platform,
} from 'react-native';
import { 
  getAdminMetrics, 
  getAllUserProfiles, 
  getModuleStatistics,
  exportUsersToCSV,
  migrateCompletedModules,
  UserStats,
  AdminMetrics as AdminMetricsType,
} from '../lib/firestore';
import { Ionicons } from '@expo/vector-icons';
import { moderateScale as ms, msFont } from '../../utils/responsive';

export const AdminMetricsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'modules'>('overview');
  const [metrics, setMetrics] = useState<AdminMetricsType | null>(null);
  const [users, setUsers] = useState<UserStats[]>([]);
  const [moduleStats, setModuleStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [migrating, setMigrating] = useState<boolean>(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [metricsData, usersData, moduleStatsData] = await Promise.all([
        getAdminMetrics(),
        getAllUserProfiles(),
        getModuleStatistics(),
      ]);
      
      setMetrics(metricsData);
      setUsers(usersData);
      setModuleStats(moduleStatsData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      Alert.alert('Error', 'No se pudieron cargar las métricas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExport = async () => {
    try {
      const csv = await exportUsersToCSV();
      if (csv) {
        if (Platform.OS === 'web') {
          // Crear blob y descargar en web
          const blob = new Blob([csv], { type: 'text/csv' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `usuarios_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
          Alert.alert('Éxito', 'Archivo CSV descargado');
        } else {
          // Compartir en móvil
          await Share.share({
            message: csv,
            title: 'Datos de Usuarios',
          });
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo exportar los datos');
    }
  };

  const handleMigration = async () => {
    Alert.alert(
      'Recalcular Módulos',
      '¿Estás seguro de que quieres recalcular el contador de módulos completados para todos los usuarios? Esto corregirá los contadores incorrectos.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Recalcular',
          style: 'destructive',
          onPress: async () => {
            setMigrating(true);
            try {
              const result = await migrateCompletedModules();
              Alert.alert(
                'Migración Completada',
                `✅ ${result.fixed} usuarios corregidos\n${result.errors > 0 ? `❌ ${result.errors} errores` : ''}`,
                [{ text: 'OK', onPress: () => loadData() }]
              );
            } catch (error) {
              Alert.alert('Error', 'No se pudo completar la migración');
            } finally {
              setMigrating(false);
            }
          },
        },
      ]
    );
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatDate = (date?: Date): string => {
    if (!date) return 'N/A';
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Hace menos de 1h';
    if (hours < 24) return `Hace ${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `Hace ${days}d`;
    return date.toLocaleDateString();
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Métricas principales */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Resumen General</Text>
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconContainer}>
              <Ionicons name="people" size={24} color="#6366f1" />
            </View>
            <Text style={styles.metricValue}>{metrics?.totalUsers || 0}</Text>
            <Text style={styles.metricLabel}>Usuarios Totales</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#dcfce7' }]}>
              <Ionicons name="person-add" size={24} color="#16a34a" />
            </View>
            <Text style={[styles.metricValue, { color: '#16a34a' }]}>
              {metrics?.activeUsersToday || 0}
            </Text>
            <Text style={styles.metricLabel}>Activos Hoy</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="calendar" size={24} color="#ca8a04" />
            </View>
            <Text style={[styles.metricValue, { color: '#ca8a04' }]}>
              {metrics?.activeUsersWeek || 0}
            </Text>
            <Text style={styles.metricLabel}>Activos esta Semana</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#fce7f3' }]}>
              <Ionicons name="trophy" size={24} color="#db2777" />
            </View>
            <Text style={[styles.metricValue, { color: '#db2777' }]}>
              {metrics?.totalPoints.toLocaleString() || 0}
            </Text>
            <Text style={styles.metricLabel}>Puntos Totales</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#ddd6fe' }]}>
              <Ionicons name="star" size={24} color="#7c3aed" />
            </View>
            <Text style={[styles.metricValue, { color: '#7c3aed' }]}>
              {metrics?.averagePoints || 0}
            </Text>
            <Text style={styles.metricLabel}>Puntos Promedio</Text>
          </View>

          <View style={styles.metricCard}>
            <View style={[styles.metricIconContainer, { backgroundColor: '#e0f2fe' }]}>
              <Ionicons name="checkmark-circle" size={24} color="#0284c7" />
            </View>
            <Text style={[styles.metricValue, { color: '#0284c7' }]}>
              {metrics?.totalModulesCompleted || 0}
            </Text>
            <Text style={styles.metricLabel}>Módulos Completados</Text>
          </View>
        </View>
      </View>

      {/* Top 10 Usuarios */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Top 10 Usuarios</Text>
        {metrics?.topUsers.slice(0, 10).map((user, index) => (
          <View key={user.uid} style={styles.topUserCard}>
            <View style={styles.rankBadge}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>
            <View style={styles.topUserInfo}>
              <Text style={styles.topUserName}>{user.displayName}</Text>
              <Text style={styles.topUserEmail}>{user.email}</Text>
            </View>
            <View style={styles.topUserStats}>
              <View style={styles.statItem}>
                <Ionicons name="trophy" size={16} color="#f59e0b" />
                <Text style={styles.statValue}>{user.points}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="flame" size={16} color="#ef4444" />
                <Text style={styles.statValue}>{user.streakDays}</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="checkmark-done" size={16} color="#10b981" />
                <Text style={styles.statValue}>{user.completedModules}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const renderUsersTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>👥 Todos los Usuarios ({users.length})</Text>
          <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
            <Ionicons name="download" size={18} color="#fff" />
            <Text style={styles.exportButtonText}>Exportar CSV</Text>
          </TouchableOpacity>
        </View>

        {users.map((user) => (
          <TouchableOpacity
            key={user.uid}
            style={styles.userCard}
            onPress={() => setExpandedUser(expandedUser === user.uid ? null : user.uid)}
          >
            <View style={styles.userCardHeader}>
              <View style={styles.userAvatar}>
                <Text style={styles.userAvatarText}>
                  {user.displayName?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.userMainInfo}>
                <Text style={styles.userName}>{user.displayName}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userActivity}>
                  Última actividad: {formatDate(user.lastActivityDate)}
                </Text>
              </View>
              <Ionicons 
                name={expandedUser === user.uid ? "chevron-up" : "chevron-down"} 
                size={20} 
                color="#9ca3af" 
              />
            </View>

            {expandedUser === user.uid && (
              <View style={styles.userCardExpanded}>
                <View style={styles.userStatsGrid}>
                  <View style={styles.userStatItem}>
                    <Text style={styles.userStatLabel}>Nivel</Text>
                    <Text style={styles.userStatValue}>{user.level}</Text>
                  </View>
                  <View style={styles.userStatItem}>
                    <Text style={styles.userStatLabel}>Puntos</Text>
                    <Text style={styles.userStatValue}>{user.points}</Text>
                  </View>
                  <View style={styles.userStatItem}>
                    <Text style={styles.userStatLabel}>Racha</Text>
                    <Text style={styles.userStatValue}>{user.streakDays} días</Text>
                  </View>
                  <View style={styles.userStatItem}>
                    <Text style={styles.userStatLabel}>Módulos</Text>
                    <Text style={styles.userStatValue}>{user.completedModules}</Text>
                  </View>
                  <View style={styles.userStatItem}>
                    <Text style={styles.userStatLabel}>Tiempo Total</Text>
                    <Text style={styles.userStatValue}>{formatTime(user.totalTimeMs)}</Text>
                  </View>
                  <View style={styles.userStatItem}>
                    <Text style={styles.userStatLabel}>Eventos</Text>
                    <Text style={styles.userStatValue}>{user.eventCount}</Text>
                  </View>
                </View>

                {user.badges && user.badges.length > 0 && (
                  <View style={styles.badgesContainer}>
                    <Text style={styles.badgesLabel}>Insignias:</Text>
                    <View style={styles.badgesRow}>
                      {user.badges.map((badge, idx) => (
                        <View key={idx} style={styles.badge}>
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {user.moduleProgress && Object.keys(user.moduleProgress).length > 0 && (
                  <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>Progreso por Módulo:</Text>
                    {Object.entries(user.moduleProgress).map(([moduleId, progress]) => (
                      <View key={moduleId} style={styles.progressItem}>
                        <Text style={styles.progressModuleName}>{moduleId}</Text>
                        <View style={styles.progressBar}>
                          <View 
                            style={[
                              styles.progressBarFill, 
                              { width: `${Math.min((progress.score || 0), 100)}%` }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressScore}>
                          {progress.score || 0}% - Paso {progress.step}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  const renderModulesTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📚 Estadísticas por Módulo</Text>
        
        {Object.keys(moduleStats).length === 0 ? (
          <Text style={styles.noDataText}>No hay datos de módulos disponibles</Text>
        ) : (
          Object.entries(moduleStats).map(([moduleId, stats]: [string, any]) => (
            <View key={moduleId} style={styles.moduleCard}>
              <Text style={styles.moduleName}>{moduleId.toUpperCase()}</Text>
              
              <View style={styles.moduleStatsRow}>
                <View style={styles.moduleStatItem}>
                  <Ionicons name="play-circle" size={20} color="#3b82f6" />
                  <Text style={styles.moduleStatLabel}>Iniciados</Text>
                  <Text style={styles.moduleStatValue}>{stats.usersStarted}</Text>
                </View>

                <View style={styles.moduleStatItem}>
                  <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  <Text style={styles.moduleStatLabel}>Completados</Text>
                  <Text style={styles.moduleStatValue}>{stats.usersCompleted}</Text>
                </View>

                <View style={styles.moduleStatItem}>
                  <Ionicons name="stats-chart" size={20} color="#8b5cf6" />
                  <Text style={styles.moduleStatLabel}>Score Promedio</Text>
                  <Text style={styles.moduleStatValue}>{stats.averageScore}%</Text>
                </View>
              </View>

              {stats.usersStarted > 0 && (
                <View style={styles.completionBar}>
                  <View 
                    style={[
                      styles.completionBarFill,
                      { width: `${(stats.usersCompleted / stats.usersStarted * 100)}%` }
                    ]}
                  />
                </View>
              )}
              <Text style={styles.completionRate}>
                Tasa de completación: {stats.usersStarted > 0 
                  ? Math.round((stats.usersCompleted / stats.usersStarted) * 100) 
                  : 0}%
              </Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="analytics" size={32} color="#6366f1" />
          <Text style={styles.headerTitle}>Panel de Administración</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'overview' && styles.tabActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Ionicons 
              name="stats-chart" 
              size={20} 
              color={activeTab === 'overview' ? '#6366f1' : '#6b7280'} 
            />
            <Text style={[styles.tabText, activeTab === 'overview' && styles.tabTextActive]}>
              Resumen
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'users' && styles.tabActive]}
            onPress={() => setActiveTab('users')}
          >
            <Ionicons 
              name="people" 
              size={20} 
              color={activeTab === 'users' ? '#6366f1' : '#6b7280'} 
            />
            <Text style={[styles.tabText, activeTab === 'users' && styles.tabTextActive]}>
              Usuarios
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'modules' && styles.tabActive]}
            onPress={() => setActiveTab('modules')}
          >
            <Ionicons 
              name="library" 
              size={20} 
              color={activeTab === 'modules' ? '#6366f1' : '#6b7280'} 
            />
            <Text style={[styles.tabText, activeTab === 'modules' && styles.tabTextActive]}>
              Módulos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366f1" />
            <Text style={styles.loadingText}>Cargando datos...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'overview' && renderOverviewTab()}
            {activeTab === 'users' && renderUsersTab()}
            {activeTab === 'modules' && renderModulesTab()}
          </>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={loadData}
            disabled={loading}
          >
            <Ionicons name="refresh" size={20} color="#fff" />
            <Text style={styles.refreshButtonText}>Actualizar Datos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.refreshButton, styles.migrationButton]}
            onPress={handleMigration}
            disabled={migrating || loading}
          >
            {migrating ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="construct" size={20} color="#fff" />
            )}
            <Text style={styles.refreshButtonText}>
              {migrating ? 'Recalculando...' : 'Recalcular Módulos'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(20),
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: msFont(24),
    fontWeight: 'bold',
    marginLeft: ms(12),
    color: '#1f2937',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(16),
    gap: ms(8),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6366f1',
  },
  tabText: {
    fontSize: msFont(14),
    fontWeight: '600',
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#6366f1',
  },
  tabContent: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: ms(16),
    fontSize: msFont(16),
    color: '#6b7280',
  },
  section: {
    padding: ms(16),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: ms(16),
  },
  sectionTitle: {
    fontSize: msFont(20),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: ms(16),
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(12),
  },
  metricCard: {
    backgroundColor: '#fff',
    padding: ms(16),
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  metricIconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: '#ede9fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: ms(12),
  },
  metricValue: {
    fontSize: msFont(28),
    fontWeight: 'bold',
    color: '#6366f1',
    marginBottom: ms(4),
  },
  metricLabel: {
    fontSize: msFont(12),
    color: '#6b7280',
    textAlign: 'center',
  },
  topUserCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: ms(16),
    borderRadius: 12,
    marginBottom: ms(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rankBadge: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  rankText: {
    fontSize: msFont(16),
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  topUserInfo: {
    flex: 1,
  },
  topUserName: {
    fontSize: msFont(16),
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: ms(2),
  },
  topUserEmail: {
    fontSize: msFont(12),
    color: '#6b7280',
  },
  topUserStats: {
    flexDirection: 'row',
    gap: ms(12),
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
  },
  statValue: {
    fontSize: msFont(14),
    fontWeight: '600',
    color: '#1f2937',
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: ms(16),
    paddingVertical: ms(8),
    borderRadius: 8,
    gap: ms(6),
  },
  exportButtonText: {
    color: '#fff',
    fontSize: msFont(14),
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: ms(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  userCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(16),
  },
  userAvatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: ms(12),
  },
  userAvatarText: {
    fontSize: msFont(20),
    fontWeight: 'bold',
    color: '#fff',
  },
  userMainInfo: {
    flex: 1,
  },
  userName: {
    fontSize: msFont(16),
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: ms(2),
  },
  userEmail: {
    fontSize: msFont(12),
    color: '#6b7280',
    marginBottom: ms(4),
  },
  userActivity: {
    fontSize: msFont(11),
    color: '#9ca3af',
  },
  userCardExpanded: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(16),
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  userStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(12),
    marginTop: ms(12),
  },
  userStatItem: {
    width: '30%',
    backgroundColor: '#f9fafb',
    padding: ms(12),
    borderRadius: 8,
    alignItems: 'center',
  },
  userStatLabel: {
    fontSize: msFont(11),
    color: '#6b7280',
    marginBottom: ms(4),
  },
  userStatValue: {
    fontSize: msFont(16),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  badgesContainer: {
    marginTop: ms(12),
    paddingTop: ms(12),
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  badgesLabel: {
    fontSize: msFont(12),
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: ms(8),
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: ms(10),
    paddingVertical: ms(4),
    borderRadius: 12,
  },
  badgeText: {
    fontSize: msFont(11),
    color: '#f59e0b',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: ms(12),
    paddingTop: ms(12),
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  progressLabel: {
    fontSize: msFont(12),
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: ms(8),
  },
  progressItem: {
    marginBottom: ms(12),
  },
  progressModuleName: {
    fontSize: msFont(13),
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: ms(6),
  },
  progressBar: {
    height: ms(8),
    backgroundColor: '#e5e7eb',
    borderRadius: ms(4),
    overflow: 'hidden',
    marginBottom: ms(4),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6366f1',
  },
  progressScore: {
    fontSize: msFont(11),
    color: '#6b7280',
  },
  moduleCard: {
    backgroundColor: '#fff',
    padding: ms(16),
    borderRadius: 12,
    marginBottom: ms(12),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  moduleName: {
    fontSize: msFont(18),
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: ms(16),
  },
  moduleStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: ms(16),
  },
  moduleStatItem: {
    alignItems: 'center',
  },
  moduleStatLabel: {
    fontSize: msFont(11),
    color: '#6b7280',
    marginTop: ms(4),
    marginBottom: ms(4),
  },
  moduleStatValue: {
    fontSize: msFont(18),
    fontWeight: 'bold',
    color: '#1f2937',
  },
  completionBar: {
    height: ms(8),
    backgroundColor: '#e5e7eb',
    borderRadius: ms(4),
    overflow: 'hidden',
    marginBottom: ms(8),
  },
  completionBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
  },
  completionRate: {
    fontSize: msFont(12),
    color: '#6b7280',
    textAlign: 'center',
  },
  noDataText: {
    fontSize: msFont(14),
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: ms(20),
  },
  actionButtons: {
    paddingHorizontal: ms(16),
    paddingBottom: ms(16),
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    marginBottom: ms(12),
    padding: ms(16),
    borderRadius: 12,
    gap: ms(8),
  },
  migrationButton: {
    backgroundColor: '#f59e0b',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: msFont(16),
    fontWeight: '600',
  },
});

export default AdminMetricsScreen;
