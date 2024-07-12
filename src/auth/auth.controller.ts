import { Body, Controller, Post } from '@nestjs/common';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/signup')
    public async signUp(
        @Body() authCredentialsDTO: AuthCredentialsDTO,
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDTO);
    }
}
