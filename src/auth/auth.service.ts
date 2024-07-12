import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(UsersRepository)
        private usersRepository: UsersRepository
    ) { }

    public async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        return this.usersRepository.createUser(authCredentialsDTO);
    }
}
