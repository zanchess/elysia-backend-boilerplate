import type { GoogleUserInfoResponse } from './google-oauth.service';

export type IGoogleOAuthService = {
  getToken(code: string): Promise<{ access_token: string; id_token: string }>;
  getUserInfo(accessToken: string): Promise<GoogleUserInfoResponse>;
  readonly clientId: string;
  readonly redirectUri: string;
}; 