import { DataSource, Repository } from 'typeorm';
import { Task } from './task.entity';
import {
    Injectable,
    NotFoundException,
    BadRequestException,
    InternalServerErrorException,
} from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { validate as isValidUUID } from 'uuid';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';
@Injectable()
export class TasksRepository extends Repository<Task> {
    private logger = new Logger('TasksRepository');
    constructor(private dataSource: DataSource) {
        super(Task, dataSource.createEntityManager());
    }

    async getTasks(filterDto: any, user: User): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.where({ user });

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
                { search: `%${search}%` },
            );
        }
        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(
                `Failed to get tasks for user "${user.username}". Filters: ${JSON.stringify(
                    filterDto,
                )}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        // Validate UUID format
        if (!isValidUUID(id)) {
            throw new BadRequestException(`"${id}" is not a valid ID`);
        }

        const task = await this.findOne({
            where: { id, user },
        });

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }

        return task;
    }

    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        const { title, description } = createTaskDto;

        try {
            const task = this.create({
                title,
                description,
                status: TaskStatus.OPEN,
                user,
            });

            await this.save(task);
            return task;
        } catch (error) {
            this.logger.error(
                `Failed to create task for user "${user.username}". Data: ${JSON.stringify(
                    createTaskDto,
                )}`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async deleteTask(
        id: string,
        user: User,
    ): Promise<{ deleted: boolean; id: string }> {
        // Validate UUID format
        if (!isValidUUID(id)) {
            throw new BadRequestException(`"${id}" is not a valid ID`);
        }

        try {
            const result = await this.delete({ id, user });
            if (result.affected === 0) {
                throw new NotFoundException(`Task with ID "${id}" not found`);
            }

            // return a successful deletion message with the task id
            return { deleted: true, id };
        } catch (error) {
            this.logger.error(
                `Failed to delete task with ID "${id}" for user "${user.username}"`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }

    async updateTaskStatus(
        id: string,
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        if (!isValidUUID(id)) {
            throw new BadRequestException(`"${id}" is not a valid ID`);
        }

        const task = await this.getTaskById(id as string, user);

        if (!task) {
            throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        try {
            task.status = status;
            await this.save(task);
            return task;
        } catch (error) {
            this.logger.error(
                `Failed to update status of task with ID "${id}" for user "${user.username}" to "${status}"`,
                error.stack,
            );
            throw new InternalServerErrorException();
        }
    }
}
