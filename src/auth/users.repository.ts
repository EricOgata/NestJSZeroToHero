import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { User } from "./user.entity";
import { AuthCredentialsDTO } from "./dto/auth-credentials.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
        const { username, password } = authCredentialsDTO;
        // Hash

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.create({
            username,
            password: hashedPassword
        })
        await this.save(user);

        // try {
        //     await this.save(user);
        // } catch (error) {
        //     if (error.code === '23505') { // Duplicate Username
        //         throw new ConflictException('Username already exists.');
        //     } else {
        //         throw new InternalServerErrorException();
        //     }
        // }
    }
}