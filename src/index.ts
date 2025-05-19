import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { jwt } from '@elysiajs/jwt';
import { AuthController } from './modules/auth/controllers/auth.controller';
import { UserController } from './modules/users/controllers/user.controller';
import { logRoutes } from './utils/route-logger';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';

const app = new Elysia()
  .use(cors())
  .use(swagger({
    documentation: {
      info: {
        title: 'Elysia API Documentation',
        version: '1.0.0',
        description: 'API documentation for Elysia application'
      },
      tags: [
        { name: 'auth', description: 'Authentication endpoints' },
        { name: 'users', description: 'User management endpoints' }
      ]
    },
    path: '/doc'
  }))
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'your-secret-key'
  }))
  .use(new AuthController().getRoutes())
  .use(new UserController().getRoutes());

// Логируем все маршруты при запуске
logRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/doc`);
});
