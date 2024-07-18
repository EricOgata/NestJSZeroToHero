import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthCredentialsSignUpDTO } from './dto/auth-credentials-signup.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsSignInDTO } from './dto/auth-credentials-signin.dto';
import { JWTAccessToken } from './jwt-payload.interface';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  public async signUp(
    @Body() authCredentialsDTO: AuthCredentialsSignUpDTO,
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDTO);
  }

  @Post('/signin')
  public async signIn(
    @Body() authCredentialsDTO: AuthCredentialsSignInDTO,
  ): Promise<JWTAccessToken> {
    return this.authService.signIn(authCredentialsDTO);
  }

  @Post('teste')
  @UseGuards(AuthGuard())
  test(@Req() req) {
    console.log(req);
  }
}
