import { Test } from '@nestjs/testing';
import { TasksRepository } from "./tasks.repository";
import { TasksService } from "./tasks.service";
import { User } from 'src/auth/user.entity';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOneBy: jest.fn(),
});

const mockUser: User = {
    username: 'John Doe',
    id: 'someId',
    password: 'password',
    tasks: [],
}
 
describe('TasksService', () => {
    let tasksService: TasksService;
    let tasksRepository: TasksRepository;

    beforeEach(async () => {
        // initialize a nestJS module with tasksService and tasksRepository
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                {
                    provide: TasksRepository,
                    useFactory: mockTasksRepository,
                }
            ],
        }).compile();

        tasksService = module.get(TasksService);
        tasksRepository = module.get(TasksRepository);
    });

    describe('getTasks', () => {
        it('calls TasksRepository.getTasks and returns the result', async () => {
            (tasksRepository.getTasks as jest.Mock).mockResolvedValue('someValue');
            const result = await tasksService.getTasks(null, mockUser);
            expect(result).toEqual('someValue');
        });
    })

    describe('getTask', () => {
        it('calls TasksRepository.getTask and return single result', async () => {
            const mockTask: Task = {
                id: 'someId',
                title: '',
                description: '',
                status: TaskStatus.OPEN,
                user: mockUser,
                createdAt: new Date(),
                updatedAt: new Date(),
                deletedAt: null,
            };
            (tasksRepository.findOneBy as jest.Mock).mockResolvedValue(mockTask);
            const result = await tasksService.getTask('someId', mockUser);
            expect(result).toEqual(mockTask);
        });

        it('calls TasksRepository.getTask and handles an error', async () => {
            (tasksRepository.findOneBy as jest.Mock).mockResolvedValue(null);
            expect(tasksService.getTask('someId', mockUser)).rejects.toThrow();
        });
    });

});