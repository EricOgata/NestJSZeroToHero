import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsSignUpDTO } from './dto/auth-credentials-signup.dto';
import { AuthCredentialsSignInDTO } from './dto/auth-credentials-signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JWTAccessToken, JWTPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  public async signUp(
    authCredentialsDTO: AuthCredentialsSignUpDTO,
  ): Promise<void> {
    return this.usersRepository.createUser(authCredentialsDTO);
  }

  public async signIn(
    authCredentialsDTO: AuthCredentialsSignInDTO,
  ): Promise<JWTAccessToken> {
    const { username, password } = authCredentialsDTO;
    const user = await this.usersRepository.findOneBy({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JWTPayload = { username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    }
    throw new UnauthorizedException('Please check yout login credentials.');
  }
}
