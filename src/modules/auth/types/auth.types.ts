export interface JWTPayload {
  userId: number;
  [key: string]: any;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
