import { RegisterDto, LoginDto } from '../type/auth.types';
import type { IAuthService } from './auth.service.interface';
import type { IUserRepository } from '../repository/user.repository.interface';
import type { ISessionRepository } from '../repository/session.repository.interface';
import type { JwtService } from './jwt.service';
import { ERROR_MESSAGES } from '../../../constant/error.messages';
import { AuthenticationError, ConflictError } from '../../../error/base.error';
import bcrypt from 'bcrypt';
import { generateRandomPassword } from '../../../util/password';
import { injectable, inject } from 'tsyringe';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject('JwtService') private jwtService: JwtService,
    @inject('UserRepository') private userRepository: IUserRepository,
    @inject('SessionRepository') private sessionRepository: ISessionRepository
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictError(ERROR_MESSAGES.USER_EXISTS);
    }

    const user = await this.userRepository.create({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (!user) {
      throw new Error(ERROR_MESSAGES.USER_CREATION_FAILED);
    }

    const token = await this.jwtService.sign({
      userId: user.id,
      roleTypes: user.roles.map((role: { roleType: string }) => role.roleType),
    });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 дней
    await this.sessionRepository.createSession({
      userId: user.id,
      token,
      expiresAt,
    });

    return { user, token };
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (await bcrypt.compare(data.password, user.password)) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    // Создание JWT токена
    const token = await this.jwtService.sign({
      userId: user.id,
      roleTypes: user.roles.map((role: { roleType: string }) => role.roleType),
    });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 дней
    await this.sessionRepository.createSession({
      userId: user.id,
      token,
      expiresAt,
    });

    return {
      token,
      user,
    };
  }

  async loginOrRegisterWithGoogle(profile: {
    email: string;
    given_name: string;
    family_name: string;
    picture: string;
  }) {
    let user = await this.userRepository.findByEmail(profile.email);

    if (!user) {
      const rawPassword = generateRandomPassword();
      console.log('rawPassword', rawPassword);
      const hashedPassword = await bcrypt.hash(rawPassword, 10);
      user = await this.userRepository.create({
        email: profile.email,
        firstName: profile.given_name,
        lastName: profile.family_name,
        photoUrl: profile.picture,
        password: hashedPassword,
        isActive: true,
      });
    }

    const token = await this.jwtService.sign({
      userId: user.id,
      roleTypes: user.roles.map((role: { roleType: string }) => role.roleType),
    });
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7); // 7 дней
    await this.sessionRepository.createSession({
      userId: user.id,
      token,
      expiresAt,
    });
    return { user, token };
  }
}
