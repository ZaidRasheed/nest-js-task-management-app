import { CreateTaskDTO } from './dto/create-task.dto';
import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-taks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { User } from '../auth/user.entity'

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) {}

    async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
        // Implemented filtering logic in the repository
        return this.tasksRepository.getTasks(filterDto, user);
    }

    async getTaskById(id: string, user: User): Promise<Task> {
        return this.tasksRepository.getTaskById(id, user);
    }

    async createTask(createTaskDto: CreateTaskDTO, user: User): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto, user);
    }

    async deleteTask(
        id: string,
        user: User,
    ): Promise<{ deleted: boolean; id: string }> {
        return this.tasksRepository.deleteTask(id, user);
    }

    async updateTaskStatus(
        id: string,
        status: TaskStatus,
        user: User,
    ): Promise<Task> {
        return this.tasksRepository.updateTaskStatus(id, status, user);
    }
}
