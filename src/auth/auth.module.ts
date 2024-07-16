import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { IsUniqueConstraint } from 'src/customValidations/IsUnique/isUnique.constraints';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: "MySuperSecret",
      signOptions: {
        expiresIn: 3600, // Expires in 1 hour
      }
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UsersRepository, IsUniqueConstraint, JwtStrategy],
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule { }
