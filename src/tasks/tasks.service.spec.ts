import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TasksRepository } from './tasks.repository';
import { TaskStatus } from './task-status.enum';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    getTaskById: jest.fn(),
    createTask: jest.fn(),
    deleteTask: jest.fn(),
    updateTaskStatus: jest.fn(),
});
const mockUser = {
    id: 'someId',
    username: 'TestUser',
    password: 'TestPassword',
    tasks: [],
};
describe('TasksService', () => {
    let tasksService: TasksService;
    let tasksRepository: TasksRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository,
                    useFactory: mockTasksRepository,
                },
            ],
        }).compile();

        tasksService = module.get<TasksService>(TasksService);
        tasksRepository = module.get<TasksRepository>(TasksRepository);
    });

    // Add your tests here
    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and returns the result', async () => {
            const mockTasks = [
                {
                    id: 1,
                    title: 'Test Task',
                    description: 'Test Description',
                    status: TaskStatus.OPEN,
                },
            ];
            // call the mock implementation
            tasksRepository.getTasks = jest.fn().mockResolvedValue(mockTasks);

            const result = await tasksService.getTasks({}, mockUser);

            expect(result).toEqual(mockTasks);
        });
    });

    describe('getTaskById', () => {
        it('calls TasksRepository.getTaskById and returns the result', async () => {
            const mockTask = {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.OPEN,
            };
            tasksRepository.getTaskById = jest.fn().mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById('1', mockUser);

            expect(result).toEqual(mockTask);
        });

        it('throws an error when task is not found', async () => {
            tasksRepository.getTaskById = jest
                .fn()
                .mockRejectedValue(new Error('Task not found'));

            await expect(
                tasksService.getTaskById('999', mockUser),
            ).rejects.toThrow('Task not found');
        });
    });

    describe('createTask', () => {
        it('calls TasksRepository.createTask and returns the result', async () => {
            const createTaskDto = {
                title: 'New Task',
                description: 'New Description',
            };
            const mockTask = {
                id: '1',
                title: 'New Task',
                description: 'New Description',
                status: TaskStatus.OPEN,
            };
            tasksRepository.createTask = jest.fn().mockResolvedValue(mockTask);

            const result = await tasksService.createTask(
                createTaskDto,
                mockUser,
            );

            expect(result).toEqual(mockTask);
        });
    });

    describe('deleteTask', () => {
        it('calls TasksRepository.deleteTask and returns the result', async () => {
            const mockResult = { deleted: true, id: '1' };
            tasksRepository.deleteTask = jest
                .fn()
                .mockResolvedValue(mockResult);

            const result = await tasksService.deleteTask('1', mockUser);

            expect(result).toEqual(mockResult);
        });

        it('throws an error when task to delete is not found', async () => {
            tasksRepository.deleteTask = jest
                .fn()
                .mockRejectedValue(new Error('Task not found'));

            await expect(
                tasksService.deleteTask('999', mockUser),
            ).rejects.toThrow('Task not found');
        });
    });

    describe('updateTaskStatus', () => {
        it('calls TasksRepository.updateTaskStatus and returns the result', async () => {
            const mockTask = {
                id: '1',
                title: 'Test Task',
                description: 'Test Description',
                status: TaskStatus.DONE,
            };
            tasksRepository.updateTaskStatus = jest
                .fn()
                .mockResolvedValue(mockTask);

            const result = await tasksService.updateTaskStatus(
                '1',
                TaskStatus.DONE,
                mockUser,
            );

            expect(result).toEqual(mockTask);
        });

        it('throws an error when task to update is not found', async () => {
            tasksRepository.updateTaskStatus = jest
                .fn()
                .mockRejectedValue(new Error('Task not found'));

            await expect(
                tasksService.updateTaskStatus('999', TaskStatus.DONE, mockUser),
            ).rejects.toThrow('Task not found');
        });
    });
});
