import { Elysia } from 'elysia';

export interface Context {
  body: unknown;
  jwt: {
    sign: (payload: any) => Promise<string>;
    verify: (token: string) => Promise<any | null>;
  };
  headers: Record<string, string | undefined>;
  requireAuth: () => Promise<any>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
