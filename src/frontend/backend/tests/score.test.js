const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Tu aplicación Express
const { ActivityScore, ModuleProgress, UserProgress } = require('../models/Score');

describe('Score API', () => {
  beforeAll(async () => {
    // Conectar a base de datos de prueba
    await mongoose.connect(process.env.MONGODB_TEST_URI);
  });

  afterAll(async () => {
    // Limpiar base de datos y desconectar
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Limpiar colecciones antes de cada prueba
    await ActivityScore.deleteMany({});
    await ModuleProgress.deleteMany({});
    await UserProgress.deleteMany({});
  });

  describe('POST /api/scores/activity', () => {
    it('debe guardar una nueva puntuación de actividad', async () => {
      const scoreData = {
        activityId: 'cnee_trivia',
        userId: 'test_user',
        moduleId: 'cnee',
        correctAnswers: 8,
        incorrectAnswers: 2,
        totalQuestions: 10,
        timeSpent: 300,
        score: 80,
        activityType: 'trivia',
        correctStreak: 3
      };

      const response = await request(app)
        .post('/api/scores/activity')
        .send(scoreData)
        .expect(201);

      expect(response.body.activityScore).toBeDefined();
      expect(response.body.moduleProgress).toBeDefined();
      expect(response.body.userProgress).toBeDefined();
    });

    it('debe validar datos incorrectos', async () => {
      const invalidScore = {
        // Datos incompletos
        activityId: 'cnee_trivia',
        userId: 'test_user'
      };

      const response = await request(app)
        .post('/api/scores/activity')
        .send(invalidScore)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.details).toBeDefined();
    });
  });

  describe('GET /api/scores/module/:moduleId/user/:userId', () => {
    it('debe obtener puntuaciones de un módulo', async () => {
      // Crear algunas puntuaciones de prueba
      await ActivityScore.create({
        activityId: 'cnee_trivia',
        userId: 'test_user',
        moduleId: 'cnee',
        correctAnswers: 8,
        incorrectAnswers: 2,
        totalQuestions: 10,
        timeSpent: 300,
        score: 80,
        activityType: 'trivia'
      });

      const response = await request(app)
        .get('/api/scores/module/cnee/user/test_user')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
    });
  });

  describe('GET /api/progress/user/:userId', () => {
    it('debe obtener el progreso del usuario', async () => {
      // Crear progreso de prueba
      await UserProgress.create({
        userId: 'test_user',
        totalScore: 80,
        modulesCompleted: 1,
        totalModules: 5,
        activitiesCompleted: 3,
        totalActivities: 15
      });

      const response = await request(app)
        .get('/api/progress/user/test_user')
        .expect(200);

      expect(response.body.userId).toBe('test_user');
      expect(response.body.totalScore).toBe(80);
    });
  });

  describe('GET /api/leaderboard/:activityId', () => {
    it('debe obtener la tabla de clasificación', async () => {
      // Crear algunas puntuaciones para el leaderboard
      await ActivityScore.create([
        {
          activityId: 'cnee_trivia',
          userId: 'user1',
          moduleId: 'cnee',
          score: 90,
          activityType: 'trivia'
        },
        {
          activityId: 'cnee_trivia',
          userId: 'user2',
          moduleId: 'cnee',
          score: 85,
          activityType: 'trivia'
        }
      ]);

      const response = await request(app)
        .get('/api/leaderboard/cnee_trivia')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].score).toBe(90); // Ordenado por puntuación
    });
  });
});