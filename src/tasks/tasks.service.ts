import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like } from 'typeorm';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository
    ) { }

    /**
     * Returns all tasks
     * @returns Promise<Task> tasks
     */
    public async getAllTasks(): Promise<Task[]> | null {
        return await this.taskRepository.find();
    }

    /**
     * 
     * @param id string
     * @returns Promise<Task> | null
     */
    public async getTask(id: string): Promise<Task> | null {
        const found = await this.taskRepository.findOneBy({
            id
        });
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }
        return found;
    }

    /**
     * getTasksWithFilter
     */
    public async getTasksWithFilter(filterDTO: GetTasksFilterDTO): Promise<Task[]> {
        const { status, search } = filterDTO;
        return await this.taskRepository.find({
            where: [
                { status: status },
                { title: Like(`%${search}%`) },
                { description: Like(`%${search}%`) },
            ]
        });
    }

    /**
     * Create a new Task
     * @param createTaskDTO 
     * @returns 
     */
    public async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDTO);
    }

    /**
     * Delete Task
     * @param id id of task
     */
    public async deleteTask(id: string): Promise<void> {
        const deletedRows = await this.taskRepository.softDelete({
            id,
            deletedAt: IsNull(),
        });
        if (deletedRows.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }
    }

    /**
     * patchTask
     */
    public async patchTask(id: string, param: string, value: string): Promise<Task> {
        return await this.taskRepository.save({
            id,
            [param]: value,
        });
    }
}

