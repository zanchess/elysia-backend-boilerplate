import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { jwt } from '@elysiajs/jwt';
import 'dotenv/config';
import { logRoutes } from './util/route-logger';
import { AuthController } from './modules/auth/controller/auth.controller';
import { UserController } from './modules/user/controller/user.controller';
import { RoleController } from './modules/role/controller/role.controller';

const PORT = process.env.PORT || 3000;
const API_PREFIX = process.env.API_PREFIX || '/api';

const app = new Elysia({ prefix: API_PREFIX })
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'Elysia API Documentation',
          version: '1.0.0',
          description: 'API documentation for Elysia application',
        },
        tags: [
          { name: 'auth', description: 'Authentication endpoints' },
          { name: 'users', description: 'User management endpoints' },
        ],
      },
      path: '/doc',
    })
  )
  .use(
    jwt({
      name: 'jwt',
      secret: process.env.JWT_SECRET || 'your-secret-key',
    })
  )
  .use(new AuthController().getRoutes())
  .use(new UserController().getRoutes())
  .use(new RoleController().getRoutes());

// Логируем все маршруты при запуске
logRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/doc`);
});
