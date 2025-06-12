import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { jwt } from '@elysiajs/jwt';
import 'dotenv/config';
import { logRoutes } from './util/route-logger';
import { AuthController } from './modules/auth/controller/auth.controller';
import { UserController } from './modules/user/controller/user.controller';
import { RoleController } from './modules/role/controller/role.controller';
import { AuthService } from './modules/auth/service/auth.service';
import { UserRepository } from './modules/user/repository/user.repository';
import { SessionRepository } from './modules/auth/repository/session.repository';
import { JwtService } from './modules/auth/service/jwt.service';
import { GoogleOAuthService } from './modules/auth/service/google-oauth.service';
import { UserService } from './modules/user/service/user.service';
import { RoleService } from './modules/role/service/role.service';
import { RoleRepository } from './modules/role/repository/role.repository';
import { DepartamentController } from './modules/departament/controller/departament.controller';
import { DepartamentService } from './modules/departament/service/departament.service';
import { DepartamentRepository } from './modules/departament/repository/departament.repository';
import 'reflect-metadata';
import { container } from 'tsyringe';

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
  );

// Регистрация зависимостей
container.registerSingleton('JwtService', JwtService);
container.registerSingleton('SessionRepository', SessionRepository);
container.registerSingleton('UserRepository', UserRepository);
container.registerSingleton('GoogleOAuthService', GoogleOAuthService);
container.registerSingleton('AuthService', AuthService);
container.registerSingleton('UserService', UserService);
container.registerSingleton('RoleRepository', RoleRepository);
container.registerSingleton('RoleService', RoleService);
container.registerSingleton('DepartamentRepository', DepartamentRepository);
container.registerSingleton('DepartamentService', DepartamentService);

app.use(container.resolve(RoleController).getRoutes());
app.use(container.resolve(AuthController).getRoutes());
app.use(container.resolve(UserController).getRoutes());
app.use(container.resolve(DepartamentController).getRoutes());

// Логируем все маршруты при запуске
logRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/doc`);
});
