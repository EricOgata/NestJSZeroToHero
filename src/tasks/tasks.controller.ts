import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {

    // constructor + dependency injction
    constructor(private tasksService: TasksService) { }

    /**
     * Return all Tasks
     * 
     * @returns Tasks[] tasks
     */
    @Get()
    public getTasks(
        @Query() filterDTO: GetTasksFilterDTO,
        @GetUser() user: User,
    ): Promise<Task[]> {
        return this.tasksService.getTasks(filterDTO, user);
    }

    /**
     * fetchSingleTask
     */
    @Get('/:id')
    public fetchSingleTask(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<Task> {
        const found = this.tasksService.getTask(id, user)
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
        return found;
    }

    /**
     * Create new Task
     */
    @Post()
    @HttpCode(201)
    public createTask(
        @Body() createTaskDTO: CreateTaskDTO,
        @GetUser() user: User,
    ): Promise<Task> {
        const newTask = this.tasksService.createTask(createTaskDTO, user);
        return newTask;
    }

    /**
     * deleteSingleTask
     */
    @Delete('/:id')
    @HttpCode(204)
    public deleteSingleTask(
        @Param('id') id: string,
        @GetUser() user: User
    ): Promise<void> {
        return this.tasksService.deleteTask(id, user);
    }

    /**
     * Update Status of Single Task
     * @param id 
     * @param updateTaskStatusDTO 
     * @param user 
     * @returns 
     */
    @Patch('/:id/status')
    @HttpCode(201)
    public patchTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDTO: UpdateTaskStatusDTO,
        @GetUser() user: User
    ): Promise<Task> {
        const { status } = updateTaskStatusDTO;
        return this.tasksService.patchTask(id, user, 'status', status);
    }
}
