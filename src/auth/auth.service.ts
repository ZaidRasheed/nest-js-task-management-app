import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
import { Logger } from '@nestjs/common';
@Injectable()
export class AuthService {
    private logger = new Logger('AuthService');
    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ) {}

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        return this.usersRepository.createUser(authCredentialsDto);
    }

    async signIn(
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
        const { username, password } = authCredentialsDto;

        const user = await this.usersRepository.findOne({
            where: { username },
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            const payLoad: JwtPayload = { username };

            const accessToken: string = this.jwtService.sign(payLoad);
            this.logger.log(`User "${username}" has successfully signed in.`);

            return { accessToken };
        } else {
            throw new UnauthorizedException('Invalid credentials');
        }
    }
}
