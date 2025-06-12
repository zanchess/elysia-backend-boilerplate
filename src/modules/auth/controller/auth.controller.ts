import { Elysia } from 'elysia';
import { BaseController } from '../../../controller/base.controller';
import type { IAuthService } from '../service/auth.service.interface';
import type { IGoogleOAuthService } from '../service/google-oauth.service.interface';
import { RegisterDto, LoginDto } from '../type/auth.types';
import {
  registerSchema,
  registerResponseSchema,
  errorResponseSchema,
  loginResponseSchema,
  loginSchema,
} from '../schema';
import { BadRequestError } from '../../../error/base.error';

export class AuthController extends BaseController {
  protected prefix = '/auth';
  private authService: IAuthService;
  private googleOAuthService: IGoogleOAuthService;

  constructor(authService: IAuthService, googleOAuthService: IGoogleOAuthService) {
    super();
    this.authService = authService;
    this.googleOAuthService = googleOAuthService;
  }

  protected routes() {
    return new Elysia()
      .post(
        '/register',
        async ({ body }) => {
          const result = await this.authService.register(body as RegisterDto);
          return {
            success: true,
            data: {
              id: result.user.id,
              email: result.user.email,
              firstName: result.user.firstName,
              lastName: result.user.lastName,
            },
            message: 'User registered successfully',
          };
        },
        {
          body: registerSchema,
          response: {
            200: registerResponseSchema,
            400: errorResponseSchema,
            409: errorResponseSchema,
          },
          detail: {
            tags: ['Authentication'],
            summary: 'Register a new user',
            description: 'Creates a new user account with the provided credentials',
            examples: [
              {
                request: {
                  body: {
                    email: 'user@example.com',
                    password: 'password123',
                    name: 'John Doe',
                  },
                },
              },
            ],
          },
        }
      )
      .post(
        '/login',
        async ({ body }) => {
          const result = await this.authService.login(body as LoginDto);
          return {
            success: true,
            data: {
              token: result.token,
              user: {
                id: result.user.id,
                email: result.user.email,
                firstName: result.user.firstName,
                lastName: result.user.lastName,
              },
            },
            message: 'User logged in successfully',
          };
        },
        {
          body: loginSchema,
          response: {
            200: loginResponseSchema,
            401: errorResponseSchema,
          },
          detail: {
            tags: ['Authentication'],
            summary: 'Login user',
            description: 'Authenticates a user and returns a JWT token',
            examples: [
              {
                request: {
                  body: {
                    email: 'user@example.com',
                    password: 'password123',
                  },
                },
              },
            ],
          },
        }
      )
      .get('/google', () => {
        const params = new URLSearchParams({
          client_id: this.googleOAuthService.clientId,
          redirect_uri: this.googleOAuthService.redirectUri,
          response_type: 'code',
          scope: 'openid email profile',
          access_type: 'offline',
          prompt: 'consent',
        });
        return Response.redirect(
          `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
        );
      })
      .get('/google/callback', async ({ query }) => {
        const code = query.code;
        if (!code) {
          throw new BadRequestError('No code provided');
        }

        const { access_token } = await this.googleOAuthService.getToken(code);
        const profile = await this.googleOAuthService.getUserInfo(access_token);
        const result = await this.authService.loginOrRegisterWithGoogle(profile);

        return { success: true, token: result.token, user: result.user };
      }) as unknown as Elysia;
  }
}
