import { RegisterDto, LoginDto } from '../types/auth.types';
import { JwtService } from './jwt.service';
import { ERROR_MESSAGES } from '../../../constants/error.messages';
import { AuthenticationError, ConflictError } from '../../../errors/base.error';
import { UserRepository } from '../../users/repositories/user.repository';
import bcrypt from 'bcrypt';

export class AuthService {
  private jwtService: JwtService;
  private userRepository: UserRepository;

  constructor() {
    this.jwtService = new JwtService();
    this.userRepository = new UserRepository();
  }

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

    return user;
  }

  async login(data: LoginDto) {
    const user = await this.userRepository.findByEmail(data.email);

    if (!user) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    if (await bcrypt.compare(data.password, user.password)) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = await this.jwtService.sign({ userId: user.id });

    return {
      token,
      user,
    };
  }
}
