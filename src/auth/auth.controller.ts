import { Controller, Post, Body } from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { AuthService } from './auth.service';
import { Logger } from '@nestjs/common';
@Controller('auth')
export class AuthController {
    private logger = new Logger('AuthController');
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body() authCredentialsDto: AuthCredentialsDto): Promise<void> {
        this.logger.log(`User "${authCredentialsDto.username}" is signing up.`);
        return this.authService.signUp(authCredentialsDto);
    }

    @Post('/signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
        this.logger.log(`User "${authCredentialsDto.username}" is signing in.`);
        return this.authService.signIn(authCredentialsDto);
    }
}
