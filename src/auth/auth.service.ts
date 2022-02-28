import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayload } from './token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  public getCookieWithJwtToken(userId: string) {
    const payload: TokenPayload = { userId };
    const token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: `${this.config.get('JWT_EXPIRATION_TIME')}s`,
    });
    return `Authentication=${token}; httpOnly; Path=/; Max-Age=${this.config.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
