import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { AuthGuard } from '@nestjs/passport';

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
    public getTasks(@Query() filterDTO: GetTasksFilterDTO): Promise<Task[]> {
        return this.tasksService.getTasks(filterDTO);
    }

    /**
     * fetchSingleTask
     */
    @Get('/:id')
    public fetchSingleTask(@Param('id') id: string): Promise<Task> {
        const found = this.tasksService.getTask(id)
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
    public createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
        const newTask = this.tasksService.createTask(createTaskDTO);
        return newTask;
    }

    /**
     * deleteSingleTask
     */
    @Delete('/:id')
    @HttpCode(204)
    public deleteSingleTask(@Param('id') id: string): Promise<void> {
        return this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    @HttpCode(201)
    public patchTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDTO: UpdateTaskStatusDTO
    ): Promise<Task> {
        const { status } = updateTaskStatusDTO;
        return this.tasksService.patchTask(id, 'status', status);
    }
}
