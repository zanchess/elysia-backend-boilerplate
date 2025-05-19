import { Elysia } from 'elysia';
import { jwt } from '@elysiajs/jwt';
import { JWTPayload } from '../modules/auth/types/auth.types';

export const authMiddleware = new Elysia()
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'your-secret-key'
  }))
  .derive(({ jwt, headers }) => {
    return {
      async requireAuth() {
        const token = headers.authorization?.split(' ')[1];
        
        if (!token) {
          throw new Error('No token provided');
        }
        
        const payload = await jwt.verify(token);
        
        if (!payload || typeof payload.userId !== 'number') {
          throw new Error('Invalid token');
        }
        
        return payload as JWTPayload;
      }
    };
  }); 