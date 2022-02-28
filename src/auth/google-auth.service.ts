import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Auth, google } from 'googleapis';
import {
  AdminUser,
  AdminUserDocument,
} from 'src/admin-users/admin-user.schema';
import { AdminUsersService } from 'src/admin-users/admin-users.service';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleAuthService {
  oauthClient: Auth.OAuth2Client;
  constructor(
    private readonly config: ConfigService,
    private readonly adminUserService: AdminUsersService,
    private readonly authService: AuthService,
  ) {
    if (!this.oauthClient) {
      const clientID = this.config.get('GOOGLE_AUTH_CLIENT_ID');
      const clientSecret = this.config.get('GOOGLE_AUTH_CLIENT_SECRET');

      this.oauthClient = new google.auth.OAuth2(clientID, clientSecret);
    }
  }

  public async authenticate(access_token: string) {
    const { email } = await this.oauthClient.getTokenInfo(access_token);

    if (email.split('@')[1] !== 'help-me.kr') {
      throw new ForbiddenException('헬프미 계정으로만 로그인이 가능합니다');
    }

    try {
      const user = await this.adminUserService.getUserByEmail(email);
      return this.handleRegisteredUser(user);
    } catch (error) {
      if (error.status !== 404) {
        throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
      }

      return this.registerUser(access_token, email);
    }
  }

  public async handleRegisteredUser(user: AdminUserDocument) {
    const token = this.getCookiesForUser(user);
    return { token, user };
  }

  public getCookiesForUser(user: AdminUserDocument) {
    return this.authService.getCookieWithJwtToken(user._id);
  }

  public async registerUser(token: string, email: string) {
    const userData = await this.getUserDataFromToken(token);
    const { name, picture } = userData;
    const user = await this.adminUserService.createUserWithGoogle(
      email,
      name,
      picture,
    );
    return this.handleRegisteredUser(user);
  }

  public async getUserDataFromToken(access_token: string) {
    const userInfoClient = google.oauth2('v2').userinfo;
    this.oauthClient.setCredentials({ access_token });
    const { data } = await userInfoClient.get({ auth: this.oauthClient });
    return data;
  }
}
