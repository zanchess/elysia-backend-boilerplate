import { Elysia } from 'elysia';
import { ERROR_MESSAGES } from '../constant/error.messages';
import { AuthenticationError } from '../error/base.error';
import { JwtService } from '../modules/auth/service/jwt.service';

const jwtService = new JwtService();

export const authMiddleware = new Elysia().derive({ as: 'scoped' }, () => ({
  requireAuth: async (request: Request) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      throw new AuthenticationError(ERROR_MESSAGES.NO_TOKEN);
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = await jwtService.verify(token);

    if (!decoded) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    return decoded;
  },
}));
