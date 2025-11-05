import { CreateTaskDTO } from './dto/create-task.dto';
import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-taks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
    constructor(private tasksRepository: TasksRepository) {}

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        // Implement filtering logic in the repository
        return this.tasksRepository.getTasks(filterDto);
    }

    async getTaskById(id: string): Promise<Task> {
        return this.tasksRepository.getTaskById(id);
    }

    async createTask(createTaskDto: CreateTaskDTO): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    async deleteTask(id: string): Promise<{ deleted: boolean; id: string }> {
        return this.tasksRepository.deleteTask(id);
    }

    async updateTaskStatus(id: string, status: TaskStatus): Promise<Task> {
        return this.tasksRepository.updateTaskStatus(id, status);
    }
}
