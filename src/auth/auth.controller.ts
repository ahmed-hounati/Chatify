import { Body, Controller, Headers, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.register(createUserDto);
    }

    @Post('/login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        return this.authService.login(email, password);
    }

    @Post('/logout')
    async logout(@Headers('authorization') authHeader: string): Promise<{ message: string }> {
        return this.authService.logout(authHeader);
    }

}
