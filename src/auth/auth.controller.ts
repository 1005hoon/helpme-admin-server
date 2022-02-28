import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AdminUsersService } from 'src/admin-users/admin-users.service';
import { AuthService } from './auth.service';
import { GoogleAuthService } from './google-auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RequestWithUser } from './request-with-user.interface';
import { VerificationTokenDto } from './verification-token.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
    private readonly adminUserService: AdminUsersService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('/')
  authenticate(@Req() req: RequestWithUser) {
    return req.user;
  }

  @Post('/logout')
  logout(@Req() req: RequestWithUser) {
    req.res.setHeader('Set-Cookie', this.authService.getCookiesForLogOut());
  }

  @Post('oauth/google')
  async signInOrRegisterWithGoogle(
    @Body() tokenDto: VerificationTokenDto,
    @Req() req: Request,
  ) {
    const { token, user } = await this.googleAuthService.authenticate(
      tokenDto.token,
    );

    req.res.setHeader('Set-Cookie', [token]);
    return user;
  }
}
