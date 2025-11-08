import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Patch,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-taks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.fto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user-decorator';
import { User } from '../auth/user.entity';
import { Logger } from '@nestjs/common';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger = new Logger('TasksController');
    constructor(private tasksService: TasksService) {}

    @Get()
    getTasks(
        @Query() filterDto: GetTaskFilterDto,
        @GetUser() user: User,
    ): Promise<Task[]> {
        this.logger.verbose(
            `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(
                filterDto,
            )}`,
        );
        return this.tasksService.getTasks(filterDto, user);
    }

    @Get(':id')
    getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
        this.logger.verbose(
            `User "${user.username}" retrieving task with ID: "${id}"`,
        );
        return this.tasksService.getTaskById(id, user);
    }

    @Post()
    createTask(
        @Body() createTaskDto: CreateTaskDTO,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(
            `User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
        );
        return this.tasksService.createTask(createTaskDto, user);
    }

    @Delete(':id')
    deleteTask(
        @Param('id') id: string,
        @GetUser() user: User,
    ): Promise<{ deleted: boolean; id: string }> {
        this.logger.verbose(
            `User "${user.username}" deleting task with ID: "${id}"`,
        );
        return this.tasksService.deleteTask(id, user);
    }

    @Patch('/:id/status')
    updateStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDto: UpdateTaskStatusDto,
        @GetUser() user: User,
    ): Promise<Task> {
        this.logger.verbose(
            `User "${user.username}" updating status of task with ID: "${id}" to "${updateTaskStatusDto.status}"`,
        );
        const { status } = updateTaskStatusDto;
        return this.tasksService.updateTaskStatus(id, status, user);
    }
}
