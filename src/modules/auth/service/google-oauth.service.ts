import axios from 'axios';
import { JwtService } from './jwt.service';
import { BadRequestError } from '../../../error/base.error';

export interface GoogleUserInfoResponse {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
}

export class GoogleOAuthService {
  private clientId = process.env.GOOGLE_CLIENT_ID!;
  private clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
  private redirectUri = process.env.GOOGLE_REDIRECT_URI!;
  private jwtService: JwtService;

  constructor() {
    this.jwtService = new JwtService();
  }

  async getToken(code: string): Promise<{ access_token: string; id_token: string }> {
    const params = new URLSearchParams({
      code,
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    });

    try {
      const { data } = await axios.post('https://oauth2.googleapis.com/token', params, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        throw new BadRequestError(JSON.stringify(err.response.data));
      }
      throw err;
    }
  }

  async getUserInfo(accessToken: string): Promise<GoogleUserInfoResponse> {
    try {
      const { data } = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        throw new BadRequestError(JSON.stringify(err.response.data));
      }
      throw err;
    }
  }
}
