import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDTO } from './dto/update-task-status.dto';

@Controller('tasks')
export class TasksController {

    // constructor + dependency injction
    constructor(private tasksService: TasksService) { }

    /**
     * Return all Tasks
     * 
     * @returns Tasks[] tasks
     */
    @Get()
    public getTasks(@Query() filterDTO: GetTasksFilterDTO): Task[] {
        if (Object.keys(filterDTO).length) {
            return this.tasksService.getTasksWithFilter(filterDTO);
        }

        return this.tasksService.getAllTasks();
    }

    /**
     * fetchSingleTask
     */
    @Get('/:id')
    public fetchSingleTask(@Param('id') id: string): Task {
        const found = this.tasksService.getTask(id);
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
    public createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
        const newTask = this.tasksService.createTask(createTaskDTO);
        return newTask;
    }

    /**
     * deleteSingleTask
     */
    @Delete('/:id')
    @HttpCode(204)
    public deleteSingleTask(@Param('id') id: string): void {
        const found = this.tasksService.getTask(id);
        if (!found) {
            throw new NotFoundException(`Task with ID ${id} not found.`);
        }
        this.tasksService.deleteTask(id);
    }

    @Patch('/:id/status')
    @HttpCode(201)
    public patchTaskStatus(
        @Param('id') id: string,
        @Body() updateTaskStatusDTO: UpdateTaskStatusDTO
    ): Task {
        const { status } = updateTaskStatusDTO;
        return this.tasksService.patchTask(id, 'status', status);
    }
}
