import { TaskStatus } from '../task-status.enum';
import { IsEnum, IsOptional, IsString } from 'class-validator';
export class GetTaskFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus, {
        message: 'Status must be one of: OPEN, IN_PROGRESS, or DONE',
    })
    status?: TaskStatus;

    @IsOptional()
    @IsString()
    search?: string;
}
