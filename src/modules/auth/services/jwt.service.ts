import jwt from 'jsonwebtoken';

export class JwtService {
  private readonly secret: string;

  constructor() {
    this.secret = process.env.JWT_SECRET || 'your-secret-key';
  }

  async sign(payload: { userId: number }): Promise<string> {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  async verify(token: string): Promise<{ userId: number } | null> {
    try {
      return jwt.verify(token, this.secret) as { userId: number };
    } catch {
      return null;
    }
  }
}
