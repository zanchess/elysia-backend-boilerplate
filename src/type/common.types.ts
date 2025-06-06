export interface JWTPayload {
  userId: number;
  [key: string]: any;
}

export interface Context {
  body: unknown;
  jwt: {
    sign: (payload: JWTPayload) => Promise<string>;
    verify: (token: string) => Promise<JWTPayload | null>;
  };
  headers: Record<string, string | undefined>;
  requireAuth: () => Promise<JWTPayload>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
