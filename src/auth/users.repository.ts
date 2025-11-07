import { DataSource, Repository } from 'typeorm';
import { User } from './user.entity';
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException
} from '@nestjs/common';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { validate as isValidUUID } from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<User> {
    constructor(private dataSource: DataSource) {
        super(User, dataSource.createEntityManager());
    }
    // async getUserById(id: string): Promise<User> {
    //     // Validate UUID format
    //     if (!isValidUUID(id)) {
    //         throw new BadRequestException(`"${id}" is not a valid ID`);
    //     }

    //     const user = await this.findOne({
    //         where: { id },
    //     });

    //     if (!user) {
    //         throw new NotFoundException(`User with ID "${id}" not found`);
    //     }

    //     return user;
    // }

    async createUser(authCredentials: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentials;


        // hash password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = this.create({
                username,
                password: hashedPassword,
            });

            await this.save(user);
        } catch (error) {
            // Handle errors such as duplicate usernames
            if (error.code === '23505') {
                // 23505 is the Postgres error code for unique violation
                throw new ConflictException('Username already exists');
            } else {
                throw new BadRequestException('Failed to create user');
            }
        }
    }
}
