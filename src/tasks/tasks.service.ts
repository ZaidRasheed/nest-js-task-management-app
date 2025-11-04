import { CreateTaskDTO } from './dto/create-task.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { GetTaskFilterDto } from './dto/get-taks-filter.dto';

@Injectable()
export class TasksService {
    private tasks: Task[] = [];

    getAllTasks(): Task[] {
        return this.tasks;
    }

    getTasksWithFilters(filterDto: GetTaskFilterDto): Task[] {
        const { search, status } = filterDto;

        let tasks: Task[] = this.getAllTasks();

        if (status) {
            tasks = tasks.filter((task) => task.status === status);
        }

        if (search) {
            tasks = tasks.filter(
                (task) =>
                    task.description
                        .toLowerCase()
                        .includes(search.toLowerCase()) ||
                    task.title.toLowerCase().includes(search.toLowerCase()),
            );
        }

        return tasks;
    }

    getTaskById(id: string): Task | undefined {
        const found = this.tasks.find((task) => task.id === id);

        if (!found) {
            throw new NotFoundException(`Task with ID: ${id} not found.`);
        }

        return found;
    }

    createTask(createTaskDto: CreateTaskDTO): Task {
        const { title, description } = createTaskDto;
        const task: Task = {
            id: uuid(),
            title,
            description,
            status: TaskStatus.OPEN,
        };

        this.tasks.push(task);
        return task;
    }

    deleteTask(id: string): void {
        this.getTaskById(id);
        this.tasks = this.tasks.filter((task) => task.id != id);
    }

    updateTaskStatus(id: string, status: string) {
        let task = this.getTaskById(id);
        if (task && task?.status) task.status = status as TaskStatus;
        return task;
    }
}
