import { Elysia } from 'elysia';
import { ERROR_MESSAGES } from '../constant/error.messages';
import { AuthenticationError } from '../error/base.error';
import { JwtService } from '../modules/auth/service/jwt.service';
import { ForbiddenError } from '../error/base.error';
import { UserRepository } from '../modules/user/repository/user.repository';

const jwtService = new JwtService();
const userRepository = new UserRepository();

export const authMiddleware = new Elysia().derive({ as: 'scoped' }, async ({ request }) => {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    throw new AuthenticationError(ERROR_MESSAGES.NO_TOKEN);
  }

  const token = authHeader.replace('Bearer ', '');
  const decoded = await jwtService.verify(token);

  if (!decoded || !decoded.userId) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN);
  }

  const user = await userRepository.findById(decoded.userId);
  if (!user) {
    throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN);
  }

  (request as any).user = { id: user.id, roleType: user.roleType };

  return {
    user: {
      id: user.id,
      roleType: user.roleType,
    },
  };
});

export const adminGuard = new Elysia().derive(({ request, set }) => {
  const user = (request as any).user;
  if (!user || !['ADMIN', 'SUPER_ADMIN'].includes(user.roleType)) {
    throw new ForbiddenError(ERROR_MESSAGES.FORBIDDEN);
  }
  return { user };
});
