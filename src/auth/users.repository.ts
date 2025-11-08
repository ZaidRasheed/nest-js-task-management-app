import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
    Injectable,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';
@Injectable()
export class UsersRepository extends Repository<User> {
    private logger = new Logger('UsersRepository');
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }

    async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentials;

        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            this.logger.log(`Creating user "${username}"...`);
            const user = this.create({
                username,
                password: hashedPassword,
            });
            this.logger.log(`User "${username}" created successfully.`);
            await this.save(user);
        } catch (error) {
            // Handle duplicate usernames
            if (error.code === '23505') {
                // 23505 is the Postgres error code for unique violation
                this.logger.warn(`Username "${username}" already exists.`);
                throw new ConflictException('Username already exists');
            } else {
                this.logger.error(
                    `Failed to create user "${username}".`,
                    error.stack,
                );
                throw new BadRequestException('Failed to create user');
            }
        }
    }
}
