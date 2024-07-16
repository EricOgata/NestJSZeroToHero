import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsersRepository } from "./users.repository";
import { InjectRepository } from "@nestjs/typeorm";
import { JWTPayload } from "./jwt-payload.interface";
import { User } from "./user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(UsersRepository)
        private userRepository: UsersRepository,
    ) {
        super({
            secretOrKey: 'MySuperSecret',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    public async validate(payload: JWTPayload): Promise<User> {
        const { username } = payload;
        const user: User = await this.userRepository.findOneBy({ username });
        if (!user) {
            throw new UnauthorizedException();
        }
        return user;
    }
}