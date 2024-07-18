import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Like } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TasksRepository)
        private taskRepository: TasksRepository
    ) { }

    /**
     * 
     * @param id string
     * @returns Promise<Task> | null
     */
    public async getTask(id: string, user: User): Promise<Task> | null {
        const found = await this.taskRepository.findOneBy({
            id,
            user,
        })
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }
        return found;
    }

    /**
     * getTasksWithFilter
     */
    public async getTasks(filterDTO: GetTasksFilterDTO, user: User): Promise<Task[]> {
        return this.taskRepository.getTasks(filterDTO, user);
    }

    /**
     * Create a new Task
     * @param createTaskDTO 
     * @returns 
     */
    public async createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
        return await this.taskRepository.createTask(createTaskDTO, user);
    }

    /**
     * Delete Task
     * @param id id of task
     */
    public async deleteTask(id: string, user: User): Promise<void> {
        const deletedRows = await this.taskRepository.softDelete({
            id,
            user,
            deletedAt: IsNull(),
        });
        if (deletedRows.affected === 0) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }
    }

    /**
     * patchTask
     */
    public async patchTask(id: string, user, param: string, value: string): Promise<Task> {
        const found = await this.getTask(id, user);
        if (!found) {
            throw new NotFoundException(`Task with ID "${id}" not found`)
        }
        found[param] = value;
        return await this.taskRepository.save(found);
    }
}

