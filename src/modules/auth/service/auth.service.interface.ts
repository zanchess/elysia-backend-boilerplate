import type { RegisterDto, LoginDto } from '../type/auth.types';

export type IAuthService = {
  register(data: RegisterDto): Promise<any>;
  login(data: LoginDto): Promise<any>;
  loginOrRegisterWithGoogle(profile: {
    email: string;
    given_name: string;
    family_name: string;
    picture: string;
  }): Promise<any>;
}; 